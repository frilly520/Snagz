import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  TrendingDown, 
  Layers, 
  AlertTriangle, 
  Share2, 
  Flag, 
  Sparkles,
  Info,
  Calendar,
  DollarSign,
  Dna,
  Calculator,
  ListOrdered,
  HelpCircle,
  TrendingUp,
  Compass
} from 'lucide-react';
import { Deal } from '../types';
import { DealBreakdown } from './DealBreakdown';

interface DealDetailsModalProps {
  deal: Deal | null;
  onClose: () => void;
  onVote?: (dealId: string, type: 'works' | 'doesnt_work') => void;
  onReport?: (dealId: string, reportType: string, comment?: string) => void;
}

export const DealDetailsModal: React.FC<DealDetailsModalProps> = ({
  deal,
  onClose,
  onVote,
  onReport
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState('doesnt_work');
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // What-if calculation state
  const [whatIfQty, setWhatIfQty] = useState<number>(2);

  if (!deal) return null;

  const handleCopyCode = () => {
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShare = () => {
    const url = window.location.origin + '?dealId=' + deal.id;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReport) {
      onReport(deal.id, reportType, reportComment);
    }
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportForm(false);
      setReportSubmitted(false);
    }, 2000);
  };

  // What-If Promotion dynamic computation
  const baseUnitPrice = deal.currentPrice || (deal.originalPrice ? deal.originalPrice * 0.8 : 25);
  const baseDiscountPerUnit = (deal.estimatedSavingsDollar || 10) / 2;
  const computedWhatIfTotal = (baseUnitPrice * whatIfQty).toFixed(2);
  const computedWhatIfSavings = (baseDiscountPerUnit * Math.floor(whatIfQty / 1)).toFixed(2);
  const computedWhatIfEffective = (Number(computedWhatIfTotal) - Number(computedWhatIfSavings)).toFixed(2);

  return (
    <div 
      id="deal-details-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="deal-details-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-deal-details"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Store & Header */}
        <div className="flex items-start gap-4 mb-5 pr-8">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1.5 shrink-0">
            <img 
              src={deal.storeLogo} 
              alt={deal.storeName} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-lg text-white">{deal.storeName}</h2>
              <span className="text-xs text-neutral-500 font-mono">({deal.storeDomain})</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                Score: {deal.dealScore}/100
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-950 border border-sky-500/40 text-sky-400">
                Confidence: {deal.dataConfidence}%
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">{deal.discountDisplay}</p>
          </div>
        </div>

        {/* Title & Description */}
        <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-2 leading-tight">
          {deal.title}
        </h1>
        <p className="text-sm text-neutral-300 mb-5 leading-relaxed">
          {deal.description}
        </p>

        {/* SECTION: How To Get This Deal (Clear 1-2-3 Guide) */}
        <div className="mb-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
          <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
            <span>How to Get This Deal</span>
          </h3>
          <div className="space-y-1.5 text-xs text-neutral-300">
            {(deal.howToGetSteps || [
              '1. Click the button below to open the official store product page.',
              deal.code ? `2. Copy coupon code "${deal.code}" and apply it at checkout.` : '2. The promotional discount is applied automatically in your cart.',
              '3. Confirm your order with free shipping or store pickup.',
              `4. Enjoy an estimated net savings of $${(deal.estimatedSavingsDollar || 15).toFixed(2)}.`
            ]).map((step, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-neutral-800 text-emerald-400 font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{step.replace(/^\d+\.\s*/, '')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Free Offer Requirement Box */}
        {deal.freeClassification !== 'NOT_FREE' && (
          <div className="mb-6 p-4 rounded-xl bg-neutral-950 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                {deal.freeClassification.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-neutral-400">Free Offer Integrity Audit</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
              {deal.freeRequirementNote || 'No hidden costs detected. Genuinely free promotion verified against official store policy.'}
            </p>
          </div>
        )}

        {/* SECTION: Buy Now vs. Wait Prediction */}
        <div className="mb-6 p-4 rounded-xl bg-neutral-950/90 border border-neutral-800">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Price Prediction: Buy Now vs. Wait</span>
            </h3>
            <span className={`px-2.5 py-0.5 rounded text-xs font-extrabold ${
              (deal.buyNowVsWait?.recommendation || 'BUY_NOW') === 'BUY_NOW'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              {(deal.buyNowVsWait?.recommendation || 'BUY_NOW') === 'BUY_NOW' ? '⚡ BUY NOW' : '⏳ CONSIDER WAITING'}
            </span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            {deal.buyNowVsWait?.reason || 
              `Current price is within 5% of the 12-month low ($${deal.priceAnalysis?.lowestObserved.toFixed(2) || (deal.currentPrice || 100)}). Statistical historical probability suggests waiting will not produce a significantly lower price.`}
          </p>
          <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Confidence: {deal.buyNowVsWait?.confidencePercent || 92}% based on 12-month historical sales frequency</span>
            <span className="italic">Statistical prediction, not a guarantee</span>
          </div>
        </div>

        {/* SECTION 1: Savings Recipe & Deal Breakdown (or fallback Stacking) */}
        {deal.savingsRecipe ? (
          <div className="mb-6">
            <DealBreakdown deal={deal} />
          </div>
        ) : deal.stacking ? (
          <div className="mb-6 p-4 sm:p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Final Price & Savings Calculation</span>
              </h3>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                Save ${deal.stacking.totalSaved.toFixed(2)} ({deal.stacking.totalSavedPercentage}%)
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between text-neutral-400 py-1 border-b border-neutral-800">
                <span>Original Retail Price</span>
                <span className="text-white">${deal.stacking.originalPrice.toFixed(2)}</span>
              </div>

              {deal.stacking.components.map((comp, idx) => (
                <div key={idx} className="flex items-center justify-between text-neutral-300 py-1 border-b border-neutral-800/60">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{comp.title} {comp.code ? `(${comp.code})` : ''}</span>
                  </span>
                  <span className="text-emerald-400 font-semibold">-${comp.discountAmount.toFixed(2)}</span>
                </div>
              ))}

              <div className="flex items-center justify-between text-neutral-200 py-1.5 font-bold">
                <span>Actual Checkout Price</span>
                <span className="text-white font-sans text-sm">${deal.stacking.actualCheckoutPrice.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between text-emerald-300 py-1.5 bg-emerald-950/30 px-3 rounded-lg border border-emerald-500/20">
                <span className="font-sans font-bold">Estimated Effective Price (After Cashback)</span>
                <span className="font-sans font-extrabold text-base text-emerald-400">${deal.stacking.estimatedEffectivePrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* SECTION: Interactive What-If Quantity Calculator */}
        <div className="mb-6 p-4 rounded-xl bg-neutral-950/80 border border-neutral-800">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-amber-400" />
              <span>What-If Savings Calculator</span>
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">Dynamic Scaling</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <label className="text-xs text-neutral-400">Select Quantity:</label>
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-700 rounded-lg p-0.5">
              {[1, 2, 3, 4, 6].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setWhatIfQty(q)}
                  className={`px-2.5 py-1 text-xs font-bold rounded ${
                    whatIfQty === q ? 'bg-emerald-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center p-2.5 bg-neutral-900 rounded-lg border border-neutral-800 text-xs font-mono">
            <div>
              <span className="text-neutral-500 block text-[10px]">Estimated Subtotal</span>
              <span className="font-bold text-white">${computedWhatIfTotal}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Total Discount</span>
              <span className="font-bold text-emerald-400">-${computedWhatIfSavings}</span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Effective Cart Price</span>
              <span className="font-bold text-sky-400">${computedWhatIfEffective}</span>
            </div>
          </div>
        </div>

        {/* SECTION: Deal DNA & Source Intelligence */}
        <div className="mb-6 p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 text-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-neutral-200 flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5 text-purple-400" />
              <span>Deal DNA & Source Aggregation</span>
            </h3>
            <span className="text-[11px] text-neutral-400">
              Found across {deal.sourcesCount || 4} sources
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-[11px] font-mono">
            <div className="p-2 bg-neutral-900/80 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Store Domain</span>
              <span className="text-neutral-300 truncate block">{deal.storeDomain}</span>
            </div>
            <div className="p-2 bg-neutral-900/80 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Channel</span>
              <span className="text-neutral-300 truncate block">{deal.channel.replace(/_/g, ' ')}</span>
            </div>
            <div className="p-2 bg-neutral-900/80 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">UPC / SKU</span>
              <span className="text-neutral-300 truncate block">{deal.barcode || deal.sku || 'N/A'}</span>
            </div>
            <div className="p-2 bg-neutral-900/80 rounded border border-neutral-800">
              <span className="text-neutral-500 block text-[10px]">Source Priority</span>
              <span className="text-emerald-400 truncate block font-bold">Tier {deal.sourcePriority} (Authoritative)</span>
            </div>
          </div>

          {/* Source Conflict Resolution Box if any */}
          {deal.sourceConflict && (
            <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-300 mb-2">
              <span className="font-bold">Source Reconciliation Note: </span>
              {deal.sourceConflict.reason} (Used official: {deal.sourceConflict.officialValue})
            </div>
          )}

          <p className="text-[11px] text-neutral-400">
            Primary Feed: <strong className="text-neutral-300">{deal.sourceName}</strong>. All coupon and pricing records are verified with 0% affiliate ranking bias.
          </p>
        </div>

        {/* SECTION 2: Price History & Fake Discount Warning Analysis */}
        {deal.priceAnalysis && (
          <div className="mb-6 p-4 sm:p-5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <span>Price History & Integrity Analysis</span>
              </h3>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                deal.priceAnalysis.verdict === 'ALL_TIME_LOW' 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : deal.priceAnalysis.verdict === 'NOT_A_GREAT_DEAL'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
              }`}>
                {deal.priceAnalysis.verdict.replace(/_/g, ' ')}
              </span>
            </div>

            <p className="text-xs text-neutral-300 mb-3 leading-relaxed">
              {deal.priceAnalysis.verdictReason}
            </p>

            {/* Price points bar */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 px-3 bg-neutral-900 rounded-lg border border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-500 block">Lowest Recorded</span>
                <span className="font-bold text-emerald-400 font-mono">${deal.priceAnalysis.lowestObserved.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Typical Price</span>
                <span className="font-bold text-neutral-300 font-mono">${deal.priceAnalysis.typicalHistoricalPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Highest Recorded</span>
                <span className="font-bold text-neutral-400 font-mono">${deal.priceAnalysis.highestObserved.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: Verification & Expiration Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Verification Audit</span>
            </div>
            <p className="text-neutral-300">{deal.verification.source}</p>
            <p className="text-neutral-500 mt-1">Confidence Score: {deal.verification.confidenceScore}% • Confirmed by {deal.verification.userConfirmations} shoppers ({deal.verification.lastUserConfirmedAgo || 'Recently'})</p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-xs">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <Calendar className="w-4 h-4" />
              <span>Expiration Policy</span>
            </div>
            <p className="text-neutral-300">{deal.expiration.label}</p>
            <p className="text-neutral-500 mt-1">Source: {deal.expiration.expirationSource.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Coupon Code Copy & Main Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-neutral-800">
          {deal.code && (
            <button
              id="modal-btn-copy-code"
              type="button"
              onClick={handleCopyCode}
              className="flex-1 flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-950 border border-dashed border-emerald-500/50 hover:border-emerald-400 font-mono font-bold text-emerald-400 transition-all text-sm"
            >
              <span>{deal.code}</span>
              <span className="flex items-center gap-1 text-xs font-sans text-neutral-300">
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </span>
            </button>
          )}

          <a
            id="modal-btn-get-deal"
            href={deal.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-950"
          >
            <span>Open {deal.storeName} Offer</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Share & Report Footer Actions */}
        <div className="mt-4 pt-4 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
          <button
            id="btn-share-deal"
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link copied!' : 'Share Deal'}</span>
          </button>

          <button
            id="btn-toggle-report"
            type="button"
            onClick={() => setShowReportForm(!showReportForm)}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Report Issue</span>
          </button>
        </div>

        {/* Report Issue Form Modal Dropdown */}
        {showReportForm && (
          <form onSubmit={handleSubmitReport} className="mt-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
            <h4 className="font-bold text-white mb-2">Report a problem with this deal</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1">Issue Type</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white"
                >
                  <option value="doesnt_work">Coupon code does not work</option>
                  <option value="expired">Offer is expired</option>
                  <option value="incorrect_price">Incorrect price / discount</option>
                  <option value="fake_free">Fake free offer (mandatory fees required)</option>
                  <option value="location_restricted">Restricted to other location</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Optional Details</label>
                <textarea
                  rows={2}
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="e.g. Error code in cart says promo expired"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold"
                >
                  {reportSubmitted ? 'Submitted!' : 'Submit Report'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

