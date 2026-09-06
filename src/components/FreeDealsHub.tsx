import React, { useState } from 'react';
import { Gift, ShieldCheck, Sparkles, Filter, CheckCircle2, Info } from 'lucide-react';
import { Deal, FreeClassification } from '../types';
import { CouponCard } from './CouponCard';

interface FreeDealsHubProps {
  deals: Deal[];
  savedDealIds: Set<string>;
  onToggleSave: (dealId: string) => void;
  onOpenDetails: (deal: Deal) => void;
  onOpenAddToList: (deal: Deal) => void;
  onVote: (dealId: string, type: 'works' | 'doesnt_work') => void;
}

export const FreeDealsHub: React.FC<FreeDealsHubProps> = ({
  deals,
  savedDealIds,
  onToggleSave,
  onOpenDetails,
  onOpenAddToList,
  onVote
}) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const categories = [
    { id: 'ALL', label: 'All Free Offers' },
    { id: '$0_FREE', label: '$0 100% Free (No Purchase)' },
    { id: 'FREE_WITH_PURCHASE', label: 'Free w/ Purchase' },
    { id: 'FREE_TRIAL', label: 'Free Trials' },
    { id: 'FREE_SAMPLE', label: 'Free Samples' },
    { id: 'FREE_SHIPPING', label: 'Free Shipping' },
    { id: 'NEARLY_FREE', label: 'Nearly Free (<$1)' }
  ];

  const filteredDeals = deals.filter(d => {
    if (d.freeClassification === 'NOT_FREE') return false;
    if (selectedType === 'ALL') return true;
    return d.freeClassification === selectedType;
  });

  return (
    <div id="free-deals-hub" className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-neutral-900 to-neutral-950 border border-emerald-500/30 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3">
            <Gift className="w-3.5 h-3.5" />
            <span>100% Free & Legitimate Discovery Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Verified Free Stuff, Trials & $0 Promotions
          </h1>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Every offer is algorithmically audited to distinguish authentic <strong>$0 Free (No spend)</strong> from Free-with-Purchase, Free Trials, and Rebate Stacks. No fake surveys or hidden subscription traps.
          </p>

          <div className="flex items-center gap-4 mt-4 text-xs text-neutral-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Scam / Fake Survey Policy</span>
            </span>
            <span className="flex items-center gap-1 text-neutral-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{filteredDeals.length} active verified offers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Classification Filters Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedType === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedType(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-950 font-bold'
                  : 'bg-neutral-900/90 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800">
          <Gift className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-bold text-white text-base">No active offers in this free category right now</h3>
          <p className="text-xs text-neutral-400 mt-1">Our crawlers verify offers every 15 minutes. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredDeals.map((deal) => (
            <CouponCard
              key={deal.id}
              deal={deal}
              isSaved={savedDealIds.has(deal.id)}
              onToggleSave={onToggleSave}
              onOpenDetails={onOpenDetails}
              onOpenAddToList={onOpenAddToList}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </div>
  );
};
