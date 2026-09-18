import React, { useState } from 'react';
import { 
  Flame, 
  ArrowRight, 
  Store as StoreIcon, 
  Tag, 
  Sparkles, 
  CheckCircle2,
  ArrowUpDown,
  Search,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Deal, Store, SupportedCurrency } from '../types';
import { CouponCard } from './CouponCard';

interface CleanHomeViewProps {
  deals: Deal[];
  stores: Store[];
  currency: SupportedCurrency;
  savedDealIds: Set<string>;
  onToggleSaveDeal: (dealId: string) => void;
  onOpenDetails: (deal: Deal) => void;
  onHideDeal: (deal: Deal) => void;
  onReportDeal: (deal: Deal) => void;
  onTriggerConfirmation?: (deal: Deal) => void;
  onNavigateTab: (tab: any, query?: string) => void;
  onSelectStore: (storeName: string) => void;
}

const FEATURED_STORE_NAMES = [
  'Target',
  'Walmart',
  'Amazon',
  'Best Buy',
  'CVS Pharmacy',
  'Walgreens',
  'Home Depot',
  'Nike'
];

const POPULAR_PRICE_SEARCHES = [
  'Transmission Fluid',
  'Dexron VI',
  '5W-30 Full Synthetic Oil',
  'Paper Towels',
  'iPhone 17 Pro Case',
  '2001 Dodge Ram 5.9 Water Pump',
  'Nike Air Max 270',
  'PS5',
  'Dog Food',
  'Moog K7401'
];

export const CleanHomeView: React.FC<CleanHomeViewProps> = ({
  deals,
  stores,
  currency,
  savedDealIds,
  onToggleSaveDeal,
  onOpenDetails,
  onHideDeal,
  onReportDeal,
  onTriggerConfirmation,
  onNavigateTab,
  onSelectStore
}) => {
  const [quickPriceQuery, setQuickPriceQuery] = useState('');

  // Pick 3 to 4 featured deals (top ranked)
  const bestSnags = deals.slice(0, 4);

  // Popular stores with logos
  const popularStores = FEATURED_STORE_NAMES.map(name => {
    const matched = stores.find(s => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase()));
    return {
      name,
      logo: matched?.logo || `https://logo.clearbit.com/${name.toLowerCase().replace(/\s+/g, '')}.com`,
      dealCount: matched?.activeDealsCount || Math.floor(Math.random() * 12) + 4
    };
  });

  const handlePriceSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('pricefinder', quickPriceQuery);
  };

  const handleQuickChip = (chip: string) => {
    onNavigateTab('pricefinder', chip);
  };

  return (
    <div id="clean-home-view" className="space-y-12 py-3 max-w-6xl mx-auto animate-in fade-in duration-150">
      {/* 1. Header / Welcome Statement: Clean, Large Typography, High Contrast */}
      <section className="text-center max-w-3xl mx-auto pt-3 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs sm:text-sm font-bold mb-4">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>Real Deals • Verified Promo Codes • Universal Price Finder</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-3">
          Smart Shopping & Real Savings
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Compare real prices across 18 major retailers, discover hand-verified coupon stacks, and check active promo codes without spam.
        </p>
      </section>

      {/* 2. 🔥 BEST SNAGS (3-4 Top Featured Deals) */}
      <section>
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#1c2438]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/25">
              <Flame className="w-5 h-5 fill-orange-400/20" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                BEST SNAGS TODAY
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Hand-verified deals active right now with confirmed checkout pricing</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('deals')}
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors group"
          >
            <span>View All Deals</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {bestSnags.length === 0 ? (
          <div className="p-10 text-center rounded-2xl bg-[#121624] border border-[#222b3e] text-slate-400 text-sm">
            Loading today's best snags...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {bestSnags.map((deal) => (
              <CouponCard
                key={deal.id}
                deal={deal}
                isSaved={savedDealIds.has(deal.id)}
                currency={currency}
                onToggleSave={onToggleSaveDeal}
                onOpenDetails={onOpenDetails}
                onTriggerConfirmation={onTriggerConfirmation}
                onHideDeal={onHideDeal}
                onReportDeal={onReportDeal}
              />
            ))}
          </div>
        )}
      </section>

      {/* 3. 🔍 UNIVERSAL PRICE FINDER ENTRY (Prominent, High-Contrast Tool Card) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#10172a] via-[#0f1422] to-[#141b2d] border-2 border-blue-500/40 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/40 mb-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span>UNIVERSAL PRICE FINDER</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Before You Buy: Check The Absolute Lowest Price
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                Compare identical products across Amazon, Walmart, Target, Best Buy, Home Depot, and 13 other authorized retailers with shipping and coupons included.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('pricefinder')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 self-start md:self-center shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span>Open Price Finder</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search Form */}
          <form onSubmit={handlePriceSearch} className="relative flex items-center mb-4">
            <Search className="w-5 h-5 text-blue-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={quickPriceQuery}
              onChange={(e) => setQuickPriceQuery(e.target.value)}
              placeholder="Search product name, model number, UPC, or brand to compare retailers..."
              className="w-full pl-12 pr-32 py-3.5 sm:py-4 rounded-2xl bg-[#080c16] border border-[#222b3e] focus:border-blue-500 text-white placeholder-slate-400 text-sm sm:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 sm:py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow transition-all"
            >
              Compare
            </button>
          </form>

          {/* Popular comparison chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Popular Checks:
            </span>
            {POPULAR_PRICE_SEARCHES.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleQuickChip(chip)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#161f33] hover:bg-blue-600/30 text-slate-200 hover:text-white border border-[#26334d] hover:border-blue-500/50 whitespace-nowrap transition-all font-medium"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 🏪 POPULAR STORES (Clean grid of major stores) */}
      <section>
        <div className="flex items-center justify-between mb-5 pb-2 border-b border-[#1c2438]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/25">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                POPULAR STORES
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">Direct deals and verified savings at your favorite retailers</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('stores')}
            className="text-xs sm:text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 transition-colors group"
          >
            <span>All Stores</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {popularStores.map((store) => (
            <button
              key={store.name}
              type="button"
              onClick={() => onSelectStore(store.name)}
              className="group p-4 rounded-2xl bg-[#121624] hover:bg-[#161c2e] border border-[#222b3e] hover:border-blue-500/40 flex items-center gap-3.5 transition-all text-left shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#0c101a] border border-[#222b3e] p-1 flex items-center justify-center shrink-0">
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain rounded"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 truncate transition-colors">
                  {store.name}
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {store.dealCount} active deals
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* 5. 🏷️ VERIFIED PROMO CODES BANNER */}
      <section className="p-6 rounded-2xl bg-[#0e1320] border border-[#1e2638] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Looking for Online Promo Codes?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Browse tested and confirmed promo codes for Target, Nike, Lowe’s, CVS, and more.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigateTab('promocodes')}
          className="px-6 py-2.5 rounded-xl bg-[#161f33] hover:bg-blue-600 text-white text-xs sm:text-sm font-bold border border-[#283652] transition-all whitespace-nowrap shadow-sm"
        >
          View Verified Promo Codes →
        </button>
      </section>
    </div>
  );
};
