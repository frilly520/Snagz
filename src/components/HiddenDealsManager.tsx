import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RotateCcw, Trash2, CheckCircle2, ShieldAlert, Sparkles, Store } from 'lucide-react';
import { HiddenDealItem } from '../types';
import { hiddenDealsManager } from '../services/hiddenDealsManager';

interface HiddenDealsManagerProps {
  onDealRestored?: (dealId: string) => void;
  onAllRestored?: () => void;
}

export const HiddenDealsManager: React.FC<HiddenDealsManagerProps> = ({
  onDealRestored,
  onAllRestored
}) => {
  const [hiddenDeals, setHiddenDeals] = useState<HiddenDealItem[]>([]);
  const [restoredId, setRestoredId] = useState<string | null>(null);
  const [confirmRestoreAll, setConfirmRestoreAll] = useState<boolean>(false);

  useEffect(() => {
    // Load initial hidden deals
    setHiddenDeals(hiddenDealsManager.getHiddenDeals());

    // Subscribe to changes
    const unsubscribe = hiddenDealsManager.subscribe(() => {
      setHiddenDeals(hiddenDealsManager.getHiddenDeals());
    });

    return () => unsubscribe();
  }, []);

  const handleRestoreSingle = async (dealId: string) => {
    await hiddenDealsManager.restoreDeal(dealId);
    setRestoredId(dealId);
    setTimeout(() => {
      setRestoredId(null);
    }, 2000);
    if (onDealRestored) onDealRestored(dealId);
  };

  const handleRestoreAll = async () => {
    await hiddenDealsManager.restoreAll();
    setConfirmRestoreAll(false);
    if (onAllRestored) onAllRestored();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222b3e]">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-blue-400" />
            <span>Hidden Deals</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#1a233b] text-blue-300 border border-[#2b395e]">
              {hiddenDeals.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Deals you chose to remove from your feeds. You can restore them anytime.
          </p>
        </div>

        {hiddenDeals.length > 0 && (
          <div>
            {!confirmRestoreAll ? (
              <button
                type="button"
                onClick={() => setConfirmRestoreAll(true)}
                className="px-3 py-1.5 rounded-xl border border-[#222b3e] bg-[#141926] hover:bg-[#1a2133] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
                <span>Restore All Deals</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreAll}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors"
                >
                  Yes, Restore All
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRestoreAll(false)}
                  className="px-2.5 py-1.5 rounded-xl bg-[#141926] hover:bg-[#1a2133] text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {hiddenDeals.length === 0 ? (
        <div className="p-8 text-center rounded-xl bg-[#0b0e17] border border-[#1f2638]">
          <Eye className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <div className="text-xs font-bold text-white mb-1">No hidden deals</div>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When you see a deal you aren’t interested in, tap the three dots on the card and choose "Hide this deal".
          </p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {hiddenDeals.map((item) => {
            const formattedDate = new Date(item.hiddenAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={item.dealId}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#0d121f] border border-[#1f2638] hover:border-[#2b354d] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {item.storeLogo ? (
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#0a0d14] border border-[#222b3e] p-0.5 shrink-0 flex items-center justify-center">
                      <img
                        src={item.storeLogo}
                        alt={item.storeName || 'Store'}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#141b2c] flex items-center justify-center text-slate-400 shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                      {item.dealTitle || 'Deal'}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="font-semibold text-slate-300">{item.storeName}</span>
                      {item.price !== undefined && (
                        <span>• ${item.price.toFixed(2)}</span>
                      )}
                      <span>• Hidden {formattedDate}</span>
                    </div>
                    {item.reason && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-[#161d2d] text-slate-400 text-[10px] border border-[#26314a]">
                        Reason: {item.reason}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestoreSingle(item.dealId)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 border border-blue-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restore</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
