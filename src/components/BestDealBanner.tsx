import React, { useState } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { Deal, BestDealEvaluation, SupportedCurrency } from '../types';

interface BestDealBannerProps {
  deal: Deal;
  evaluation: BestDealEvaluation;
  isSaved?: boolean;
  currency?: SupportedCurrency;
  onToggleSave?: (dealId: string) => void;
  onOpenDetails?: (deal: Deal) => void;
  onOpenAddToList?: (deal: Deal) => void;
  onTriggerConfirmation?: (deal: Deal) => void;
  onOpenCompareModal?: () => void;
}

export const BestDealBanner: React.FC<BestDealBannerProps> = ({
  deal,
  evaluation,
  currency = 'USD',
  onOpenDetails,
  onTriggerConfirmation,
  onOpenCompareModal
}) => {
  const [copied, setCopied] = useState(false);

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code);
    setCopied(true);
    if (onTriggerConfirmation) onTriggerConfirmation(deal);
    setTimeout(() => setCopied(false), 2000);
  };

  const finalPrice = evaluation.estimatedEffectivePrice || deal.estimatedFinalPrice || deal.currentPrice;
  const originalPrice = evaluation.regularPrice || deal.originalPrice;
  const savings = evaluation.estimatedTotalSavings || (originalPrice ? originalPrice - finalPrice : 0);

  return (
    <div 
      id="best-deal-engine-hero"
      className="rounded-xl bg-[#121624] border border-[#232c42] p-4 sm:p-5 transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Product Details & Store */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-[#0e121c] border border-[#222b3e] p-1.5 flex items-center justify-center shrink-0">
            <img 
              src={deal.storeLogo} 
              alt={deal.storeName} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                <Flame className="w-3 h-3 text-blue-400" />
                <span>#1 BEST SNAG</span>
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {deal.storeName}
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">
                • Verified lowest effective price
              </span>
            </div>

            <h3 
              onClick={() => onOpenDetails && onOpenDetails(deal)}
              className="text-base sm:text-lg font-bold text-white hover:text-blue-400 transition-colors cursor-pointer line-clamp-1"
            >
              {deal.title}
            </h3>

            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {evaluation.whyBestDealExplanation || deal.description}
            </p>
          </div>
        </div>

        {/* Right Side: Price, Savings & CTA */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1f2638]">
          <div className="text-left sm:text-right">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                ${finalPrice.toFixed(2)}
              </span>
              {originalPrice && originalPrice > finalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-xs font-bold text-emerald-400 block">
                SAVE ${savings.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {deal.code && (
              <button
                type="button"
                onClick={handleCopy}
                className="px-2.5 py-2 rounded-lg bg-[#1a2133] hover:bg-[#222b3e] border border-[#2c3750] text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-colors"
                title={`Copy code ${deal.code}`}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{copied ? 'Copied' : deal.code}</span>
              </button>
            )}

            {onOpenCompareModal && (
              <button
                type="button"
                onClick={onOpenCompareModal}
                title="Compare against competing store offers"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] border border-[#222b3e] text-xs text-slate-300 hover:text-white transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Compare</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenDetails && onOpenDetails(deal)}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>VIEW DEAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
