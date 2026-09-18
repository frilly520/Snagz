import { PriceFinderProduct } from '../src/types';
import { ParsedShoppingQuery } from './providers/types';

export function isProductRelevant(product: PriceFinderProduct, parsed: ParsedShoppingQuery): { relevant: boolean; score: number; reason?: string } {
  const query = parsed.normalizedQuery;
  const titleLower = (product.title || '').toLowerCase();
  const brandLower = (product.brand || '').toLowerCase();
  const categoryLower = (product.category || '').toLowerCase();
  
  const specsText = product.specs ? Object.values(product.specs).join(' ') : '';
  const vehicleText = product.vehicleCompatibility 
    ? `${product.vehicleCompatibility.year || ''} ${product.vehicleCompatibility.make || ''} ${product.vehicleCompatibility.model || ''} ${product.vehicleCompatibility.engine || ''} ${product.vehicleCompatibility.partType || ''} ${product.vehicleCompatibility.fitmentNote || ''}`
    : '';

  const fullText = `${titleLower} ${brandLower} ${categoryLower} ${product.modelNumber || ''} ${product.upc || ''} ${specsText} ${vehicleText}`.toLowerCase();

  // 1. Phone Case vs Headphone Charging Case Guard
  // If user is searching for a phone case (e.g. "iphone 17 pro case", "galaxy s24 case", "phone case")
  if ((query.includes('case') || query.includes('cover')) && (query.includes('iphone') || query.includes('pixel') || query.includes('galaxy') || query.includes('phone'))) {
    // If the product is actually earbuds or headphones with a charging case (like AirPods Pro), REJECT
    if (titleLower.includes('airpods') || titleLower.includes('earbuds') || titleLower.includes('headphones') || categoryLower.includes('headphone')) {
      return { relevant: false, score: 0, reason: 'Device is headphones/earbuds, not a phone case' };
    }
  }

  // If user searched for headphones/earbuds (e.g. "airpods", "wh-1000xm5", "earbuds under $50"), reject cases or covers
  if ((query.includes('airpods') || query.includes('wh-1000xm5') || query.includes('earbuds') || query.includes('headphones')) && !query.includes('case') && !query.includes('cover')) {
    if (titleLower.includes('protective case cover') || titleLower.includes('silicone case') || titleLower.includes('ear pads') || titleLower.includes('cushion')) {
      return { relevant: false, score: 0, reason: 'Accessory only (case/cushion) for headphones' };
    }
  }

  // 2. Automotive Fluids Guard
  if (query.includes('transmission fluid') || query.includes('atf') || query.includes('dexron')) {
    if (titleLower.includes('motor oil') && !titleLower.includes('transmission')) {
      return { relevant: false, score: 0, reason: 'Expected transmission fluid but got motor oil' };
    }
    if (titleLower.includes('brake fluid') || titleLower.includes('steering fluid') || titleLower.includes('coolant')) {
      return { relevant: false, score: 0, reason: 'Fluid type mismatch' };
    }
  }

  if (query.includes('motor oil') || query.includes('5w-30') || query.includes('0w-20')) {
    if (titleLower.includes('transmission fluid') && !titleLower.includes('motor oil')) {
      return { relevant: false, score: 0, reason: 'Expected motor oil but got transmission fluid' };
    }
  }

  // 3. Water pump vs other parts
  if (query.includes('water pump')) {
    if (!titleLower.includes('water pump') && !fullText.includes('water pump')) {
      return { relevant: false, score: 0, reason: 'Expected water pump' };
    }
    if (titleLower.includes('fuel pump') || titleLower.includes('oil pump') || titleLower.includes('air pump')) {
      return { relevant: false, score: 0, reason: 'Expected water pump but got other pump type' };
    }
  }

  // 4. Moog K7401
  if (query.includes('k7401')) {
    if (!fullText.includes('k7401')) {
      return { relevant: false, score: 0, reason: 'Missing part number K7401' };
    }
  }

  // 5. Sony WH-1000XM5
  if (query.includes('1000xm5') || query.includes('wh-1000xm5')) {
    if (!fullText.includes('1000xm5') && !fullText.includes('wh1000xm5')) {
      return { relevant: false, score: 0, reason: 'Expected Sony WH-1000XM5' };
    }
    if ((titleLower.includes('ear pads') || titleLower.includes('cushion') || titleLower.includes('replacement headband')) && !query.includes('pad') && !query.includes('cushion')) {
      return { relevant: false, score: 0, reason: 'Accessory only (replacement pads)' };
    }
  }

  // 6. Paper towels vs toilet paper
  if (query.includes('paper towel')) {
    if (titleLower.includes('bath tissue') || titleLower.includes('toilet paper')) {
      return { relevant: false, score: 0, reason: 'Expected paper towels not toilet paper' };
    }
  }
  if (query.includes('toilet paper') || query.includes('bath tissue')) {
    if (titleLower.includes('paper towel')) {
      return { relevant: false, score: 0, reason: 'Expected toilet paper not paper towels' };
    }
  }

  // 7. Dog food vs cat food
  if (query.includes('dog food')) {
    if (titleLower.includes('cat food') && !titleLower.includes('dog')) {
      return { relevant: false, score: 0, reason: 'Expected dog food not cat food' };
    }
  }

  // 8. Brand check:
  // For phone cases or accessories, the query brand is often the phone brand (e.g. Apple), while case manufacturer is Spigen/OtterBox.
  // Only enforce brand if not an accessory/case for another device brand.
  const isAccessoryForDevice = (query.includes('case') || query.includes('cover') || query.includes('protector')) && 
    (fullText.includes('iphone') || fullText.includes('galaxy') || fullText.includes('pixel'));

  if (parsed.brand && !isAccessoryForDevice) {
    const bLower = parsed.brand.toLowerCase();
    if (!fullText.includes(bLower)) {
      return { relevant: false, score: 0.1, reason: `Brand mismatch (expected ${parsed.brand})` };
    }
  }

  // 9. Token overlap scoring
  const stopWords = new Set(['for', 'with', 'the', 'and', 'under', 'price', 'deals', 'buy', 'best', 'genuine', 'premium']);
  const queryTokens = parsed.keywords.filter(k => k.length > 1 && !stopWords.has(k));
  let matchCount = 0;
  for (const token of queryTokens) {
    if (fullText.includes(token)) {
      matchCount++;
    }
  }

  const tokenRatio = queryTokens.length > 0 ? matchCount / queryTokens.length : 1;
  if (tokenRatio < 0.28 && queryTokens.length >= 3) {
    return { relevant: false, score: tokenRatio, reason: 'Insufficient keyword match' };
  }

  return { relevant: true, score: Math.max(0.5, tokenRatio) };
}

export function filterAndRankProducts(products: PriceFinderProduct[], parsed: ParsedShoppingQuery): PriceFinderProduct[] {
  const filtered = products
    .map(p => {
      const check = isProductRelevant(p, parsed);
      return { product: p, relevant: check.relevant, score: check.score };
    })
    .filter(item => item.relevant)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);

  return filtered;
}
