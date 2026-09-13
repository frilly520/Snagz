import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Flag, 
  CheckCircle2,
  Gift,
  Tag
} from 'lucide-react';
import { Deal } from '../types';

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
  const [userVoted, setUserVoted] = useState<'works' | 'doesnt_work' | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportComment, setReportComment] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

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

  const handleVoteAction = (type: 'works' | 'doesnt_work') => {
    if (userVoted) return;
    setUserVoted(type);
    if (onVote) onVote(deal.id, type);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onReport) onReport(deal.id, 'issue', reportComment);
    setReportSubmitted(true);
    setTimeout(() => {
      setShowReport(false);
      setReportSubmitted(false);
      setReportComment('');
    }, 2000);
  };

  const finalPrice = deal.estimatedFinalPrice ?? deal.currentPrice;
  const originalPrice = deal.originalPrice;
  const savings = deal.estimatedSavingsDollar || (originalPrice && originalPrice > finalPrice ? originalPrice - finalPrice : 0);

  // Compile clear, easy-to-understand steps
  const steps: string[] = deal.howToGetSteps && deal.howToGetSteps.length > 0
    ? deal.howToGetSteps.map(s => s.replace(/^\d+[\.\)]\s*/, ''))
    : [
        `Visit ${deal.storeName} online or in-store`,
        deal.code ? `Apply promo code "${deal.code}" at checkout` : 'Promotional discount is applied automatically in cart',
        deal.savingsRecipe?.totalRewardsEarned ? `Earn $${deal.savingsRecipe.totalRewardsEarned.toFixed(2)} in store reward points` : 'Select standard shipping or free store pickup',
        `Complete checkout to secure final price of $${finalPrice.toFixed(2)}`
      ];

  return (
    <div 
      id="deal-details-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="deal-details-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#121624] border border-[#222b3e] rounded-2xl p-5 sm:p-6 shadow-2xl my-6 max-h-[92vh] overflow-y-auto"
      >
        {/* Top Header: Store Info & Close */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#1e2538] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg overflow-hidden bg-[#0d101a] border border-[#222b3e] flex items-center justify-center p-1 shrink-0">
              <img 
                src={deal.storeLogo} 
                alt={deal.storeName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
              />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">{deal.storeName}</h2>
              <span className="text-xs text-slate-400">{deal.storeDomain}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleShare}
              title="Share deal link"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              id="btn-close-deal-details"
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Product Title & Short Description */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-1.5">
            {deal.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {deal.description}
          </p>
        </div>

        {/* Price & Savings Summary Box */}
        <div className="mb-5 p-4 rounded-xl bg-[#171d2e] border border-[#232c42]">
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Current Price
              </span>
              <span className="text-lg sm:text-xl font-black text-white">
                ${deal.currentPrice.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
                Original Price
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-400 line-through">
                {originalPrice ? `$${originalPrice.toFixed(2)}` : '—'}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block mb-1">
                Total Savings
              </span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">
                {savings > 0 ? `$${savings.toFixed(2)}` : 'Verified'}
              </span>
            </div>
          </div>
        </div>

        {/* HOW TO GET THIS PRICE */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              How to Get This Price
            </h3>
            {deal.code && (
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Code: <strong className="font-mono text-white">{deal.code}</strong></span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div 
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#141926] border border-[#202738]"
              >
                <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="text-xs sm:text-sm text-slate-200 leading-snug">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FINAL PRICE Summary Banner */}
        <div className="mb-5 p-4 rounded-xl bg-[#101524] border border-blue-500/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider block">
              Final Price
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">
              ${finalPrice.toFixed(2)}
            </span>
          </div>

          {savings > 0 && (
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Savings
              </span>
              <span className="text-lg font-black text-emerald-400">
                ${savings.toFixed(2)} ({deal.estimatedSavingsPercent ?? Math.round((savings / (originalPrice || finalPrice + savings)) * 100)}% off)
              </span>
            </div>
          )}
        </div>

        {/* Primary Action Button */}
        <a
          id="btn-modal-open-store-deal"
          href={deal.directUrl || deal.affiliateUrl || `https://${deal.storeDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-600/20 mb-4"
        >
          <span>OPEN DEAL AT {deal.storeName.toUpperCase()}</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Feedback & Voting Footer */}
        <div className="pt-3 border-t border-[#1e2538] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Does this work?</span>
            <button
              type="button"
              onClick={() => handleVoteAction('works')}
              disabled={userVoted !== null}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-colors ${
                userVoted === 'works' 
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                  : 'bg-[#141926] border-[#222b3e] hover:text-white'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Works</span>
            </button>
            <button
              type="button"
              onClick={() => handleVoteAction('doesnt_work')}
              disabled={userVoted !== null}
              className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] transition-colors ${
                userVoted === 'doesnt_work' 
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                  : 'bg-[#141926] border-[#222b3e] hover:text-white'
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
              <span>Expired</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowReport(!showReport)}
            className="text-slate-400 hover:text-slate-300 underline text-[11px]"
          >
            Report Issue
          </button>
        </div>

        {/* Report Form (collapsible) */}
        {showReport && (
          <form onSubmit={handleReportSubmit} className="mt-3 p-3 rounded-lg bg-[#141926] border border-[#222b3e] text-xs">
            {reportSubmitted ? (
              <div className="text-emerald-400 font-semibold py-1 text-center">
                Thank you. Our deal verification team will review this.
              </div>
            ) : (
              <>
                <label className="block text-slate-300 mb-1 font-medium">What's wrong with this deal?</label>
                <input
                  type="text"
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="e.g., Promo code expired, out of stock, price changed..."
                  className="w-full px-3 py-1.5 rounded-md bg-[#0e121c] border border-[#222b3e] text-white text-xs mb-2 focus:outline-none focus:border-blue-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowReport(false)}
                    className="px-2.5 py-1 rounded text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                  >
                    Submit Report
                  </button>
                </div>
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
