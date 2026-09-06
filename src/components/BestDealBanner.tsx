import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  ShieldCheck, 
  TrendingDown, 
  ExternalLink, 
  Copy, 
  Check, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Info,
  Clock,
  ArrowRight,
  Store as StoreIcon
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
  isSaved = false,
  currency = 'USD',
  onToggleSave,
  onOpenDetails,
  onOpenAddToList,
  onTriggerConfirmation,
  onOpenCompareModal
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCompeting, setShowCompeting] = useState(false);
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
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div 
      id="best-deal-engine-hero"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-950 border-2 border-emerald-500/40 shadow-2xl shadow-emerald-950/40 transition-all p-5 sm:p-6 mb-8"
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-neutral-950 text-xs font-black tracking-wider uppercase shadow-md shadow-emerald-500/30">
            <Trophy className="w-3.5 h-3.5" />
            <span>BEST DEAL • RANK #1</span>
          </div>
          <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
            Ranked by Lowest Verified Net Effective Price
          </span>
        </div>

        {/* Independent Metrics: Deal Score vs Data Confidence */}
        <div className="flex items-center gap-2">
          <div 
            title="Deal Quality Score (0-100): Calculated from discount depth, price history, and stacking value."
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Deal Score: {evaluation.independentDealScore}/100</span>
          </div>
          <div 
            title="Data Confidence Score (0-100): Calculated from verification recency, source authority, and community confirmations."
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-bold"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Confidence: {evaluation.independentDataConfidence}%</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Product & Retailer Header */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-start gap-4">
          {deal.productImage ? (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-neutral-950 border border-neutral-800 p-1.5 overflow-hidden shrink-0 shadow-inner">
              <img 
                src={deal.productImage} 
                alt={deal.productName || deal.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-neutral-950 border border-neutral-800 p-2 flex items-center justify-center shrink-0">
              <img 
                src={deal.storeLogo} 
                alt={deal.storeName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-neutral-300 bg-neutral-800/90 px-2 py-0.5 rounded">
                {deal.storeName}
              </span>
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Verified {deal.verification.lastUserConfirmedAgo || 'recently'}</span>
              </span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <TrendingDown className="w-3 h-3" />
                <span>{evaluation.historicalRecordNote}</span>
              </span>
            </div>

            <h2 
              onClick={() => onOpenDetails && onOpenDetails(deal)}
              className="text-lg sm:text-xl font-bold text-white leading-snug cursor-pointer hover:text-emerald-300 transition-colors"
            >
              {deal.title}
            </h2>
            
            <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
              {deal.description}
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400 flex-wrap">
              <span className="text-neutral-300 font-medium">Channel: {deal.geoAvailabilityText}</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{deal.expiration.label}</span>
            </div>
          </div>
        </div>

        {/* Right: Effective Price Calculation Equation Box */}
        <div className="lg:col-span-5 bg-neutral-950/90 rounded-xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col justify-between">
          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Effective Price Equation</span>
            <span className="text-emerald-400 font-mono">Save {formatPrice(evaluation.estimatedTotalSavings)} ({evaluation.savingsPercentage.toFixed(0)}%)</span>
          </div>

          {/* Math breakdown row */}
          <div className="space-y-1.5 text-xs text-neutral-300 font-mono pb-3 border-b border-neutral-800">
            <div className="flex justify-between">
              <span className="text-neutral-400">Regular Typical Price:</span>
              <span>{formatPrice(evaluation.regularPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Current Store Markdown:</span>
              <span className="text-neutral-200">{formatPrice(evaluation.currentPrice)}</span>
            </div>
            {evaluation.couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Coupon Code ({deal.code || 'Auto-clip'}):</span>
                <span>-{formatPrice(evaluation.couponDiscount)}</span>
              </div>
            )}
            {evaluation.cashbackDiscount > 0 && (
              <div className="flex justify-between text-sky-400">
                <span>Cashback Rebate:</span>
                <span>-{formatPrice(evaluation.cashbackDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-400">
              <span>Shipping:</span>
              <span className="text-emerald-400 font-bold">FREE</span>
            </div>
          </div>

          {/* Final Net Effective Price */}
          <div className="flex items-baseline justify-between pt-3 mb-4">
            <div>
              <span className="text-xs font-semibold text-neutral-400 block">Net Effective Price</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {formatPrice(evaluation.estimatedEffectivePrice)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-neutral-500 line-through block font-mono">{formatPrice(evaluation.regularPrice)}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                Total Saved: {formatPrice(evaluation.estimatedTotalSavings)}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            {deal.code ? (
              <button
                id="btn-best-deal-copy-code"
                type="button"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-dashed border-emerald-500/60 hover:border-emerald-400 font-mono text-xs font-bold text-emerald-300 transition-all"
              >
                <span>{deal.code}</span>
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-neutral-400" />
                )}
              </button>
            ) : null}

            <a
              id="btn-best-deal-get"
              href={deal.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onTriggerConfirmation && onTriggerConfirmation(deal)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs tracking-wide shadow-lg shadow-emerald-500/20 transition-all"
            >
              <span>Get Best Deal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              id="btn-best-deal-add-list"
              type="button"
              onClick={() => onOpenAddToList && onOpenAddToList(deal)}
              title="Add to Custom List"
              className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Triggers */}
      <div className="mt-5 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-toggle-why-best-deal"
            type="button"
            onClick={() => setShowExplanation(!showExplanation)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-emerald-400" />
            <span>Why is this the Best Deal?</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {evaluation.competingOffers && evaluation.competingOffers.length > 0 && (
            <button
              id="btn-toggle-competing-offers"
              type="button"
              onClick={() => {
                if (onOpenCompareModal) {
                  onOpenCompareModal();
                } else {
                  setShowCompeting(!showCompeting);
                }
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800/70 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold transition-colors"
            >
              <StoreIcon className="w-3.5 h-3.5 text-sky-400" />
              <span>Side-by-Side Compare ({evaluation.competingOffers.length + 1} Stores)</span>
            </button>
          )}
        </div>

        {/* Ethical Transparency Guarantee */}
        <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Strictly mathematical ranking • 0% affiliate bias</span>
        </div>
      </div>

      {/* Expandable Explanation Panel */}
      {showExplanation && (
        <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 space-y-3">
          <div className="font-semibold text-emerald-300 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Mathematical Deal Intelligence Audit</span>
          </div>
          <p className="text-neutral-300 leading-relaxed">
            {evaluation.whyBestDealExplanation}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-neutral-800/60">
            {evaluation.whyBestDealBullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2 text-neutral-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Alternative Competing Offers Comparison */}
      {showCompeting && evaluation.competingOffers && (
        <div className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
            Multi-Retailer Price Comparison Matrix
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {evaluation.competingOffers.map((comp) => (
              <div 
                key={comp.id}
                className="p-3 rounded-lg bg-neutral-900/90 border border-neutral-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-white">{comp.retailerName}</span>
                    <span className="text-[10px] font-bold text-neutral-400 bg-neutral-800 px-1.5 py-0.5 rounded">
                      Rank #{comp.rank}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-400 space-y-0.5 font-mono">
                    <div>Regular: {formatPrice(comp.regularPrice)}</div>
                    <div>Price: {formatPrice(comp.currentPrice)}</div>
                    {comp.couponAmount > 0 && <div className="text-emerald-400">Coupon: -{formatPrice(comp.couponAmount)}</div>}
                    {comp.shippingCost > 0 && <div>Shipping: +{formatPrice(comp.shippingCost)}</div>}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Effective</span>
                    <span className="text-sm font-bold text-neutral-200 font-mono">{formatPrice(comp.effectivePrice)}</span>
                  </div>
                  <a
                    href={comp.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
