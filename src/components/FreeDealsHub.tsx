import React, { useState } from 'react';
import { Gift, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Deal } from '../types';
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
    { id: '$0_FREE', label: '$0 100% Free' },
    { id: 'FREE_WITH_PURCHASE', label: 'Free w/ Purchase' },
    { id: 'FREE_TRIAL', label: 'Free Trials' },
    { id: 'FREE_SAMPLE', label: 'Free Samples' },
    { id: 'FREE_SHIPPING', label: 'Free Shipping' },
    { id: 'NEARLY_FREE', label: 'Under $1' }
  ];

  const filteredDeals = deals.filter(d => {
    if (d.freeClassification === 'NOT_FREE') return false;
    if (selectedType === 'ALL') return true;
    return d.freeClassification === selectedType;
  });

  return (
    <div id="free-deals-hub" className="space-y-5">
      {/* Header Banner */}
      <div className="rounded-xl bg-[#121624] border border-[#232c42] p-5 sm:p-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2.5">
            <Gift className="w-3.5 h-3.5" />
            <span>Verified $0 & Free Offers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Free Stuff, Samples & $0 Promotions
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Every promotion is verified to distinguish authentic <strong>$0 Free</strong> from Free-with-Purchase and Free Trials. No fake survey traps or scam websites.
          </p>

          <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Zero-Scam Policy</span>
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>{filteredDeals.length} active verified offers</span>
            </span>
          </div>
        </div>
      </div>

      {/* Classification Filters Pill Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedType === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedType(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#141926] text-slate-400 hover:text-white border border-[#222b3e]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Deals Grid */}
      {filteredDeals.length === 0 ? (
        <div className="p-10 text-center rounded-xl bg-[#141926] border border-[#222b3e]">
          <Gift className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="font-bold text-white text-sm">No active offers in this free category right now</h3>
          <p className="text-xs text-slate-400 mt-1">Our crawlers update offers continuously. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
