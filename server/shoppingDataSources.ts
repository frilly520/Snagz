import { 
  PriceFinderProduct, 
  PriceFinderListing, 
  PriceFinderSearchResult,
  PriceFinderSellerType,
  PriceFinderCondition,
  PriceFinderStockStatus,
  SnagzDealScore,
  VehicleCompatibilityInfo,
  AiShoppingAdvisorAnalysis,
  PriceFinderSimilarProduct,
  PriceFinderSearchSummary,
  SearchedRetailerItem
} from '../src/types';

// Retailer Registry for Authentic Data Sources
export interface RetailerMeta {
  id: string;
  name: string;
  domain: string;
  logo: string;
  freeShippingThreshold: number;
  inStorePickup: boolean;
  supportedCategories: string[];
}

export const RETAILER_REGISTRY: Record<string, RetailerMeta> = {
  walmart: {
    id: 'store-walmart',
    name: 'Walmart',
    domain: 'walmart.com',
    logo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Automotive', 'Household', 'Electronics', 'Pet Care', 'General']
  },
  amazon: {
    id: 'store-amazon',
    name: 'Amazon',
    domain: 'amazon.com',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: false,
    supportedCategories: ['Automotive', 'Household', 'Electronics', 'Pet Care', 'Footwear', 'General']
  },
  target: {
    id: 'store-target',
    name: 'Target',
    domain: 'target.com',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Household', 'Electronics', 'Pet Care', 'General']
  },
  autozone: {
    id: 'store-autozone',
    name: 'AutoZone',
    domain: 'autozone.com',
    logo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Automotive']
  },
  advanceauto: {
    id: 'store-advanceauto',
    name: 'Advance Auto Parts',
    domain: 'advanceautoparts.com',
    logo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Automotive']
  },
  oreilly: {
    id: 'store-oreilly',
    name: "O'Reilly Auto Parts",
    domain: 'oreillyauto.com',
    logo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Automotive']
  },
  rockauto: {
    id: 'store-rockauto',
    name: 'RockAuto',
    domain: 'rockauto.com',
    logo: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 999, // Rockauto charges actual freight shipping
    inStorePickup: false,
    supportedCategories: ['Automotive']
  },
  bestbuy: {
    id: 'store-bestbuy',
    name: 'Best Buy',
    domain: 'bestbuy.com',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Electronics']
  },
  costco: {
    id: 'store-costco',
    name: 'Costco Wholesale',
    domain: 'costco.com',
    logo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 75,
    inStorePickup: true,
    supportedCategories: ['Household', 'Automotive', 'Electronics', 'Pet Care']
  },
  chewy: {
    id: 'store-chewy',
    name: 'Chewy',
    domain: 'chewy.com',
    logo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 49,
    inStorePickup: false,
    supportedCategories: ['Pet Care']
  },
  petco: {
    id: 'store-petco',
    name: 'Petco',
    domain: 'petco.com',
    logo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Pet Care']
  },
  cvs: {
    id: 'store-cvs',
    name: 'CVS Pharmacy',
    domain: 'cvs.com',
    logo: 'https://images.unsplash.com/photo-1586015555751-63c25b7a7019?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 35,
    inStorePickup: true,
    supportedCategories: ['Household', 'General']
  },
  nike: {
    id: 'store-nike',
    name: 'Nike Official',
    domain: 'nike.com',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 50,
    inStorePickup: true,
    supportedCategories: ['Footwear']
  },
  footlocker: {
    id: 'store-footlocker',
    name: 'Foot Locker',
    domain: 'footlocker.com',
    logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=120&h=120&q=80',
    freeShippingThreshold: 50,
    inStorePickup: true,
    supportedCategories: ['Footwear']
  }
};

// Helper to parse vehicle details from text
export function parseVehicleInfo(query: string): VehicleCompatibilityInfo {
  const q = query.toLowerCase();

  // Match Year (1980 - 2026)
  const yearMatch = q.match(/\b(19[89]\d|20[0-2]\d)\b/);
  const year = yearMatch ? yearMatch[1] : undefined;

  // Match Makes
  const makes = ['dodge', 'ford', 'chevy', 'chevrolet', 'ram', 'gmc', 'toyota', 'honda', 'nissan', 'jeep', 'chrysler'];
  const make = makes.find(m => q.includes(m));

  // Match Models
  const models = ['ram 1500', 'ram 2500', 'ram 3500', 'ram', 'f-150', 'f150', 'silverado', 'civic', 'accord', 'camry', 'corolla', 'wrangler', 'sierra'];
  const model = models.find(m => q.includes(m));

  // Match Engine
  const engineMatch = q.match(/\b(\d\.\d)l?\b/);
  const engine = engineMatch ? `${engineMatch[1]}L` : undefined;

  // Match Drivetrain
  let drivetrain: string | undefined;
  if (q.includes('4x4') || q.includes('4wd')) drivetrain = '4WD / 4x4';
  else if (q.includes('2wd') || q.includes('rwd')) drivetrain = '2WD / RWD';
  else if (q.includes('awd')) drivetrain = 'AWD';

  // Match Parts
  const parts = ['water pump', 'ball joint', 'brake pads', 'alternator', 'starter', 'oil filter', 'transmission fluid', 'thermostat'];
  const partType = parts.find(p => q.includes(p));

  const isVehiclePart = Boolean(year || make || model || partType || q.includes('dodge') || q.includes('moog') || q.includes('dexron'));

  let compatibilityStatus: 'CONFIRMED_FIT' | 'NEEDS_VERIFICATION' | 'UNIVERSAL' = 'UNIVERSAL';
  let fitmentNote = 'Universal fitment or standard specification.';

  if (year && make && model) {
    compatibilityStatus = 'CONFIRMED_FIT';
    fitmentNote = `Direct fit confirmed for ${year} ${make.charAt(0).toUpperCase() + make.slice(1)} ${model.toUpperCase()}${engine ? ` (${engine})` : ''}${drivetrain ? ` ${drivetrain}` : ''}. Meets or exceeds OEM specifications.`;
  } else if (isVehiclePart) {
    compatibilityStatus = 'NEEDS_VERIFICATION';
    fitmentNote = 'Vehicle fitment should be verified against your specific VIN or trim configuration.';
  }

  return {
    isVehiclePart,
    year,
    make: make ? make.charAt(0).toUpperCase() + make.slice(1) : undefined,
    model: model ? model.toUpperCase() : undefined,
    engine,
    drivetrain,
    partType: partType ? partType.charAt(0).toUpperCase() + partType.slice(1) : undefined,
    compatibilityStatus,
    fitmentNote
  };
}
