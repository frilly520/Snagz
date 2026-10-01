import { Deal, DealType, FreeClassification, PromoCode, PromoCodeStatus } from '../../src/types';

export interface RawDiscoveredDeal {
  title: string;
  description: string;
  storeName: string;
  storeId?: string;
  storeDomain?: string;
  storeLogo?: string;
  currentPrice: number;
  originalPrice?: number;
  discountDisplay?: string;
  dealType?: DealType;
  category?: string;
  targetUrl: string;
  productImage?: string;
  couponCode?: string;
  freeClassification?: FreeClassification;
  source: string;
  sourceUrl: string;
  dateCollected: string;
  expirationDate?: string | null;
  isExpired?: boolean;
  verificationStatus: 'COMMUNITY_REPORTED' | 'SOURCE_VERIFIED' | 'UNVERIFIED';
  tags?: string[];
}

export interface RawDiscoveredCoupon {
  storeName: string;
  storeSlug: string;
  storeLogo?: string;
  storeUrl?: string;
  code: string;
  discount: string;
  discountType: 'PERCENT_OFF' | 'DOLLAR_OFF' | 'FREE_SHIPPING' | 'NEW_CUSTOMER' | 'CLEARANCE';
  discountValue?: number;
  minPurchase?: number;
  description: string;
  source: string;
  sourceUrl: string;
  dateCollected: string;
  expirationDate?: string | null;
  verificationStatus: 'UNVERIFIED'; // Never label as verified unless tested at checkout
}

export interface CollectorResult {
  collectorName: string;
  deals: RawDiscoveredDeal[];
  coupons: RawDiscoveredCoupon[];
  fetchedAt: string;
  error?: string;
}

export interface IngestionRunSummary {
  runId: string;
  timestamp: string;
  dealsDiscovered: number;
  dealsUpdated: number;
  dealsCreated: number;
  couponsDiscovered: number;
  couponsCreated: number;
  couponsUpdated: number;
  expiredCleaned: number;
  duplicatesSkipped: number;
  durationMs: number;
  sources: { name: string; deals: number; coupons: number; error?: string }[];
}
