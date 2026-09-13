import React, { useState } from 'react';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Gift, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Deal, SupportedCurrency } from '../types';

interface CouponCardProps {
  deal: Deal;
  isSaved?: boolean;
  currency?: SupportedCurrency;
  onToggleSave?: (dealId: string) => void;
  onOpenDetails?: (deal: Deal) => void;
  onOpenAddToList?: (deal: Deal) => void;
  onVote?: (dealId: string, type: 'works' | 'doesnt_work') => void;
  onOpenWhyNotFree?: (deal: Deal) => void;
  onTriggerConfirmation?: (deal: Deal) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  deal,
  isSaved = false,
  currency = 'USD',
  onToggleSave,
  onOpenDetails,
  onTriggerConfirmation
}) => {
  const [copied, setCopied] = useState(false);

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleCardClick = () => {
    if (onOpenDetails) onOpenDetails(deal);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code);
    setCopied(true);
    if (onTriggerConfirmation) onTriggerConfirmation(deal);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine concise stack summary if applicable
  const getStackSummary = () => {
    if (deal.isPennyDeal || deal.currentPrice === 0.01) {
      return '1¢ In-Store Penny Find';
    }
    if (deal.isMoneyMaker) {
      return `Money Maker • +$${(deal.moneyMakerAmount ?? 0).toFixed(2)} Profit`;
    }
    if (deal.freeClassification && deal.freeClassification !== 'NOT_FREE') {
      if (deal.freeClassification === 'FREE_WITH_PURCHASE') return 'Free with Purchase';
      if (deal.freeClassification === 'FREE_TRIAL') return 'Free Trial';
      if (deal.freeClassification === 'FREE_SAMPLE') return 'Free Sample';
      return '100% Free Offer';
    }
    if (deal.savingsRecipe && deal.savingsRecipe.steps && deal.savingsRecipe.steps.length > 1) {
      const parts: string[] = [];
      if (deal.code || deal.dealType === 'DIGITAL_COUPON') parts.push('Coupon');
      if (deal.loyaltyProgramName || deal.dealType === 'STORE_REWARDS' || deal.dealType === 'EXTRABUCKS') parts.push('Store Reward');
      if (deal.dealType === 'REBATE') parts.push('Rebate');
      if (parts.length > 0) {
        return `${parts.join(' + ')} • Final: ${formatPrice(deal.estimatedFinalPrice ?? deal.currentPrice)}`;
      }
    }
    if (deal.stacking?.isStackable && deal.stacking.components.length > 1) {
      return `Coupon + Rebate Stack • Final: ${formatPrice(deal.estimatedFinalPrice ?? deal.currentPrice)}`;
    }
    return null;
  };

  const stackSummary = getStackSummary();

  // Price calculations
  const displayPrice = deal.estimatedFinalPrice !== undefined && deal.estimatedFinalPrice < deal.currentPrice 
    ? deal.estimatedFinalPrice 
    : deal.currentPrice;
  const originalPrice = deal.originalPrice;
  const savingsAmount = deal.estimatedSavingsDollar || (originalPrice && originalPrice > displayPrice ? originalPrice - displayPrice : 0);

  return (
    <div 
      id={`deal-card-${deal.id}`}
      onClick={handleCardClick}
      className="group flex flex-col justify-between bg-[#141926] hover:bg-[#181f30] border border-[#222b3e] hover:border-[#33415c] rounded-xl p-4 sm:p-5 transition-colors cursor-pointer shadow-sm"
    >
      <div>
        {/* Top: Store & Save Action */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-[#0d101a] border border-[#222b3e] flex items-center justify-center p-0.5 shrink-0">
              <img 
                src={deal.storeLogo} 
                alt={deal.storeName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
              {deal.storeName}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {deal.verification?.status === 'VERIFIED_ACTIVE' && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Verified</span>
              </span>
            )}
            <button
              id={`btn-save-${deal.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSave) onToggleSave(deal.id);
              }}
              title={isSaved ? 'Remove from Saved' : 'Save Deal'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved 
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                  : 'bg-[#1a2133] text-slate-400 hover:text-white border-[#222b3e] hover:border-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-slate-100 text-base leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 mb-1.5">
          {deal.title}
        </h3>

        {/* One Short Deal Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {deal.description}
        </p>

        {/* Stack Requirement Summary (if stacked / coupon / rebate) */}
        {stackSummary && (
          <div className="mb-3 px-2.5 py-1 rounded-md bg-[#101522] border border-[#222b3e] text-[11px] text-blue-300 font-medium truncate">
            {stackSummary}
          </div>
        )}
      </div>

      {/* Bottom: Pricing & CTA */}
      <div className="pt-3 border-t border-[#1f2638] mt-2">
        <div className="flex items-baseline justify-between gap-2 mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && originalPrice > displayPrice && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {savingsAmount > 0 && (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
              SAVE {formatPrice(savingsAmount)}
            </span>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-2">
          {deal.code ? (
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-2 rounded-lg bg-[#1a2133] hover:bg-[#222b3e] border border-[#2c3750] text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              title={`Copy code: ${deal.code}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="font-mono">{copied ? 'Copied' : deal.code}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>VIEW DEAL</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
