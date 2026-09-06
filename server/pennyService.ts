import { 
  PennyItem, 
  PennyListHealth, 
  PennyReportSubmission, 
  PennyFeedbackType,
  PennyStatus,
  PennyCategory,
  PennyAvailability
} from '../src/types';

export interface PennyRetailerAdapter {
  retailerId: string;
  retailerName: string;
  retailerDomain: string;
  retailerLogo: string;
  description: string;
  getPennyItems: () => Promise<PennyItem[]>;
}

// -------------------------------------------------------------
// DOLLAR GENERAL PENNY LIST ADAPTER
// Dollar General markdown schedule: Markdowns start at 25%, 
// 50%, 70%, 90%, and finally penny out ($0.01) on Tuesday mornings.
// -------------------------------------------------------------
export const DollarGeneralPennyAdapter: PennyRetailerAdapter = {
  retailerId: 'store-dollargeneral',
  retailerName: 'Dollar General',
  retailerDomain: 'dollargeneral.com',
  retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
  description: 'Dollar General weekly Tuesday 1¢ discontinue schedule. High-velocity seasonal resets, yellow/purple dot apparel, and home clearance.',
  getPennyItems: async () => initialPennyItems.filter(i => i.retailerId === 'store-dollargeneral')
};

// Generic adapter registry for future retailers (Home Depot, etc.)
export const registeredPennyAdapters: PennyRetailerAdapter[] = [
  DollarGeneralPennyAdapter,
  {
    retailerId: 'store-homedepot',
    retailerName: 'The Home Depot',
    retailerDomain: 'homedepot.com',
    retailerLogo: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&h=120&q=80',
    description: 'Home Depot clearance cycle items that reach .01 after 75% yellow tag markdown window.',
    getPennyItems: async () => initialPennyItems.filter(i => i.retailerId === 'store-homedepot')
  }
];

// -------------------------------------------------------------
// SEED PENNY LIST ITEMS
// -------------------------------------------------------------
export const initialPennyItems: PennyItem[] = [
  {
    id: 'penny-dg-trueliving-cast-iron-skillet',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'TrueLiving Pre-Seasoned Cast Iron Skillet (10-Inch)',
    brand: 'TrueLiving',
    size: '10 inch',
    variant: 'Black Rustic Finish',
    productImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '076753198242',
    sku: 'DG-TL-10CI',
    previousPrice: 16.50,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 98,
    category: 'Home',
    seasonalInfo: 'Purple Dot Kitchenware Markdown Reset',
    availability: 'IN_STORE',
    availabilityDetails: 'Reported in-store across participating DG locations. Found in housewares aisle and top overstock shelves.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Rangs up 1¢ at registers 1 & 2 when scanned with official DG barcode.'
    },
    dateDiscovered: '2026-09-02T08:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T10:15:00Z',
    lastVerifiedRelative: 'Moments ago',
    source: 'DG Tuesday Discontinue Markdown List & POS Scans',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Verified by 14 community POS receipt uploads; scanned at $0.01 via Dollar General app price checker in 8 states.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-1',
        timestamp: '2026-09-06T10:15:00Z',
        action: 'In-store barcode verification',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'SNAGZ Community Auditor',
        confidenceScore: 98,
        notes: 'Register receipt confirmed $0.01 checkout total.'
      },
      {
        id: 'vh-2',
        timestamp: '2026-09-02T08:30:00Z',
        action: 'Weekly Discontinue List match',
        verifiedPrice: 0.01,
        method: 'RETAILER_AD_SYSTEM',
        sourceName: 'DG Discontinue Schedule',
        confidenceScore: 95,
        notes: 'Purple Dot housewares reached final phase 1¢ drop.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 38,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 7,
      storeRefusedCount: 1
    },
    tags: ['TrueLiving', 'Purple Dot', 'Kitchen', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-gain-flings-botanicals',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Gain Flings! Botanicals Laundry Detergent Pacs',
    brand: 'Gain',
    size: '14 Count Pouch',
    variant: 'White Tea & Lavender',
    productImage: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '037000789214',
    sku: 'DG-GN-FL14',
    previousPrice: 5.95,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 96,
    category: 'Cleaning',
    seasonalInfo: 'Discontinued SKU Package Redesign',
    availability: 'IN_STORE',
    availabilityDetails: 'Check laundry aisle endcaps and discontinued clearance rolling carts.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Specific to the older 14ct packaging with purple trim banner.'
    },
    dateDiscovered: '2026-09-01T07:30:00Z',
    lastVerifiedTimestamp: '2026-09-06T09:40:00Z',
    lastVerifiedRelative: '45 minutes ago',
    source: 'Community POS Register Scan',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Scanned 1¢ in DG app price checker. 22 confirmed user receipt images in SNAGZ verification queue.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-3',
        timestamp: '2026-09-06T09:40:00Z',
        action: 'App in-store price check scan',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'User Receipt Verification',
        confidenceScore: 96,
        notes: 'Rang up $0.01 at DG Store #4192.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 29,
      didntWorkCount: 1,
      priceChangedCount: 0,
      notInStockCount: 12,
      storeRefusedCount: 0
    },
    tags: ['Gain', 'Laundry', 'Cleaning', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-clorox-scented-bleach',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Clorox Splash-less Bleach Concentrated Meadow Fresh',
    brand: 'Clorox',
    size: '43 fl oz',
    variant: 'Meadow Fresh',
    productImage: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '044600321899',
    sku: 'DG-CX-BL43',
    previousPrice: 4.85,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 94,
    category: 'Household',
    seasonalInfo: 'Formula & Bottle Size Transition',
    availability: 'IN_STORE',
    availabilityDetails: 'In-store nationwide where 43oz legacy stock remains on bottom shelves.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Applies only to 43oz size; 77oz bottles remain full price.'
    },
    dateDiscovered: '2026-09-02T11:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T08:20:00Z',
    lastVerifiedRelative: '2 hours ago',
    source: 'DG System Markdown Audit',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Audited across 11 DG store POS terminals; system price shows $0.01 penny status.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-4',
        timestamp: '2026-09-06T08:20:00Z',
        action: 'System Price Audit',
        verifiedPrice: 0.01,
        method: 'PRICE_AUDIT',
        sourceName: 'SNAGZ Price Tracker',
        confidenceScore: 94,
        notes: 'Price verified unchanged at 1 cent.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 19,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 15,
      storeRefusedCount: 1
    },
    tags: ['Clorox', 'Household', 'Cleaning', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-yellow-dot-gildan-hoodie',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Gildan Heavy Blend Fleece Pullover Hoodie (Assorted)',
    brand: 'Gildan',
    size: 'Adult L / XL',
    variant: 'Yellow Dot Tag - Heather Grey / Navy',
    productImage: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '883096412089',
    sku: 'DG-GL-HDYEL',
    previousPrice: 18.00,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 97,
    category: 'Apparel',
    seasonalInfo: 'Yellow Dot Apparel Seasonal Drop',
    availability: 'IN_STORE',
    availabilityDetails: 'Check apparel hanging racks and overhead clearance bins. Must have a Yellow Dot on the price tag.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Tag must bear the official Yellow Dot printed sticker or printed symbol.'
    },
    dateDiscovered: '2026-09-01T06:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T11:05:00Z',
    lastVerifiedRelative: 'Moments ago',
    source: 'DG Official Markdown Schedule',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Confirmed across nationwide stores. Yellow Dot apparel reached final 1¢ penny phase on Tuesday morning.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-5',
        timestamp: '2026-09-06T11:05:00Z',
        action: 'Apparel Clearance Audit',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'SNAGZ Community Auditor',
        confidenceScore: 97,
        notes: 'Scanned at self-checkout and main register for $0.01.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 42,
      didntWorkCount: 3,
      priceChangedCount: 0,
      notInStockCount: 9,
      storeRefusedCount: 2
    },
    tags: ['Gildan', 'Yellow Dot', 'Apparel', 'Clothing', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-airwick-scented-oil-hawaiian',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Air Wick Scented Oil Refill 2-Pack (Hawaiian Exotic Papaya)',
    brand: 'Air Wick',
    size: '2 x 0.67 fl oz',
    variant: 'Hawaiian Exotic Papaya (Summer Edition)',
    productImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '062338947113',
    sku: 'DG-AW-PAP2',
    previousPrice: 6.25,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 93,
    category: 'Household',
    seasonalInfo: 'Summer Scent Seasonal Discontinue',
    availability: 'IN_STORE',
    availabilityDetails: 'Air care aisle and summer seasonal markdown shelves.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Hawaiian Exotic Papaya 2-pack only. Standard lavender/linen scents remain at $6.25.'
    },
    dateDiscovered: '2026-09-02T14:15:00Z',
    lastVerifiedTimestamp: '2026-09-06T07:15:00Z',
    lastVerifiedRelative: '3 hours ago',
    source: 'DG Weekly Penny List Feed',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: '18 verified community reports with DG app scanner screenshots confirming 1 cent register status.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-6',
        timestamp: '2026-09-06T07:15:00Z',
        action: 'Community Scanner Confirmation',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'DG App Scan Scanner',
        confidenceScore: 93,
        notes: 'Barcodes scanned in TX, GA, NC, and OH.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 24,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 18,
      storeRefusedCount: 0
    },
    tags: ['Air Wick', 'Air Care', 'Household', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-playdoh-mini-color-pack',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Play-Doh Mini Fun Color 4-Pack Assortment',
    brand: 'Play-Doh',
    size: '4 x 1 oz Cans',
    variant: 'Neon Brights Packaging',
    productImage: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '630509738120',
    sku: 'DG-PD-NEON4',
    previousPrice: 3.50,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'REPORTED_PENNY',
    confidence: 82,
    category: 'Toys',
    seasonalInfo: 'Summer Fun Toy Reset',
    availability: 'SELECT_STORES',
    availabilityDetails: 'Toy aisle seasonal endcaps and discount baskets.',
    locationApplicability: {
      isNationwideParticipation: false,
      region: 'Midwest and Southeast stores confirmed',
      storeLocationNotes: 'Some stores already pulled stock off floor on Sunday.'
    },
    dateDiscovered: '2026-09-03T09:00:00Z',
    lastVerifiedTimestamp: '2026-09-05T18:30:00Z',
    lastVerifiedRelative: 'Yesterday',
    source: 'Community User Submission',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Reported by 6 coupon community shoppers; 4 receipt uploads showing $0.01. SNAGZ pending corporate file audit.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-7',
        timestamp: '2026-09-05T18:30:00Z',
        action: 'Community Report Submission',
        verifiedPrice: 0.01,
        method: 'USER_SUBMISSION',
        sourceName: 'SNAGZ Community Submissions',
        confidenceScore: 82,
        notes: '4 receipt uploads verified.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 11,
      didntWorkCount: 3,
      priceChangedCount: 0,
      notInStockCount: 14,
      storeRefusedCount: 2
    },
    tags: ['Play-Doh', 'Toys', 'Reported Penny']
  },
  {
    id: 'penny-dg-tresemme-pro-pure-shampoo',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'TRESemmé Pro Pure Sulfate-Free Shampoo (Micellar Moisture)',
    brand: 'TRESemmé',
    size: '16 fl oz',
    variant: 'Micellar Moisture Clear Bottle',
    productImage: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '022400008455',
    sku: 'DG-TS-PP16',
    previousPrice: 6.50,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 95,
    category: 'Personal Care',
    seasonalInfo: 'Hair Care Discontinued Formula Planogram',
    availability: 'IN_STORE',
    availabilityDetails: 'Shampoo aisle shelf bottom and overstock boxes in rear of store.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Specific to older clear bottle design. The new white bottle remains full price.'
    },
    dateDiscovered: '2026-09-01T10:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T09:10:00Z',
    lastVerifiedRelative: '1 hour ago',
    source: 'DG Planogram Reset Audit',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Official discontinue list matched. Verified through 31 store register audits nationwide.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-8',
        timestamp: '2026-09-06T09:10:00Z',
        action: 'Planogram Audit',
        verifiedPrice: 0.01,
        method: 'PRICE_AUDIT',
        sourceName: 'SNAGZ Crawler',
        confidenceScore: 95,
        notes: 'Confirmed 1¢ active price.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 31,
      didntWorkCount: 1,
      priceChangedCount: 0,
      notInStockCount: 8,
      storeRefusedCount: 0
    },
    tags: ['TRESemme', 'Hair Care', 'Personal Care', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-purina-beggin-strips-bacon-cheese',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Purina Beggin\' Strips Real Meat Dog Treats (Bacon & Cheese)',
    brand: 'Purina',
    size: '6 oz Pouch',
    variant: 'Limited Edition Summer BBQ Graphic',
    productImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '038100142058',
    sku: 'DG-PU-BG06',
    previousPrice: 4.25,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 91,
    category: 'Pet',
    seasonalInfo: 'Summer BBQ Pet Treats Promo Discontinue',
    availability: 'IN_STORE',
    availabilityDetails: 'Check pet aisle and promotional front display dump tables.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Bag must feature the summer grill graphic in corner.'
    },
    dateDiscovered: '2026-09-02T13:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T06:45:00Z',
    lastVerifiedRelative: '4 hours ago',
    source: 'DG Weekly Clearance Feed',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Confirmed across 17 stores. Tuesday markdown cycle dropped price to $0.01.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-9',
        timestamp: '2026-09-06T06:45:00Z',
        action: 'Store Scan Verification',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'Community POS Upload',
        confidenceScore: 91,
        notes: 'Scanned 1¢ in AL, TN, KY stores.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 17,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 11,
      storeRefusedCount: 1
    },
    tags: ['Purina', 'Pet', 'Dog Treats', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-general-mills-cheerios-strawberry-banana',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Cheerios Strawberry Banana Cereal Family Size Box',
    brand: 'General Mills',
    size: '14.9 oz Box',
    variant: 'Strawberry Banana Limited Flavor',
    productImage: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '016000171221',
    sku: 'DG-GM-CH14',
    previousPrice: 4.95,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'REPORTED_PENNY',
    confidence: 79,
    category: 'Food',
    seasonalInfo: 'Spring/Summer Limited Cereal Discontinue',
    availability: 'SELECT_STORES',
    availabilityDetails: 'Cereal aisle top shelf overstock and clearance rack.',
    locationApplicability: {
      isNationwideParticipation: false,
      region: 'Select regional stores with older inventory',
      storeLocationNotes: 'Best-by dates through October 2026.'
    },
    dateDiscovered: '2026-09-03T15:20:00Z',
    lastVerifiedTimestamp: '2026-09-05T14:10:00Z',
    lastVerifiedRelative: 'Yesterday',
    source: 'Community User Submission',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Multiple community shoppers report $0.01 at register. Independent receipt validation underway.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-10',
        timestamp: '2026-09-05T14:10:00Z',
        action: 'User Price Report',
        verifiedPrice: 0.01,
        method: 'USER_SUBMISSION',
        sourceName: 'User Report',
        confidenceScore: 79,
        notes: 'Price reported at $0.01 in FL & GA.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 8,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 16,
      storeRefusedCount: 0
    },
    tags: ['Cheerios', 'Food', 'Cereal', 'Reported Penny']
  },
  {
    id: 'penny-dg-trueliving-solar-pathway-lights',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'TrueLiving Solar LED Stainless Steel Pathway Garden Lights',
    brand: 'TrueLiving',
    size: 'Single Stake',
    variant: 'Silver Stainless Steel Mosaic Lens',
    productImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '076753448101',
    sku: 'DG-TL-SOL01',
    previousPrice: 5.00,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 95,
    category: 'Seasonal',
    seasonalInfo: 'Summer Lawn & Garden Final Penny Drop',
    availability: 'IN_STORE',
    availabilityDetails: 'Garden section clearance racks and seasonal transition aisle.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Lawn and garden final penny date was Tuesday September 1st.'
    },
    dateDiscovered: '2026-09-01T08:00:00Z',
    lastVerifiedTimestamp: '2026-09-06T10:50:00Z',
    lastVerifiedRelative: 'Moments ago',
    source: 'DG Markdown Calendar & Community Scans',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Over 50 community verified receipts. Summer lawn and garden reached final penny phase.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-11',
        timestamp: '2026-09-06T10:50:00Z',
        action: 'Lawn & Garden Markdown Confirmation',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'SNAGZ Community Auditor',
        confidenceScore: 95,
        notes: 'Active $0.01 confirmed at checkout.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 45,
      didntWorkCount: 2,
      priceChangedCount: 0,
      notInStockCount: 21,
      storeRefusedCount: 3
    },
    tags: ['TrueLiving', 'Lawn & Garden', 'Seasonal', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-bic-velocity-mechanical-pencils',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'BIC Velocity Max Mechanical Pencils 0.7mm (2-Pack)',
    brand: 'BIC',
    size: '2 Count',
    variant: 'Neon Colors + Extra Lead & Erasers',
    productImage: 'https://images.unsplash.com/photo-1585336261026-41ff340ef241?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '070330349219',
    sku: 'DG-BC-VEL02',
    previousPrice: 4.50,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'CONFIRMED_PENNY',
    confidence: 92,
    category: 'Other',
    seasonalInfo: 'Discontinued Stationery SKU Reset',
    availability: 'IN_STORE',
    availabilityDetails: 'Stationery and school supplies aisle.',
    locationApplicability: {
      isNationwideParticipation: true,
      region: 'Nationwide participating stores',
      storeLocationNotes: 'Specific packaging with the green "FREE REFILLS" promotional burst.'
    },
    dateDiscovered: '2026-09-02T10:30:00Z',
    lastVerifiedTimestamp: '2026-09-06T08:50:00Z',
    lastVerifiedRelative: '2 hours ago',
    source: 'DG In-Store Scanner Verification',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Community POS receipt verified in 12 states; barcode matches discontinued school package.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-12',
        timestamp: '2026-09-06T08:50:00Z',
        action: 'Barcode Scan Verification',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'User Receipt Upload',
        confidenceScore: 92,
        notes: 'Receipt uploaded showing $0.01 purchase.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 20,
      didntWorkCount: 1,
      priceChangedCount: 0,
      notInStockCount: 13,
      storeRefusedCount: 0
    },
    tags: ['BIC', 'Office', 'Stationery', 'Confirmed Penny']
  },
  {
    id: 'penny-dg-folgers-simply-gourmet-caramel',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Folgers Simply Gourmet Natural Caramel Ground Coffee',
    brand: 'Folgers',
    size: '10 oz Bag',
    variant: 'Natural Caramel Flavored Ground',
    productImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '025500003716',
    sku: 'DG-FL-CAR10',
    previousPrice: 6.95,
    currentPrice: 0.01,
    expectedPennyPrice: 0.01,
    status: 'STALE_NEEDS_VERIFICATION',
    confidence: 68,
    category: 'Food',
    seasonalInfo: 'Discontinued Flavor Line',
    availability: 'SELECT_STORES',
    availabilityDetails: 'Most inventory was removed by employees during last week planogram reset.',
    locationApplicability: {
      isNationwideParticipation: false,
      region: 'Remaining straggler inventory only',
      storeLocationNotes: 'No new reports in 5 days; may be completely cleared from shelves.'
    },
    dateDiscovered: '2026-08-26T09:00:00Z',
    lastVerifiedTimestamp: '2026-08-31T16:00:00Z',
    lastVerifiedRelative: '6 days ago (Stale)',
    source: 'Community User Submission',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'Discontinued flavor line. Previously verified at $0.01, but no new reports in over 5 days.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-13',
        timestamp: '2026-08-31T16:00:00Z',
        action: 'Last Community Report',
        verifiedPrice: 0.01,
        method: 'USER_SUBMISSION',
        sourceName: 'User Report',
        confidenceScore: 68,
        notes: 'Marked STALE due to elapsed confirmation threshold.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 7,
      didntWorkCount: 4,
      priceChangedCount: 1,
      notInStockCount: 28,
      storeRefusedCount: 2
    },
    tags: ['Folgers', 'Coffee', 'Food', 'Stale Penny']
  },
  {
    id: 'penny-dg-energizer-max-aaa-4pack-legacy',
    retailerId: 'store-dollargeneral',
    retailerName: 'Dollar General',
    retailerDomain: 'dollargeneral.com',
    retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    productName: 'Energizer MAX AAA Alkaline Batteries 4-Pack (Legacy Package)',
    brand: 'Energizer',
    size: '4-Pack',
    variant: '2024 Design Package',
    productImage: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?auto=format&fit=crop&w=400&h=400&q=80',
    upc: '039800011329',
    sku: 'DG-EN-AAA04',
    previousPrice: 5.75,
    currentPrice: 5.75,
    expectedPennyPrice: 0.01,
    status: 'NO_LONGER_ACTIVE',
    confidence: 15,
    category: 'Electronics',
    seasonalInfo: 'SKU Re-activation / Price Reset',
    availability: 'UNKNOWN',
    availabilityDetails: 'Dollar General POS system reset price back to regular retail of $5.75. No longer ringing up for 1¢.',
    locationApplicability: {
      isNationwideParticipation: false,
      region: 'Price reset nationwide',
      storeLocationNotes: 'Do not attempt to purchase as a penny item.'
    },
    dateDiscovered: '2026-08-20T12:00:00Z',
    lastVerifiedTimestamp: '2026-09-04T11:00:00Z',
    lastVerifiedRelative: '2 days ago',
    source: 'DG System Price Correction Notice',
    sourceUrl: 'https://www.dollargeneral.com',
    sourceEvidence: 'System price returned to $5.75 after corporate planogram re-index.',
    isGlitch: false,
    verificationHistory: [
      {
        id: 'vh-14',
        timestamp: '2026-09-04T11:00:00Z',
        action: 'System Price Reversal Detected',
        verifiedPrice: 5.75,
        method: 'PRICE_AUDIT',
        sourceName: 'SNAGZ Crawler Audit',
        confidenceScore: 15,
        notes: 'Price corrected to $5.75 by retailer.'
      }
    ],
    userFeedbackStats: {
      rangUpPennyCount: 5,
      didntWorkCount: 19,
      priceChangedCount: 22,
      notInStockCount: 3,
      storeRefusedCount: 0
    },
    tags: ['Energizer', 'Electronics', 'No Longer Active']
  }
];

// -------------------------------------------------------------
// PENNY REPOSITORY & VERIFICATION SERVICE
// -------------------------------------------------------------
class PennyService {
  private items: PennyItem[] = [...initialPennyItems];
  private pendingSubmissions: PennyReportSubmission[] = [];

  // Get items with filtering, sorting, location support, and search
  public getPennyItemsSync(params?: {
    retailerId?: string;
    category?: string;
    status?: string;
    sort?: string;
    q?: string;
    zip?: string;
    activeOnly?: boolean;
  }): { items: PennyItem[]; count: number } {
    let result = [...this.items];

    // Filter by retailer
    if (params?.retailerId && params.retailerId !== 'ALL') {
      result = result.filter(item => item.retailerId === params.retailerId);
    }

    // Filter by category
    if (params?.category && params.category !== 'All') {
      result = result.filter(item => item.category.toLowerCase() === params.category!.toLowerCase());
    }

    // Filter by status
    if (params?.status && params.status !== 'ALL') {
      result = result.filter(item => item.status === params.status);
    }

    // Filter active only (default for general views)
    if (params?.activeOnly) {
      result = result.filter(item => item.status === 'CONFIRMED_PENNY' || item.status === 'REPORTED_PENNY');
    }

    // Search query matching (UPC, SKU, brand, product name, tags)
    if (params?.q) {
      const q = params.q.toLowerCase().trim();
      result = result.filter(item => 
        item.productName.toLowerCase().includes(q) ||
        item.brand.toLowerCase().includes(q) ||
        item.upc.includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q)) ||
        (item.seasonalInfo && item.seasonalInfo.toLowerCase().includes(q)) ||
        item.category.toLowerCase().includes(q) ||
        item.retailerName.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort items based on requirements (Rank formula: Confidence, Recency, Availability, Confirmations)
    const sort = params?.sort || 'highest_confidence';
    switch (sort) {
      case 'recently_verified':
        result.sort((a, b) => new Date(b.lastVerifiedTimestamp).getTime() - new Date(a.lastVerifiedTimestamp).getTime());
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.dateDiscovered).getTime() - new Date(a.dateDiscovered).getTime());
        break;
      case 'highest_confidence':
        result.sort((a, b) => {
          // Confirmed penny first, then confidence desc, then recency
          if (a.status === 'CONFIRMED_PENNY' && b.status !== 'CONFIRMED_PENNY') return -1;
          if (b.status === 'CONFIRMED_PENNY' && a.status !== 'CONFIRMED_PENNY') return 1;
          if (b.confidence !== a.confidence) return b.confidence - a.confidence;
          return new Date(b.lastVerifiedTimestamp).getTime() - new Date(a.lastVerifiedTimestamp).getTime();
        });
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
      case 'most_confirmations':
        result.sort((a, b) => b.userFeedbackStats.rangUpPennyCount - a.userFeedbackStats.rangUpPennyCount);
        break;
      default:
        // Default rank
        result.sort((a, b) => b.confidence - a.confidence);
    }

    return {
      items: result,
      count: result.length
    };
  }

  // Get items with filtering (async wrapper)
  public async getPennyItems(params?: {
    retailerId?: string;
    category?: string;
    status?: string;
    sort?: string;
    q?: string;
    zip?: string;
    activeOnly?: boolean;
  }): Promise<{ items: PennyItem[]; count: number }> {
    return this.getPennyItemsSync(params);
  }

  // Get single item by ID
  public async getPennyItemById(id: string): Promise<PennyItem | null> {
    const found = this.items.find(i => i.id === id);
    return found || null;
  }

  // Submit quick community feedback on an item (RANG_UP_PENNY, DIDNT_WORK, etc.)
  public async submitFeedback(id: string, type: PennyFeedbackType, notes?: string): Promise<{ success: boolean; item: PennyItem }> {
    const itemIndex = this.items.findIndex(i => i.id === id);
    if (itemIndex === -1) {
      throw new Error(`Penny item ${id} not found`);
    }

    const item = { ...this.items[itemIndex] };
    const now = new Date().toISOString();

    // Increment stats
    if (type === 'RANG_UP_PENNY') {
      item.userFeedbackStats.rangUpPennyCount += 1;
      item.confidence = Math.min(99, item.confidence + 1);
      item.lastVerifiedTimestamp = now;
      item.lastVerifiedRelative = 'Just now';
      item.verificationHistory.unshift({
        id: `vh-${Date.now()}`,
        timestamp: now,
        action: 'Community Confirmation: Rang up for 1¢',
        verifiedPrice: 0.01,
        method: 'POS_RECEIPT_SCAN',
        sourceName: 'Verified User Report',
        confidenceScore: item.confidence,
        notes: notes || 'User reported successful 1 cent checkout.'
      });
    } else if (type === 'DIDNT_WORK') {
      item.userFeedbackStats.didntWorkCount += 1;
      item.confidence = Math.max(10, item.confidence - 3);
    } else if (type === 'PRICE_CHANGED') {
      item.userFeedbackStats.priceChangedCount += 1;
      item.confidence = Math.max(5, item.confidence - 10);
      if (item.userFeedbackStats.priceChangedCount >= 3) {
        item.status = 'NO_LONGER_ACTIVE';
      }
    } else if (type === 'NOT_IN_STOCK') {
      item.userFeedbackStats.notInStockCount += 1;
    } else if (type === 'STORE_REFUSED') {
      item.userFeedbackStats.storeRefusedCount += 1;
    }

    this.items[itemIndex] = item;
    return { success: true, item };
  }

  // Community report submission with UPC/SKU deduplication
  public async submitReport(report: PennyReportSubmission): Promise<{ success: boolean; message: string; itemId?: string }> {
    // 1. Check for existing item by UPC/GTIN
    const cleanUpc = report.upc.replace(/\D/g, '');
    const existingIndex = this.items.findIndex(i => i.upc.replace(/\D/g, '') === cleanUpc);

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      // Merge report into existing item
      const existing = this.items[existingIndex];
      existing.userFeedbackStats.rangUpPennyCount += 1;
      existing.lastVerifiedTimestamp = now;
      existing.lastVerifiedRelative = 'Moments ago';
      existing.verificationHistory.unshift({
        id: `vh-${Date.now()}`,
        timestamp: now,
        action: 'Community Report Submission',
        verifiedPrice: report.reportedPrice || 0.01,
        method: 'USER_SUBMISSION',
        sourceName: `Community Report (${report.storeLocation || 'In-Store'})`,
        confidenceScore: existing.confidence,
        notes: report.notes || 'User report submitted via SNAGZ Community Scanner'
      });

      return {
        success: true,
        message: 'Your report matched an existing penny find and has been added as fresh verification evidence!',
        itemId: existing.id
      };
    }

    // 2. New Penny Item candidate
    const newItemId = `penny-${report.retailerId}-${Date.now()}`;
    const retailerName = report.retailerId === 'store-dollargeneral' ? 'Dollar General' : 'Retailer';
    const retailerLogo = report.retailerId === 'store-dollargeneral' 
      ? 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80'
      : 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&h=120&q=80';

    const newItem: PennyItem = {
      id: newItemId,
      retailerId: report.retailerId,
      retailerName,
      retailerDomain: 'dollargeneral.com',
      retailerLogo,
      productName: report.productName,
      brand: report.brand || 'Unspecified Brand',
      productImage: report.photoUrl || 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=400&h=400&q=80',
      upc: report.upc,
      sku: report.itemNumber,
      previousPrice: 10.00,
      currentPrice: 0.01,
      expectedPennyPrice: 0.01,
      status: 'REPORTED_PENNY', // Community report is not confirmed automatically
      confidence: 75,
      category: report.category || 'Other',
      seasonalInfo: 'Community Reported Markdown',
      availability: 'IN_STORE',
      availabilityDetails: report.storeLocation ? `Reported at: ${report.storeLocation}` : 'In-store reported find',
      locationApplicability: {
        isNationwideParticipation: false,
        storeLocationNotes: report.storeLocation
      },
      dateDiscovered: now,
      lastVerifiedTimestamp: now,
      lastVerifiedRelative: 'Just now',
      source: report.source || 'SNAGZ Community User Report',
      sourceEvidence: report.notes || 'Submitted by user with receipt or barcode photo.',
      isGlitch: false,
      verificationHistory: [
        {
          id: `vh-${Date.now()}`,
          timestamp: now,
          action: 'Initial User Report',
          verifiedPrice: report.reportedPrice || 0.01,
          method: 'USER_SUBMISSION',
          sourceName: 'Community User Submission',
          confidenceScore: 75,
          notes: report.notes
        }
      ],
      userFeedbackStats: {
        rangUpPennyCount: 1,
        didntWorkCount: 0,
        priceChangedCount: 0,
        notInStockCount: 0,
        storeRefusedCount: 0
      },
      tags: ['Community Report', 'Pending Audit']
    };

    this.items.unshift(newItem);
    this.pendingSubmissions.push(report);

    return {
      success: true,
      message: 'Penny find submitted successfully! It is now live with "REPORTED PENNY" status pending full auditor confirmation.',
      itemId: newItem.id
    };
  }

  // Get Penny List Data Health
  public getHealth(): PennyListHealth {
    const total = this.items.length;
    const confirmed = this.items.filter(i => i.status === 'CONFIRMED_PENNY').length;
    const reported = this.items.filter(i => i.status === 'REPORTED_PENNY').length;
    const stale = this.items.filter(i => i.status === 'STALE_NEEDS_VERIFICATION').length;
    const inactive = this.items.filter(i => i.status === 'NO_LONGER_ACTIVE').length;

    const dgCount = this.items.filter(i => i.retailerId === 'store-dollargeneral' && (i.status === 'CONFIRMED_PENNY' || i.status === 'REPORTED_PENNY')).length;
    const hdCount = this.items.filter(i => i.retailerId === 'store-homedepot').length;

    return {
      activeSources: 8,
      lastSuccessfulUpdate: new Date().toISOString(),
      currentItemCount: confirmed + reported,
      confirmedCount: confirmed,
      reportedCount: reported,
      staleCount: stale,
      pendingVerificationCount: this.pendingSubmissions.length,
      verificationSuccessRate: 96.2,
      reportsReceived: 342,
      supportedRetailers: [
        {
          id: 'store-dollargeneral',
          name: 'Dollar General',
          activeCount: dgCount,
          status: 'ACTIVE'
        },
        {
          id: 'store-homedepot',
          name: 'The Home Depot',
          activeCount: hdCount,
          status: 'PLANNED'
        }
      ]
    };
  }
}

export const pennyService = new PennyService();
