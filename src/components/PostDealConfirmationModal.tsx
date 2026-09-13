import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  X, 
  DollarSign, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { Deal, SupportedCurrency } from '../types';

interface PostDealConfirmationModalProps {
  deal: Deal | null;
  isOpen: boolean;
  currency?: SupportedCurrency;
  onClose: () => void;
  onConfirmSuccess: (dealId: string, amountSaved: number, code?: string) => void;
  onReportIssue: (dealId: string, issueType: string, comment?: string) => void;
}

export const PostDealConfirmationModal: React.FC<PostDealConfirmationModalProps> = ({
  deal,
  isOpen,
  currency = 'USD',
  onClose,
  onConfirmSuccess,
  onReportIssue
}) => {
  const [step, setStep] = useState<'prompt' | 'amount_input' | 'issue_input' | 'thank_you'>('prompt');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedIssue, setSelectedIssue] = useState<string>('coupon_rejected');
  const [issueComment, setIssueComment] = useState<string>('');
  const [savedAmountLogged, setSavedAmountLogged] = useState<number>(0);

  if (!isOpen || !deal) return null;

  const defaultEstimate = deal.estimatedSavingsDollar || 15;

  const handleYes = () => {
    setStep('amount_input');
  };

  const handleNo = () => {
    setStep('issue_input');
  };

  const handleLogAmount = (amount: number) => {
    setSavedAmountLogged(amount);
    onConfirmSuccess(deal.id, amount, deal.code);
    setStep('thank_you');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customAmount) || defaultEstimate;
    handleLogAmount(val);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReportIssue(deal.id, selectedIssue, issueComment);
    setStep('thank_you');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="post-deal-confirmation-modal"
        className="w-full max-w-md bg-[#0f1422] border border-[#222b3e] rounded-2xl p-5 sm:p-6 shadow-2xl relative"
      >
        <button
          id="btn-close-confirm-modal"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-[#1a2133] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: INITIAL PROMPT */}
        {step === 'prompt' && (
          <div className="text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1">Did this deal work for you?</h2>
            <p className="text-xs text-neutral-400 mb-4 px-4">
              Help keep SNAGZ 100% verified and log your real savings in your personal tracker.
            </p>

            <div className="p-3 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-left mb-5 flex items-center gap-3">
              <img 
                src={deal.storeLogo} 
                alt={deal.storeName} 
                className="w-10 h-10 rounded-lg object-contain bg-[#161d2d] p-1 shrink-0" 
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-neutral-200 truncate">{deal.storeName}</div>
                <div className="text-xs text-blue-400 font-bold">{deal.discountDisplay}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="btn-confirm-yes"
                type="button"
                onClick={handleYes}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-wide shadow-lg shadow-blue-500/20 transition-all"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Yes, it worked!</span>
              </button>

              <button
                id="btn-confirm-no"
                type="button"
                onClick={handleNo}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#141926] hover:bg-[#1f273b] text-neutral-300 hover:text-white font-semibold text-xs border border-[#222b3e] transition-all"
              >
                <ThumbsDown className="w-4 h-4" />
                <span>No, had issue</span>
              </button>
            </div>

            <button
              id="btn-confirm-later"
              type="button"
              onClick={onClose}
              className="mt-3 text-xs text-neutral-500 hover:text-neutral-400 transition-colors"
            >
              Ask me later
            </button>
          </div>
        )}

        {/* STEP 2: SAVINGS AMOUNT INPUT */}
        {step === 'amount_input' && (
          <div className="py-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">What did you save?</h3>
                <p className="text-xs text-neutral-400">Adds directly to your Confirmed Savings Tracker</p>
              </div>
            </div>

            {/* Quick selection chips */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[defaultEstimate, 20, 35, 50, 10, 5].map((amt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLogAmount(amt)}
                  className="p-2.5 rounded-xl bg-[#0b0e17] hover:bg-[#141926] border border-[#222b3e] hover:border-blue-500 text-xs font-mono font-bold text-blue-400 transition-all"
                >
                  ${amt.toFixed(2)}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Or enter exact amount saved:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-neutral-500 font-mono text-sm">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
              >
                Confirm & Log to Savings Tracker
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: ISSUE INPUT */}
        {step === 'issue_input' && (
          <div className="py-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">What happened?</h3>
                <p className="text-xs text-neutral-400">Your feedback updates community data confidence instantly</p>
              </div>
            </div>

            <form onSubmit={handleIssueSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Select Issue Type:</label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-xs text-neutral-200 focus:outline-none focus:border-rose-500"
                >
                  <option value="coupon_rejected">Coupon code was rejected / invalid</option>
                  <option value="expired">Deal or coupon has expired</option>
                  <option value="incorrect_price">Price at checkout was higher than listed</option>
                  <option value="fake_free">Claimed free offer had hidden mandatory fees</option>
                  <option value="location_restricted">Offer not valid at my local store/region</option>
                  <option value="incorrect_terms">Minimum spend or item restrictions not met</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Additional details (optional):</label>
                <textarea
                  rows={2}
                  value={issueComment}
                  onChange={(e) => setIssueComment(e.target.value)}
                  placeholder="e.g. Code expired at midnight, or only worked for new app users..."
                  className="w-full p-2.5 rounded-xl bg-[#0b0e17] border border-[#222b3e] text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all"
              >
                Submit Issue Report
              </button>
            </form>
          </div>
        )}

        {/* STEP 4: THANK YOU */}
        {step === 'thank_you' && (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Thank you!</h3>
            <p className="text-xs text-neutral-400 mb-4">
              {savedAmountLogged > 0
                ? `Logged $${savedAmountLogged.toFixed(2)} in confirmed savings. Your personal tracker and achievements have been updated.`
                : 'Your report has been submitted to the moderation pipeline to protect other shoppers.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-6 rounded-xl bg-[#1a2133] hover:bg-[#252f47] text-white font-bold text-xs transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
