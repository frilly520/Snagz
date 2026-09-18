import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  TrendingDown, 
  Clock, 
  ShieldCheck, 
  Tag, 
  AlertCircle, 
  Bell, 
  Info, 
  Filter, 
  Building2, 
  ArrowUpDown, 
  ArrowRight,
  ChevronDown,
  Layers,
  ShoppingBag,
  HelpCircle,
  X,
  Car,
  Wrench,
  Check,
  Copy,
  History,
  DollarSign,
  Flame,
  ThumbsUp
} from 'lucide-react';
import { 
  PriceFinderProduct, 
  PriceFinderListing, 
  PriceFinderSearchResult, 
  SupportedCurrency,
  PriceFinderCondition,
  PriceFinderSellerType
} from '../types';
import { api } from '../services/api';
import { ZigAvatar } from './ZigMascot';

interface PriceFinderViewProps {
  currency?: SupportedCurrency;
  initialQuery?: string;
  onAskZig?: (query: string) => void;
}

const DEFAULT_POPULAR_SEARCHES = [
  'transmission fluid',
  'Dexron VI transmission fluid',
  '5W-30 full synthetic oil',
  'paper towels',
  'iPhone 17 Pro case',
  '2001 Dodge Ram 5.9 water pump',
  'Moog K7401',
  'dog food',
  'Nike Air Max 270 size 10',
  'PS5',
  'wireless earbuds under $50'
];

const RECENT_SEARCHES_STORAGE_KEY = 'snagz_recent_price_searches';

export const PriceFinderView: React.FC<PriceFinderViewProps> = ({
  currency = 'USD',
  initialQuery = '',
  onAskZig
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [conditionFilter, setConditionFilter] = useState<'ALL' | 'NEW' | 'REFURBISHED'>('ALL');
  const [sellerFilter, setSellerFilter] = useState<'ALL' | 'OFFICIAL_RETAILER' | 'AUTHORIZED_DEALER'>('ALL');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortOption, setSortOption] = useState<'CHEAPEST' | 'DEAL_SCORE' | 'PRICE_DROP'>('CHEAPEST');
  const [isLoading, setIsLoading] = useState(false);

  // Search Results
  const [searchResult, setSearchResult] = useState<PriceFinderSearchResult | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<PriceFinderProduct | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_POPULAR_SEARCHES);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedCouponCode, setCopiedCouponCode] = useState<string | null>(null);

  // Price Alert Modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Info modal
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    // Load recent searches from localStorage
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentSearches(parsed.slice(0, 8));
        }
      }
    } catch {
      // Ignore localStorage errors
    }

    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    try {
      const existing = recentSearches.filter(s => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...existing].slice(0, 8);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  };

  const clearRecentSearches = () => {
    try {
      setRecentSearches([]);
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const suggs = await api.getPriceFinderSuggestions();
      if (suggs && suggs.length > 0) {
        setSuggestions(suggs);
      }
      
      const res = await api.searchPriceFinder({
        q: initialQuery || '',
        category: selectedCategory,
        condition: conditionFilter,
        sellerType: sellerFilter,
        inStockOnly,
        sort: sortOption
      });
      setSearchResult(res);
      if (res.products && res.products.length > 0) {
        setSelectedProduct(res.products[0]);
      }
    } catch (err) {
      console.warn('Error loading price finder data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const performSearch = async (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : searchQuery;
    setIsLoading(true);
    if (q.trim()) {
      saveRecentSearch(q);
    }
    try {
      const res = await api.searchPriceFinder({
        q,
        category: selectedCategory,
        condition: conditionFilter,
        sellerType: sellerFilter,
        inStockOnly,
        sort: sortOption
      });
      setSearchResult(res);
      if (res.products && res.products.length > 0) {
        setSelectedProduct(res.products[0]);
      } else {
        setSelectedProduct(null);
      }
    } catch (err) {
      console.error('Failed to perform price finder search:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (sugg: string) => {
    setSearchQuery(sugg);
    performSearch(sugg);
  };

  const handleCopyCoupon = (code: string) => {
    if (!code) return;
    try {
      navigator.clipboard.writeText(code);
      setCopiedCouponCode(code);
      setTimeout(() => setCopiedCouponCode(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !alertTargetPrice) return;
    try {
      await api.createPriceFinderAlert({
        productId: selectedProduct.id,
        productTitle: selectedProduct.title,
        targetPrice: parseFloat(alertTargetPrice),
        email: alertEmail || 'user@snagz.deals'
      });
      setAlertSuccess(true);
      setTimeout(() => {
        setIsAlertModalOpen(false);
        setAlertSuccess(false);
        setAlertTargetPrice('');
      }, 2000);
    } catch (err) {
      console.error('Alert creation error:', err);
    }
  };

  const formatPrice = (val?: number | null) => {
    if (val === null || val === undefined || isNaN(val)) {
      return 'Check retailer';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: val % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(val);
  };

  const cheapest = selectedProduct?.cheapestListing;
  const advisor = selectedProduct?.aiAdvisor || searchResult?.aiOverallAdvisor;
  const dealScore = selectedProduct?.dealScore;
  const vehicle = selectedProduct?.vehicleCompatibility;

  // Collect verified coupons across all listings for this product
  const allVerifiedCoupons = selectedProduct?.listings
    .filter(l => l.couponDiscount > 0 && l.couponCode)
    .map(l => ({
      retailerName: l.retailerName,
      retailerLogo: l.retailerLogo,
      couponCode: l.couponCode as string,
      couponDiscount: l.couponDiscount,
      directUrl: l.directUrl
    })) || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-in fade-in duration-200">
      {/* Top Header & Context */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <ArrowUpDown className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Shopping & Universal Price Finder
              </h1>
            </div>
            <p className="text-sm text-slate-300 max-w-2xl">
              Tell Snagz what you need. We calculate real out-of-pocket prices across verified U.S. retailers—including shipping, taxes, verified coupons, unit pricing, and vehicle fitment.
            </p>
          </div>

          {/* Verification Transparency Pill */}
          <button
            type="button"
            onClick={() => setShowDisclaimer(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141a29] hover:bg-[#1c2438] text-xs font-semibold text-blue-300 border border-blue-500/30 transition-all self-start sm:self-center"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Multi-Retailer Comparison Engine</span>
            <Info className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Prominent Search Bar */}
      <div className="mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            performSearch();
          }}
          className="relative flex items-center shadow-2xl"
        >
          <div className="absolute left-4 pointer-events-none text-slate-400">
            <Search className="w-5 h-5 text-blue-400" />
          </div>
          <input
            id="input-universal-price-finder-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any product (e.g., transmission fluid, 5W-30 synthetic oil, paper towels, iPhone 17 case, Dodge Ram water pump, Moog K7401)..."
            className="w-full pl-12 pr-32 py-3.5 sm:py-4 rounded-2xl bg-[#0f1422] border border-[#222b3e] focus:border-blue-500 text-white placeholder-slate-400 text-sm sm:text-base font-medium shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedProduct(null);
              }}
              className="absolute right-28 p-1.5 text-slate-400 hover:text-white"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2.5 px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/30 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Recent Searches (Search Memory) */}
        {recentSearches.length > 0 && (
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
              <History className="w-3 h-3 text-blue-400" /> Recent:
            </span>
            {recentSearches.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSelectSuggestion(term)}
                className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#121826] hover:bg-[#1c2438] text-slate-300 hover:text-white border border-[#222b3e] whitespace-nowrap transition-all"
              >
                {term}
              </button>
            ))}
            <button
              type="button"
              onClick={clearRecentSearches}
              className="text-[10px] text-slate-500 hover:text-slate-300 underline ml-1"
            >
              Clear
            </button>
          </div>
        )}

        {/* Popular Example Search Chips */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" /> Suggestions:
          </span>
          {suggestions.map((sugg) => (
            <button
              key={sugg}
              type="button"
              onClick={() => handleSelectSuggestion(sugg)}
              className={`text-xs px-3 py-1 rounded-full whitespace-nowrap transition-all border ${
                searchQuery.toLowerCase() === sugg.toLowerCase()
                  ? 'bg-blue-600 text-white border-blue-500 font-bold'
                  : 'bg-[#141a29] hover:bg-[#1b2337] text-slate-300 hover:text-white border-[#222b3e]'
              }`}
            >
              {sugg}
            </button>
          ))}
        </div>
      </div>

      {/* Filter, Sort & Control Bar */}
      <div className="mb-6 p-3 rounded-xl bg-[#0b0f19] border border-[#1e2738] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Condition Filter */}
          <div className="flex items-center gap-1 bg-[#141926] p-1 rounded-lg border border-[#222b3e]">
            <span className="text-slate-400 px-1.5 font-medium">Condition:</span>
            {(['ALL', 'NEW', 'REFURBISHED'] as const).map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => {
                  setConditionFilter(cond);
                  performSearch();
                }}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                  conditionFilter === cond
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cond === 'ALL' ? 'All' : cond === 'NEW' ? 'New Only' : 'Refurbished'}
              </button>
            ))}
          </div>

          {/* Seller Filter */}
          <div className="flex items-center gap-1 bg-[#141926] p-1 rounded-lg border border-[#222b3e]">
            <span className="text-slate-400 px-1.5 font-medium">Sellers:</span>
            <button
              type="button"
              onClick={() => {
                setSellerFilter('ALL');
                performSearch();
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                sellerFilter === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Retailers
            </button>
            <button
              type="button"
              onClick={() => {
                setSellerFilter('OFFICIAL_RETAILER');
                performSearch();
              }}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                sellerFilter === 'OFFICIAL_RETAILER' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Direct Retailers Only
            </button>
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-1 bg-[#141926] p-1 rounded-lg border border-[#222b3e]">
            <span className="text-slate-400 px-1.5 font-medium">Sort:</span>
            <select
              value={sortOption}
              onChange={(e) => {
                setSortOption(e.target.value as any);
                performSearch();
              }}
              className="bg-transparent text-white font-semibold text-[11px] focus:outline-none cursor-pointer pr-1"
            >
              <option value="CHEAPEST" className="bg-[#141926] text-white">Cheapest Out-of-Pocket</option>
              <option value="DEAL_SCORE" className="bg-[#141926] text-white">Highest Deal Score</option>
              <option value="PRICE_DROP" className="bg-[#141926] text-white">Biggest Price Drop</option>
            </select>
          </div>
        </div>

        {/* In-Stock Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              performSearch();
            }}
            className="w-4 h-4 rounded text-blue-600 bg-[#141926] border-[#222b3e] focus:ring-blue-500"
          />
          <span className="font-semibold">In Stock Only</span>
        </label>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-20 text-center rounded-2xl bg-[#0f1422] border border-[#222b3e] p-8 shadow-xl">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-base font-bold text-white">AI Search Engine comparing live retail prices...</p>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Checking Amazon, Walmart, Target, Best Buy, AutoZone, Advance Auto, RockAuto, and verified coupon feeds for "{searchQuery || 'products'}"
          </p>
        </div>
      ) : selectedProduct ? (
        <div className="space-y-6">
          {/* Multiple Products Selector (if search returned multiple distinct items) */}
          {searchResult && searchResult.products.length > 1 && (
            <div className="p-3.5 rounded-xl bg-[#0f1422] border border-[#222b3e]">
              <div className="text-xs font-bold text-slate-400 mb-2.5 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Verified Products ({searchResult.products.length}):</span>
                <span className="text-[11px] text-blue-400 font-normal">Click any item to view multi-retailer comparison</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {searchResult.products.map((prod) => (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => setSelectedProduct(prod)}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                      selectedProduct.id === prod.id
                        ? 'bg-blue-900/30 border-blue-500 text-white ring-1 ring-blue-500/50'
                        : 'bg-[#141926] border-[#222b3e] text-slate-300 hover:bg-[#1a2133]'
                    }`}
                  >
                    <img 
                      src={prod.image} 
                      alt={prod.title} 
                      className="w-12 h-12 rounded-lg object-contain bg-[#0b0f19] border border-[#222b3e] p-1 flex-shrink-0" 
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate text-white">{prod.title}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-blue-400 font-bold">
                          {formatPrice(prod.cheapestListing.estimatedTotal)}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          at {prod.cheapestListing.retailerName}
                        </span>
                      </div>
                      {prod.dealScore && (
                        <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                          {prod.dealScore.label}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* VEHICLE COMPATIBILITY CARD (Shown for Auto Parts & Fluids) */}
          {vehicle?.isVehiclePart && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#141d33] via-[#0f1629] to-[#12192c] border-2 border-blue-500/40 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
                        Vehicle Fitment & Compatibility
                      </span>
                      {vehicle.compatibilityStatus === 'CONFIRMED_FIT' ? (
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-400" />
                          Confirmed Direct Fit
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-amber-400" />
                          Verify Engine / Drivetrain
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">
                      {vehicle.year ? `${vehicle.year} ` : ''}{vehicle.make || ''} {vehicle.model || ''}
                      {vehicle.engine ? ` • ${vehicle.engine}` : ''}
                      {vehicle.drivetrain ? ` • ${vehicle.drivetrain}` : ''}
                    </h3>
                  </div>
                </div>

                {vehicle.partType && (
                  <div className="px-3 py-1 rounded-lg bg-[#1a233a] border border-blue-500/30 text-xs font-mono text-blue-300 self-start sm:self-auto">
                    Part: {vehicle.partType}
                  </div>
                )}
              </div>

              <div className="mt-3 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                <Wrench className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Fitment Details: </strong>
                  {vehicle.fitmentNote}
                </div>
              </div>
            </div>
          )}

          {/* MAIN PRODUCT HERO CARD */}
          <div className="p-5 sm:p-7 rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Product Visual & Technical Specs */}
              <div className="lg:col-span-4 flex flex-col items-center">
                <div className="relative w-full aspect-square max-w-[280px] rounded-2xl overflow-hidden bg-[#141926] border border-[#222b3e] flex items-center justify-center p-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                  {dealScore && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                      {dealScore.label}
                    </div>
                  )}
                </div>

                {/* Identifiers & Unit Pricing Metric */}
                <div className="mt-4 w-full text-center space-y-2">
                  <div className="flex items-center justify-center gap-3 text-xs font-mono text-slate-400">
                    <div>
                      <span className="text-slate-500">UPC:</span> {selectedProduct.upc}
                    </div>
                    {selectedProduct.modelNumber && (
                      <div>
                        <span className="text-slate-500">Model:</span> {selectedProduct.modelNumber}
                      </div>
                    )}
                  </div>

                  {/* Unit Pricing Highlight */}
                  {selectedProduct.unitPriceMetric && (
                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-left">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Unit Price:</span>
                        <span className="text-blue-300 font-bold text-sm">
                          {selectedProduct.unitPriceMetric.unitDisplay}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1 leading-snug">
                        {selectedProduct.unitPriceMetric.advantageNote}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info, CHEAPEST DEAL & AI ADVISOR */}
              <div className="lg:col-span-8 flex flex-col justify-between h-full space-y-5">
                <div>
                  {/* Data Source Provenance Badge */}
                  {selectedProduct.dataSourceBadge && (
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1 ${
                        selectedProduct.dataSourceBadge.type === 'LIVE_WEB'
                          ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50'
                          : selectedProduct.dataSourceBadge.type === 'LOCAL_CATALOG'
                          ? 'bg-blue-950/70 text-blue-300 border-blue-500/50'
                          : 'bg-amber-950/70 text-amber-300 border-amber-500/50'
                      }`}>
                        {selectedProduct.dataSourceBadge.label}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {selectedProduct.dataSourceBadge.description}
                      </span>
                      {selectedProduct.dataSourceBadge.sourceUrl && (
                        <a
                          href={selectedProduct.dataSourceBadge.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-0.5 ml-1"
                        >
                          <span>Direct Source</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{selectedProduct.brand}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400">{selectedProduct.category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                    {selectedProduct.title}
                  </h2>

                  {/* Variants (e.g. Size, Storage, Pack count) */}
                  {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {selectedProduct.variants.map((variant) => (
                        <div key={variant.name} className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-400 font-medium">{variant.name}:</span>
                          <div className="flex items-center gap-1">
                            {variant.options.map((opt) => (
                              <span
                                key={opt}
                                className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                                  opt === variant.selected
                                    ? 'bg-blue-600/30 text-blue-300 border-blue-500'
                                    : 'bg-[#141926] text-slate-400 border-[#222b3e]'
                                }`}
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🚨 PROMINENT "CHEAPEST CURRENT OPTION" HIGHLIGHT BANNER */}
                {cheapest && (
                  <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-blue-950/60 to-[#121929] border-2 border-blue-500/60 shadow-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                            Cheapest Option
                          </span>
                          <span className="text-xs text-slate-200 font-bold flex items-center gap-1">
                            at {cheapest.retailerName}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Checked {cheapest.lastChecked}
                          </span>
                        </div>

                        {/* Price Breakdown */}
                        <div className="flex items-baseline gap-3 pt-1">
                          <span className="text-3xl sm:text-4xl font-black text-white">
                            {formatPrice(cheapest.estimatedTotal)}
                          </span>
                          <span className="text-xs text-slate-300">
                            Real Out-of-Pocket
                          </span>
                        </div>

                        <div className="text-xs text-slate-300 space-x-1.5">
                          <span>Item: {formatPrice(cheapest.itemPrice)}</span>
                          <span>+</span>
                          <span className="text-blue-300 font-semibold">
                            {cheapest.shippingPrice === 0 ? 'Free Shipping' : formatPrice(cheapest.shippingPrice)}
                          </span>
                          {cheapest.couponDiscount > 0 && (
                            <>
                              <span>-</span>
                              <span className="text-blue-300 font-semibold">
                                {formatPrice(cheapest.couponDiscount)} coupon ({cheapest.couponCode})
                              </span>
                            </>
                          )}
                          <span className="text-slate-400 font-normal">({cheapest.shippingNote})</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                        <a
                          href={cheapest.directUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-600/40 transition-all hover:scale-105 active:scale-95 text-center"
                        >
                          <span>Buy at {cheapest.retailerName}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setIsAlertModalOpen(true)}
                          className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1e2538] text-xs font-semibold text-slate-300 hover:text-white border border-[#222b3e] flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Bell className="w-3.5 h-3.5 text-blue-400" />
                          <span>Track Price Drops</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI SHOPPING ADVISOR CARD (Intelligent Advice) */}
                {advisor && (
                  <div className="p-4 rounded-xl bg-[#121827] border border-blue-500/30">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-500/20 text-blue-400">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Snagz AI Shopping Advisor
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {advisor.isGoodDeal ? (
                          <span className="px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase">
                            Recommended Deal
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase">
                            Wait or Consider Alternatives
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-xs font-bold text-blue-300 mb-1">
                      {advisor.verdictHeadline}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {advisor.reasoning}
                    </p>

                    {advisor.unitEconomicsNote && (
                      <div className="mt-2.5 p-2 rounded-lg bg-[#0c101a] border border-[#1e2738] text-[11px] text-slate-300 flex items-start gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-white">Unit Economics Tip: </strong>
                          {advisor.unitEconomicsNote}
                        </div>
                      </div>
                    )}

                    {advisor.couponTip && (
                      <div className="mt-2 text-[11px] text-blue-300 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>{advisor.couponTip}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VERIFIED COUPONS & DISCOUNTS SECTION (1-Click Copy) */}
          {allVerifiedCoupons.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0f1422] border border-[#222b3e]">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">
                  Verified Coupons & Promo Codes Available
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allVerifiedCoupons.map((coupon, idx) => (
                  <div
                    key={`${coupon.couponCode}-${idx}`}
                    className="p-3 rounded-xl bg-[#141926] border border-[#222b3e] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <img 
                          src={coupon.retailerLogo} 
                          alt={coupon.retailerName} 
                          className="w-5 h-5 rounded object-cover" 
                        />
                        <span className="text-xs font-bold text-white">{coupon.retailerName}</span>
                      </div>
                      <div className="text-[11px] text-blue-300 font-semibold mt-1">
                        Saves {formatPrice(coupon.couponDiscount)} at checkout
                      </div>
                      <div className="text-xs font-mono font-bold text-slate-300 mt-0.5">
                        {coupon.couponCode}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyCoupon(coupon.couponCode)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-95 flex-shrink-0"
                    >
                      {copiedCouponCode === coupon.couponCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ALL RETAILERS COMPARISON TABLE */}
          <div className="p-5 rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#222b3e]">
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-400" />
                  <span>Compare All Verified Retailers</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Sorted by net estimated price. Includes shipping, direct coupon codes, and verified seller status.
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                {selectedProduct.listings.length} live retailer listings compared
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#222b3e] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Retailer</th>
                    <th className="py-3 px-3">Condition</th>
                    <th className="py-3 px-3">Item Price</th>
                    <th className="py-3 px-3">Shipping & Fees</th>
                    <th className="py-3 px-3">Coupons / Promos</th>
                    <th className="py-3 px-3">Estimated Total</th>
                    <th className="py-3 px-3">Stock</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1b2337] text-xs">
                  {selectedProduct.listings.map((listing) => (
                    <tr
                      key={listing.id}
                      className={`hover:bg-[#141a29] transition-colors ${
                        listing.isCheapest ? 'bg-blue-950/20' : ''
                      }`}
                    >
                      {/* Retailer */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={listing.retailerLogo}
                            alt={listing.retailerName}
                            className="w-7 h-7 rounded-lg object-cover border border-[#222b3e]"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{listing.retailerName}</span>
                              {listing.isCheapest && (
                                <span className="px-1.5 py-0.2 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                                  Lowest
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <span>{listing.sellerType === 'OFFICIAL_RETAILER' ? 'Official Retailer' : 'Authorized Dealer'}</span>
                              {listing.isEstimated && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-950/60 text-amber-300/90 border border-amber-500/30 font-semibold">
                                  Est.
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Condition */}
                      <td className="py-3.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          listing.condition === 'NEW' 
                            ? 'bg-blue-900/30 text-blue-300 border border-blue-800/40' 
                            : 'bg-amber-900/30 text-amber-300 border border-amber-800/40'
                        }`}>
                          {listing.condition}
                        </span>
                      </td>

                      {/* Item Price */}
                      <td className="py-3.5 px-3 font-semibold text-slate-200">
                        {formatPrice(listing.itemPrice)}
                      </td>

                      {/* Shipping */}
                      <td className="py-3.5 px-3">
                        <div className="text-slate-300">
                          {listing.shippingPrice === 0 ? (
                            <span className="text-blue-300 font-semibold">Free</span>
                          ) : (
                            formatPrice(listing.shippingPrice)
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                          {listing.shippingNote || 'Standard delivery'}
                        </div>
                      </td>

                      {/* Coupons */}
                      <td className="py-3.5 px-3">
                        {listing.couponDiscount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-blue-300 font-bold">
                              -{formatPrice(listing.couponDiscount)}
                            </span>
                            {listing.couponCode && (
                              <button
                                type="button"
                                onClick={() => handleCopyCoupon(listing.couponCode!)}
                                className="px-1.5 py-0.5 rounded bg-blue-950 hover:bg-blue-900 border border-blue-500/40 text-[10px] font-mono text-blue-300"
                                title="Click to copy promo code"
                              >
                                {copiedCouponCode === listing.couponCode ? 'Copied' : listing.couponCode}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Estimated Total */}
                      <td className="py-3.5 px-3">
                        <div className={`text-sm font-black ${listing.isCheapest ? 'text-blue-300' : 'text-white'}`}>
                          {formatPrice(listing.estimatedTotal)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {listing.lastChecked}
                        </div>
                      </td>

                      {/* Stock Status */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                          listing.stockStatus === 'IN_STOCK' ? 'text-blue-300' : 'text-amber-400'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {listing.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Low Stock'}
                        </span>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-3 text-right">
                        <a
                          href={listing.directUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow transition-all active:scale-95"
                        >
                          <span>Buy</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List (Responsive adaptation) */}
            <div className="md:hidden space-y-3">
              {selectedProduct.listings.map((listing) => (
                <div
                  key={listing.id}
                  className={`p-3.5 rounded-xl border ${
                    listing.isCheapest 
                      ? 'bg-blue-950/30 border-blue-500/50' 
                      : 'bg-[#141926] border-[#222b3e]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img src={listing.retailerLogo} alt={listing.retailerName} className="w-6 h-6 rounded object-cover" />
                      <span className="font-bold text-white text-sm">{listing.retailerName}</span>
                    </div>
                    {listing.isCheapest && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                        Lowest Price
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline justify-between py-1">
                    <span className="text-xs text-slate-400">Total Out-of-Pocket:</span>
                    <span className="text-lg font-black text-white">{formatPrice(listing.estimatedTotal)}</span>
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-[#222b3e]">
                    <span>Item: {formatPrice(listing.itemPrice)} • {listing.shippingPrice === 0 ? 'Free Shipping' : `Shipping: ${formatPrice(listing.shippingPrice)}`}</span>
                    <span className="text-blue-300 font-semibold">{listing.stockStatus === 'IN_STOCK' ? 'In Stock' : 'Low Stock'}</span>
                  </div>

                  {listing.couponDiscount > 0 && listing.couponCode && (
                    <div className="mt-2 p-1.5 rounded bg-blue-950/40 border border-blue-500/30 text-xs flex items-center justify-between">
                      <span className="text-blue-300">Code: <strong>{listing.couponCode}</strong> (-{formatPrice(listing.couponDiscount)})</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCoupon(listing.couponCode!)}
                        className="text-[10px] text-blue-400 font-bold hover:underline"
                      >
                        {copiedCouponCode === listing.couponCode ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  <div className="mt-3">
                    <a
                      href={listing.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <span>Buy at {listing.retailerName}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SIMILAR / ALTERNATIVE OPTIONS CARD (Strict Model & Variant Distinction) */}
          {selectedProduct.similarProducts && selectedProduct.similarProducts.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#0b0f19] border border-[#1e2738]">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Similar Models & Variant Disclosures</h4>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                We clearly distinguish these similar products so you never accidentally buy an older generation, accessory, or different pack size thinking it’s the same item.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedProduct.similarProducts.map((sim) => (
                  <div key={sim.id} className="p-3 rounded-xl bg-[#141926] border border-[#222b3e] flex items-center gap-3">
                    <img src={sim.image} alt={sim.title} className="w-12 h-12 rounded-lg object-contain bg-[#0f1422] border border-[#222b3e] p-1 flex-shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">{sim.title}</div>
                      <div className="text-xs text-blue-400 font-semibold mt-0.5">From {formatPrice(sim.lowestPrice)}</div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{sim.differenceReason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* NO RESULTS STATE WITH REAL SEARCH CHIPS */
        <div className="p-10 sm:p-14 text-center rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-xl">
          <ShoppingBag className="w-12 h-12 text-blue-400/50 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-white">
            {searchQuery ? `No verified deals found for "${searchQuery}"` : 'Start Your Price Comparison'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto leading-relaxed">
            {searchQuery
              ? 'Try searching with general keywords, brand name, model number, or check one of our popular verified categories below:'
              : 'Search any product to compare real prices across Amazon, Walmart, Target, Best Buy, AutoZone, Advance Auto, and RockAuto.'}
          </p>

          <div className="mt-6 pt-6 border-t border-[#222b3e] max-w-2xl mx-auto">
            <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
              Try Searching For:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {DEFAULT_POPULAR_SEARCHES.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSelectSuggestion(chip)}
                  className="px-3 py-1.5 rounded-lg bg-[#141926] hover:bg-blue-600/30 text-xs font-semibold text-slate-200 hover:text-white border border-[#222b3e] hover:border-blue-500/50 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRICE DROP ALERT MODAL */}
      {isAlertModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222b3e]">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Set Target Price Alert</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAlertModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Notify me automatically when <span className="font-bold text-white">{selectedProduct.title}</span> drops below my target price across any verified retailer.
            </p>

            {alertSuccess ? (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center space-y-1">
                <CheckCircle2 className="w-6 h-6 text-blue-400 mx-auto" />
                <div className="text-sm font-bold text-white">Alert Set Successfully!</div>
                <div className="text-xs text-slate-400">We'll alert you the moment a retailer beats your price.</div>
              </div>
            ) : (
              <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Target Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                      placeholder={formatPrice(selectedProduct.priceHistory.currentPrice * 0.9).replace('$', '')}
                      className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#141926] border border-[#222b3e] focus:border-blue-500 text-white text-sm font-bold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Notification Email</label>
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-xl bg-[#141926] border border-[#222b3e] focus:border-blue-500 text-white text-xs focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAlertModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-[#141926] hover:bg-[#1a2133] text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow"
                  >
                    Activate Alert
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TRANSPARENT COVERAGE DISCLOSURE MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0f1422] border border-[#222b3e] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#222b3e]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Retailer Coverage & Verification Standards</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                <strong className="text-white">Multi-Retailer Engine:</strong> Snagz monitors prices across major U.S. retailers and authorized sellers (including Amazon, Walmart, Target, Best Buy, AutoZone, Advance Auto Parts, RockAuto, Chewy, The Home Depot, Lowe’s, and Nike).
              </p>
              <p>
                We do <strong className="text-white">not</strong> display unverified marketplace spam or unauthorized bootleg sellers. We prioritize genuine warranty coverage, verified in-stock availability, and authentic OEM part specifications.
              </p>
              <p>
                <strong className="text-white">Net Out-of-Pocket Calculation:</strong> All comparisons compute the estimated final checkout price by adding shipping/fees and subtracting verified, currently working promotional codes and instant discounts.
              </p>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowDisclaimer(false)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
