import React from 'react';
import { 
  X, 
  Gift, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  Info 
} from 'lucide-react';
import { Deal, WhyNotFreeAnalysis } from '../types';

interface WhyNotFreeModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhyNotFreeModal: React.FC<WhyNotFreeModalProps> = ({
  deal,
  isOpen,
  onClose
}) => {
  if (!isOpen || !deal) return null;

  const analysis: WhyNotFreeAnalysis = deal.whyNotFree || {
    isActuallyFree: deal.freeClassification === '$0_FREE',
    classification: deal.freeClassification,
    headline: deal.freeClassification === '$0_FREE' 
      ? 'VERIFIED 100% $0 FREE — Zero spend or purchase required' 
      : 'CONDITIONAL OFFER — Requires qualifying purchase or subscription',
    requirements: [
      deal.freeRequirementNote || 'Requires meeting terms of promotional offer'
    ],
    creditCardRequired: deal.freeClassification === 'FREE_TRIAL',
    autoRenews: deal.freeClassification === 'FREE_TRIAL',
    explanation: deal.description
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div 
        id="why-not-free-modal"
        className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
      >
        <button
          id="btn-close-why-not-free"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-2 rounded-xl border ${
            analysis.isActuallyFree 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }`}>
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Free-Offer Trust Audit</h2>
            <p className="text-xs text-neutral-400">Deal Intelligence Anti-Gimmick Verification</p>
          </div>
        </div>

        {/* Headline Callout */}
        <div className={`p-3.5 rounded-xl border mb-4 text-xs font-bold leading-snug flex items-start gap-2 ${
          analysis.isActuallyFree 
            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' 
            : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
        }`}>
          {analysis.isActuallyFree ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span>{analysis.headline}</span>
        </div>

        {/* Deal Summary Box */}
        <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 mb-4">
          <div className="font-semibold text-white mb-1">{deal.title}</div>
          <div className="text-neutral-400">{analysis.explanation}</div>
        </div>

        {/* Financial Commitments Grid if not actually free */}
        {!analysis.isActuallyFree && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {analysis.minimumCommitmentDollar !== undefined && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-500 flex items-center gap-1 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Min Commitment</span>
                </div>
                <div className="text-base font-black text-amber-400 font-mono">
                  ${analysis.minimumCommitmentDollar.toFixed(2)}
                </div>
              </div>
            )}

            {analysis.contractTermMonths && (
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800">
                <div className="text-[11px] text-neutral-500 flex items-center gap-1 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Contract Term</span>
                </div>
                <div className="text-base font-black text-sky-400">
                  {analysis.contractTermMonths} Months
                </div>
              </div>
            )}
          </div>
        )}

        {/* Requirements Checklist */}
        <div className="space-y-2 mb-5">
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Mandatory Conditions & Fine Print:
          </div>
          {analysis.requirements.map((req, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300 p-2 rounded-lg bg-neutral-950/60 border border-neutral-800/60">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
              <span>{req}</span>
            </div>
          ))}
        </div>

        {/* Trust Badges Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SNAGZ Zero-Cost Audit</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};
