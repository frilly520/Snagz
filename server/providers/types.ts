import { 
  PriceFinderProduct, 
  PriceFinderListing, 
  PriceFinderSearchResult, 
  PriceFinderCondition, 
  PriceFinderSellerType, 
  PriceFinderStockStatus,
  VehicleCompatibilityInfo,
  SnagzDealScore,
  AiShoppingAdvisorAnalysis
} from '../../src/types';

export interface ParsedShoppingQuery {
  rawQuery: string;
  normalizedQuery: string;
  productType?: string;
  brand?: string;
  model?: string;
  modelNumber?: string;
  partNumber?: string;
  upc?: string;
  size?: string;
  quantity?: number;
  color?: string;
  category?: string;
  budgetMax?: number;
  specs?: Record<string, string>;
  isVehiclePart: boolean;
  vehicleYear?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleEngine?: string;
  vehicleDrivetrain?: string;
  keywords: string[];
}

export interface ProviderDiagnostics {
  providerName: string;
  liveGoogleSearchExecuted: boolean;
  searchQueriesGenerated: string[];
  groundedSourcesFound: number;
  validProductListingsExtracted: number;
  retailerDomains: string[];
  relevanceFilteredOutCount?: number;
  errorMessage?: string;
  status: 'SUCCESS' | 'NO_RESULTS' | 'API_ERROR' | 'QUOTA_EXHAUSTED' | 'NOT_CONFIGURED';
  message?: string;
}

export interface ProductSearchProvider {
  name: string;
  priority: number; // Lower number = higher priority
  isConfigured(): boolean;
  search(query: string, parsed: ParsedShoppingQuery): Promise<PriceFinderProduct[]>;
  getLastDiagnostics?(): ProviderDiagnostics | null;
}
