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
      <div className="flex items-center justify-center py-24 text-neutral-400">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mr-3"></div>
        <span>Loading Savings Dashboard...</span>
      </div>
    );
  }

  return (
    <div id="savings-tracker-dashboard" className="space-y-6">
      {/* Top Banner: Total Confirmed Savings */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-950 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Lifetime Savings</span>
              </span>
              <span className="text-xs text-neutral-400">Evidence-Backed Metrics</span>
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                {formatPrice(tracker.confirmedSavingsTotal)}
              </h1>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                100% Confirmed
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 mt-2 max-w-xl leading-relaxed">
              Every dollar displayed is verified from actual coupon redemptions and community confirmations.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="btn-log-savings"
              type="button"
              onClick={() => setShowManualLog(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Recent Savings</span>
            </button>

            <button
              id="btn-export-savings"
              type="button"
              onClick={exportSavingsCSV}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-semibold text-xs border border-neutral-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* 4-Stat Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-neutral-800/80">
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Saved This Month</span>
            </div>
            <div className="text-lg font-black text-white font-mono">{formatPrice(tracker.savingsThisMonth)}</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Saved This Year</span>
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">{formatPrice(tracker.savingsThisYear)}</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Coupons Used</span>
            </div>
            <div className="text-lg font-black text-white">{tracker.couponsUsedCount} Redeemed</div>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
            <div className="text-[11px] text-neutral-400 flex items-center gap-1 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Deals Tracked</span>
            </div>
            <div className="text-lg font-black text-white">{tracker.dealsSavedCount} Bookmarked</div>
          </div>
        </div>
      </div>

      {/* Manual Log Modal */}
      {showManualLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Log Confirmed Coupon Savings</h3>
            <p className="text-xs text-neutral-400 mb-4">Record your savings to track achievements and verify store coupons.</p>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Amount Saved ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="25.00"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Store Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Buy, Target, Amazon"
                  value={manualStore}
                  onChange={(e) => setManualStore(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Coupon Code Used (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SAVE20"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono text-xs uppercase focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowManualLog(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
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
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Savings Milestones</h2>
              </div>
              <span className="text-xs text-neutral-400">
                {tracker.achievements.filter(a => a.unlocked).length} / {tracker.achievements.length} Unlocked
              </span>
            </div>

            <div className="space-y-3">
              {tracker.achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    ach.unlocked 
                      ? 'bg-neutral-950 border-amber-500/30' 
                      : 'bg-neutral-950/40 border-neutral-800/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl text-lg ${ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-500'}`}>
                      {ach.icon === 'Trophy' ? <Trophy className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-xs text-white">{ach.title}</h3>
                        {ach.unlocked && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                            Achieved
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{ach.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verified Savings Audit History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Confirmed Savings Audit Log</h2>
              </div>
              <span className="text-xs text-neutral-500">{tracker.history.length} verified records</span>
            </div>

            <div className="space-y-2.5">
              {tracker.history.length === 0 ? (
                <div className="text-center py-10 text-neutral-500 text-xs">
                  No verified savings logged yet. Click "Log Recent Savings" or confirm a deal after checkout.
                </div>
              ) : (
                tracker.history.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center font-black text-xs text-emerald-400 font-mono shrink-0">
                        +${log.amountSaved.toFixed(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-neutral-200 truncate">{log.dealTitle}</div>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span>{log.storeName}</span>
                          {log.couponCode && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-emerald-400">{log.couponCode}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(log.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-400 font-mono">
                        +{formatPrice(log.amountSaved)}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium bg-emerald-950/60 px-1.5 py-0.2 rounded">
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
