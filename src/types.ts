export type VerificationStatus =
  | 'VERIFIED_ACTIVE'
  | 'ACTIVE'
  | 'EXPIRING_SOON'
  | 'UNVERIFIED'
  | 'POSSIBLY_EXPIRED'
  | 'EXPIRED'
  | 'INVALID';

export type FreeClassification =
  | '$0_FREE'
  | 'FREE_WITH_PURCHASE'
  | 'FREE_TRIAL'
  | 'FREE_SHIPPING'
  | 'FREE_SAMPLE'
  | 'GIVEAWAY'
  | 'NEARLY_FREE'
  | 'NOT_FREE';

export type DealType =
  | 'coupon_code'
  | 'sale'
  | 'rebate'
  | 'free_offer'
  | 'cashback'
  | 'bundle'
  | 'bogo'
  | 'COUPON_CODE'
  | 'DIGITAL_COUPON'
  | 'STORE_COUPON'
  | 'MANUFACTURER_COUPON'
  | 'WEEKLY_AD'
  | 'SALE'
  | 'CLEARANCE'
  | 'BOGO'
  | 'BOGO_PERCENT'
  | 'BUY_X_GET_Y'
  | 'SPEND_X_GET_Y'
  | 'BUNDLE'
  | 'GIFT_CARD_PROMOTION'
  | 'STORE_REWARD'
  | 'LOYALTY_REWARD'
  | 'CASHBACK'
  | 'REBATE'
  | 'FREE_SHIPPING'
  | 'FREE_ITEM'
  | 'PRICE_DROP'
  | 'MEMBER_PRICE'
  | 'PERSONALIZED_OFFER'
  | 'LOYALTY_OFFER'
  | 'EXTRABUCKS'
  | 'REWARD_POINTS'
  | 'PRICE_MATCH';

export type RetailerCategory =
  | 'GROCERY'
  | 'PHARMACY / HEALTH'
  | 'GENERAL RETAIL'
  | 'HOME IMPROVEMENT'
  | 'AUTOMOTIVE'
  | 'ELECTRONICS'
  | 'OFFICE / SCHOOL'
  | 'CLOTHING'
  | 'BEAUTY'
  | 'RESTAURANTS / FOOD'
  | 'PET'
  | 'GAS / CONVENIENCE';

export type ShoppingChannel = 'ONLINE' | 'IN_STORE' | 'ONLINE_AND_IN_STORE';

export type SupportedCurrency = 'USD' | 'CAD' | 'GBP' | 'EUR';

export interface WeeklyAdInfo {
  circularName?: string;
  startDate: string;
  endDate: string;
  pageNumber?: number;
  featuredCategory?: string;
  quantityRequirements?: string;
  storeLocationId?: string;
  inStoreOnly: boolean;
  unitPriceComparison?: string;
}

export interface StoreLocation {
  id: string;
  storeId: string;
  storeName: string;
  storeNumber: string; // e.g. "Store #1842"
  address: string;
  city: string;
  state: string;
  zipCode: string;
  distanceMiles?: number;
  hasPharmacy?: boolean;
  hasGrocery?: boolean;
  hasGas?: boolean;
}

export interface StoreLoyaltyProgram {
  id: string;
  storeId: string;
  storeName: string;
  programName: string; // e.g. "CVS ExtraCare", "Target Circle", "Kroger Plus", "myWalgreens"
  isFree: boolean;
  perksDescription: string;
  digitalClipAvailable: boolean;
  userEnrolled: boolean;
}

export interface CategoryBalanceMetric {
  category: string;
  dealCount: number;
  percentage: number;
  isOverWeighted: boolean;
  status: 'OPTIMAL' | 'OVER_WEIGHTED' | 'UNDER_REPRESENTED';
}

export interface RetailerDiscoveryHealth {
  storeId: string;
  storeName: string;
  category: string;
  logo: string;
  lastSuccessfulCrawl: string;
  activeDeals: number;
  verifiedDeals: number;
  unverifiedDeals: number;
  expiredDeals: number;
  sourceStatus: 'HEALTHY' | 'DEGRADED' | 'RATE_LIMITED';
  averageLatencyMs: number;
  searchPriorityWeight: number;
  lastError?: string;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logo: string;
  category: string;
  retailerCategory?: RetailerCategory;
  description: string;
  cashbackRate?: number;
  cashbackProvider?: string;
  allowsStacking: boolean;
  couponCount: number;
  dealCount: number;
  popularDiscountText: string;
  verifiedScore: number;
  isFollowed?: boolean;
  loyaltyProgramName?: string;
  loyaltyProgramPerk?: string;
  hasWeeklyAd?: boolean;
  weeklyAdCount?: number;
  digitalCouponsCount?: number;
  rewardsCount?: number;
  inStoreLocationsCount?: number;
  weeklyAdUrl?: string;
  hasActiveWeeklyAd?: boolean;
}

export interface VerificationInfo {
  status: VerificationStatus;
  lastChecked: string;
  lastSuccessful: string;
  method: 'automated_checkout_probe' | 'official_api_feed' | 'community_consensus' | 'ai_synthesized_audit';
  source: string;
  confidenceScore: number; // 0-100 (Independent Data Confidence)
  userConfirmations: number;
  userFailureReports: number;
  lastUserConfirmedAgo?: string;
  verificationAgeHours?: number;
  isOutdatedVerification?: boolean;
  notes?: string;
}

export interface ExpirationInfo {
  startDate?: string;
  expirationDate?: string;
  expirationSource: 'retailer_terms' | 'affiliate_feed' | 'ai_extracted' | 'unknown';
  expirationConfidence: number; // 0-100
  label: 'Expires today' | 'Expires tomorrow' | 'Expires in 3 days' | string;
  isExpiringSoon: boolean;
  isExpired: boolean;
  daysRemaining?: number;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
  retailer: string;
  event?: string;
}

export interface PriceAnalysis {
  currentPrice: number;
  originalPrice: number;
  lowestObserved: number;
  highestObserved: number;
  typicalHistoricalPrice: number;
  isRealDiscount: boolean;
  historicalSaleFrequency: 'Frequent' | 'Rare' | 'Seasonal' | 'Moderate';
  verdict: 'EXCELLENT_DEAL' | 'FAIR_PRICE' | 'NOT_A_GREAT_DEAL' | 'ALL_TIME_LOW';
  verdictReason: string;
  lowestIn12MonthsClaim?: string;
  history: PriceHistoryPoint[];
}

export interface StackingComponent {
  title: string;
  type: 'sale' | 'store_coupon' | 'mfr_coupon' | 'cashback' | 'rebate' | 'free_shipping';
  discountAmount: number;
  discountPercentage?: number;
  code?: string;
  description?: string;
  permitted: boolean;
  confidence: number;
}

export interface CouponComponent {
  id?: string;
  title: string;
  type: 'MANUFACTURER' | 'STORE_COUPON' | 'STORE_CRT' | 'PERCENT_OFF' | 'APP_ONLY' | 'DIGITAL';
  discountAmount: number;
  code?: string;
  clipRequired: boolean;
  source: string; // e.g. "CVS App Send to Card", "Manufacturer Digital", "Circular Coupon"
  expirationDate?: string;
  restrictions?: string; // e.g. "Limit 1 per household", "Requires 2 items"
  isClipped?: boolean;
}

export interface RewardComponent {
  id?: string;
  name: string; // e.g. "$5.00 ExtraBucks Rewards", "$10 Target GiftCard", "5,000 myWalgreens Points"
  type: 'EXTRABUCKS' | 'WALGREENS_CASH' | 'TARGET_GIFT_CARD' | 'POINTS' | 'REWARD_CERTIFICATE' | 'STORE_CREDIT';
  amount: number;
  timing: 'EARNED_FOR_NEXT_TRANSACTION' | 'IMMEDIATE_AT_CHECKOUT';
  expirationDays?: number;
  rollingAllowed: boolean; // e.g. can be used to pay for subsequent transactions
  description?: string;
}

export interface CashbackRebateComponent {
  id?: string;
  provider: string; // e.g. "Ibotta", "Fetch Rewards", "Rakuten", "Coupons.com App"
  amount: number;
  type: 'REBATE' | 'RECEIPT_SCAN' | 'CASHBACK' | 'PAYPAL_DEPOSIT';
  submissionRequirement: string; // e.g. "Scan paper receipt in Ibotta app within 7 days"
  verificationStatus: 'ACTIVE' | 'PENDING' | 'CONFIRMED';
  rebateUrl?: string;
}

export interface RollingRewardScenario {
  transaction1: {
    title: string;
    items: string;
    retailPrice: number;
    couponsApplied: number;
    payToday: number;
    earnRewards: number;
    rewardName: string;
    instructions: string;
  };
  transaction2: {
    title: string;
    items: string;
    retailPrice: number;
    rollRewardUsed: number;
    additionalCoupons?: number;
    finalPayToday: number;
    netEffectiveBoth: number;
    instructions: string;
  };
}

export interface TransactionScenario {
  thresholdType: 'SPEND' | 'QUANTITY';
  thresholdAmount: number; // e.g. $30 (Spend $30) or 2 (Buy 2)
  currentProgress?: number;
  optimalQuantity: number;
  savingsExplanation: string;
  qualifyingItems?: { name: string; price: number; quantity: number }[];
}

export interface DealSavingsRecipe {
  whatToBuy: string; // e.g. "Buy 2 Colgate Optic White Toothpastes (4.2 oz)"
  quantityRequired: number;
  itemSizeVariation?: string;
  skuOrUpc?: string;
  
  // Starting & Sale Prices
  regularUnitPrice: number;
  regularTotalPrice: number;
  saleUnitPrice?: number;
  saleTotalPrice: number;
  salePromotionType?: 'BOGO' | 'BOGO_50' | 'SALE_PRICE' | 'SPEND_GET' | 'BUY_GET' | 'CLEARANCE' | 'STANDARD';
  
  // Stacking Components
  coupons: CouponComponent[];
  totalCouponsDiscount: number;
  
  // Out of Pocket at the register today
  outOfPocketToday: number; // Actual cash/card paid at checkout
  
  // Rewards Earned (Future Currency)
  rewardsEarned: RewardComponent[];
  totalRewardsEarned: number;
  
  // Third-Party Cashback & Rebates
  cashbackRebates: CashbackRebateComponent[];
  totalCashbackRebates: number;
  
  // Effective Net Cost (Out of pocket - Rewards - Rebates)
  effectiveNetCost: number;
  effectiveNetPerUnit: number;
  
  // Money Maker Detection
  isMoneyMaker: boolean; // True if effectiveNetCost < 0
  moneyMakerAmount?: number; // Absolute profit value
  
  // Scenarios
  transactionScenario?: TransactionScenario;
  rollingRewardScenario?: RollingRewardScenario;
  stepByStepInstructions?: {
    stepNumber: number;
    instruction: string;
    highlightedTip?: string;
  }[];
}

export interface StackingBreakdown {
  isStackable: boolean;
  isUncertainStack?: boolean; // When stacking is uncertain, show "Potential savings"
  warning?: string;
  originalPrice: number;
  currentSalePrice?: number;
  components: StackingComponent[];
  actualCheckoutPrice: number;
  estimatedEffectivePrice: number;
  totalSaved: number;
  totalSavedPercentage: number;
}

export interface CompetingOffer {
  id: string;
  retailerName: string;
  retailerLogo: string;
  regularPrice: number;
  currentPrice: number;
  couponAmount: number;
  cashbackAmount: number;
  shippingCost: number;
  effectivePrice: number;
  totalSavings: number;
  dealScore: number;
  dataConfidence: number;
  code?: string;
  targetUrl: string;
  rank: number;
  badge?: string;
}

export interface BestDealEvaluation {
  isRankOne: boolean;
  productTarget: string;
  regularPrice: number;
  currentPrice: number;
  couponDiscount: number;
  cashbackDiscount: number;
  shippingCost: number;
  estimatedEffectivePrice: number;
  estimatedTotalSavings: number;
  savingsPercentage: number;
  whyBestDealExplanation: string;
  whyBestDealBullets: string[];
  historicalRecordNote: string;
  independentDealScore: number; // Deal score (0-100)
  independentDataConfidence: number; // Data confidence (0-100)
  competingOffers: CompetingOffer[];
  affiliateCommissionBiased: false; // Explicit guarantee
}

export interface WhyNotFreeAnalysis {
  isActuallyFree: boolean;
  classification: FreeClassification;
  headline: string;
  requirements: string[];
  minimumCommitmentDollar?: number;
  contractTermMonths?: number;
  monthlyPaymentRequired?: number;
  creditCardRequired: boolean;
  autoRenews: boolean;
  shippingCost?: number;
  taxesOrFeesEstimated?: number;
  explanation: string;
}

export interface Deal {
  id: string;
  title: string;
  description: string;
  storeId: string;
  storeName: string;
  storeLogo: string;
  storeDomain: string;
  code?: string;
  dealType: DealType;
  discountDisplay: string;
  category: string;
  subcategory?: string;
  retailerCategory?: RetailerCategory;
  targetUrl: string;
  
  // Weekly Ad details
  weeklyAd?: WeeklyAdInfo;
  weeklyAdInfo?: WeeklyAdInfo;
  isWeeklyAdDeal?: boolean;
  localStoreLocations?: { storeName: string; address?: string; zipCode: string; distanceMiles?: number }[];

  // Loyalty Program specifics
  loyaltyRequired?: boolean;
  loyaltyProgramName?: string;
  loyaltyActionText?: string; // e.g. "Requires free CVS ExtraCare account. Clip in CVS app or at register."
  
  // Channel & Location
  channel: ShoppingChannel;
  geoAvailabilityText: string; // e.g. "Available nationwide", "Online only", "Available at participating Iowa locations"
  isLocalOnly?: boolean;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string; // International ready, defaults to "US"
  currency?: SupportedCurrency;
  
  // Free Classification & In-Depth Audit
  freeClassification: FreeClassification;
  freeRequirementNote?: string;
  whyNotFree?: WhyNotFreeAnalysis;
  
  // Financials
  originalPrice?: number;
  currentPrice?: number;
  estimatedFinalPrice?: number;
  estimatedSavingsDollar?: number;
  estimatedSavingsPercent?: number;
  outOfPocketPrice?: number;
  isMoneyMaker?: boolean;
  moneyMakerAmount?: number;
  isPennyDeal?: boolean;
  savingsRecipe?: DealSavingsRecipe;
  
  // Deal Score vs Data Confidence (Separate independent metrics)
  dealScore: number; // 0-100 (Measures how good the deal is)
  dealScoreLabel: 'Outstanding Deal' | 'Excellent Deal' | 'Great Deal' | 'Good Value' | 'Average' | 'Low Value';
  dataConfidence: number; // 0-100 (Measures verification recency & accuracy)
  scoreFactors?: {
    discountDepth: number;
    reliability: number;
    priceHistoryAdvantage: number;
    stackPotential: number;
    communityTrust: number;
  };
  
  // Best Deal Intelligence
  bestDealEvaluation?: BestDealEvaluation;
  
  // Verification & Expiration
  verification: VerificationInfo;
  expiration: ExpirationInfo;
  
  // Stacking & History
  stacking?: StackingBreakdown;
  priceAnalysis?: PriceAnalysis;
  
  // Product info if specific product
  productName?: string;
  productImage?: string;
  barcode?: string;
  
  // Source info & Affiliate transparency
  sourcePriority?: 1 | 2 | 3 | 4 | 5; // 1 = Official Retailer, 2 = Official Brand, 3 = Authorized API, 4 = Syndicated, 5 = Public Web
  sourceName?: string;
  sourceUrl?: string;
  isAffiliateLink: boolean;
  directMerchantUrl: string;
  affiliateNetwork?: string;
  affiliateDisclosureText?: string;
  
  // Deal DNA & Structured Representation
  brand?: string;
  sku?: string;
  upc?: string;
  sourcesCount?: number;
  sourcesList?: {
    name: string;
    priority: number;
    sourceUrl?: string;
    lastChecked?: string;
    isPrimary?: boolean;
  }[];
  sourceConflict?: {
    field: string;
    officialValue: string;
    thirdPartyValue: string;
    chosenValue: string;
    reason: string;
  } | null;
  deadLinkStatus?: 'ACTIVE' | '404_DETECTED' | 'EXPIRED_LANDING' | 'REMOVED_PRODUCT';

  // Buy Now vs Wait Prediction
  buyNowVsWait?: {
    recommendation: 'BUY_NOW' | 'WAIT';
    confidencePercent: number;
    typicalPrice: number;
    historicalLow: number;
    reason: string;
    predictionDisclaimer: string;
  };

  // "Is This Actually A Good Deal?" Reality Check
  dealAnalysis?: {
    advertisedDiscount: string;
    typicalRecentPrice: number;
    currentPrice: number;
    verdict: 'EXCELLENT' | 'FAIR' | 'NOT_A_GREAT_DEAL';
    explanation: string;
  };

  // How to Get This Deal (Concise human-readable steps)
  howToGetSteps?: string[];

  // What-If Promotion Rules
  whatIfRules?: {
    baseUnit: string;
    stepQty: number;
    unitPrice: number;
    discountPerStep: number;
    maxQty?: number;
    explanation?: string;
  };

  // Meta
  createdAt: string;
  popularityCount: number;
  tags: string[];
  isFeatured?: boolean;
  termsAndConditions?: string;
}

export interface ShoppingTripItem {
  id: string;
  name: string;
  category?: string;
  quantity: number;
  estimatedPrice: number;
  bestDealId?: string;
  bestStore?: string;
}

export interface ShoppingTripStoreOption {
  storeName: string;
  storeLogo: string;
  itemCount: number;
  totalPrice: number;
  estimatedSavings: number;
  distanceMiles: number;
  items: {
    itemId: string;
    itemName: string;
    price: number;
    savings: number;
    dealCode?: string;
    couponTitle?: string;
  }[];
}

export interface ShoppingTripPlan {
  oneStoreOption: {
    storeName: string;
    storeLogo: string;
    itemCount: number;
    totalPrice: number;
    estimatedSavings: number;
    distanceMiles: number;
  };
  multiStoreOption: {
    stores: ShoppingTripStoreOption[];
    totalPrice: number;
    estimatedSavings: number;
    additionalSavingsVsOneStore: number;
    totalDistanceMiles: number;
    additionalDistanceMiles: number;
    estimatedTravelTimeMin: number;
  };
  mode: 'MAXIMUM_SAVINGS' | 'MINIMUM_TRAVEL';
}

export interface UserList {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  dealIds: string[];
  notes?: Record<string, string>; // dealId -> note
  createdAt: string;
  updatedAt: string;
}

export interface DealAlert {
  id: string;
  query: string;
  type: 'store_discount' | 'price_drop' | 'free_food' | 'keyword_match' | 'category_discount';
  targetStore?: string;
  targetCategory?: string;
  minDiscountPercent?: number;
  targetPriceMax?: number;
  notifyEmail: boolean;
  notifyPush: boolean;
  active: boolean;
  matchCount: number;
  createdAt: string;
}

export interface ProductWatchlistItem {
  id: string;
  productName: string;
  targetPrice: number;
  currentBestPrice: number;
  bestStore: string;
  imageUrl?: string;
  activeCouponsCount: number;
  cashbackRate: number;
  lowest12MonthPrice: number;
  lastChecked: string;
  dealId?: string;
  hasPriceDropAlert?: boolean;
  alertHeadline?: string;
}

export interface PriceDropCombinationAlert {
  id: string;
  dealId: string;
  productName: string;
  storeName: string;
  storeLogo: string;
  imageUrl?: string;
  previousPrice: number;
  newPrice: number;
  couponCode?: string;
  couponSavings: number;
  cashbackAmount: number;
  freeShipping: boolean;
  effectivePrice: number;
  totalSaved: number;
  lowestIn12Months: boolean;
  lowestPrice12Months: number;
  headline: string;
  description: string;
  timestamp: string;
}

export interface UserReport {
  id: string;
  dealId: string;
  dealTitle: string;
  storeName: string;
  reportType:
    | 'works'
    | 'doesnt_work'
    | 'expired'
    | 'incorrect_price'
    | 'wrong_expiration'
    | 'fake_free'
    | 'incorrect_terms'
    | 'location_restricted'
    | 'coupon_rejected';
  comment?: string;
  savedAmountReported?: number;
  userIpOrId: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface SavingsLogItem {
  id: string;
  dealId: string;
  dealTitle: string;
  storeName: string;
  storeLogo?: string;
  amountSaved: number;
  couponCode?: string;
  type: 'confirmed' | 'estimated';
  cashbackEarned?: number;
  date: string;
}

export interface SavingsAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'savings' | 'deals' | 'coupons' | 'free_offers';
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface SavingsTrackerState {
  estimatedSavingsTotal: number;
  confirmedSavingsTotal: number;
  couponsUsedCount: number;
  dealsSavedCount: number;
  cashbackEarnedTotal: number;
  rebatesClaimedTotal: number;
  savingsThisMonth: number;
  savingsThisYear: number;
  averageSavingsPercentage: number;
  history: SavingsLogItem[];
  achievements: SavingsAchievement[];
}

export interface UserPrivacySettings {
  allowPersonalization: boolean;
  allowLocationDeals: boolean;
  allowPushNotifications: boolean;
  notificationFrequency: 'realtime' | 'daily_digest' | 'price_drops_only' | 'off';
  currency: SupportedCurrency;
  enableOfflineCache: boolean;
}

export interface AdminMetrics {
  totalDeals: number;
  activeDeals: number;
  expiringDeals: number;
  expiredDeals: number;
  unverifiedDeals: number;
  dealsDiscoveredToday: number;
  verificationFailures: number;
  freeOffersCount: number;
  averageDealScore: number;
  averageDataConfidence: number;
  userReportsPending: number;
  duplicateDetectionsPrevented: number;
  categoryImbalanceWarning?: string;
  categoryBalance: CategoryBalanceMetric[];
  retailerHealth: RetailerDiscoveryHealth[];
  sourceHealth: {
    name: string;
    type: string;
    status: 'HEALTHY' | 'DEGRADED' | 'PAUSED';
    lastSync: string;
    itemsIndexed: number;
    responseTimeMs: number;
  }[];
  apiUsage: {
    geminiCallsToday: number;
    geminiCostEstimated: number;
    cacheHitRate: number;
    averageLatencyMs: number;
  };
}

export interface NaturalSearchIntent {
  rawQuery: string;
  understoodQuery: string;
  matchedStores: string[];
  matchedCategories: string[];
  matchedFreeType?: FreeClassification;
  maxPrice?: number;
  minDiscountPercent?: number;
  dealType?: DealType;
  location?: string;
  sortBy: 'best_deal' | 'biggest_savings' | 'highest_discount' | 'newest' | 'expiring_soon' | 'most_popular' | 'recently_verified';
  aiExplanation: string;
}

export interface ReceiptScanResult {
  receiptDate: string;
  storeName: string;
  totalPaid: number;
  lineItems: {
    name: string;
    price: number;
    quantity: number;
    category?: string;
    missedDeal?: {
      title: string;
      savings: number;
      couponCode?: string;
      cashbackAvailable?: number;
      type: string;
    };
  }[];
  totalPotentialSavings: number;
  rebateOpportunities: {
    title: string;
    amount: number;
    instructions: string;
  }[];
  summary: string;
}

// ==========================================
// SNAGZ PENNY LIST DATA ARCHITECTURE
// ==========================================

export type PennyStatus =
  | 'CONFIRMED_PENNY'           // Reliable current evidence confirms $0.01
  | 'REPORTED_PENNY'            // Legitimate source or user report, unverified by SNAGZ
  | 'POSSIBLE_PENNY'            // Insufficient evidence for confirmation
  | 'NO_LONGER_ACTIVE'          // Verified price is no longer $0.01
  | 'STALE_NEEDS_VERIFICATION'  // Evidence outdated or cannot be reconfirmed
  | 'PENDING_VERIFICATION';     // New user submission awaiting audit

export type PennyAvailability =
  | 'IN_STORE'
  | 'ONLINE'
  | 'SELECT_STORES'
  | 'REGIONAL'
  | 'UNKNOWN';

export type PennyCategory =
  | 'All'
  | 'Seasonal'
  | 'Food'
  | 'Household'
  | 'Cleaning'
  | 'Health & Beauty'
  | 'Personal Care'
  | 'Toys'
  | 'Home'
  | 'Electronics'
  | 'Apparel'
  | 'Pet'
  | 'Other';

export interface PennyVerificationEvent {
  id: string;
  timestamp: string;
  action: string;
  verifiedPrice: number;
  method: 'POS_RECEIPT_SCAN' | 'COMMUNITY_REPORT' | 'RETAILER_AD_SYSTEM' | 'PRICE_AUDIT' | 'USER_SUBMISSION';
  sourceName: string;
  confidenceScore: number;
  notes?: string;
}

export interface PennyFeedbackStats {
  rangUpPennyCount: number;
  didntWorkCount: number;
  priceChangedCount: number;
  notInStockCount: number;
  storeRefusedCount: number;
}

export interface PennyItem {
  id: string;
  retailerId: string;           // e.g. 'store-dollargeneral', 'store-homedepot'
  retailerName: string;         // e.g. 'Dollar General'
  retailerDomain: string;
  retailerLogo: string;
  productName: string;
  brand: string;
  size?: string;
  variant?: string;
  productImage: string;
  upc: string;                  // UPC / GTIN barcode number
  sku?: string;                 // Retailer SKU / Model / Item #
  previousPrice: number;        // Regular shelf price e.g. 12.00
  currentPrice: number;         // Always 0.01 for active penny items
  expectedPennyPrice: number;   // 0.01
  status: PennyStatus;
  confidence: number;           // 0 - 100 percentage
  category: PennyCategory;
  seasonalInfo?: string;        // e.g. "Yellow Dot Apparel", "Purple Square Home"
  availability: PennyAvailability;
  availabilityDetails?: string; // Evidence-backed availability description
  locationApplicability?: {
    isNationwideParticipation?: boolean;
    region?: string;
    verifiedZipCodes?: string[];
    storeLocationNotes?: string;
  };
  dateDiscovered: string;
  lastVerifiedTimestamp: string;
  lastVerifiedRelative: string; // e.g. "Moments ago", "2 hours ago"
  source: string;               // e.g. "Dollar General Discontinue List & POS Receipts"
  sourceUrl?: string;
  sourceEvidence: string;       // Direct evidence description
  isGlitch: boolean;            // Strictly separated: Penny != Glitch unless both verified
  isPossibleGlitch?: boolean;
  verificationHistory: PennyVerificationEvent[];
  userFeedbackStats: PennyFeedbackStats;
  tags: string[];
  isSaved?: boolean;
}

export interface PennyListHealth {
  activeSources: number;
  lastSuccessfulUpdate: string;
  currentItemCount: number;
  confirmedCount: number;
  reportedCount: number;
  staleCount: number;
  pendingVerificationCount: number;
  verificationSuccessRate: number; // e.g. 96.4%
  reportsReceived: number;
  supportedRetailers: {
    id: string;
    name: string;
    activeCount: number;
    status: 'ACTIVE' | 'PLANNED';
  }[];
}

export type PennyFeedbackType =
  | 'RANG_UP_PENNY'
  | 'DIDNT_WORK'
  | 'PRICE_CHANGED'
  | 'NOT_IN_STOCK'
  | 'STORE_REFUSED';

export interface PennyReportSubmission {
  retailerId: string;
  productName: string;
  brand?: string;
  upc: string;
  itemNumber?: string;
  reportedPrice: number; // 0.01
  category?: PennyCategory;
  storeLocation?: string;
  zipCode?: string;
  photoUrl?: string;
  source: string;
  notes?: string;
  submitterEmail?: string;
}
