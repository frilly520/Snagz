import React, { useState, useEffect } from 'react';
import { EyeOff, RotateCcw, X, Check } from 'lucide-react';
import { Deal, HideDealReason } from '../types';

interface DealHiddenToastProps {
  hiddenDeal: Deal | null;
  onUndo: (deal: Deal) => void;
  onSelectReason: (dealId: string, reason: HideDealReason) => void;
  onDismiss: () => void;
}

const REASONS: HideDealReason[] = [
  'Not interested',
  'Wrong store',
  'Already bought it',
  'Not relevant',
  'Other'
];

export const DealHiddenToast: React.FC<DealHiddenToastProps> = ({
  hiddenDeal,
  onUndo,
  onSelectReason,
  onDismiss
}) => {
  const [selectedReason, setSelectedReason] = useState<HideDealReason | null>(null);

  useEffect(() => {
    if (!hiddenDeal) return;
    setSelectedReason(null);

    // Auto-dismiss after 6 seconds if no interaction
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);

    return () => clearTimeout(timer);
  }, [hiddenDeal]);

  if (!hiddenDeal) return null;

  const handleReasonClick = (reason: HideDealReason) => {
    setSelectedReason(reason);
    onSelectReason(hiddenDeal.id, reason);
    setTimeout(() => {
      onDismiss();
    }, 1200);
  };

  return (
    <div 
      id="deal-hidden-toast"
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md bg-[#0f1422]/95 backdrop-blur-md border border-[#222b3e] shadow-2xl rounded-2xl p-3.5 sm:p-4 text-white animate-in slide-in-from-bottom-5 duration-200"
    >
      {/* Top row: Status message & Undo button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <EyeOff className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold block text-white">Deal hidden from feeds</span>
            <span className="text-[11px] text-slate-400 truncate block">
              {hiddenDeal.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onUndo(hiddenDeal)}
            className="px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-400 hover:text-blue-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#1a2133] transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Reason Selector */}
      <div className="mt-3 pt-2.5 border-t border-[#1f2638]">
        <div className="text-[11px] text-slate-400 mb-1.5 flex items-center justify-between">
          <span>Why did you hide this? <span className="text-slate-500">(Optional)</span></span>
          {selectedReason && (
            <span className="text-emerald-400 font-medium flex items-center gap-1 text-[10px]">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <button
                key={reason}
                type="button"
                onClick={() => handleReasonClick(reason)}
                className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 font-bold'
                    : 'bg-[#141926] hover:bg-[#1b2336] text-slate-300 border-[#222b3e] hover:border-slate-600 font-medium'
                }`}
              >
                {reason}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
