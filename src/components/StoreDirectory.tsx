import React, { useState } from 'react';
import { 
  Store as StoreIcon, 
  Search, 
  Heart, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Tag,
  Gift,
  MapPin,
  Calendar,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Store, Deal, RetailerCategory } from '../types';
import { CouponCard } from './CouponCard';

interface StoreDirectoryProps {
  stores: Store[];
  deals: Deal[];
  savedDealIds: Set<string>;
  onToggleSaveDeal: (dealId: string) => void;
  onToggleFollowStore: (storeId: string) => void;
  onOpenDetails: (deal: Deal) => void;
  onOpenAddToList: (deal: Deal) => void;
  onVote: (dealId: string, type: 'works' | 'doesnt_work') => void;
  initialSelectedStoreId?: string | null;
  onClearInitialStore?: () => void;
}

const RETAILER_CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'ALL', label: 'All Stores', icon: '🏪' },
  { id: 'GROCERY', label: 'Grocery Stores', icon: '🥦' },
  { id: 'PHARMACY / HEALTH', label: 'Pharmacies & Health', icon: '💊' },
  { id: 'GENERAL RETAIL', label: 'Everyday & Dollar Stores', icon: '🛒' },
  { id: 'HOME IMPROVEMENT', label: 'Hardware & Home', icon: '🔨' },
  { id: 'AUTOMOTIVE', label: 'Auto Parts & Supplies', icon: '🚗' },
  { id: 'OFFICE / SCHOOL', label: 'Office & School', icon: '📎' },
  { id: 'RESTAURANTS / FOOD', label: 'Restaurants & Dining', icon: '🍕' },
  { id: 'PET', label: 'Pet Supplies', icon: '🐾' },
  { id: 'GAS / CONVENIENCE', label: 'Gas & Convenience', icon: '⛽' },
  { id: 'ELECTRONICS', label: 'Electronics', icon: '💻' },
  { id: 'CLOTHING', label: 'Apparel & Department', icon: '👕' },
  { id: 'BEAUTY', label: 'Beauty & Wellness', icon: '✨' },
];

export const StoreDirectory: React.FC<StoreDirectoryProps> = ({
  stores,
  deals,
  savedDealIds,
  onToggleSaveDeal,
  onToggleFollowStore,
  onOpenDetails,
  onOpenAddToList,
  onVote,
  initialSelectedStoreId,
  onClearInitialStore
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [weeklyAdOnly, setWeeklyAdOnly] = useState(false);
  const [stackingOnly, setStackingOnly] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(initialSelectedStoreId || null);
  const [storeDealTypeFilter, setStoreDealTypeFilter] = useState<string>('ALL');

  // Filter stores
  const filteredStores = stores.filter(s => {
    // Search query
    const matchQuery = !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.popularDiscountText && s.popularDiscountText.toLowerCase().includes(searchQuery.toLowerCase()));

    // Category filter
    const matchCategory = selectedCategory === 'ALL' || 
      s.retailerCategory === selectedCategory || 
      s.category.toLowerCase().includes(selectedCategory.toLowerCase().split('/')[0].trim().toLowerCase());

    // Feature toggles
    const matchWeeklyAd = !weeklyAdOnly || s.hasWeeklyAd || (s.weeklyAdCount && s.weeklyAdCount > 0);
    const matchStacking = !stackingOnly || s.allowsStacking;

    return matchQuery && matchCategory && matchWeeklyAd && matchStacking;
  });

  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const allStoreDeals = deals.filter(d => d.storeId === selectedStoreId || (selectedStore && d.storeDomain === selectedStore.domain));
  
  const selectedStoreDeals = allStoreDeals.filter(d => {
    if (storeDealTypeFilter === 'ALL') return true;
    if (storeDealTypeFilter === 'WEEKLY_AD') return d.isWeeklyAdDeal || d.weeklyAdInfo || d.dealType === 'WEEKLY_AD_ITEM';
    if (storeDealTypeFilter === 'DIGITAL_COUPON') return d.dealType === 'DIGITAL_COUPON' || d.code;
    if (storeDealTypeFilter === 'REWARDS') return d.dealType === 'STORE_REWARDS' || d.loyaltyRequired;
    if (storeDealTypeFilter === 'CLEARANCE') return d.dealType === 'CLEARANCE';
    return true;
  });

  // If a store profile is selected:
  if (selectedStore) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => {
            setSelectedStoreId(null);
            if (onClearInitialStore) onClearInitialStore();
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Everyday Stores</span>
        </button>

        {/* Store Header Banner */}
        <div className="p-6 sm:p-7 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 p-2 flex items-center justify-center shrink-0">
                <img 
                  src={selectedStore.logo} 
                  alt={selectedStore.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl font-bold text-white">{selectedStore.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                    {selectedStore.retailerCategory || selectedStore.category}
                  </span>
                  <a
                    href={`https://${selectedStore.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-400 hover:text-emerald-400 flex items-center gap-1 font-mono"
                  >
                    <span>{selectedStore.domain}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                  {selectedStore.description}
                </p>
                {selectedStore.loyaltyProgramPerk && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-sky-400">
                    <Gift className="w-3.5 h-3.5" />
                    <span><strong>{selectedStore.loyaltyProgramName || 'Rewards'}:</strong> {selectedStore.loyaltyProgramPerk}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow button */}
            <button
              type="button"
              onClick={() => onToggleFollowStore(selectedStore.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                selectedStore.isFollowed
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-md'
              }`}
            >
              <Heart className={`w-4 h-4 ${selectedStore.isFollowed ? 'fill-rose-400' : ''}`} />
              <span>{selectedStore.isFollowed ? 'Following Store' : 'Follow for Alerts'}</span>
            </button>
          </div>

          {/* Store Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-neutral-800 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-500 block">Active Verified Deals</span>
              <span className="font-bold text-white text-base mt-0.5 block">{allStoreDeals.length} Deals</span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-500 block">Verified Cashback</span>
              <span className="font-bold text-emerald-400 text-base mt-0.5 block">
                {selectedStore.cashbackRate ? `+${selectedStore.cashbackRate}%` : 'Standard Rewards'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-500 block">Coupon Stacking Policy</span>
              <span className="font-bold text-sky-400 text-base mt-0.5 block">
                {selectedStore.allowsStacking ? 'Stacking Permitted' : '1 Promo Per Order'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <span className="text-neutral-500 block">Source Verification</span>
              <span className="font-bold text-emerald-300 text-base mt-0.5 block">{selectedStore.verifiedScore || 98}% Verified</span>
            </div>
          </div>
        </div>

        {/* Store Deal Type Sub-Tabs */}
        <div className="flex items-center justify-between gap-3 flex-wrap border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'ALL', label: `All Deals (${allStoreDeals.length})` },
              { id: 'WEEKLY_AD', label: 'Weekly Ad & Circulars' },
              { id: 'DIGITAL_COUPON', label: 'Digital Coupons' },
              { id: 'REWARDS', label: 'Store Rewards & Loyalty' },
              { id: 'CLEARANCE', label: 'Clearance' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStoreDealTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  storeDealTypeFilter === tab.id
                    ? 'bg-emerald-500 text-neutral-950 font-bold'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-neutral-500">
            Showing {selectedStoreDeals.length} of {allStoreDeals.length} deals
          </span>
        </div>

        {/* Store Active Deals */}
        <div>
          {selectedStoreDeals.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 space-y-2">
              <ShoppingBag className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
              <p className="font-bold text-white text-sm">No specific {storeDealTypeFilter.toLowerCase().replace('_', ' ')} deals found for {selectedStore.name}.</p>
              <p>Try switching to "All Deals" or check back when the new weekly flyer is indexed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedStoreDeals.map((deal) => (
                <CouponCard
                  key={deal.id}
                  deal={deal}
                  isSaved={savedDealIds.has(deal.id)}
                  onToggleSave={onToggleSaveDeal}
                  onOpenDetails={onOpenDetails}
                  onOpenAddToList={onOpenAddToList}
                  onVote={onVote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div id="store-directory" className="space-y-6">
      {/* Header with Search and Categories */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Everyday Store & Retailer Directory</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Verified circulars, digital coupons, and loyalty rewards for pharmacies, grocery, hardware, dollar stores, and auto retailers
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CVS, Kroger, Walmart, Aldi, AutoZone..."
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:border-emerald-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Category Pills Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {RETAILER_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-emerald-500 text-neutral-950 font-bold shadow-md'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Quick Filter Toggles */}
      <div className="flex items-center gap-3 flex-wrap text-xs text-neutral-400">
        <span className="font-semibold text-neutral-300 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick Filters:</span>
        </span>

        <button
          type="button"
          onClick={() => setWeeklyAdOnly(!weeklyAdOnly)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            weeklyAdOnly
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Has Weekly Circular</span>
        </button>

        <button
          type="button"
          onClick={() => setStackingOnly(!stackingOnly)}
          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            stackingOnly
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Permits Coupon Stacking</span>
        </button>

        <span className="ml-auto font-mono text-[11px] text-neutral-500">
          Showing {filteredStores.length} stores
        </span>
      </div>

      {/* Store Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            onClick={() => setSelectedStoreId(store.id)}
            className="p-5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/40 transition-all cursor-pointer shadow-lg group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 p-1.5 flex items-center justify-center shrink-0">
                    <img 
                      src={store.logo} 
                      alt={store.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain rounded"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                      {store.name}
                    </h3>
                    <span className="text-[11px] text-neutral-400 font-mono block">{store.domain}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{store.retailerCategory || store.category}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFollowStore(store.id);
                  }}
                  className={`p-2 rounded-lg border transition-colors ${
                    store.isFollowed
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white border-neutral-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${store.isFollowed ? 'fill-rose-400' : ''}`} />
                </button>
              </div>

              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                {store.description}
              </p>

              {/* Tags and Perks */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {store.hasWeeklyAd && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                    Weekly Circular
                  </span>
                )}
                {store.loyaltyProgramName && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {store.loyaltyProgramName}
                  </span>
                )}
                {store.allowsStacking && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Stackable
                  </span>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">{store.dealCount || store.couponCount || 8} Active Deals</span>
                {store.cashbackRate ? (
                  <span className="text-emerald-400 font-bold font-mono">+{store.cashbackRate}% CB</span>
                ) : null}
              </div>
              <span className="text-emerald-400 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                View Deals →
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
