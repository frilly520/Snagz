import { 
  PriceFinderProduct, 
  PriceFinderListing, 
  SnagzDealScore, 
  AiShoppingAdvisorAnalysis 
} from '../src/types';

export function normalizeListingPricing(listing: PriceFinderListing): PriceFinderListing {
  if (listing.itemPrice === null || listing.itemPrice === undefined) {
    return {
      ...listing,
      itemPrice: null,
      shippingPrice: listing.shippingPrice ?? null,
      estimatedTotal: null
    };
  }

  const itemPrice = Math.max(0, listing.itemPrice);
  const shippingPrice = listing.shippingPrice !== null && listing.shippingPrice !== undefined ? Math.max(0, listing.shippingPrice) : 0;
  const requiredFees = Math.max(0, listing.requiredFees || 0);
  const couponDiscount = Math.max(0, listing.couponDiscount || 0);
  const rebateDiscount = Math.max(0, listing.rebateDiscount || 0);

  const estimatedTotal = Number(
    Math.max(0.01, itemPrice + shippingPrice + requiredFees - couponDiscount - rebateDiscount).toFixed(2)
  );

  return {
    ...listing,
    itemPrice,
    shippingPrice: listing.shippingPrice ?? 0,
    requiredFees,
    couponDiscount,
    rebateDiscount,
    estimatedTotal
  };
}

export function calculateProductUnitPricing(product: PriceFinderProduct): PriceFinderProduct {
  const validTotals = product.listings
    .map(l => l.estimatedTotal)
    .filter((t): t is number => typeof t === 'number' && t > 0);
  
  const lowestPrice = product.cheapestListing?.estimatedTotal && product.cheapestListing.estimatedTotal > 0
    ? product.cheapestListing.estimatedTotal
    : (validTotals.length > 0 ? Math.min(...validTotals) : 0);

  if (!lowestPrice || lowestPrice <= 0) {
    return product;
  }

  const titleLower = product.title.toLowerCase();

  // If product already has accurate unitPriceMetric, keep it
  if (product.unitPriceMetric && product.unitPriceMetric.unitValue > 0) {
    return product;
  }

  // 1. Quarts / Gallons (Fluids)
  const galMatch = titleLower.match(/(\d+(?:\.\d+)?)\s*(?:gal|gallon)/i);
  if (galMatch) {
    const gallons = parseFloat(galMatch[1]);
    const quarts = gallons * 4;
    const perQuart = Number((lowestPrice / quarts).toFixed(2));
    return {
      ...product,
      unitPriceMetric: {
        unitName: 'quart',
        unitValue: perQuart,
        unitDisplay: `$${perQuart.toFixed(2)} / quart`,
        advantageNote: `${gallons} Gallon container equals ${quarts} quarts`
      }
    };
  }

  const quartMatch = titleLower.match(/(\d+(?:\.\d+)?)\s*(?:qt|quart)/i);
  if (quartMatch) {
    const quarts = parseFloat(quartMatch[1]);
    const perQuart = Number((lowestPrice / quarts).toFixed(2));
    return {
      ...product,
      unitPriceMetric: {
        unitName: 'quart',
        unitValue: perQuart,
        unitDisplay: `$${perQuart.toFixed(2)} / quart`,
        advantageNote: `Single container (${quarts} qt)`
      }
    };
  }

  // 2. Paper Towels / Toilet Paper (Sheets / Rolls)
  const rollMatch = titleLower.match(/(\d+)\s*(?:rolls?|pk|pack)/i);
  const sheetMatch = titleLower.match(/(\d+)\s*sheets?/i);
  if (sheetMatch) {
    const sheets = parseInt(sheetMatch[1], 10);
    const per100Sheets = Number(((lowestPrice / sheets) * 100).toFixed(2));
    return {
      ...product,
      unitPriceMetric: {
        unitName: '100 sheets',
        unitValue: per100Sheets,
        unitDisplay: `$${per100Sheets.toFixed(2)} / 100 sheets`,
        advantageNote: `Total ${sheets.toLocaleString()} sheets in pack`
      }
    };
  } else if (rollMatch) {
    const rolls = parseInt(rollMatch[1], 10);
    if (rolls > 1) {
      const perRoll = Number((lowestPrice / rolls).toFixed(2));
      return {
        ...product,
        unitPriceMetric: {
          unitName: 'roll',
          unitValue: perRoll,
          unitDisplay: `$${perRoll.toFixed(2)} / roll`,
          advantageNote: `${rolls} rolls in package`
        }
      };
    }
  }

  // 3. Weight (Pounds / Ounces for Dog Food, Coffee, etc.)
  const lbMatch = titleLower.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs|pound)/i);
  if (lbMatch) {
    const lbs = parseFloat(lbMatch[1]);
    const perLb = Number((lowestPrice / lbs).toFixed(2));
    return {
      ...product,
      unitPriceMetric: {
        unitName: 'lb',
        unitValue: perLb,
        unitDisplay: `$${perLb.toFixed(2)} / lb`,
        advantageNote: `${lbs} lb bag ($${perLb.toFixed(2)} per pound)`
      }
    };
  }

  // 4. Count (Packs, pods, batteries)
  const countMatch = titleLower.match(/(\d+)\s*(?:ct|count|pods|capsules|pack)/i);
  if (countMatch) {
    const count = parseInt(countMatch[1], 10);
    if (count > 1) {
      const perUnit = Number((lowestPrice / count).toFixed(2));
      return {
        ...product,
        unitPriceMetric: {
          unitName: 'count',
          unitValue: perUnit,
          unitDisplay: `$${perUnit.toFixed(2)} / each`,
          advantageNote: `${count} total items in pack`
        }
      };
    }
  }

  return product;
}

export function computeDealScoreAndAdvisor(product: PriceFinderProduct): PriceFinderProduct {
  const lowestPrice = product.cheapestListing?.estimatedTotal || 
    Math.min(...product.listings.map(l => l.estimatedTotal));

  const averagePrice = product.priceHistory?.thirtyDayAverage || (lowestPrice * 1.15);
  const diffPercent = ((lowestPrice - averagePrice) / averagePrice) * 100;

  let rating: 'AMAZING_DEAL' | 'GOOD_DEAL' | 'FAIR_PRICE' | 'POOR_DEAL' = 'GOOD_DEAL';
  let label = '🟢 Good Deal';
  let explanation = `Priced competitively against market averages.`;

  if (diffPercent <= -20) {
    rating = 'AMAZING_DEAL';
    label = '🔥 Amazing Deal';
    explanation = `${Math.abs(Math.round(diffPercent))}% below typical recent market price ($${averagePrice.toFixed(2)}).`;
  } else if (diffPercent <= -8) {
    rating = 'GOOD_DEAL';
    label = '🟢 Good Deal';
    explanation = `${Math.abs(Math.round(diffPercent))}% below average retailer pricing.`;
  } else if (diffPercent <= 5) {
    rating = 'FAIR_PRICE';
    label = '🟡 Fair Price';
    explanation = `Standard retail price ($${lowestPrice.toFixed(2)}). Matches typical street pricing.`;
  } else {
    rating = 'POOR_DEAL';
    label = '🔴 High Price';
    explanation = `Currently higher than typical historic low. Consider waiting for upcoming sales.`;
  }

  const dealScore: SnagzDealScore = {
    rating,
    label,
    explanation,
    historyConfidence: product.priceHistory?.thirtyDayAverage ? 'SUFFICIENT' : 'INSUFFICIENT'
  };

  const cheapestRetailer = product.cheapestListing?.retailerName || 'Verified Store';
  const isGoodDeal = rating === 'AMAZING_DEAL' || rating === 'GOOD_DEAL';

  const advisor: AiShoppingAdvisorAnalysis = {
    isGoodDeal,
    verdictHeadline: isGoodDeal 
      ? `Strong Buy at ${cheapestRetailer} ($${lowestPrice.toFixed(2)})`
      : `Standard Market Pricing at ${cheapestRetailer}`,
    bestOverallValue: `${cheapestRetailer} ($${lowestPrice.toFixed(2)})`,
    reasoning: `${cheapestRetailer} currently offers the lowest verified out-of-pocket total including shipping and promotions. ${explanation}`,
    unitEconomicsNote: product.unitPriceMetric ? `Unit cost: ${product.unitPriceMetric.unitDisplay}` : undefined
  };

  return {
    ...product,
    dealScore,
    aiAdvisor: product.aiAdvisor || advisor
  };
}
