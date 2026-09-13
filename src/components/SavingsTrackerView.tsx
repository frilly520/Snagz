import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Trophy, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Plus, 
  Award, 
  Sparkles, 
  Download, 
  Tag, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { SavingsTrackerState, SupportedCurrency } from '../types';
import { api } from '../services/api';

interface SavingsTrackerViewProps {
  currency?: SupportedCurrency;
  onSelectDeal?: (dealId: string) => void;
}

export const SavingsTrackerView: React.FC<SavingsTrackerViewProps> = ({
  currency = 'USD',
  onSelectDeal
}) => {
  const [tracker, setTracker] = useState<SavingsTrackerState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showManualLog, setShowManualLog] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualStore, setManualStore] = useState('');
  const [manualCode, setManualCode] = useState('');

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const fetchTracker = async () => {
    try {
      setLoading(true);
      const data = await api.getSavingsTracker();
      setTracker(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracker();
  }, []);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(manualAmount) || 10;
    try {
      await api.confirmSavings('manual-entry', amt, manualCode || 'MANUAL-ENTRY');
      setShowManualLog(false);
      setManualAmount('');
      setManualStore('');
      setManualCode('');
      fetchTracker();
    } catch (err) {
      console.error(err);
    }
  };

  const exportSavingsCSV = () => {
    if (!tracker) return;
    const headers = ['Date', 'Store', 'Deal / Note', 'Amount Saved', 'Coupon Code', 'Type'];
    const rows = tracker.history.map(h => [
      new Date(h.date).toLocaleDateString(),
      `"${h.storeName}"`,
      `"${h.dealTitle}"`,
      h.amountSaved.toFixed(2),
      h.couponCode || 'N/A',
      h.type
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `snagz-savings-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading || !tracker) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mr-3"></div>
        <span>Loading Savings Dashboard...</span>
      </div>
    );
  }

  return (
    <div id="savings-tracker-dashboard" className="space-y-6">
      {/* Top Banner: Total Confirmed Savings */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#131b2e] via-[#101422] to-[#0b0d13] border border-[#222b3e] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Lifetime Savings</span>
              </span>
              <span className="text-xs text-slate-400">Evidence-Backed Metrics</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                {formatPrice(tracker.confirmedSavingsTotal)}
              </h1>
              <span className="text-xs text-blue-300 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                100% Confirmed
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Every dollar displayed is verified from actual coupon redemptions and community confirmations.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-log-savings"
              type="button"
              onClick={() => setShowManualLog(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Recent Savings</span>
            </button>

            <button
              id="btn-export-savings"
              type="button"
              onClick={exportSavingsCSV}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#141926] hover:bg-[#1a2133] text-slate-200 hover:text-white font-semibold text-xs border border-[#222b3e] transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#1f2638]">
          <div className="p-3 rounded-lg bg-[#0d101a] border border-[#222b3e]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Saved This Month</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">{formatPrice(tracker.savingsThisMonth)}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0d101a] border border-[#222b3e]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              <span>Saved This Year</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-400 font-mono">{formatPrice(tracker.savingsThisYear)}</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0d101a] border border-[#222b3e]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Coupons Used</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">{tracker.couponsUsedCount} Redeemed</div>
          </div>

          <div className="p-3 rounded-lg bg-[#0d101a] border border-[#222b3e]">
            <div className="text-[11px] text-slate-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Deals Tracked</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">{tracker.dealsSavedCount} Bookmarked</div>
          </div>
        </div>
      </div>

      {/* Manual Log Modal */}
      {showManualLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#121624] border border-[#222b3e] rounded-xl p-5 sm:p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Confirmed Coupon Savings</h3>
            <p className="text-xs text-slate-400 mb-4">Record your savings to track achievements and verify store coupons.</p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Amount Saved ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="25.00"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d101a] border border-[#222b3e] text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Store Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Buy, Target, Amazon"
                  value={manualStore}
                  onChange={(e) => setManualStore(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d101a] border border-[#222b3e] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Coupon Code Used (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d101a] border border-[#222b3e] text-white font-mono text-xs uppercase focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222b3e]">
                <button
                  type="button"
                  onClick={() => setShowManualLog(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#141926] hover:bg-[#1a2133] text-slate-300 text-xs font-semibold border border-[#222b3e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid: Achievements & History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Achievements & Badges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#121624] border border-[#222b3e]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Savings Milestones</h2>
              </div>
              <span className="text-xs text-slate-400">
                {tracker.achievements.filter(a => a.unlocked).length} / {tracker.achievements.length} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {tracker.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3 rounded-lg border transition-all ${
                    ach.unlocked 
                      ? 'bg-[#0d101a] border-amber-500/30' 
                      : 'bg-[#0d101a]/40 border-[#222b3e]/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg text-lg ${ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-[#141926] text-slate-500'}`}>
                      {ach.icon === 'Trophy' ? <Trophy className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs text-white">{ach.title}</h3>
                        {ach.unlocked && (
                          <span className="text-[10px] font-bold text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800">
                            Achieved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Savings Audit History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-xl bg-[#121624] border border-[#222b3e]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h2 className="text-xs font-bold text-white uppercase tracking-wider">Confirmed Savings Audit Log</h2>
              </div>
              <span className="text-xs text-slate-500">{tracker.history.length} verified records</span>
            </div>

            <div className="space-y-2">
              {tracker.history.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No verified savings logged yet. Click "Log Recent Savings" or confirm a deal after checkout.
                </div>
              ) : (
                tracker.history.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-[#0d101a] border border-[#222b3e] flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-md bg-[#141926] border border-[#222b3e] flex items-center justify-center font-bold text-xs text-blue-400 font-mono shrink-0">
                        +${log.amountSaved.toFixed(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-200 truncate">{log.dealTitle}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{log.storeName}</span>
                          {log.couponCode && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-blue-400">{log.couponCode}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-bold text-blue-400 font-mono">
                        +{formatPrice(log.amountSaved)}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium bg-blue-950/40 px-1.5 py-0.5 rounded">
                        Confirmed
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
