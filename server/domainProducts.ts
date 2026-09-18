import { 
  PriceFinderProduct, 
  PriceFinderListing,
  PriceFinderSimilarProduct,
  VehicleCompatibilityInfo,
  PriceFinderSearchSummary,
  SearchedRetailerItem
} from '../src/types';
import { parseVehicleInfo } from './shoppingDataSources';

// -------------------------------------------------------------
// 1. AUTOMOTIVE: TRANSMISSION FLUID & DEXRON VI
// -------------------------------------------------------------
export const TRANSMISSION_FLUID_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-valvoline-maxlife-atf-gal',
    title: 'Valvoline MaxLife Multi-Vehicle Full Synthetic Automatic Transmission Fluid (1 Gallon / 4 Quarts)',
    brand: 'Valvoline',
    modelNumber: '773775',
    upc: '074130007753',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Volume': '1 Gallon (128 fl oz / 4 Quarts)',
      'Specification': 'Dexron VI, Mercon LV, Toyota WS, Honda Z-1 / DW-1',
      'Fluid Type': 'Full Synthetic Multi-Vehicle ATF',
      'Recommended Use': 'Automatic Transmissions with high mileage or severe service'
    },
    variants: [
      {
        name: 'Container Size',
        options: ['1 Gallon (4 Quarts)', '1 Quart (32 oz)'],
        selected: '1 Gallon (4 Quarts)'
      }
    ],
    unitPriceMetric: {
      unitName: 'quart',
      unitValue: 6.24,
      unitDisplay: '$6.24 / quart',
      advantageNote: 'Buying the 1-gallon jug saves 30.6% per quart vs $8.99 individual quarts'
    },
    priceHistory: {
      currentPrice: 24.97,
      thirtyDayLow: 24.97,
      thirtyDayAverage: 27.50,
      ninetyDayLow: 23.88,
      allTimeLow: 21.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'Priced at $6.24/quart in the 1-gallon jug, 28% below typical auto parts retail price ($8.99/quart).',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Best Overall Value in Transmission Fluids',
      bestOverallValue: 'Valvoline MaxLife ATF 1 Gallon at Walmart ($24.97)',
      reasoning: 'At $24.97 for 4 quarts, this comes out to just $6.24 per quart. Compared to buying individual 1-quart bottles at auto parts counters ($8.99/qt), a 4-quart drain-and-fill saves over $11 out of pocket.',
      unitEconomicsNote: '1 Gallon ($24.97) = $6.24/qt. Single Quart ($8.99) = $8.99/qt.',
      couponTip: 'Walmart offers free curbside pickup today or free home shipping on orders over $35.',
      cheaperEquivalent: 'No cheaper full synthetic ATF meets both Dexron VI and Mercon LV specifications.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $24.97 ($6.24/qt) at Walmart',
      explanation: 'Lowest unit price across 6 automotive retailers. In stock for immediate curbside pickup or free 2-day delivery over $35.',
      percentageDiff: -16.8
    },
    vehicleCompatibility: {
      isVehiclePart: true,
      compatibilityStatus: 'UNIVERSAL',
      fitmentNote: 'Meets Dexron VI, Mercon LV, Nissan Matic D/J/K/S, and Toyota T-IV/WS transmission fluid requirements.'
    },
    retailersCheckedCount: 6,
    listings: [
      {
        id: 'list-valv-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=valvoline+maxlife+atf+1+gallon',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.97,
        shippingPrice: 0,
        shippingNote: 'Free Curbside Pickup or Free Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        cashbackPercentage: 2.0,
        estimatedTotal: 24.97,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-valv-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=valvoline+maxlife+atf+gallon',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 26.49,
        shippingPrice: 0,
        shippingNote: 'Free Prime Shipping (Orders $35+ or Prime)',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        cashbackPercentage: 1.0,
        estimatedTotal: 26.49,
        stockStatus: 'IN_STOCK',
        lastChecked: '4 mins ago',
        lastCheckedTimestamp: Date.now() - 240000
      },
      {
        id: 'list-valv-advance',
        retailerId: 'store-advanceauto',
        retailerName: 'Advance Auto Parts',
        retailerDomain: 'advanceautoparts.com',
        retailerLogo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://shop.advanceautoparts.com/web/SearchResults?searchTerm=valvoline+maxlife+atf',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 32.99,
        shippingPrice: 0,
        shippingNote: 'Free 30-Min In-Store Pickup',
        requiredFees: 0,
        couponCode: 'SAVE15',
        couponDiscount: 4.95,
        rebateDiscount: 0,
        cashbackPercentage: 3.0,
        estimatedTotal: 28.04,
        stockStatus: 'IN_STOCK',
        lastChecked: '12 mins ago',
        lastCheckedTimestamp: Date.now() - 720000
      },
      {
        id: 'list-valv-autozone',
        retailerId: 'store-autozone',
        retailerName: 'AutoZone',
        retailerDomain: 'autozone.com',
        retailerLogo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.autozone.com/searchresult?searchText=valvoline+maxlife+atf',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 33.99,
        shippingPrice: 0,
        shippingNote: 'Free Next-Day Delivery on $35+ or Store Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        cashbackPercentage: 1.5,
        estimatedTotal: 33.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '18 mins ago',
        lastCheckedTimestamp: Date.now() - 1080000
      },
      {
        id: 'list-valv-oreilly',
        retailerId: 'store-oreilly',
        retailerName: "O'Reilly Auto Parts",
        retailerDomain: 'oreillyauto.com',
        retailerLogo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.oreillyauto.com/search?q=valvoline+maxlife+atf',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 34.49,
        shippingPrice: 0,
        shippingNote: 'Free In-Store Pickup in 1 Hour',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 34.49,
        stockStatus: 'IN_STOCK',
        lastChecked: '25 mins ago',
        lastCheckedTimestamp: Date.now() - 1500000
      }
    ],
    cheapestListing: {} as any, // populated below
    similarProducts: [
      {
        id: 'sim-valv-1qt',
        title: 'Valvoline MaxLife Multi-Vehicle ATF (1 Quart)',
        brand: 'Valvoline',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 8.99,
        unitDisplay: '$8.99 / qt',
        dealScore: 'POOR_DEAL',
        type: 'DIFFERENT_SIZE',
        differenceReason: 'Smaller 1-quart size costs $8.99/qt vs $6.24/qt in the 1-gallon jug (30.6% more expensive per quart).'
      },
      {
        id: 'sim-acdelco-dex6',
        title: 'ACDelco GM Original Equipment Dexron VI Full Synthetic ATF (1 Gallon)',
        brand: 'ACDelco',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 29.99,
        unitDisplay: '$7.50 / qt',
        dealScore: 'GOOD_DEAL',
        type: 'PREMIUM_ALTERNATIVE',
        differenceReason: 'Official OEM GM factory fill spec. Higher price ($7.50/qt) for authentic GM licensed fluid.'
      },
      {
        id: 'sim-castrol-transmax',
        title: 'Castrol Transmax Full Synthetic Multi-Vehicle ATF (1 Gallon)',
        brand: 'Castrol',
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 26.48,
        unitDisplay: '$6.62 / qt',
        dealScore: 'GOOD_DEAL',
        type: 'COMPARABLE',
        differenceReason: 'Direct competitor with smooth drive technology. Within $1.51 of Valvoline.'
      }
    ]
  },
  {
    id: 'prod-acdelco-dexron-vi-gal',
    title: 'ACDelco GM Genuine Parts Dexron VI Full Synthetic Automatic Transmission Fluid (1 Gallon)',
    brand: 'ACDelco',
    modelNumber: '10-9395 / 88865601',
    upc: '021625299494',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Volume': '1 Gallon (128 fl oz)',
      'Specification': 'GM Dexron VI Licensed (backward compatible with Dexron III)',
      'Fluid Type': '100% Full Synthetic Genuine OEM'
    },
    unitPriceMetric: {
      unitName: 'quart',
      unitValue: 7.50,
      unitDisplay: '$7.50 / quart',
      advantageNote: 'Lowest price for authentic GM Licensed OEM fluid'
    },
    priceHistory: {
      currentPrice: 29.99,
      thirtyDayLow: 29.99,
      thirtyDayAverage: 34.50,
      ninetyDayLow: 28.50
    },
    dealScore: {
      rating: 'GOOD_DEAL',
      label: '🟢 Good Deal',
      explanation: '13% below dealership MSRP ($34.50) for factory-fill GM Dexron VI.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Official GM OEM Fluid at Fair Price',
      bestOverallValue: 'ACDelco Dexron VI at Amazon ($29.99)',
      reasoning: 'If your vehicle warranty requires official licensed Dexron VI (common for GM 6L80/8L90/10L90 transmissions), this is the lowest price for the OEM GM bottle.',
      unitEconomicsNote: '$7.50/quart for 1 Gallon vs $10.99 for single quart.'
    },
    zigVerdict: {
      status: 'GOOD_DEAL',
      headline: 'Snagz Best Price: $29.99 at Amazon & Walmart',
      explanation: 'Matches 60-day low price. Dealerships charge $45+ for the same gallon.',
      percentageDiff: -13.0
    },
    vehicleCompatibility: {
      isVehiclePart: true,
      compatibilityStatus: 'CONFIRMED_FIT',
      fitmentNote: 'Mandatory specification for GM 2006+ vehicles requiring Dexron VI. Backward compatible with Dexron III.'
    },
    retailersCheckedCount: 5,
    listings: [
      {
        id: 'list-acdelco-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=acdelco+dexron+vi+atf+gallon',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 29.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 29.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-acdelco-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=acdelco+dexron+vi+gallon',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 31.48,
        shippingPrice: 0,
        shippingNote: 'Free Pickup or 2-Day Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 31.48,
        stockStatus: 'IN_STOCK',
        lastChecked: '10 mins ago',
        lastCheckedTimestamp: Date.now() - 600000
      },
      {
        id: 'list-acdelco-advance',
        retailerId: 'store-advanceauto',
        retailerName: 'Advance Auto Parts',
        retailerDomain: 'advanceautoparts.com',
        retailerLogo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://shop.advanceautoparts.com/web/SearchResults?searchTerm=acdelco+dexron+vi',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 36.99,
        shippingPrice: 0,
        shippingNote: 'Free In-Store Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 36.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      }
    ],
    cheapestListing: {} as any
  }
];

// Initialize cheapestListing
TRANSMISSION_FLUID_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 2. AUTOMOTIVE: 5W-30 FULL SYNTHETIC MOTOR OIL
// -------------------------------------------------------------
export const MOTOR_OIL_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-mobil1-5w30-5qt',
    title: 'Mobil 1 Advanced Full Synthetic Motor Oil 5W-30 (5-Quart Jug)',
    brand: 'Mobil 1',
    modelNumber: '120769',
    upc: '071924149762',
    category: 'Automotive',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Viscosity': '5W-30',
      'Volume': '5 Quarts (160 fl oz)',
      'Specification': 'API SP, ILSAC GF-6A, dexos1 Gen 3',
      'Protection Interval': 'Up to 10,000 miles between changes'
    },
    unitPriceMetric: {
      unitName: 'quart',
      unitValue: 5.99,
      unitDisplay: '$5.99 / quart',
      advantageNote: '5-Quart jug saves 36.8% per quart vs $9.48 1-quart bottles'
    },
    priceHistory: {
      currentPrice: 29.97,
      thirtyDayLow: 27.97,
      thirtyDayAverage: 31.50,
      ninetyDayLow: 26.98
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'At $5.99/quart in the 5-quart jug, this is 36% below the standard per-quart shelf price.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Top Tier Synthetic at Lowest Out-of-Pocket Cost',
      bestOverallValue: 'Mobil 1 5W-30 5-Quart at Walmart ($29.97)',
      reasoning: 'Walmart holds the best national contract price for Mobil 1 5-quart jugs. AutoZone and Advance Auto charge $39.99 for the identical jug in-store.',
      unitEconomicsNote: '5-Quart Jug ($29.97) = $5.99/qt vs Individual 1-Qt ($9.48) = $9.48/qt.',
      couponTip: 'Mobil running $10 rebate per 5-qt jug twice annually through mobil1.us/rebate.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $29.97 ($5.99/qt) at Walmart',
      explanation: 'Save $10.02 vs auto parts store counters. Free pickup or shipping over $35.',
      percentageDiff: -25.0
    },
    retailersCheckedCount: 6,
    listings: [
      {
        id: 'list-m1-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=mobil+1+5w30+5+quart',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 29.97,
        shippingPrice: 0,
        shippingNote: 'Free Curbside Pickup or Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        cashbackPercentage: 2.0,
        estimatedTotal: 29.97,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-m1-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=mobil+1+5w30+5+quart',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 30.98,
        shippingPrice: 0,
        shippingNote: 'Free Prime Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 30.98,
        stockStatus: 'IN_STOCK',
        lastChecked: '5 mins ago',
        lastCheckedTimestamp: Date.now() - 300000
      },
      {
        id: 'list-m1-autozone',
        retailerId: 'store-autozone',
        retailerName: 'AutoZone',
        retailerDomain: 'autozone.com',
        retailerLogo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.autozone.com/searchresult?searchText=mobil+1+5w30+5+quart',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 39.99,
        shippingPrice: 0,
        shippingNote: 'Free Store Pickup or Next-Day Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 39.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      },
      {
        id: 'list-m1-advance',
        retailerId: 'store-advanceauto',
        retailerName: 'Advance Auto Parts',
        retailerDomain: 'advanceautoparts.com',
        retailerLogo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://shop.advanceautoparts.com/web/SearchResults?searchTerm=mobil+1+5w30+5+quart',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 39.99,
        shippingPrice: 0,
        shippingNote: 'Free In-Store Pickup',
        requiredFees: 0,
        couponCode: 'SAVE15',
        couponDiscount: 6.00,
        rebateDiscount: 0,
        estimatedTotal: 33.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '20 mins ago',
        lastCheckedTimestamp: Date.now() - 1200000
      }
    ],
    cheapestListing: {} as any,
    similarProducts: [
      {
        id: 'sim-pennzoil-plat',
        title: 'Pennzoil Platinum Full Synthetic 5W-30 Motor Oil (5-Quart Jug)',
        brand: 'Pennzoil',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 28.98,
        unitDisplay: '$5.80 / qt',
        dealScore: 'AMAZING_DEAL',
        type: 'CHEAPER_ALTERNATIVE',
        differenceReason: 'Made from natural gas base stock. Costs $0.99 less per 5-qt jug ($5.80/qt).'
      },
      {
        id: 'sim-castrol-edge',
        title: 'Castrol EDGE Advanced Full Synthetic 5W-30 (5-Quart Jug)',
        brand: 'Castrol',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 31.98,
        unitDisplay: '$6.40 / qt',
        dealScore: 'GOOD_DEAL',
        type: 'COMPARABLE',
        differenceReason: 'Fluid Titanium technology formulation. Within $2 of Mobil 1.'
      }
    ]
  }
];

MOTOR_OIL_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 3. AUTOMOTIVE VEHICLE PARTS: 2001 DODGE RAM 5.9 WATER PUMP & MOOG K7401
// -------------------------------------------------------------
export const DODGE_RAM_WATER_PUMP_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-gates-water-pump-dodge-59',
    title: 'Gates Premium Heavy Duty Engine Water Pump (Part #43015) for 5.9L V8 / 5.2L V8',
    brand: 'Gates',
    modelNumber: '43015',
    upc: '072053034989',
    mpn: '43015',
    category: 'Automotive Parts',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Fitment': '2001 Dodge Ram 1500 / 2500 5.9L V8 Magnum (Gas) & 5.2L V8',
      'Rotation': 'Reverse Rotation (Serpentine Belt Driven)',
      'Housing Material': 'Cast Iron Heavy Duty',
      'Includes': 'Premium Pre-cut Gasket and Hardware'
    },
    vehicleCompatibility: {
      isVehiclePart: true,
      year: '2001',
      make: 'Dodge',
      model: 'RAM 1500',
      engine: '5.9L V8 Magnum',
      drivetrain: '4WD / 4x4',
      partType: 'Water Pump',
      compatibilityStatus: 'CONFIRMED_FIT',
      fitmentNote: 'Confirmed direct bolt-on replacement for 2001 Dodge Ram 1500 5.9L V8 4WD. Reverse rotation design matches factory serpentine routing. Gasket included.'
    },
    unitPriceMetric: {
      unitName: 'unit',
      unitValue: 54.99,
      unitDisplay: '$54.99 / unit',
      advantageNote: 'OEM-grade impeller with lifetime pump warranty'
    },
    priceHistory: {
      currentPrice: 54.99,
      thirtyDayLow: 54.99,
      thirtyDayAverage: 65.00,
      ninetyDayLow: 51.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'Gates premium pump at $54.99 is $15.00 cheaper than auto parts store house brands (Duralast $69.99).',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Confirmed Direct Fit & Best Brand Value',
      bestOverallValue: 'Gates 43015 at Amazon ($54.99)',
      reasoning: 'Gates is the OEM-tier cooling system supplier for Chrysler/Dodge Magnum 360 (5.9L) engines. At $54.99 with free shipping, this is cheaper than retail counter house brands and includes the factory-spec gasket.',
      unitEconomicsNote: 'Complete pump assembly including gasket.',
      couponTip: 'Advance Auto offers 15% off with code SAVE15 if you need local same-day store pickup ($62.04 after coupon).'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $54.99 with Free Shipping',
      explanation: 'Confirmed fit for 2001 Dodge Ram 1500 5.9L V8 4x4. Includes gasket.',
      percentageDiff: -21.4
    },
    retailersCheckedCount: 5,
    listings: [
      {
        id: 'list-gates-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=gates+43015+water+pump+dodge+ram+5.9',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 54.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 54.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-gates-rockauto',
        retailerId: 'store-rockauto',
        retailerName: 'RockAuto',
        retailerDomain: 'rockauto.com',
        retailerLogo: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.rockauto.com/en/partsearch/?partnum=43015',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 48.79,
        shippingPrice: 8.99,
        shippingNote: '$8.99 Ground Freight Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 57.78,
        stockStatus: 'IN_STOCK',
        lastChecked: '10 mins ago',
        lastCheckedTimestamp: Date.now() - 600000
      },
      {
        id: 'list-duralast-autozone',
        retailerId: 'store-autozone',
        retailerName: 'AutoZone (Duralast CWP-9038)',
        retailerDomain: 'autozone.com',
        retailerLogo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.autozone.com/cooling-heating-and-climate-control/water-pump/p/duralast-water-pump-cwp-9038/47377_0_0',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 69.99,
        shippingPrice: 0,
        shippingNote: 'Free In-Store Pickup Today (Lifetime Warranty)',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 69.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      },
      {
        id: 'list-oreilly-cp9038',
        retailerId: 'store-oreilly',
        retailerName: "O'Reilly Auto Parts (Murray CP9038)",
        retailerDomain: 'oreillyauto.com',
        retailerLogo: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.oreillyauto.com/search?q=2001+dodge+ram+1500+5.9+water+pump',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 64.99,
        shippingPrice: 0,
        shippingNote: 'Free Next-Day In-Store Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 64.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '25 mins ago',
        lastCheckedTimestamp: Date.now() - 1500000
      }
    ],
    cheapestListing: {} as any,
    similarProducts: [
      {
        id: 'sim-duralast-wp',
        title: 'Duralast New Water Pump CWP-9038',
        brand: 'Duralast',
        image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 69.99,
        dealScore: 'FAIR_PRICE',
        type: 'COMPARABLE',
        differenceReason: 'AutoZone house brand with nationwide in-store lifetime warranty replacement.'
      }
    ]
  }
];

DODGE_RAM_WATER_PUMP_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// Moog K7401 Exact Match
export const MOOG_K7401_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-moog-k7401',
    title: 'Moog Problem Solver Front Lower Suspension Ball Joint (Part #K7401)',
    brand: 'Moog',
    modelNumber: 'K7401',
    upc: '080066258458',
    mpn: 'K7401',
    category: 'Automotive Parts',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&h=600&q=80',
    isExactMatch: true,
    matchedIdentifier: 'K7401',
    specs: {
      'Part Number': 'K7401',
      'Position': 'Front Lower (Left or Right)',
      'Design': 'Greasable Socket with Sunoloy Bearings',
      'Vehicle Fitment': '2000-2001 Dodge Ram 1500 4WD, 2000-2002 Ram 2500/3500 4WD Dana 60'
    },
    vehicleCompatibility: {
      isVehiclePart: true,
      partType: 'Ball Joint',
      compatibilityStatus: 'CONFIRMED_FIT',
      fitmentNote: 'Exact OEM replacement ball joint for 2000-2001 Dodge Ram 1500 4WD solid front axle. Greasable design extends service life.'
    },
    unitPriceMetric: {
      unitName: 'ball joint',
      unitValue: 38.99,
      unitDisplay: '$38.99 each',
      advantageNote: 'Heavy duty greasable problem-solver design'
    },
    priceHistory: {
      currentPrice: 38.99,
      thirtyDayLow: 38.99,
      thirtyDayAverage: 46.50,
      ninetyDayLow: 36.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'Priced at $38.99 on Amazon with free delivery, saving $11.00 vs AutoZone ($49.99).',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Exact Part Match — Lowest Price at Amazon',
      bestOverallValue: 'Moog K7401 at Amazon ($38.99)',
      reasoning: 'This exact Moog Problem Solver part number K7401 replaces the failure-prone factory ball joints on 2000-2001 Dodge Ram 4x4 trucks. Amazon offers the lowest delivered price.',
      unitEconomicsNote: 'Order 2 for a complete front lower axle rebuild ($77.98 total vs $99.98 at local stores).'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $38.99 with Free Shipping',
      explanation: 'Exact Moog Part #K7401 match. $11 lower than in-store auto parts counters.',
      percentageDiff: -22.0
    },
    retailersCheckedCount: 5,
    listings: [
      {
        id: 'list-moog-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=moog+k7401+ball+joint',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 38.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 38.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-moog-rockauto',
        retailerId: 'store-rockauto',
        retailerName: 'RockAuto',
        retailerDomain: 'rockauto.com',
        retailerLogo: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.rockauto.com/en/partsearch/?partnum=K7401',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 34.79,
        shippingPrice: 7.99,
        shippingNote: '$7.99 Standard Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 42.78,
        stockStatus: 'IN_STOCK',
        lastChecked: '10 mins ago',
        lastCheckedTimestamp: Date.now() - 600000
      },
      {
        id: 'list-moog-autozone',
        retailerId: 'store-autozone',
        retailerName: 'AutoZone',
        retailerDomain: 'autozone.com',
        retailerLogo: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.autozone.com/searchresult?searchText=moog+k7401',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 49.99,
        shippingPrice: 0,
        shippingNote: 'Free Next-Day Delivery or Store Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 49.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      },
      {
        id: 'list-moog-advance',
        retailerId: 'store-advanceauto',
        retailerName: 'Advance Auto Parts',
        retailerDomain: 'advanceautoparts.com',
        retailerLogo: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://shop.advanceautoparts.com/web/SearchResults?searchTerm=moog+k7401',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 51.99,
        shippingPrice: 0,
        shippingNote: 'Free Store Pickup in 30 Mins',
        requiredFees: 0,
        couponCode: 'SAVE15',
        couponDiscount: 7.80,
        rebateDiscount: 0,
        estimatedTotal: 44.19,
        stockStatus: 'IN_STOCK',
        lastChecked: '25 mins ago',
        lastCheckedTimestamp: Date.now() - 1500000
      }
    ],
    cheapestListing: {} as any
  }
];

MOOG_K7401_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 4. HOUSEHOLD & BULK: PAPER TOWELS
// -------------------------------------------------------------
export const PAPER_TOWEL_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-bounty-select-a-size-12pk',
    title: 'Bounty Select-A-Size Paper Towels, White, 12 Double Plus Rolls (= 30 Regular Rolls / 1,416 Sheets)',
    brand: 'Bounty',
    modelNumber: '3700078864',
    upc: '037000788649',
    category: 'Household Essentials',
    image: 'https://images.unsplash.com/photo-1586015555751-63c25b7a7019?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Pack Size': '12 Double Plus Rolls (= 30 Regular Rolls)',
      'Total Sheets': '1,416 Sheets',
      'Ply': '2-Ply Quick-Absorbing',
      'Format': 'Select-A-Size Custom Perforated'
    },
    unitPriceMetric: {
      unitName: 'sheet',
      unitValue: 0.0162,
      unitDisplay: '$1.62 / 100 sheets ($1.91 / roll)',
      advantageNote: 'Buying the 12 Double Plus pack cuts sheet cost down to 1.6¢ vs 2.8¢ on small grocery 2-packs'
    },
    priceHistory: {
      currentPrice: 22.99,
      thirtyDayLow: 22.49,
      thirtyDayAverage: 25.99,
      ninetyDayLow: 21.99
    },
    dealScore: {
      rating: 'GOOD_DEAL',
      label: '🟢 Good Deal',
      explanation: 'Target with Circle discount brings final price to $22.99 ($1.62/100 sheets), 12% below grocery retail average.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Lowest Sheet Price for Brand-Name Paper Towels',
      bestOverallValue: 'Bounty 12 Double Plus at Target ($22.99)',
      reasoning: 'Target with free in-store drive-up or redcard 5% discount beats Amazon pricing by $2.00 on the 1,416 sheet pack. Costco Kirkland remains cheaper per sheet for store-brand, but Bounty is the best absorbency per dollar.',
      unitEconomicsNote: 'Bounty: $1.62/100 sheets. Kirkland Signature: $1.20/100 sheets.',
      couponTip: 'Target Circle members clip $3 off manufacturer coupon in app.'
    },
    zigVerdict: {
      status: 'GOOD_DEAL',
      headline: '🏆 Snagz Best Price: $22.99 at Target',
      explanation: '1,416 total sheets. $1.62 per 100 sheets. Target Circle coupon active.',
      percentageDiff: -11.5
    },
    retailersCheckedCount: 6,
    listings: [
      {
        id: 'list-bounty-target',
        retailerId: 'store-target',
        retailerName: 'Target',
        retailerDomain: 'target.com',
        retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.target.com/s?searchTerm=bounty+select+a+size+12+rolls',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.99,
        shippingPrice: 0,
        shippingNote: 'Free Drive Up / In-Store Pickup',
        requiredFees: 0,
        couponCode: 'CIRCLE-TOWEL3',
        couponDiscount: 2.00,
        rebateDiscount: 0,
        cashbackPercentage: 5.0,
        estimatedTotal: 22.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-bounty-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=bounty+select+a+size+12+rolls',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.48,
        shippingPrice: 0,
        shippingNote: 'Free Curbside Pickup or Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        cashbackPercentage: 2.0,
        estimatedTotal: 24.48,
        stockStatus: 'IN_STOCK',
        lastChecked: '8 mins ago',
        lastCheckedTimestamp: Date.now() - 480000
      },
      {
        id: 'list-bounty-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=bounty+select+a+size+paper+towels',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 24.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '12 mins ago',
        lastCheckedTimestamp: Date.now() - 720000
      },
      {
        id: 'list-bounty-costco',
        retailerId: 'store-costco',
        retailerName: 'Costco Wholesale',
        retailerDomain: 'costco.com',
        retailerLogo: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.costco.com/s?dept=All&keyword=bounty+paper+towels',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 27.99,
        shippingPrice: 0,
        shippingNote: 'Free 2-Day Delivery on $75+ or In-Warehouse',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 27.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '30 mins ago',
        lastCheckedTimestamp: Date.now() - 1800000
      }
    ],
    cheapestListing: {} as any,
    similarProducts: [
      {
        id: 'sim-kirkland-towels',
        title: 'Kirkland Signature Create-A-Size Paper Towels (12 Rolls / 1,920 Sheets)',
        brand: 'Kirkland Signature',
        image: 'https://images.unsplash.com/photo-1586015555751-63c25b7a7019?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 22.99,
        unitDisplay: '$1.20 / 100 sheets',
        dealScore: 'AMAZING_DEAL',
        type: 'CHEAPER_ALTERNATIVE',
        differenceReason: 'Costco store brand gives 1,920 sheets for $22.99 (26% cheaper per sheet than Bounty).'
      },
      {
        id: 'sim-brawny-towels',
        title: 'Brawny Tear-A-Square Paper Towels (16 Double Rolls / 2,048 Sheets)',
        brand: 'Brawny',
        image: 'https://images.unsplash.com/photo-1586015555751-63c25b7a7019?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 29.98,
        unitDisplay: '$1.46 / 100 sheets',
        dealScore: 'GOOD_DEAL',
        type: 'COMPARABLE',
        differenceReason: 'Offers 3 sheet sizes per roll. 2,048 sheets at $1.46 per 100 sheets.'
      }
    ]
  }
];

PAPER_TOWEL_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 5. PET CARE: DOG FOOD
// -------------------------------------------------------------
export const DOG_FOOD_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-purina-pro-plan-chicken-35lb',
    title: 'Purina Pro Plan High Protein Adult Chicken & Rice Formula Dry Dog Food (35 lb Bag)',
    brand: 'Purina Pro Plan',
    modelNumber: '038100174092',
    upc: '038100174092',
    category: 'Pet Supplies',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Weight': '35 lb (15.8 kg) Bulk Bag',
      'Life Stage': 'Adult Dog',
      'Primary Protein': 'Real Chicken (#1 Ingredient, 26% Protein)',
      'Special Diet': 'High Protein with Guaranteed Live Probiotics'
    },
    unitPriceMetric: {
      unitName: 'pound',
      unitValue: 2.03,
      unitDisplay: '$2.03 / lb',
      advantageNote: '35 lb bag saves $0.62 per lb vs buying the 6 lb bag ($2.65/lb)'
    },
    priceHistory: {
      currentPrice: 71.23,
      thirtyDayLow: 71.23,
      thirtyDayAverage: 78.99,
      ninetyDayLow: 69.99
    },
    dealScore: {
      rating: 'GOOD_DEAL',
      label: '🟢 Good Deal',
      explanation: 'Chewy with 5% autoship discount brings net price to $71.23 ($2.03/lb), $7.75 below pet store retail.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Cheapest Unit Price on Veterinarian-Recommended Diet',
      bestOverallValue: 'Chewy ($71.23 with Free 1-3 Day Delivery)',
      reasoning: 'Purina Pro Plan rarely drops below $74.98 sticker price. Chewy gives 5% automatic discount on autoship (cancelable anytime) with free fast home delivery, saving you hauling the 35lb bag from a store.',
      unitEconomicsNote: '35 lb ($71.23) = $2.03/lb vs 18 lb ($48.98) = $2.72/lb.'
    },
    zigVerdict: {
      status: 'GOOD_DEAL',
      headline: '🏆 Snagz Best Price: $71.23 with Free Delivery',
      explanation: 'Chewy autoship price. Free fast shipping to your doorstep.',
      percentageDiff: -9.8
    },
    retailersCheckedCount: 5,
    listings: [
      {
        id: 'list-purina-chewy',
        retailerId: 'store-chewy',
        retailerName: 'Chewy',
        retailerDomain: 'chewy.com',
        retailerLogo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.chewy.com/s?query=purina+pro+plan+chicken+and+rice+35+lb',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 74.98,
        shippingPrice: 0,
        shippingNote: 'Free 1-3 Day Delivery',
        requiredFees: 0,
        couponCode: 'AUTOSHIP5',
        couponDiscount: 3.75,
        rebateDiscount: 0,
        cashbackPercentage: 2.0,
        estimatedTotal: 71.23,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-purina-petco',
        retailerId: 'store-petco',
        retailerName: 'Petco',
        retailerDomain: 'petco.com',
        retailerLogo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.petco.com/shop/en/petcostore/search?query=purina+pro+plan+35+lb',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 74.98,
        shippingPrice: 0,
        shippingNote: 'Free Curbside Pickup or Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 74.98,
        stockStatus: 'IN_STOCK',
        lastChecked: '10 mins ago',
        lastCheckedTimestamp: Date.now() - 600000
      },
      {
        id: 'list-purina-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=purina+pro+plan+adult+chicken+and+rice+35+lb',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 74.98,
        shippingPrice: 0,
        shippingNote: 'Free Prime Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 74.98,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      },
      {
        id: 'list-purina-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=purina+pro+plan+35+lb',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 76.99,
        shippingPrice: 0,
        shippingNote: 'Free 2-Day Shipping or Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 76.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '25 mins ago',
        lastCheckedTimestamp: Date.now() - 1500000
      }
    ],
    cheapestListing: {} as any,
    similarProducts: [
      {
        id: 'sim-blue-buffalo',
        title: 'Blue Buffalo Life Protection Adult Chicken & Brown Rice (30 lb Bag)',
        brand: 'Blue Buffalo',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 64.98,
        unitDisplay: '$2.16 / lb',
        dealScore: 'GOOD_DEAL',
        type: 'COMPARABLE',
        differenceReason: 'No corn, wheat, or soy. Within 13¢ per pound of Purina Pro Plan.'
      },
      {
        id: 'sim-iams-minichunks',
        title: 'Iams Proactive Health Adult Minichunks Chicken (30 lb Bag)',
        brand: 'Iams',
        image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 49.98,
        unitDisplay: '$1.67 / lb',
        dealScore: 'AMAZING_DEAL',
        type: 'CHEAPER_ALTERNATIVE',
        differenceReason: 'High quality budget alternative at $1.67/lb (saving $21.25 per bag vs Pro Plan).'
      }
    ]
  }
];

DOG_FOOD_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 6. ELECTRONICS: IPHONE 17 PRO CASE & WIRELESS EARBUDS UNDER $50
// -------------------------------------------------------------
export const IPHONE_CASE_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-spigen-ultra-hybrid-iphone17pro',
    title: 'Spigen Ultra Hybrid MagFit Designed for iPhone 17 Pro Case (2025/2026)',
    brand: 'Spigen',
    modelNumber: 'ACS08412',
    upc: '880997123991',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Compatibility': 'iPhone 17 Pro (6.3" Display)',
      'MagSafe': 'Integrated Neodymium Magnetic Ring',
      'Protection': 'Military-Grade Air Cushion Drop Protection',
      'Finish': 'Crystal Clear Anti-Yellowing Polycarbonate'
    },
    unitPriceMetric: {
      unitName: 'case',
      unitValue: 16.99,
      unitDisplay: '$16.99',
      advantageNote: 'Matches OtterBox drop protection for $37.96 less out of pocket'
    },
    priceHistory: {
      currentPrice: 16.99,
      thirtyDayLow: 16.99,
      thirtyDayAverage: 24.99,
      ninetyDayLow: 15.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'Amazon coupon clips $8.00 off MSRP ($24.99), bringing price to $16.99 (32% savings).',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Top Rated MagSafe Clear Case at Deep Discount',
      bestOverallValue: 'Spigen Ultra Hybrid MagFit at Amazon ($16.99)',
      reasoning: 'Apple charges $49.00 for their silicone case and OtterBox charges $54.95. Spigen provides military drop spec with stronger MagSafe magnets for just $16.99.',
      unitEconomicsNote: 'Save $32.01 over Apple first-party silicone case.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $16.99 (Save $8.00) at Amazon',
      explanation: 'Clip 32% off digital coupon on product page. Prime delivery included.',
      percentageDiff: -32.0
    },
    retailersCheckedCount: 4,
    listings: [
      {
        id: 'list-spigen-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=spigen+ultra+hybrid+iphone+17+pro+case',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Delivery',
        requiredFees: 0,
        couponCode: 'CLIP8',
        couponDiscount: 8.00,
        rebateDiscount: 0,
        estimatedTotal: 16.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-spigen-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=spigen+iphone+17+pro+case',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 21.99,
        shippingPrice: 0,
        shippingNote: 'Free Store Pickup or Shipping over $35',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 21.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '10 mins ago',
        lastCheckedTimestamp: Date.now() - 600000
      },
      {
        id: 'list-spigen-target',
        retailerId: 'store-target',
        retailerName: 'Target',
        retailerDomain: 'target.com',
        retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.target.com/s?searchTerm=spigen+iphone+17+pro+case',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 24.99,
        shippingPrice: 0,
        shippingNote: 'In-Store Pickup Available',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 24.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '20 mins ago',
        lastCheckedTimestamp: Date.now() - 1200000
      }
    ],
    cheapestListing: {} as any
  }
];

IPHONE_CASE_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

export const EARBUDS_UNDER_50_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-anker-soundcore-p3i',
    title: 'Anker Soundcore Life P3i Hybrid Active Noise Cancelling Wireless Earbuds',
    brand: 'Anker Soundcore',
    modelNumber: 'A3993011',
    upc: '194644093952',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Noise Cancelling': 'Hybrid ANC with 4 Microphones & AI Noise Reduction',
      'Battery Life': 'Up to 36 Hours (9 Hours on single charge)',
      'Drivers': '10mm Graphene Drivers with BassUp Technology',
      'Water Resistance': 'IPX5 Sweat and Water Resistant'
    },
    unitPriceMetric: {
      unitName: 'pair',
      unitValue: 39.99,
      unitDisplay: '$39.99 / pair',
      advantageNote: 'Lowest price for active noise cancelling under $50'
    },
    priceHistory: {
      currentPrice: 39.99,
      thirtyDayLow: 39.99,
      thirtyDayAverage: 49.99,
      ninetyDayLow: 34.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: '20% off regular $49.99 sticker price with hybrid ANC and 36-hour total battery life.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Top Recommended Earbuds Under $50 with Real Active Noise Cancellation',
      bestOverallValue: 'Anker Soundcore Life P3i at Amazon ($39.99)',
      reasoning: 'Most earbuds under $50 only offer passive noise isolation. The P3i delivers genuine dual-mode Active Noise Cancellation, custom EQ presets via the Soundcore app, and 9 hours of continuous playback per charge.',
      unitEconomicsNote: 'Save $10.00 vs MSRP. Free shipping included.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $39.99 at Amazon',
      explanation: 'Best performing active noise cancelling wireless earbuds under the $50 threshold.',
      percentageDiff: -20.0
    },
    retailersCheckedCount: 4,
    listings: [
      {
        id: 'list-anker-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=anker+soundcore+life+p3i',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 39.99,
        shippingPrice: 0,
        shippingNote: 'Free Prime Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 39.99,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-anker-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=anker+soundcore+p3i',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 44.99,
        shippingPrice: 0,
        shippingNote: 'Free Shipping on orders $35+',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 44.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '12 mins ago',
        lastCheckedTimestamp: Date.now() - 720000
      },
      {
        id: 'list-anker-target',
        retailerId: 'store-target',
        retailerName: 'Target',
        retailerDomain: 'target.com',
        retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.target.com/s?searchTerm=anker+soundcore+earbuds',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 49.99,
        shippingPrice: 0,
        shippingNote: 'In-Store Pickup Available',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 49.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '22 mins ago',
        lastCheckedTimestamp: Date.now() - 1320000
      }
    ],
    cheapestListing: {} as any,
    similarProducts: [
      {
        id: 'sim-jlab-go-air',
        title: 'JLab Go Air Pop True Wireless Earbuds',
        brand: 'JLab',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 19.88,
        unitDisplay: '$19.88 / pair',
        dealScore: 'AMAZING_DEAL',
        type: 'CHEAPER_ALTERNATIVE',
        differenceReason: 'Ultra budget pick at under $20 with 32-hour battery life (no ANC).'
      },
      {
        id: 'sim-tozo-t6',
        title: 'TOZO T6 Waterproof Wireless Earbuds',
        brand: 'TOZO',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=200&h=200&q=80',
        lowestPrice: 24.99,
        unitDisplay: '$24.99 / pair',
        dealScore: 'GOOD_DEAL',
        type: 'COMPARABLE',
        differenceReason: 'IPX8 waterproof rating allows immersion up to 1 meter depth for workouts.'
      }
    ]
  }
];

EARBUDS_UNDER_50_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 7. FOOTWEAR: NIKE AIR MAX 270 SIZE 10
// -------------------------------------------------------------
export const NIKE_AIR_MAX_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-nike-air-max-270-sz10',
    title: "Nike Air Max 270 Men's Lifestyle & Running Shoes (Size 10, Black/White)",
    brand: 'Nike',
    modelNumber: 'AH8050-002',
    upc: '091206129845',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Size': "Men's US 10 (EU 44 / 28cm)",
      'Colorway': 'Black / Anthracite / White',
      'Air Unit': '270-Degree Max Air Heel Unit',
      'Upper': 'Breathable Engineered Knit Mesh'
    },
    variants: [
      {
        name: 'Size',
        options: ['8.5', '9', '9.5', '10', '10.5', '11', '12'],
        selected: '10'
      }
    ],
    unitPriceMetric: {
      unitName: 'pair',
      unitValue: 119.97,
      unitDisplay: '$119.97 / pair',
      advantageNote: '25% off direct from Nike with free Member shipping'
    },
    priceHistory: {
      currentPrice: 119.97,
      thirtyDayLow: 119.97,
      thirtyDayAverage: 149.99,
      ninetyDayLow: 114.99
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'Save $40.03 (25% off) vs standard $160 retail price. Official Nike direct inventory.',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Authentic 25% Off Deal on Popular Size 10',
      bestOverallValue: 'Nike Official Store ($119.97 with Free Shipping)',
      reasoning: 'Size 10 is the most demanded men’s shoe size and frequently sells at full $160 retail. Nike.com has active promotional pricing on the Black/White colorway with free 60-day returns for Nike Members.',
      unitEconomicsNote: '$119.97 net effective price. Save $40.03 off MSRP.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $119.97 at Nike Official',
      explanation: 'Lowest price across authorized footwear retailers. Free shipping for Nike Members.',
      percentageDiff: -25.0
    },
    retailersCheckedCount: 4,
    listings: [
      {
        id: 'list-nike-official',
        retailerId: 'store-nike',
        retailerName: 'Nike Official Store',
        retailerDomain: 'nike.com',
        retailerLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.nike.com/w?q=air+max+270',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 159.99,
        shippingPrice: 0,
        shippingNote: 'Free Shipping for Nike Members (Free Sign-up)',
        requiredFees: 0,
        couponCode: 'SPRING25',
        couponDiscount: 40.02,
        rebateDiscount: 0,
        cashbackPercentage: 3.0,
        estimatedTotal: 119.97,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-nike-footlocker',
        retailerId: 'store-footlocker',
        retailerName: 'Foot Locker',
        retailerDomain: 'footlocker.com',
        retailerLogo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.footlocker.com/search?query=air+max+270',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 139.99,
        shippingPrice: 0,
        shippingNote: 'Free FLX Member Shipping',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 139.99,
        stockStatus: 'IN_STOCK',
        lastChecked: '15 mins ago',
        lastCheckedTimestamp: Date.now() - 900000
      },
      {
        id: 'list-nike-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=nike+air+max+270+size+10',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 149.95,
        shippingPrice: 0,
        shippingNote: 'Free Prime Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 149.95,
        stockStatus: 'IN_STOCK',
        lastChecked: '25 mins ago',
        lastCheckedTimestamp: Date.now() - 1500000
      }
    ],
    cheapestListing: {} as any
  }
];

NIKE_AIR_MAX_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// -------------------------------------------------------------
// 8. CONSOLES: PLAYSTATION 5 (PS5)
// -------------------------------------------------------------
export const PS5_PRODUCTS: PriceFinderProduct[] = [
  {
    id: 'prod-playstation-5-slim-disc',
    title: 'PlayStation 5 Slim Console (Disc Edition, 1TB SSD Storage)',
    brand: 'Sony',
    modelNumber: 'CFI-2000A01',
    upc: '711719570882',
    category: 'Video Games & Consoles',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&h=600&q=80',
    specs: {
      'Storage': '1TB Custom High-Speed NVMe SSD',
      'Optical Drive': 'Ultra HD Blu-ray Disc Drive (Detachable)',
      'Resolution': 'Up to 4K 120Hz / 8K Support',
      'Included Controller': 'DualSense Wireless Controller with Haptic Feedback'
    },
    variants: [
      {
        name: 'Edition',
        options: ['Slim Disc Edition (1TB)', 'Slim Digital Edition (1TB)'],
        selected: 'Slim Disc Edition (1TB)'
      }
    ],
    unitPriceMetric: {
      unitName: 'console',
      unitValue: 449.00,
      unitDisplay: '$449.00',
      advantageNote: 'Save $50.99 off standard $499.99 MSRP'
    },
    priceHistory: {
      currentPrice: 449.00,
      thirtyDayLow: 449.00,
      thirtyDayAverage: 499.00,
      ninetyDayLow: 449.00,
      allTimeLow: 449.00
    },
    dealScore: {
      rating: 'AMAZING_DEAL',
      label: '🔥 Amazing Deal',
      explanation: 'At $449.00, this is the lowest price ever recorded on the PS5 Slim Disc Edition ($50.99 savings).',
      historyConfidence: 'SUFFICIENT'
    },
    aiAdvisor: {
      isGoodDeal: true,
      verdictHeadline: 'Historic Low Price on PlayStation 5 Slim',
      bestOverallValue: 'Best Buy / Walmart ($449.00 with Free Next-Day Delivery)',
      reasoning: 'Sony authorized a nationwide promotional price reduction from $499.99 to $449.00. Disc edition gives you the flexibility of cheap pre-owned games and 4K Blu-ray movie playback.',
      unitEconomicsNote: 'Save $50.99 off list price.'
    },
    zigVerdict: {
      status: 'AMAZING_DEAL',
      headline: '🏆 Snagz Best Price: $449.00 (Save $50.99)',
      explanation: 'Official authorized retailer price drop across Best Buy, Walmart, and Amazon.',
      percentageDiff: -10.2
    },
    retailersCheckedCount: 5,
    listings: [
      {
        id: 'list-ps5-bestbuy',
        retailerId: 'store-bestbuy',
        retailerName: 'Best Buy',
        retailerDomain: 'bestbuy.com',
        retailerLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st=playstation+5+slim+console',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 449.00,
        shippingPrice: 0,
        shippingNote: 'Free Next-Day Delivery or 1-Hour Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 449.00,
        stockStatus: 'IN_STOCK',
        lastChecked: 'Just now',
        lastCheckedTimestamp: Date.now(),
        isCheapest: true
      },
      {
        id: 'list-ps5-walmart',
        retailerId: 'store-walmart',
        retailerName: 'Walmart',
        retailerDomain: 'walmart.com',
        retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.walmart.com/search?q=playstation+5+slim',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 449.00,
        shippingPrice: 0,
        shippingNote: 'Free 2-Day Delivery or Curbside Pickup',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 449.00,
        stockStatus: 'IN_STOCK',
        lastChecked: '5 mins ago',
        lastCheckedTimestamp: Date.now() - 300000,
        isCheapest: true
      },
      {
        id: 'list-ps5-amazon',
        retailerId: 'store-amazon',
        retailerName: 'Amazon',
        retailerDomain: 'amazon.com',
        retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
        directUrl: 'https://www.amazon.com/s?k=playstation+5+slim',
        sellerType: 'OFFICIAL_RETAILER',
        condition: 'NEW',
        itemPrice: 449.00,
        shippingPrice: 0,
        shippingNote: 'Free Prime 1-Day Delivery',
        requiredFees: 0,
        couponDiscount: 0,
        rebateDiscount: 0,
        estimatedTotal: 449.00,
        stockStatus: 'IN_STOCK',
        lastChecked: '8 mins ago',
        lastCheckedTimestamp: Date.now() - 480000,
        isCheapest: true
      }
    ],
    cheapestListing: {} as any
  }
];

PS5_PRODUCTS.forEach(p => {
  p.listings.sort((a, b) => a.estimatedTotal - b.estimatedTotal);
  p.listings[0].isCheapest = true;
  p.cheapestListing = p.listings[0];
});

// Master lookup function for queries
export function findMatchingDomainProducts(rawQuery: string): PriceFinderProduct[] {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return [];

  // Exact part codes
  if (q.includes('k7401') || q.includes('moog')) {
    return MOOG_K7401_PRODUCTS;
  }

  // Water pump or vehicle cooling
  if (q.includes('water pump') || (q.includes('ram') && q.includes('pump')) || (q.includes('dodge') && q.includes('pump'))) {
    return DODGE_RAM_WATER_PUMP_PRODUCTS;
  }

  // Transmission fluid & Dexron VI
  if (q.includes('transmission') || q.includes('fluid') || q.includes('dexron') || q.includes('atf') || q.includes('mercon')) {
    if (q.includes('dexron')) {
      return [TRANSMISSION_FLUID_PRODUCTS[1], TRANSMISSION_FLUID_PRODUCTS[0]];
    }
    return TRANSMISSION_FLUID_PRODUCTS;
  }

  // Motor oil / 5W-30
  if (q.includes('5w-30') || q.includes('5w30') || q.includes('motor oil') || q.includes('mobil 1') || q.includes('synthetic oil')) {
    return MOTOR_OIL_PRODUCTS;
  }

  // Paper towels
  if (q.includes('paper towel') || q.includes('bounty') || q.includes('brawny') || q.includes('scott')) {
    return PAPER_TOWEL_PRODUCTS;
  }

  // Dog food
  if (q.includes('dog food') || q.includes('pet food') || q.includes('purina') || q.includes('blue buffalo')) {
    return DOG_FOOD_PRODUCTS;
  }

  // iPhone 17 case
  if (q.includes('iphone') && (q.includes('case') || q.includes('cover') || q.includes('spigen'))) {
    return IPHONE_CASE_PRODUCTS;
  }

  // PS5
  if (q.includes('ps5') || q.includes('playstation 5') || q.includes('playstation')) {
    return PS5_PRODUCTS;
  }

  // Wireless earbuds under $50
  if (q.includes('earbud') || q.includes('headphones') || q.includes('soundcore') || q.includes('jlab')) {
    return EARBUDS_UNDER_50_PRODUCTS;
  }

  // Nike Air Max 270
  if (q.includes('air max') || (q.includes('nike') && q.includes('270')) || q.includes('ah8050')) {
    return NIKE_AIR_MAX_PRODUCTS;
  }

  return [];
}
