import {
  Deal,
  Store,
  UserList,
  DealAlert,
  ProductWatchlistItem,
  UserReport,
  AdminMetrics,
  StackingBreakdown,
  PriceAnalysis,
  FreeClassification,
  BestDealEvaluation,
  PriceDropCombinationAlert,
  SavingsTrackerState,
  UserPrivacySettings,
  WhyNotFreeAnalysis,
  RetailerCategory,
  CategoryBalanceMetric,
  RetailerDiscoveryHealth,
  StoreLocation,
  StoreLoyaltyProgram
} from '../src/types';
import { comprehensiveStores, sampleStoreLocations, sampleLoyaltyPrograms } from './retailerDatabase';
import { CVSAdapter, WalmartAdapter, WalgreensAdapter, KrogerAdapter, HomeDepotAdapter, AutoZoneAdapter, DollarGeneralAdapter, CostcoAdapter, AldiAdapter } from './retailerAdapters';

// Initial Seed Stores
export const initialStores: Store[] = [
  {
    id: 'store-target',
    name: 'Target',
    slug: 'target',
    domain: 'target.com',
    logo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Department Stores',
    description: 'Everyday essentials, electronics, home goods, apparel, and groceries with RedCard savings.',
    cashbackRate: 2.5,
    cashbackProvider: 'Rakuten & SNAGZ Rewards',
    allowsStacking: true,
    couponCount: 14,
    dealCount: 38,
    popularDiscountText: 'Up to 50% Off Clearance & Circle Offers',
    verifiedScore: 98,
    isFollowed: true
  },
  {
    id: 'store-nike',
    name: 'Nike',
    slug: 'nike',
    domain: 'nike.com',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Footwear & Athletic',
    description: 'World premier athletic footwear, sportswear, training gear, and member-exclusive drops.',
    cashbackRate: 6.0,
    cashbackProvider: 'TopCashback',
    allowsStacking: true,
    couponCount: 8,
    dealCount: 22,
    popularDiscountText: 'Extra 20% Off Select Sale Shoes',
    verifiedScore: 96,
    isFollowed: true
  },
  {
    id: 'store-bestbuy',
    name: 'Best Buy',
    slug: 'best-buy',
    domain: 'bestbuy.com',
    logo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Electronics & Computers',
    description: 'Laptops, TVs, smart home, appliances, and daily tech doorbuster deals.',
    cashbackRate: 1.5,
    cashbackProvider: 'SNAGZ Direct',
    allowsStacking: false,
    couponCount: 9,
    dealCount: 45,
    popularDiscountText: 'Member Deals & Tech Price-Match',
    verifiedScore: 94,
    isFollowed: false
  },
  {
    id: 'store-amazon',
    name: 'Amazon',
    slug: 'amazon',
    domain: 'amazon.com',
    logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'General Merchandise',
    description: 'Digital coupons, lightning deals, Prime savings, and warehouse clearance.',
    cashbackRate: 3.0,
    cashbackProvider: 'Prime Card & Affiliates',
    allowsStacking: true,
    couponCount: 65,
    dealCount: 140,
    popularDiscountText: 'Clip Coupons up to $50 Off',
    verifiedScore: 92,
    isFollowed: true
  },
  {
    id: 'store-sephora',
    name: 'Sephora',
    slug: 'sephora',
    domain: 'sephora.com',
    logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Beauty & Cosmetics',
    description: 'Prestige cosmetics, fragrances, skincare with free sample bundles on all orders.',
    cashbackRate: 4.0,
    cashbackProvider: 'Rakuten',
    allowsStacking: true,
    couponCount: 12,
    dealCount: 29,
    popularDiscountText: 'Free Deluxe Samples + 20% VIB Sale',
    verifiedScore: 97,
    isFollowed: false
  },
  {
    id: 'store-dominos',
    name: 'Domino’s Pizza',
    slug: 'dominos',
    domain: 'dominos.com',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Restaurants & Food',
    description: 'Carryout specials, mix & match deals, and national promo coupon codes.',
    cashbackRate: 0,
    allowsStacking: false,
    couponCount: 6,
    dealCount: 11,
    popularDiscountText: '$7.99 Mix & Match 2+ Items',
    verifiedScore: 99,
    isFollowed: true
  },
  {
    id: 'store-homedepot',
    name: 'The Home Depot',
    slug: 'home-depot',
    domain: 'homedepot.com',
    logo: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Home & Garden',
    description: 'Tools, building supplies, patio furniture, appliances and Special Buys of the Day.',
    cashbackRate: 2.0,
    cashbackProvider: 'TopCashback',
    allowsStacking: true,
    couponCount: 8,
    dealCount: 31,
    popularDiscountText: 'Special Buy Savings up to 40% Off',
    verifiedScore: 91,
    isFollowed: false
  },
  {
    id: 'store-apple',
    name: 'Apple',
    slug: 'apple',
    domain: 'apple.com',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Electronics & Computers',
    description: 'Certified refurbished store, education discounts, and trade-in promotional values.',
    cashbackRate: 3.0,
    cashbackProvider: 'Apple Card 3% Daily Cash',
    allowsStacking: false,
    couponCount: 3,
    dealCount: 14,
    popularDiscountText: 'Education Pricing & Refurbished 15% Off',
    verifiedScore: 99,
    isFollowed: false
  },
  {
    id: 'store-chipotle',
    name: 'Chipotle Mexican Grill',
    slug: 'chipotle',
    domain: 'chipotle.com',
    logo: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Restaurants & Food',
    description: 'Burritos, bowls, quesadillas with rewards app BOGO codes and free guac drops.',
    cashbackRate: 0,
    allowsStacking: false,
    couponCount: 4,
    dealCount: 7,
    popularDiscountText: 'Free Guac with Entree / BOGO Event',
    verifiedScore: 95,
    isFollowed: false
  },
  {
    id: 'store-rei',
    name: 'REI Co-op',
    slug: 'rei',
    domain: 'rei.com',
    logo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=120&h=120&q=80',
    category: 'Outdoors & Sports',
    description: 'Outdoor recreation gear, camping, hiking footwear, and member dividend savings.',
    cashbackRate: 5.0,
    cashbackProvider: 'Rakuten',
    allowsStacking: true,
    couponCount: 5,
    dealCount: 19,
    popularDiscountText: 'Outlet clearance 30-50% off + 20% Member Coupon',
    verifiedScore: 96,
    isFollowed: false
  }
];

// Seed Deals with comprehensive verification, expiration, stacking, best deal rankings, why not free audits, channels
export const initialDeals: Deal[] = [
  // 1. BEST DEAL #1 FEATURE: Wireless Noise-Cancelling Headphones / AirPods Pro / Sony
  {
    id: 'deal-wireless-headphones-best-deal',
    title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    description: 'Top-rated active noise canceling headphones with 30-hour battery life and multipoint Bluetooth connection. Stack manufacturer instant markdown with coupon code and 4.5% cashback.',
    storeId: 'store-bestbuy',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'bestbuy.com',
    code: 'SONIC20',
    dealType: 'coupon_code',
    discountDisplay: '$48 OFF (Stack)',
    category: 'Electronics & Computers',
    subcategory: 'Audio & Headphones',
    targetUrl: 'https://www.bestbuy.com/site/sony-headphones',
    directMerchantUrl: 'https://www.bestbuy.com/site/sony-headphones',
    isAffiliateLink: true,
    affiliateDisclosureText: 'SNAGZ independent ranking. Affiliate commission has 0% influence on deal score or ranking.',
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide online and at all US Best Buy retail stores',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 199.00,
    currentPrice: 179.00,
    estimatedFinalPrice: 151.00,
    estimatedSavingsDollar: 48.00,
    estimatedSavingsPercent: 24.1,
    dealScore: 94,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    scoreFactors: {
      discountDepth: 93,
      reliability: 99,
      priceHistoryAdvantage: 96,
      stackPotential: 90,
      communityTrust: 95
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:52:00Z',
      lastSuccessful: '2026-08-30T18:52:00Z',
      method: 'automated_checkout_probe',
      source: 'Official Best Buy Merchant Feed',
      confidenceScore: 98,
      userConfirmations: 184,
      userFailureReports: 2,
      lastUserConfirmedAgo: '12 minutes ago',
      verificationAgeHours: 0.2,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-03T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 95,
      label: 'Expires in 4 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 4
    },
    stacking: {
      isStackable: true,
      originalPrice: 199.00,
      currentSalePrice: 179.00,
      actualCheckoutPrice: 159.00,
      estimatedEffectivePrice: 151.00,
      totalSaved: 48.00,
      totalSavedPercentage: 24.1,
      components: [
        { title: 'Store Sale Markdown', type: 'sale', discountAmount: 20.00, permitted: true, confidence: 100 },
        { title: 'Promo Code SONIC20', type: 'store_coupon', code: 'SONIC20', discountAmount: 20.00, permitted: true, confidence: 98 },
        { title: 'Cashback Rebate', type: 'cashback', discountAmount: 8.00, description: '4.5% Cashback via SNAGZ Rewards', permitted: true, confidence: 95 },
        { title: 'Free 2-Day Shipping', type: 'free_shipping', discountAmount: 0.00, description: 'Orders over $35 ship free', permitted: true, confidence: 100 }
      ]
    },
    priceAnalysis: {
      currentPrice: 179.00,
      originalPrice: 199.00,
      lowestObserved: 151.00,
      highestObserved: 199.00,
      typicalHistoricalPrice: 189.00,
      isRealDiscount: true,
      historicalSaleFrequency: 'Rare',
      verdict: 'ALL_TIME_LOW',
      verdictReason: '$151 effective price is the lowest recorded price in the last 12 months.',
      lowestIn12MonthsClaim: 'Lowest recorded price in the last 12 months across all tracked US retailers.',
      history: [
        { date: '2026-03-15', price: 199.00, retailer: 'Best Buy' },
        { date: '2026-05-20', price: 189.00, retailer: 'Best Buy' },
        { date: '2026-07-04', price: 179.00, retailer: 'Best Buy', event: '4th of July Sale' },
        { date: '2026-08-30', price: 151.00, retailer: 'Best Buy', event: 'Current Stack' }
      ]
    },
    bestDealEvaluation: {
      isRankOne: true,
      productTarget: 'Wireless Headphones',
      regularPrice: 199.00,
      currentPrice: 179.00,
      couponDiscount: 20.00,
      cashbackDiscount: 8.00,
      shippingCost: 0.00,
      estimatedEffectivePrice: 151.00,
      estimatedTotalSavings: 48.00,
      savingsPercentage: 24.1,
      whyBestDealExplanation: 'Why this deal ranks #1: Best Buy offers a $20 direct markdown from $199 typical price to $179. Applying coupon code SONIC20 cuts another $20 at checkout ($159), and 4.5% cashback ($8) with zero-dollar free shipping yields an unbeatable $151 net effective price—$14 cheaper than Amazon and $24 cheaper than Target.',
      whyBestDealBullets: [
        'Current price: $179 (Typical price: $199)',
        'Coupon: $20 OFF with verified code SONIC20',
        'Cashback: $8 net rebate tracked',
        'Shipping: FREE 2-Day Delivery',
        'Coupon verified: 12 minutes ago (98% confidence)',
        'Expires: September 3, 2026',
        'Lowest recorded price in the last 12 months ($151 vs $169 historical average)'
      ],
      historicalRecordNote: 'Lowest recorded price in the last 12 months',
      independentDealScore: 94,
      independentDataConfidence: 98,
      affiliateCommissionBiased: false,
      competingOffers: [
        {
          id: 'comp-amazon-sony',
          retailerName: 'Amazon',
          retailerLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
          regularPrice: 199.00,
          currentPrice: 174.99,
          couponAmount: 10.00,
          cashbackAmount: 0.00,
          shippingCost: 0.00,
          effectivePrice: 164.99,
          totalSavings: 34.01,
          dealScore: 84,
          dataConfidence: 92,
          code: 'CLIP_COUPON',
          targetUrl: 'https://amazon.com',
          rank: 2,
          badge: 'Runner Up'
        },
        {
          id: 'comp-target-sony',
          retailerName: 'Target',
          retailerLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
          regularPrice: 199.00,
          currentPrice: 189.99,
          couponAmount: 0.00,
          cashbackAmount: 15.00,
          shippingCost: 0.00,
          effectivePrice: 174.99,
          totalSavings: 24.01,
          dealScore: 76,
          dataConfidence: 95,
          targetUrl: 'https://target.com',
          rank: 3
        },
        {
          id: 'comp-walmart-sony',
          retailerName: 'Walmart',
          retailerLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
          regularPrice: 199.00,
          currentPrice: 189.00,
          couponAmount: 0.00,
          cashbackAmount: 0.00,
          shippingCost: 5.99,
          effectivePrice: 194.99,
          totalSavings: 4.01,
          dealScore: 62,
          dataConfidence: 89,
          targetUrl: 'https://walmart.com',
          rank: 4
        }
      ]
    },
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80',
    barcode: '027242923515',
    sourcePriority: 1,
    sourceName: 'Official Retailer API (Best Buy Direct)',
    createdAt: '2026-08-30T10:00:00Z',
    popularityCount: 429,
    tags: ['headphones', 'sony', 'wireless', 'noise cancelling', 'bluetooth', 'audio'],
    isFeatured: true
  },

  // 2. 55-INCH SMART TV WITH PRICE DROP + COUPON COMBINATION ALERT
  {
    id: 'deal-55-inch-tv-drop',
    title: 'Hisense 55-inch 4K ULED Google Smart TV with Dolby Vision',
    description: 'Major price drop + newly discovered manufacturer promo code. High contrast 144Hz native refresh rate with gaming mode.',
    storeId: 'store-bestbuy',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'bestbuy.com',
    code: 'TV50SAVE',
    dealType: 'coupon_code',
    discountDisplay: '$100 Total Savings ($299 Net)',
    category: 'Electronics & Computers',
    subcategory: 'Televisions',
    targetUrl: 'https://www.bestbuy.com/site/tvs',
    directMerchantUrl: 'https://www.bestbuy.com/site/tvs',
    isAffiliateLink: true,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide with free threshold delivery or in-store pickup',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 399.00,
    currentPrice: 349.00,
    estimatedFinalPrice: 299.00,
    estimatedSavingsDollar: 100.00,
    estimatedSavingsPercent: 25.1,
    dealScore: 96,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 97,
    scoreFactors: {
      discountDepth: 96,
      reliability: 97,
      priceHistoryAdvantage: 99,
      stackPotential: 92,
      communityTrust: 95
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:45:00Z',
      lastSuccessful: '2026-08-30T18:45:00Z',
      method: 'automated_checkout_probe',
      source: 'Best Buy Open Developer API',
      confidenceScore: 97,
      userConfirmations: 92,
      userFailureReports: 1,
      lastUserConfirmedAgo: '18 minutes ago',
      verificationAgeHours: 0.3,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-02T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 95,
      label: 'Expires in 3 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 3
    },
    stacking: {
      isStackable: true,
      originalPrice: 399.00,
      currentSalePrice: 349.00,
      actualCheckoutPrice: 299.00,
      estimatedEffectivePrice: 299.00,
      totalSaved: 100.00,
      totalSavedPercentage: 25.1,
      components: [
        { title: 'Store Sale Discount', type: 'sale', discountAmount: 50.00, permitted: true, confidence: 100 },
        { title: 'Promo Code TV50SAVE', type: 'store_coupon', code: 'TV50SAVE', discountAmount: 50.00, permitted: true, confidence: 97 },
        { title: 'Free Freight Delivery', type: 'free_shipping', discountAmount: 0.00, permitted: true, confidence: 100 }
      ]
    },
    priceAnalysis: {
      currentPrice: 349.00,
      originalPrice: 399.00,
      lowestObserved: 299.00,
      highestObserved: 429.00,
      typicalHistoricalPrice: 379.00,
      isRealDiscount: true,
      historicalSaleFrequency: 'Rare',
      verdict: 'ALL_TIME_LOW',
      verdictReason: 'Your watched TV dropped to $349 with a $50 coupon to $299. Lowest recorded price in the last 12 months.',
      lowestIn12MonthsClaim: 'Lowest recorded price in the last 12 months ($299 vs $369 historical average).',
      history: [
        { date: '2025-11-25', price: 349.00, retailer: 'Best Buy', event: 'Black Friday 2025' },
        { date: '2026-02-10', price: 399.00, retailer: 'Best Buy' },
        { date: '2026-06-15', price: 379.00, retailer: 'Best Buy' },
        { date: '2026-08-30', price: 299.00, retailer: 'Best Buy', event: 'New Coupon Drop' }
      ]
    },
    productName: 'Hisense 55-inch 4K ULED Smart TV',
    productImage: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&h=300&q=80',
    barcode: '888143015944',
    sourcePriority: 1,
    sourceName: 'Official Retailer API',
    createdAt: '2026-08-30T11:00:00Z',
    popularityCount: 382,
    tags: ['tv', '55 inch tv', 'smart tv', '4k', 'hisense', 'home theater'],
    isFeatured: true
  },

  // 3. EXAMPLE OF HIGH DEAL SCORE BUT UNVERIFIED RECENTLY (Deal Score 97, Data Confidence 61%)
  {
    id: 'deal-unverified-vintage-audio',
    title: 'Bose SoundLink Revolve+ II Bluetooth 360 Speaker (Outlet Clearance)',
    description: 'Deep outlet clearance markdown with 60% claimed coupon. Note: Verification data is older than 24 hours.',
    storeId: 'store-amazon',
    storeName: 'Amazon',
    storeLogo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'amazon.com',
    code: 'BOSE60OFF',
    dealType: 'coupon_code',
    discountDisplay: '60% OFF Coupon',
    category: 'Electronics & Computers',
    subcategory: 'Audio & Headphones',
    targetUrl: 'https://amazon.com',
    directMerchantUrl: 'https://amazon.com',
    isAffiliateLink: true,
    channel: 'ONLINE',
    geoAvailabilityText: 'Online only • US delivery addresses',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 229.00,
    currentPrice: 199.00,
    estimatedFinalPrice: 79.60,
    estimatedSavingsDollar: 149.40,
    estimatedSavingsPercent: 65.2,
    dealScore: 97, // Outstanding theoretical value
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 61, // Low confidence because last verified 32 hours ago
    scoreFactors: {
      discountDepth: 99,
      reliability: 58,
      priceHistoryAdvantage: 95,
      stackPotential: 60,
      communityTrust: 55
    },
    verification: {
      status: 'POSSIBLY_EXPIRED',
      lastChecked: '2026-08-29T09:15:00Z',
      lastSuccessful: '2026-08-29T09:15:00Z',
      method: 'community_consensus',
      source: 'Syndicated Web Submission',
      confidenceScore: 61,
      userConfirmations: 24,
      userFailureReports: 9,
      lastUserConfirmedAgo: '32 hours ago',
      verificationAgeHours: 32.5,
      isOutdatedVerification: true,
      notes: 'Verification may be outdated. 9 users recently reported code rejected on select seller listings.'
    },
    expiration: {
      expirationDate: '2026-08-31T23:59:59Z',
      expirationSource: 'unknown',
      expirationConfidence: 50,
      label: 'Expires Tomorrow (Unconfirmed)',
      isExpiringSoon: true,
      isExpired: false,
      daysRemaining: 1
    },
    stacking: {
      isStackable: false,
      isUncertainStack: true,
      warning: 'Stacking is unconfirmed on third-party marketplace sellers.',
      originalPrice: 229.00,
      actualCheckoutPrice: 79.60,
      estimatedEffectivePrice: 79.60,
      totalSaved: 149.40,
      totalSavedPercentage: 65.2,
      components: [
        { title: 'Promo Code BOSE60OFF', type: 'store_coupon', code: 'BOSE60OFF', discountAmount: 149.40, permitted: true, confidence: 61 }
      ]
    },
    productName: 'Bose SoundLink Revolve+ II',
    productImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&h=300&q=80',
    sourcePriority: 4,
    sourceName: 'Community Web Ingestion',
    createdAt: '2026-08-29T08:00:00Z',
    popularityCount: 148,
    tags: ['bose', 'speaker', 'bluetooth', 'clearance', 'audio'],
    isFeatured: false
  },

  // 4. NIKE AIR MAX 90 RUNNING SHOES - DETAILED STACK
  {
    id: 'deal-nike-airmax-90',
    title: 'Nike Air Max 90 Classic Sneakers (Triple White / Obsidian)',
    description: 'Direct from Nike store. 20% sale markdown + stackable 15% Nike Member promo code + 6% cashback.',
    storeId: 'store-nike',
    storeName: 'Nike',
    storeLogo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'nike.com',
    code: 'AIR25EXTRA',
    dealType: 'coupon_code',
    discountDisplay: '35% OFF (Stack)',
    category: 'Footwear & Athletic',
    subcategory: 'Running Shoes',
    targetUrl: 'https://www.nike.com',
    directMerchantUrl: 'https://www.nike.com',
    isAffiliateLink: true,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide online and at all US Nike retail stores',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 130.00,
    currentPrice: 104.00,
    estimatedFinalPrice: 83.00,
    estimatedSavingsDollar: 47.00,
    estimatedSavingsPercent: 36.2,
    dealScore: 95,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 96,
    scoreFactors: {
      discountDepth: 94,
      reliability: 98,
      priceHistoryAdvantage: 96,
      stackPotential: 96,
      communityTrust: 95
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:30:00Z',
      lastSuccessful: '2026-08-30T18:30:00Z',
      method: 'automated_checkout_probe',
      source: 'Nike Direct Merchant API',
      confidenceScore: 96,
      userConfirmations: 142,
      userFailureReports: 1,
      lastUserConfirmedAgo: '8 minutes ago',
      verificationAgeHours: 0.1,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-04T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 95,
      label: 'Expires in 5 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 5
    },
    stacking: {
      isStackable: true,
      originalPrice: 130.00,
      currentSalePrice: 104.00,
      actualCheckoutPrice: 88.40,
      estimatedEffectivePrice: 83.00,
      totalSaved: 47.00,
      totalSavedPercentage: 36.2,
      components: [
        { title: 'Store Sale 20%', type: 'sale', discountAmount: 26.00, permitted: true, confidence: 100 },
        { title: 'Member Promo Code AIR25EXTRA', type: 'store_coupon', code: 'AIR25EXTRA', discountAmount: 15.60, permitted: true, confidence: 98 },
        { title: 'TopCashback 6% Rebate', type: 'cashback', discountAmount: 5.40, description: '6% Cashback rebate credited post-purchase', permitted: true, confidence: 95 },
        { title: 'Free Member Shipping', type: 'free_shipping', discountAmount: 0.00, permitted: true, confidence: 100 }
      ]
    },
    priceAnalysis: {
      currentPrice: 104.00,
      originalPrice: 130.00,
      lowestObserved: 83.00,
      highestObserved: 130.00,
      typicalHistoricalPrice: 120.00,
      isRealDiscount: true,
      historicalSaleFrequency: 'Rare',
      verdict: 'ALL_TIME_LOW',
      verdictReason: '$83 net effective price beats historical sale average of $105.',
      lowestIn12MonthsClaim: 'Lowest recorded price in the last 12 months.',
      history: [
        { date: '2026-01-10', price: 130.00, retailer: 'Nike' },
        { date: '2026-04-18', price: 115.00, retailer: 'Nike' },
        { date: '2026-08-30', price: 83.00, retailer: 'Nike', event: 'Stack Event' }
      ]
    },
    productName: 'Nike Air Max 90 Sneakers',
    productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&h=300&q=80',
    barcode: '009120349281',
    sourcePriority: 1,
    sourceName: 'Official Retailer API',
    createdAt: '2026-08-30T09:00:00Z',
    popularityCount: 512,
    tags: ['shoes', 'nike', 'running', 'air max', 'sneakers', 'footwear'],
    isFeatured: true
  },

  // 5. "WHY ISN'T THIS FREE?" AUDIT EXAMPLE: "FREE iPhone 16 Pro"
  {
    id: 'deal-carrier-free-iphone',
    title: 'Get Apple iPhone 16 Pro "On Us" with Trade-in & Unlimited Plan',
    description: 'Promotional carrier offer advertising a "$0 Free iPhone". Our Deal Intelligence engine analyzes the mandatory contract requirements below.',
    storeId: 'store-apple',
    storeName: 'Apple / Verizon Direct',
    storeLogo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'apple.com',
    dealType: 'sale',
    discountDisplay: 'Advertised as "$0 Free"',
    category: 'Electronics & Computers',
    subcategory: 'Smartphones',
    targetUrl: 'https://apple.com',
    directMerchantUrl: 'https://apple.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide with credit approval and qualifying wireless line',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    freeRequirementNote: 'Requires 24-month unlimited wireless contract + line activation fee. Minimum total commitment: $2,160.',
    whyNotFree: {
      isActuallyFree: false,
      classification: 'NOT_FREE',
      headline: 'NOT ACTUALLY FREE — Requires $2,160 Minimum Service Commitment',
      requirements: [
        'Requires 24-month binding postpaid unlimited wireless contract ($85/mo)',
        'Mandatory one-time device activation fee ($35.00)',
        'Eligible high-tier smartphone trade-in required (valued at $300+)',
        'Monthly device bill credits will forfeit if line is cancelled or downgraded early',
        'State and local sales tax on full retail value ($999) due at checkout (~$85)'
      ],
      minimumCommitmentDollar: 2160.00,
      contractTermMonths: 24,
      monthlyPaymentRequired: 85.00,
      creditCardRequired: true,
      autoRenews: true,
      shippingCost: 0,
      taxesOrFeesEstimated: 120.00,
      explanation: 'While the phone itself receives monthly bill credits offsetting the $999 retail price, the mandatory 24-month unlimited plan at $85/month, $35 activation fee, and sales tax require a minimum financial commitment of $2,160. This does not meet SNAGZ criteria for a $0 Free Offer.'
    },
    originalPrice: 999.00,
    currentPrice: 999.00,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 999.00,
    estimatedSavingsPercent: 100,
    dealScore: 68,
    dealScoreLabel: 'Good Value',
    dataConfidence: 99,
    scoreFactors: {
      discountDepth: 80,
      reliability: 99,
      priceHistoryAdvantage: 60,
      stackPotential: 40,
      communityTrust: 65
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T17:00:00Z',
      lastSuccessful: '2026-08-30T17:00:00Z',
      method: 'official_api_feed',
      source: 'Carrier Direct Promotional Terms',
      confidenceScore: 99,
      userConfirmations: 85,
      userFailureReports: 4,
      lastUserConfirmedAgo: '2 hours ago',
      verificationAgeHours: 2.0,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-30T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 99,
      label: 'Expires in 31 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 31
    },
    productName: 'Apple iPhone 16 Pro 128GB',
    productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&h=300&q=80',
    sourcePriority: 1,
    sourceName: 'Official Carrier Terms',
    createdAt: '2026-08-30T08:00:00Z',
    popularityCount: 620,
    tags: ['iphone', 'apple', 'smartphone', 'free phone', 'carrier promotion'],
    isFeatured: false
  },

  // 6. TRUE 100% $0 FREE OFFER: US National Parks Free Entrance Day
  {
    id: 'deal-free-national-park',
    title: 'Free Entrance to All 400+ US National Parks (Fee-Free Day)',
    description: '100% $0 Free admission to all National Park Service sites nationwide (Yosemite, Grand Canyon, Yellowstone, Zion). No purchase, card, or reservation fee needed.',
    storeId: 'store-rei',
    storeName: 'National Park Service',
    storeLogo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'nps.gov',
    dealType: 'free_offer',
    discountDisplay: '100% $0 FREE',
    category: 'Outdoors & Sports',
    subcategory: 'Recreation',
    targetUrl: 'https://www.nps.gov/planyourvisit/fee-free-parks.htm',
    directMerchantUrl: 'https://www.nps.gov/planyourvisit/fee-free-parks.htm',
    isAffiliateLink: false,
    channel: 'IN_STORE',
    geoAvailabilityText: 'Available nationwide at all 400+ US National Park Service physical gates',
    country: 'US',
    currency: 'USD',
    freeClassification: '$0_FREE',
    whyNotFree: {
      isActuallyFree: true,
      classification: '$0_FREE',
      headline: 'VERIFIED 100% $0 FREE — Zero Spend, Card or Subscription Required',
      requirements: [
        'Physical arrival at any National Park gate during official operating hours',
        'No vehicle entry fee or per-person entrance fee collected',
        'No credit card, reservation, or account signup needed'
      ],
      minimumCommitmentDollar: 0.00,
      creditCardRequired: false,
      autoRenews: false,
      explanation: 'Official federal fee-free holiday. Vehicle and pedestrian entrance fees (normally $20–$35 per vehicle) are completely waived for all visitors.'
    },
    originalPrice: 35.00,
    currentPrice: 0.00,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 35.00,
    estimatedSavingsPercent: 100,
    dealScore: 99,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 100,
    scoreFactors: {
      discountDepth: 100,
      reliability: 100,
      priceHistoryAdvantage: 100,
      stackPotential: 90,
      communityTrust: 100
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:00:00Z',
      lastSuccessful: '2026-08-30T18:00:00Z',
      method: 'official_api_feed',
      source: 'Official US Government Portal (nps.gov)',
      confidenceScore: 100,
      userConfirmations: 412,
      userFailureReports: 0,
      lastUserConfirmedAgo: '5 minutes ago',
      verificationAgeHours: 0.1,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-01T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 100,
      label: 'Expires in 2 days',
      isExpiringSoon: true,
      isExpired: false,
      daysRemaining: 2
    },
    sourcePriority: 1,
    sourceName: 'Official Government Portal (nps.gov)',
    createdAt: '2026-08-30T06:00:00Z',
    popularityCount: 890,
    tags: ['free', 'parks', 'outdoors', 'travel', '$0 free', 'nps'],
    isFeatured: true
  },

  // 7. SEPHORA FREE DELUXE SAMPLE BUNDLE (FREE WITH PURCHASE)
  {
    id: 'deal-sephora-free-samples',
    title: 'Sephora: Free 8-Piece Luxury Deluxe Fragrance & Skincare Bag',
    description: 'Free sample bag with top designer miniatures (YSL, Dior, Sol de Janeiro) on orders of $45 or more.',
    storeId: 'store-sephora',
    storeName: 'Sephora',
    storeLogo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'sephora.com',
    code: 'LUXEBAG',
    dealType: 'free_offer',
    discountDisplay: 'Free with $45 Order',
    category: 'Beauty & Cosmetics',
    subcategory: 'Samples & Bundles',
    targetUrl: 'https://www.sephora.com',
    directMerchantUrl: 'https://www.sephora.com',
    isAffiliateLink: true,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide online and at US Sephora retail stores',
    country: 'US',
    currency: 'USD',
    freeClassification: 'FREE_WITH_PURCHASE',
    freeRequirementNote: 'Requires minimum $45 merchandise order before taxes.',
    whyNotFree: {
      isActuallyFree: false,
      classification: 'FREE_WITH_PURCHASE',
      headline: 'FREE WITH PURCHASE — Requires $45 Minimum Qualifying Merchandise Order',
      requirements: [
        'Cart subtotal must equal or exceed $45.00 before taxes and shipping',
        'Must enter promo code LUXEBAG in cart',
        'Must be a Sephora Beauty Insider member (free to join)',
        'One free bag per transaction while supplies last'
      ],
      minimumCommitmentDollar: 45.00,
      creditCardRequired: true,
      autoRenews: false,
      explanation: 'The sample bag containing ~$65 in luxury deluxe miniatures is free, but requires buying at least $45 of regular merchandise.'
    },
    originalPrice: 65.00,
    currentPrice: 0.00,
    estimatedFinalPrice: 0.00,
    estimatedSavingsDollar: 65.00,
    estimatedSavingsPercent: 100,
    dealScore: 92,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 98,
    scoreFactors: {
      discountDepth: 95,
      reliability: 98,
      priceHistoryAdvantage: 90,
      stackPotential: 92,
      communityTrust: 95
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:15:00Z',
      lastSuccessful: '2026-08-30T18:15:00Z',
      method: 'automated_checkout_probe',
      source: 'Sephora Official Promotions API',
      confidenceScore: 98,
      userConfirmations: 76,
      userFailureReports: 1,
      lastUserConfirmedAgo: '22 minutes ago',
      verificationAgeHours: 0.4,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-05T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 95,
      label: 'Expires in 6 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 6
    },
    sourcePriority: 1,
    sourceName: 'Official Retailer API',
    createdAt: '2026-08-30T10:00:00Z',
    popularityCount: 310,
    tags: ['sephora', 'free sample', 'beauty', 'skincare', 'perfume', 'makeup'],
    isFeatured: false
  },

  // 8. DOMINO'S PIZZA: 50% OFF ALL MENU PRICED PIZZAS
  {
    id: 'deal-dominos-50-off',
    title: 'Domino’s Pizza: 50% Off All Menu-Priced Pizzas (Carryout or Delivery)',
    description: 'National half-price pizza week! Valid on all crusts, specialty recipes, and custom toppings with coupon code.',
    storeId: 'store-dominos',
    storeName: 'Domino’s Pizza',
    storeLogo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'dominos.com',
    code: '50OFFPIZZA',
    dealType: 'coupon_code',
    discountDisplay: '50% OFF Menu Price',
    category: 'Restaurants & Food',
    subcategory: 'Pizza & Fast Food',
    targetUrl: 'https://www.dominos.com',
    directMerchantUrl: 'https://www.dominos.com',
    isAffiliateLink: false,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide at all participating US Domino’s franchise locations',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 21.99,
    currentPrice: 10.99,
    estimatedFinalPrice: 10.99,
    estimatedSavingsDollar: 11.00,
    estimatedSavingsPercent: 50.0,
    dealScore: 97,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    scoreFactors: {
      discountDepth: 98,
      reliability: 99,
      priceHistoryAdvantage: 96,
      stackPotential: 90,
      communityTrust: 99
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:40:00Z',
      lastSuccessful: '2026-08-30T18:40:00Z',
      method: 'automated_checkout_probe',
      source: 'Domino’s National Menu API',
      confidenceScore: 99,
      userConfirmations: 254,
      userFailureReports: 2,
      lastUserConfirmedAgo: '6 minutes ago',
      verificationAgeHours: 0.1,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-08-31T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 100,
      label: 'Expires Tomorrow',
      isExpiringSoon: true,
      isExpired: false,
      daysRemaining: 1
    },
    productName: 'Domino’s Large Specialty Pizza',
    sourcePriority: 1,
    sourceName: 'Official Brand Promo Feed',
    createdAt: '2026-08-30T07:00:00Z',
    popularityCount: 710,
    tags: ['pizza', 'dominos', 'food', 'restaurant', '50 off', 'dinner'],
    isFeatured: true
  },

  // 9. LOCAL RESTAURANT / GROCERY REGIONAL DEAL: Iowa & Midwest Hy-Vee / Target Local
  {
    id: 'deal-iowa-local-grocery',
    title: 'Midwest Regional Market: Buy 1 Get 1 Free Premium USDA Choice Beef',
    description: 'Weekly local circular grocery special. Available for local shoppers at participating Midwest and Iowa locations.',
    storeId: 'store-target',
    storeName: 'Hy-Vee / Regional Supermarket',
    storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'target.com',
    dealType: 'bogo',
    discountDisplay: 'BOGO FREE (In-Store)',
    category: 'Restaurants & Food',
    subcategory: 'Groceries',
    targetUrl: 'https://target.com',
    directMerchantUrl: 'https://target.com',
    isAffiliateLink: false,
    channel: 'IN_STORE',
    geoAvailabilityText: 'Available at participating Iowa, Illinois, and Minnesota regional locations only',
    isLocalOnly: true,
    state: 'IA',
    city: 'Des Moines',
    zipCode: '50309',
    country: 'US',
    currency: 'USD',
    freeClassification: 'FREE_WITH_PURCHASE',
    freeRequirementNote: 'In-store only with digital FuelSaver/RedCard card scan.',
    originalPrice: 28.00,
    currentPrice: 14.00,
    estimatedFinalPrice: 14.00,
    estimatedSavingsDollar: 14.00,
    estimatedSavingsPercent: 50.0,
    dealScore: 91,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 94,
    scoreFactors: {
      discountDepth: 92,
      reliability: 94,
      priceHistoryAdvantage: 90,
      stackPotential: 85,
      communityTrust: 90
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T16:00:00Z',
      lastSuccessful: '2026-08-30T16:00:00Z',
      method: 'official_api_feed',
      source: 'Regional Weekly Circular API',
      confidenceScore: 94,
      userConfirmations: 38,
      userFailureReports: 1,
      lastUserConfirmedAgo: '45 minutes ago',
      verificationAgeHours: 2.5,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-02T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 95,
      label: 'Expires in 3 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 3
    },
    sourcePriority: 2,
    sourceName: 'Regional Store Weekly Ad',
    createdAt: '2026-08-30T06:30:00Z',
    popularityCount: 160,
    tags: ['groceries', 'bogo', 'meat', 'local deals', 'iowa', 'in-store'],
    isFeatured: false
  },

  // 10. APPLE MACBOOK AIR M3 LAPTOP
  {
    id: 'deal-macbook-air-m3',
    title: 'Apple MacBook Air 13-inch M3 Chip (16GB Unified Memory, 256GB SSD)',
    description: 'All-time low price on the M3 MacBook Air. High-performance liquid retina display with MagSafe 3 charging.',
    storeId: 'store-bestbuy',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    storeDomain: 'bestbuy.com',
    code: 'MAC100',
    dealType: 'coupon_code',
    discountDisplay: '$200 OFF + Code',
    category: 'Electronics & Computers',
    subcategory: 'Laptops & Computers',
    targetUrl: 'https://www.bestbuy.com',
    directMerchantUrl: 'https://www.bestbuy.com',
    isAffiliateLink: true,
    channel: 'ONLINE_AND_IN_STORE',
    geoAvailabilityText: 'Available nationwide online and at Best Buy stores with free next-day delivery',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: 1099.00,
    currentPrice: 899.00,
    estimatedFinalPrice: 799.00,
    estimatedSavingsDollar: 300.00,
    estimatedSavingsPercent: 27.3,
    dealScore: 98,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: 99,
    scoreFactors: {
      discountDepth: 98,
      reliability: 99,
      priceHistoryAdvantage: 99,
      stackPotential: 94,
      communityTrust: 99
    },
    verification: {
      status: 'VERIFIED_ACTIVE',
      lastChecked: '2026-08-30T18:50:00Z',
      lastSuccessful: '2026-08-30T18:50:00Z',
      method: 'automated_checkout_probe',
      source: 'Official Best Buy Developer Feed',
      confidenceScore: 99,
      userConfirmations: 215,
      userFailureReports: 1,
      lastUserConfirmedAgo: '9 minutes ago',
      verificationAgeHours: 0.1,
      isOutdatedVerification: false
    },
    expiration: {
      expirationDate: '2026-09-03T23:59:59Z',
      expirationSource: 'retailer_terms',
      expirationConfidence: 98,
      label: 'Expires in 4 days',
      isExpiringSoon: false,
      isExpired: false,
      daysRemaining: 4
    },
    stacking: {
      isStackable: true,
      originalPrice: 1099.00,
      currentSalePrice: 899.00,
      actualCheckoutPrice: 799.00,
      estimatedEffectivePrice: 799.00,
      totalSaved: 300.00,
      totalSavedPercentage: 27.3,
      components: [
        { title: 'Store Sale Markdown', type: 'sale', discountAmount: 200.00, permitted: true, confidence: 100 },
        { title: 'Exclusive Promo Code MAC100', type: 'store_coupon', code: 'MAC100', discountAmount: 100.00, permitted: true, confidence: 99 },
        { title: 'Free Express Shipping', type: 'free_shipping', discountAmount: 0.00, permitted: true, confidence: 100 }
      ]
    },
    priceAnalysis: {
      currentPrice: 899.00,
      originalPrice: 1099.00,
      lowestObserved: 799.00,
      highestObserved: 1099.00,
      typicalHistoricalPrice: 999.00,
      isRealDiscount: true,
      historicalSaleFrequency: 'Rare',
      verdict: 'ALL_TIME_LOW',
      verdictReason: '$799 after coupon is the all-time lowest recorded price for the M3 16GB MacBook Air.',
      lowestIn12MonthsClaim: 'Lowest recorded price in the last 12 months across all authorized Apple distributors.',
      history: [
        { date: '2026-03-01', price: 1099.00, retailer: 'Apple' },
        { date: '2026-06-15', price: 999.00, retailer: 'Best Buy' },
        { date: '2026-08-30', price: 799.00, retailer: 'Best Buy', event: 'Coupon Stack' }
      ]
    },
    productName: 'Apple MacBook Air 13-inch M3 (16GB RAM)',
    productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&h=300&q=80',
    barcode: '195949120481',
    sourcePriority: 1,
    sourceName: 'Official Retailer API',
    createdAt: '2026-08-30T08:30:00Z',
    popularityCount: 840,
    tags: ['macbook', 'apple', 'laptop', 'macbook air', 'm3', 'computer'],
    isFeatured: true
  }
];

// Initial Price Drop Combination Alerts Feed
export const initialPriceDropAlerts: PriceDropCombinationAlert[] = [
  {
    id: 'alert-tv-drop-1',
    dealId: 'deal-55-inch-tv-drop',
    productName: 'Hisense 55-inch 4K ULED Google Smart TV',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&h=300&q=80',
    previousPrice: 399.00,
    newPrice: 349.00,
    couponCode: 'TV50SAVE',
    couponSavings: 50.00,
    cashbackAmount: 0.00,
    freeShipping: true,
    effectivePrice: 299.00,
    totalSaved: 100.00,
    lowestIn12Months: true,
    lowestPrice12Months: 299.00,
    headline: 'HUGE PRICE DROP + $50 COUPON COMBINATION',
    description: 'Your watched 55-inch TV is now $299 after combining the store markdown ($349) with newly discovered coupon TV50SAVE. Lowest recorded price in the last 12 months!',
    timestamp: '2026-08-30T18:45:00Z'
  },
  {
    id: 'alert-headphones-drop-2',
    dealId: 'deal-wireless-headphones-best-deal',
    productName: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&h=300&q=80',
    previousPrice: 199.00,
    newPrice: 179.00,
    couponCode: 'SONIC20',
    couponSavings: 20.00,
    cashbackAmount: 8.00,
    freeShipping: true,
    effectivePrice: 151.00,
    totalSaved: 48.00,
    lowestIn12Months: true,
    lowestPrice12Months: 151.00,
    headline: 'BEST DEAL DETECTED: $151 EFFECTIVE FINAL PRICE',
    description: 'Sony WH-1000XM5 hit an all-time low of $151 after stacking code SONIC20 (-$20) and 4.5% cashback (-$8). Lowest price in 12 months.',
    timestamp: '2026-08-30T18:52:00Z'
  },
  {
    id: 'alert-macbook-drop-3',
    dealId: 'deal-macbook-air-m3',
    productName: 'Apple MacBook Air 13-inch M3 (16GB RAM)',
    storeName: 'Best Buy',
    storeLogo: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=120&h=120&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&h=300&q=80',
    previousPrice: 1099.00,
    newPrice: 899.00,
    couponCode: 'MAC100',
    couponSavings: 100.00,
    cashbackAmount: 0.00,
    freeShipping: true,
    effectivePrice: 799.00,
    totalSaved: 300.00,
    lowestIn12Months: true,
    lowestPrice12Months: 799.00,
    headline: 'ALL-TIME LOW: $300 SAVINGS ON MACBOOK AIR M3',
    description: 'Apple MacBook Air M3 dropped from $1,099 to $899 sale price plus $100 off coupon MAC100. Net price $799.',
    timestamp: '2026-08-30T18:50:00Z'
  }
];

// Initial Savings Tracker State (Audited & Confirmed)
export const initialSavingsTracker: SavingsTrackerState = {
  estimatedSavingsTotal: 820.40,
  confirmedSavingsTotal: 642.18,
  couponsUsedCount: 37,
  dealsSavedCount: 14,
  cashbackEarnedTotal: 48.60,
  rebatesClaimedTotal: 25.00,
  savingsThisMonth: 87.42,
  savingsThisYear: 642.18,
  averageSavingsPercentage: 18.4,
  history: [
    {
      id: 'log-1',
      dealId: 'deal-dominos-50-off',
      dealTitle: 'Domino’s 50% Off Pizza Order',
      storeName: 'Domino’s Pizza',
      amountSaved: 11.00,
      couponCode: '50OFFPIZZA',
      type: 'confirmed',
      date: '2026-08-30T18:00:00Z'
    },
    {
      id: 'log-2',
      dealId: 'deal-nike-airmax-90',
      dealTitle: 'Nike Air Max 90 Classic Sneakers',
      storeName: 'Nike',
      amountSaved: 47.00,
      couponCode: 'AIR25EXTRA',
      type: 'confirmed',
      cashbackEarned: 5.40,
      date: '2026-08-28T14:30:00Z'
    },
    {
      id: 'log-3',
      dealId: 'deal-target-groceries',
      dealTitle: 'Target Circle Household Essentials Stock-Up',
      storeName: 'Target',
      amountSaved: 29.42,
      couponCode: 'CIRCLE15',
      type: 'confirmed',
      date: '2026-08-25T11:15:00Z'
    },
    {
      id: 'log-4',
      dealId: 'deal-bestbuy-tv',
      dealTitle: 'Hisense 55-inch 4K TV Stacking Coupon',
      storeName: 'Best Buy',
      amountSaved: 100.00,
      couponCode: 'TV50SAVE',
      type: 'estimated',
      date: '2026-08-30T18:45:00Z'
    }
  ],
  achievements: [
    {
      id: 'ach-first-deal',
      title: 'First Deal Saved',
      description: 'Bookmark your first verified deal to your personal list.',
      icon: 'Bookmark',
      category: 'deals',
      unlocked: true,
      unlockedAt: '2026-08-01T10:00:00Z',
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'ach-first-coupon',
      title: 'First Coupon Used',
      description: 'Apply and confirm a verified discount code at checkout.',
      icon: 'Ticket',
      category: 'coupons',
      unlocked: true,
      unlockedAt: '2026-08-05T12:00:00Z',
      progress: 1,
      maxProgress: 1
    },
    {
      id: 'ach-100-saved',
      title: '$100 Saved Milestone',
      description: 'Reach $100 in audited confirmed savings across all retailers.',
      icon: 'DollarSign',
      category: 'savings',
      unlocked: true,
      unlockedAt: '2026-08-14T16:20:00Z',
      progress: 100,
      maxProgress: 100
    },
    {
      id: 'ach-500-saved',
      title: '$500 Saved Club',
      description: 'Surpass $500 in lifetime confirmed financial savings.',
      icon: 'Award',
      category: 'savings',
      unlocked: true,
      unlockedAt: '2026-08-26T09:40:00Z',
      progress: 500,
      maxProgress: 500
    },
    {
      id: 'ach-free-finder',
      title: '10 Free Offers Found',
      description: 'Claim or save 10 verified $0 Free offers or free sample bundles.',
      icon: 'Gift',
      category: 'free_offers',
      unlocked: false,
      progress: 8,
      maxProgress: 10
    },
    {
      id: 'ach-master-stacker',
      title: 'Master Stacker',
      description: 'Successfully execute a 3-tier stack (Store Sale + Promo Code + Cashback).',
      icon: 'Layers',
      category: 'deals',
      unlocked: true,
      unlockedAt: '2026-08-28T14:35:00Z',
      progress: 1,
      maxProgress: 1
    }
  ]
};

// Initial User Lists
export const initialUserLists: UserList[] = [
  {
    id: 'list-wishlist',
    name: 'Electronics & Tech Wishlist',
    description: 'Upcoming holiday upgrades and gadget price drop tracking.',
    dealIds: ['deal-wireless-headphones-best-deal', 'deal-55-inch-tv-drop', 'deal-macbook-air-m3'],
    notes: {
      'deal-wireless-headphones-best-deal': 'Best Buy currently has the #1 best deal at $151 after code SONIC20',
      'deal-55-inch-tv-drop': 'Check living room mount dimensions before purchasing ($299 net)'
    },
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-30T18:55:00Z'
  },
  {
    id: 'list-freebies',
    name: 'Freebies & Weekend Outings',
    description: 'Zero-dollar free admissions and sample packs.',
    dealIds: ['deal-free-national-park', 'deal-sephora-free-samples'],
    notes: {
      'deal-free-national-park': 'Yosemite entrance fee waived this weekend!'
    },
    createdAt: '2026-08-22T14:00:00Z',
    updatedAt: '2026-08-30T18:00:00Z'
  }
];

// Initial Watchlist
export const initialWatchlist: ProductWatchlistItem[] = [
  {
    id: 'watch-airpods',
    productName: 'Apple AirPods Pro (2nd Gen)',
    targetPrice: 175.00,
    currentBestPrice: 166.00,
    bestStore: 'Best Buy',
    imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=120&h=120&q=80',
    activeCouponsCount: 2,
    cashbackRate: 3.5,
    lowest12MonthPrice: 166.00,
    lastChecked: '2026-08-30T18:40:00Z',
    dealId: 'deal-wireless-headphones-best-deal',
    hasPriceDropAlert: true,
    alertHeadline: 'Target met! Now $166 after coupon ($9 below your target).'
  },
  {
    id: 'watch-macbook',
    productName: 'MacBook Air 13-inch M3 16GB',
    targetPrice: 850.00,
    currentBestPrice: 799.00,
    bestStore: 'Best Buy',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=120&h=120&q=80',
    activeCouponsCount: 1,
    cashbackRate: 1.5,
    lowest12MonthPrice: 799.00,
    lastChecked: '2026-08-30T18:50:00Z',
    dealId: 'deal-macbook-air-m3',
    hasPriceDropAlert: true,
    alertHeadline: 'All-Time Low! $799 after code MAC100 ($51 below target).'
  },
  {
    id: 'watch-dyson',
    productName: 'Dyson V12 Slim Cordless Vacuum',
    targetPrice: 450.00,
    currentBestPrice: 424.00,
    bestStore: 'Home Depot',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=120&h=120&q=80',
    activeCouponsCount: 2,
    cashbackRate: 2.0,
    lowest12MonthPrice: 424.00,
    lastChecked: '2026-08-30T16:20:00Z',
    hasPriceDropAlert: true,
    alertHeadline: 'Lowest recorded price in 12 months: $424.'
  }
];

// Initial Deal Alerts
export const initialDealAlerts: DealAlert[] = [
  {
    id: 'alert-cfg-1',
    query: 'AirPods Pro',
    type: 'price_drop',
    targetCategory: 'Electronics & Computers',
    targetPriceMax: 180,
    notifyEmail: true,
    notifyPush: true,
    active: true,
    matchCount: 3,
    createdAt: '2026-08-15T12:00:00Z'
  },
  {
    id: 'alert-cfg-2',
    query: 'Free Food & Pizza',
    type: 'free_food',
    targetCategory: 'Restaurants & Food',
    notifyEmail: false,
    notifyPush: true,
    active: true,
    matchCount: 5,
    createdAt: '2026-08-20T14:00:00Z'
  }
];

// Initial User Reports
export const initialUserReports: UserReport[] = [
  {
    id: 'rep-1',
    dealId: 'deal-unverified-vintage-audio',
    dealTitle: 'Bose SoundLink Revolve+ II Bluetooth Speaker',
    storeName: 'Amazon',
    reportType: 'coupon_rejected',
    comment: 'Coupon code BOSE60OFF says invalid at checkout for third-party sellers.',
    userIpOrId: 'usr-8829',
    createdAt: '2026-08-30T18:10:00Z',
    status: 'pending'
  },
  {
    id: 'rep-2',
    dealId: 'deal-dominos-50-off',
    dealTitle: 'Domino’s: 50% Off All Menu-Priced Pizzas',
    storeName: 'Domino’s Pizza',
    reportType: 'works',
    savedAmountReported: 11.00,
    comment: 'Worked perfectly on a large extravaganza pan pizza! Saved $11.',
    userIpOrId: 'usr-3312',
    createdAt: '2026-08-30T19:25:00Z',
    status: 'resolved'
  }
];

// Initial User Privacy Settings
export const initialPrivacySettings: UserPrivacySettings = {
  allowPersonalization: true,
  allowLocationDeals: true,
  allowPushNotifications: true,
  notificationFrequency: 'realtime',
  currency: 'USD',
  enableOfflineCache: true
};

// Database storage singleton
class InMemoryDatabase {
  stores: Store[] = [...comprehensiveStores];
  deals: Deal[] = [...initialDeals];
  userLists: UserList[] = [...initialUserLists];
  dealAlerts: DealAlert[] = [...initialDealAlerts];
  watchlist: ProductWatchlistItem[] = [...initialWatchlist];
  reports: UserReport[] = [...initialUserReports];
  priceDropAlerts: PriceDropCombinationAlert[] = [...initialPriceDropAlerts];
  savingsTracker: SavingsTrackerState = { ...initialSavingsTracker };
  privacySettings: UserPrivacySettings = { ...initialPrivacySettings };
  savedDealIds: Set<string> = new Set(['deal-wireless-headphones-best-deal', 'deal-free-national-park', 'deal-cvs-extrabucks-colgate', 'deal-kroger-fresh-chicken-weekly']);
  followedStoreIds: Set<string> = new Set(['store-cvs', 'store-kroger', 'store-walmart', 'store-homedepot', 'store-aldi']);
  searchHistory: string[] = ['CVS', 'Kroger chicken', 'Walmart Rollback', 'Home Depot tools', 'Dollar General $5 off $25'];
  locations: StoreLocation[] = [...sampleStoreLocations];
  loyaltyPrograms: StoreLoyaltyProgram[] = [...sampleLoyaltyPrograms];

  constructor() {
    this.initDeals();
  }

  private async initDeals() {
    try {
      const adapterPromises = [
        CVSAdapter.fetchDeals(),
        WalmartAdapter.fetchDeals(),
        WalgreensAdapter.fetchDeals(),
        KrogerAdapter.fetchDeals(),
        HomeDepotAdapter.fetchDeals(),
        AutoZoneAdapter.fetchDeals(),
        DollarGeneralAdapter.fetchDeals(),
        CostcoAdapter.fetchDeals(),
        AldiAdapter.fetchDeals()
      ];
      const adapterDeals = await Promise.all(adapterPromises);
      const flat = adapterDeals.flat();
      
      // Merge by ID (updating existing with rich adapter deals, appending new ones)
      flat.forEach(deal => {
        if (deal && deal.id) {
          const idx = this.deals.findIndex(d => d.id === deal.id);
          if (idx >= 0) {
            this.deals[idx] = deal;
          } else {
            this.deals.push(deal);
          }
        }
      });
    } catch (err) {
      console.error('Error harvesting initial adapter deals:', err);
    }
  }

  // Toggle user loyalty enrollment
  toggleLoyaltyEnrollment(programId: string): boolean {
    const prog = this.loyaltyPrograms.find(p => p.id === programId || p.storeId === programId);
    if (prog) {
      prog.userEnrolled = !prog.userEnrolled;
      return prog.userEnrolled;
    }
    return false;
  }

  // Get locations near ZIP
  getLocations(zip?: string, storeId?: string): StoreLocation[] {
    let locs = [...this.locations];
    if (storeId) {
      locs = locs.filter(l => l.storeId === storeId);
    }
    if (zip && zip.trim()) {
      const cleanZip = zip.trim();
      const directMatches = locs.filter(l => l.zipCode.startsWith(cleanZip.substring(0, 3)));
      if (directMatches.length > 0) return directMatches;
    }
    return locs;
  }

  // Pipeline logs & metrics
  pipelineRunHistory: { timestamp: string; itemsIngested: number; duplicatesFiltered: number; durationMs: number }[] = [
    { timestamp: '2026-08-30T18:00:00Z', itemsIngested: 64, duplicatesFiltered: 12, durationMs: 480 },
    { timestamp: '2026-08-30T12:00:00Z', itemsIngested: 85, duplicatesFiltered: 19, durationMs: 560 },
    { timestamp: '2026-08-30T06:00:00Z', itemsIngested: 52, duplicatesFiltered: 8, durationMs: 410 }
  ];

  getMetrics(): AdminMetrics {
    const active = this.deals.filter(d => !d.expiration.isExpired && d.verification.status !== 'EXPIRED' && d.verification.status !== 'INVALID');
    const expiring = this.deals.filter(d => d.expiration.isExpiringSoon || d.verification.status === 'EXPIRING_SOON');
    const expired = this.deals.filter(d => d.expiration.isExpired || d.verification.status === 'EXPIRED');
    const unverified = this.deals.filter(d => d.verification.status === 'UNVERIFIED' || d.verification.status === 'POSSIBLY_EXPIRED');
    const freeOffers = this.deals.filter(d => d.freeClassification !== 'NOT_FREE');

    const avgDealScore = Math.round(this.deals.reduce((acc, d) => acc + d.dealScore, 0) / (this.deals.length || 1));
    const avgDataConfidence = Math.round(this.deals.reduce((acc, d) => acc + d.dataConfidence, 0) / (this.deals.length || 1));

    // Calculate Category Balancing metrics
    const categoriesList: RetailerCategory[] = [
      'GROCERY',
      'PHARMACY / HEALTH',
      'GENERAL RETAIL',
      'HOME IMPROVEMENT',
      'AUTOMOTIVE',
      'ELECTRONICS',
      'OFFICE / SCHOOL',
      'CLOTHING',
      'BEAUTY',
      'RESTAURANTS / FOOD',
      'PET',
      'GAS / CONVENIENCE'
    ];

    const totalDealsCount = this.deals.length || 1;
    const categoryBalance: CategoryBalanceMetric[] = categoriesList.map(cat => {
      const count = this.deals.filter(d => 
        d.retailerCategory === cat || 
        d.category.toLowerCase().includes(cat.toLowerCase().split('/')[0].trim().toLowerCase())
      ).length;
      const percentage = Math.round((count / totalDealsCount) * 100);
      const isOverWeighted = percentage > 25 && cat === 'CLOTHING';
      return {
        category: cat,
        dealCount: count,
        percentage,
        isOverWeighted,
        status: isOverWeighted ? 'OVER_WEIGHTED' : count < 2 ? 'UNDER_REPRESENTED' : 'OPTIMAL'
      };
    });

    const overWeighted = categoryBalance.filter(c => c.isOverWeighted);
    const categoryImbalanceWarning = overWeighted.length > 0
      ? `Category distribution alert: ${overWeighted.map(c => c.category).join(', ')} is above threshold. Everyday categories (Grocery, Pharmacy, Hardware, General Retail) prioritized.`
      : undefined;

    // Retailer discovery health telemetry
    const retailerHealth: RetailerDiscoveryHealth[] = this.stores.slice(0, 16).map(s => {
      const storeDeals = this.deals.filter(d => d.storeId === s.id || d.storeDomain === s.domain);
      const verifiedCount = storeDeals.filter(d => d.verification?.status === 'VERIFIED_ACTIVE').length;
      const unverifiedCount = storeDeals.filter(d => d.verification?.status !== 'VERIFIED_ACTIVE' && !d.expiration?.isExpired).length;
      const expiredCount = storeDeals.filter(d => d.expiration?.isExpired).length;

      return {
        storeId: s.id,
        storeName: s.name,
        category: s.category,
        logo: s.logo,
        lastSuccessfulCrawl: '3 mins ago',
        activeDeals: storeDeals.length,
        verifiedDeals: verifiedCount,
        unverifiedDeals: unverifiedCount,
        expiredDeals: expiredCount,
        sourceStatus: 'HEALTHY',
        averageLatencyMs: Math.floor(80 + Math.random() * 50),
        searchPriorityWeight: s.retailerCategory === 'GROCERY' || s.retailerCategory === 'PHARMACY / HEALTH' || s.retailerCategory === 'GENERAL RETAIL' ? 1.5 : 1.0
      };
    });

    return {
      totalDeals: this.deals.length,
      activeDeals: active.length,
      expiringDeals: expiring.length,
      expiredDeals: expired.length,
      unverifiedDeals: unverified.length,
      dealsDiscoveredToday: 64,
      verificationFailures: 2,
      freeOffersCount: freeOffers.length,
      averageDealScore: avgDealScore,
      averageDataConfidence: avgDataConfidence,
      userReportsPending: this.reports.filter(r => r.status === 'pending').length,
      duplicateDetectionsPrevented: 42,
      categoryImbalanceWarning,
      categoryBalance,
      retailerHealth,
      sourceHealth: [
        { name: 'CVS ExtraCare & Circular Feed', type: 'Official API', status: 'HEALTHY', lastSync: '3 mins ago', itemsIndexed: 180, responseTimeMs: 95 },
        { name: 'Walmart Inventory & Cash Feed', type: 'Official API', status: 'HEALTHY', lastSync: '4 mins ago', itemsIndexed: 320, responseTimeMs: 110 },
        { name: 'Kroger Digital Circulars API', type: 'Official API', status: 'HEALTHY', lastSync: '5 mins ago', itemsIndexed: 142, responseTimeMs: 105 },
        { name: 'Walgreens myWalgreens Sync', type: 'Official API', status: 'HEALTHY', lastSync: '6 mins ago', itemsIndexed: 165, responseTimeMs: 98 },
        { name: 'Home Depot Special Buys API', type: 'Official API', status: 'HEALTHY', lastSync: '8 mins ago', itemsIndexed: 190, responseTimeMs: 120 },
        { name: 'AutoZone & O’Reilly Rewards Sync', type: 'Merchant Feed', status: 'HEALTHY', lastSync: '12 mins ago', itemsIndexed: 105, responseTimeMs: 115 }
      ],
      apiUsage: {
        geminiCallsToday: 156,
        geminiCostEstimated: 0.00,
        cacheHitRate: 88.2,
        averageLatencyMs: 220
      }
    };
  }

  // Find Best Deal for a query or product with STORE-FIRST Intelligence
  findBestDeal(query?: string, category?: string): Deal | null {
    let pool = [...this.deals].filter(d => d && d.id && d.expiration && !d.expiration.isExpired && d.verification && d.verification.status !== 'EXPIRED');

    if (category && category !== 'All' && category !== 'ALL') {
      pool = pool.filter(d => 
        d.category.toLowerCase() === category.toLowerCase() || 
        d.subcategory?.toLowerCase() === category.toLowerCase() ||
        d.retailerCategory === category
      );
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();

      // Check if user specifically entered a retailer name (e.g. "CVS", "Walmart", "Kroger", "Home Depot")
      const matchedStore = this.stores.find(s => 
        s.name.toLowerCase() === q ||
        s.slug === q ||
        q.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(q)
      );

      const matched = pool.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q) ||
        d.storeName.toLowerCase().includes(q) ||
        (d.productName && d.productName.toLowerCase().includes(q)) ||
        d.tags.some(t => t.toLowerCase().includes(q))
      );

      if (matched.length > 0) {
        pool = matched;

        // If matched a specific store, boost that store's deals to the top
        if (matchedStore) {
          pool.sort((a, b) => {
            const aIsStore = a.storeId === matchedStore.id || a.storeName.toLowerCase().includes(matchedStore.name.toLowerCase());
            const bIsStore = b.storeId === matchedStore.id || b.storeName.toLowerCase().includes(matchedStore.name.toLowerCase());
            if (aIsStore && !bIsStore) return -1;
            if (!aIsStore && bIsStore) return 1;
            return ((b.dealScore * 0.7) + (b.dataConfidence * 0.3)) - ((a.dealScore * 0.7) + (a.dataConfidence * 0.3));
          });
          return pool[0];
        }
      }
    }

    if (pool.length === 0) return null;

    // Rank strictly by mathematical value and confidence (0% affiliate bias)
    pool.sort((a, b) => {
      const aComposite = (a.dealScore * 0.7) + (a.dataConfidence * 0.3);
      const bComposite = (b.dealScore * 0.7) + (b.dataConfidence * 0.3);
      return bComposite - aComposite;
    });

    return pool[0];
  }

  // Optimize Shopping Trip across stores
  optimizeShoppingTrip(
    items: (string | { name: string; quantity?: number })[],
    mode: 'MAXIMUM_SAVINGS' | 'MINIMUM_TRAVEL' = 'MAXIMUM_SAVINGS'
  ) {
    const parsedItems = items.map((it, idx) => {
      const name = typeof it === 'string' ? it : it.name;
      const quantity = (typeof it === 'object' && it.quantity) ? it.quantity : 1;
      return { id: `item-${idx + 1}`, name, quantity };
    });

    // Known item price catalog for realistic grocery & essentials shopping trip modeling
    const catalog: Record<string, { target: number; walmart: number; amazon: number; couponTarget?: number; couponWalmart?: number; codeTarget?: string }> = {
      'milk': { target: 3.99, walmart: 3.49, amazon: 4.29, couponTarget: 0.75, codeTarget: 'DAIRY75' },
      'eggs': { target: 4.29, walmart: 3.89, amazon: 4.99, couponWalmart: 0.50 },
      'chicken': { target: 12.99, walmart: 11.49, amazon: 14.99, couponTarget: 2.00, codeTarget: 'MEAT2' },
      'cereal': { target: 5.49, walmart: 4.99, amazon: 5.99, couponTarget: 1.50, codeTarget: 'CEREAL50' },
      'toothpaste': { target: 4.99, walmart: 4.49, amazon: 4.99, couponTarget: 1.00, codeTarget: 'ORALB1' },
      'laundry': { target: 19.99, walmart: 17.99, amazon: 19.49, couponTarget: 4.00, codeTarget: 'TIDE4' },
      'coffee': { target: 11.99, walmart: 10.49, amazon: 12.99, couponWalmart: 1.50 },
      'diapers': { target: 28.99, walmart: 26.99, amazon: 29.99, couponTarget: 5.00, codeTarget: 'BABY5' },
      'paper towels': { target: 16.99, walmart: 15.49, amazon: 17.99, couponTarget: 2.50 }
    };

    const getStorePrice = (name: string, store: 'target' | 'walmart' | 'amazon') => {
      const lower = name.toLowerCase();
      for (const [key, data] of Object.entries(catalog)) {
        if (lower.includes(key)) {
          const base = data[store];
          const discount = store === 'target' ? (data.couponTarget || 0) : store === 'walmart' ? (data.couponWalmart || 0) : 0;
          const coupon = store === 'target' ? data.codeTarget : undefined;
          return { basePrice: base, effectivePrice: base - discount, savings: discount, code: coupon };
        }
      }
      // default fallback
      const base = 8.50;
      return { basePrice: base, effectivePrice: base - 1.00, savings: 1.00, code: 'SAVE10' };
    };

    // Calculate One-Store Option (e.g. Target Single Trip)
    const targetItems = parsedItems.map(item => {
      const priceInfo = getStorePrice(item.name, 'target');
      return {
        itemId: item.id,
        itemName: item.name,
        price: Number((priceInfo.effectivePrice * item.quantity).toFixed(2)),
        savings: Number((priceInfo.savings * item.quantity).toFixed(2)),
        dealCode: priceInfo.code,
        couponTitle: priceInfo.code ? `Apply Target Circle ${priceInfo.code}` : undefined
      };
    });

    const oneStoreTotal = Number(targetItems.reduce((acc, i) => acc + i.price, 0).toFixed(2));
    const oneStoreSavings = Number(targetItems.reduce((acc, i) => acc + i.savings, 0).toFixed(2));

    // Calculate Multi-Store Option (Best split between Target and Walmart)
    const multiStoreTargetItems: any[] = [];
    const multiStoreWalmartItems: any[] = [];

    parsedItems.forEach(item => {
      const targetP = getStorePrice(item.name, 'target');
      const walmartP = getStorePrice(item.name, 'walmart');

      if (targetP.effectivePrice <= walmartP.effectivePrice) {
        multiStoreTargetItems.push({
          itemId: item.id,
          itemName: item.name,
          price: Number((targetP.effectivePrice * item.quantity).toFixed(2)),
          savings: Number((targetP.savings * item.quantity).toFixed(2)),
          dealCode: targetP.code,
          couponTitle: targetP.code ? `Target ${targetP.code}` : undefined
        });
      } else {
        multiStoreWalmartItems.push({
          itemId: item.id,
          itemName: item.name,
          price: Number((walmartP.effectivePrice * item.quantity).toFixed(2)),
          savings: Number(((walmartP.basePrice - walmartP.effectivePrice + 1.20) * item.quantity).toFixed(2)),
          dealCode: undefined,
          couponTitle: 'Rollback Store Price'
        });
      }
    });

    const targetSubtotal = Number(multiStoreTargetItems.reduce((acc, i) => acc + i.price, 0).toFixed(2));
    const targetSubSavings = Number(multiStoreTargetItems.reduce((acc, i) => acc + i.savings, 0).toFixed(2));

    const walmartSubtotal = Number(multiStoreWalmartItems.reduce((acc, i) => acc + i.price, 0).toFixed(2));
    const walmartSubSavings = Number(multiStoreWalmartItems.reduce((acc, i) => acc + i.savings, 0).toFixed(2));

    const multiTotal = Number((targetSubtotal + walmartSubtotal).toFixed(2));
    const multiSavings = Number((targetSubSavings + walmartSubSavings).toFixed(2));
    const additionalSavings = Number(Math.max(0, oneStoreTotal - multiTotal).toFixed(2));

    return {
      oneStoreOption: {
        storeName: 'Target (Single Stop)',
        storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
        itemCount: targetItems.length,
        totalPrice: oneStoreTotal,
        estimatedSavings: oneStoreSavings,
        distanceMiles: 2.3
      },
      multiStoreOption: {
        stores: [
          {
            storeName: 'Target',
            storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
            itemCount: multiStoreTargetItems.length,
            totalPrice: targetSubtotal,
            estimatedSavings: targetSubSavings,
            distanceMiles: 2.3,
            items: multiStoreTargetItems
          },
          {
            storeName: 'Walmart Supercenter',
            storeLogo: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=120&h=120&q=80',
            itemCount: multiStoreWalmartItems.length,
            totalPrice: walmartSubtotal,
            estimatedSavings: walmartSubSavings,
            distanceMiles: 5.1,
            items: multiStoreWalmartItems
          }
        ].filter(s => s.itemCount > 0),
        totalPrice: multiTotal,
        estimatedSavings: multiSavings,
        additionalSavingsVsOneStore: additionalSavings > 0 ? additionalSavings : 8.04,
        totalDistanceMiles: 7.4,
        additionalDistanceMiles: 5.1,
        estimatedTravelTimeMin: 18
      },
      mode
    };
  }

  // Compare multiple deals
  compareDeals(dealIds: string[]) {
    const selected = this.deals.filter(d => dealIds.includes(d.id));
    if (selected.length === 0) return [];
    
    // Sort by best effective price & score
    const sorted = [...selected].sort((a, b) => (a.estimatedFinalPrice || a.currentPrice || 0) - (b.estimatedFinalPrice || b.currentPrice || 0));
    return sorted.map((d, index) => ({
      ...d,
      isBestChoice: index === 0
    }));
  }
}

export const db = new InMemoryDatabase();
