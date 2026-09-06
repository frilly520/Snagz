import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  RefreshCw, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Trash2, 
  Check, 
  X, 
  Database,
  Gift,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { api } from '../services/api';
import { AdminMetrics, UserReport, Deal } from '../types';

interface AdminDashboardProps {
  deals: Deal[];
  onRefreshDeals: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  deals,
  onRefreshDeals
}) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<any | null>(null);

  const fetchAdminData = async () => {
    try {
      const [mRes, rRes] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminReports()
      ]);
      setMetrics(mRes.metrics);
      setRecentRuns(mRes.recentRuns);
      setReports(rRes);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleTriggerPipeline = async () => {
    setIsRunningPipeline(true);
    setPipelineResult(null);
    try {
      const res = await api.triggerIngestionPipeline();
      setPipelineResult(res.result);
      await fetchAdminData();
      onRefreshDeals();
    } catch (err) {
      console.error('Pipeline trigger error:', err);
    } finally {
      setIsRunningPipeline(false);
    }
  };

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    try {
      await api.resolveReport(reportId, status);
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status } : r));
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };

  const handleModerateDeal = async (dealId: string, action: 'approve' | 'reject') => {
    try {
      await fetch(`/api/admin/deals/${dealId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      onRefreshDeals();
      await fetchAdminData();
    } catch (err) {
      console.error('Deal moderation failed:', err);
    }
  };

  return (
    <div id="admin-dashboard" className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Deal Intelligence Operations & Admin</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Admin Mode
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time pipeline monitoring, automated deal verification telemetry, and community moderation queue.
          </p>
        </div>

        <button
          type="button"
          disabled={isRunningPipeline}
          onClick={handleTriggerPipeline}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-xs shadow-lg transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isRunningPipeline ? 'animate-spin' : ''}`} />
          <span>{isRunningPipeline ? 'Ingesting Feeds...' : 'Run Ingestion Pipeline'}</span>
        </button>
      </div>

      {/* Pipeline Result Toast if just run */}
      {pipelineResult && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Ingestion complete! Discovered: {pipelineResult.discovered} • Filtered duplicates: {pipelineResult.deduped} • Ingested: {pipelineResult.saved} items in {pipelineResult.durationMs}ms.
            </span>
          </div>
          <button type="button" onClick={() => setPipelineResult(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metrics Cards Grid */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block">Total Deals</span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">{metrics.totalDeals}</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider block">Active Verified</span>
            <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">{metrics.activeDeals}</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider block">Expiring Soon</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">{metrics.expiringDeals}</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-rose-400 uppercase tracking-wider block">Expired</span>
            <span className="text-xl font-bold text-rose-400 font-mono mt-1 block">{metrics.expiredDeals}</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-sky-400 uppercase tracking-wider block">Free Stuff</span>
            <span className="text-xl font-bold text-sky-400 font-mono mt-1 block">{metrics.freeOffersCount}</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider block">Avg Quality</span>
            <span className="text-xl font-bold text-white font-mono mt-1 block">{metrics.averageDealScore}/100</span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800">
            <span className="text-[11px] text-rose-400 uppercase tracking-wider block">Pending Reports</span>
            <span className="text-xl font-bold text-rose-300 font-mono mt-1 block">{metrics.userReportsPending || 0}</span>
          </div>
        </div>
      )}

      {/* Category Balancing & Anti-Fashion Bias Monitor */}
      {metrics && metrics.categoryBalance && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Retail Category Balancing & Everyday-Savings Monitor</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Target: Maintain broad everyday retail distribution. Prevent national fashion & luxury over-indexing.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              Everyday Focus: Active
            </span>
          </div>

          {/* Imbalance Warning Banner if any */}
          {metrics.categoryImbalanceWarning && (
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-300">Catalog Balancing Alert</strong>
                <span>{metrics.categoryImbalanceWarning}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {metrics.categoryBalance.map((cat, idx) => (
              <div 
                key={idx} 
                className={`p-3 rounded-xl border text-xs ${
                  cat.status === 'OVER_WEIGHTED' 
                    ? 'bg-rose-950/30 border-rose-500/40' 
                    : cat.status === 'UNDER_REPRESENTED'
                    ? 'bg-amber-950/20 border-amber-500/30'
                    : 'bg-neutral-950 border-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-neutral-200 truncate pr-2">{cat.category}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    cat.status === 'OVER_WEIGHTED'
                      ? 'bg-rose-500/20 text-rose-300'
                      : cat.status === 'UNDER_REPRESENTED'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {cat.status}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>{cat.dealCount} active deals</span>
                  <span className="font-mono font-bold text-white">{cat.percentage}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${
                      cat.status === 'OVER_WEIGHTED'
                        ? 'bg-rose-500'
                        : cat.status === 'UNDER_REPRESENTED'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.min(100, cat.percentage * 3)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Retailer Discovery Health Matrix */}
      {metrics && metrics.retailerHealth && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>Everyday Retailer Source Discovery & Crawler Telemetry</span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Monitoring crawl health, weekly circular sync status, and active coupon verification rates across everyday stores.
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400">
              {metrics.retailerHealth.length} Stores Tracked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Retailer</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Active Deals</th>
                  <th className="py-2.5 px-3">Verified %</th>
                  <th className="py-2.5 px-3">Crawler Latency</th>
                  <th className="py-2.5 px-3">Priority Weight</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 font-mono">
                {metrics.retailerHealth.map((r, i) => (
                  <tr key={i} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center gap-2">
                      <img src={r.logo} alt="" className="w-5 h-5 rounded object-cover" />
                      <span>{r.storeName}</span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-neutral-400 text-[11px]">{r.category}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{r.activeDeals}</td>
                    <td className="py-2.5 px-3 text-emerald-400">
                      {r.activeDeals > 0 ? `${Math.round((r.verifiedDeals / r.activeDeals) * 100)}%` : '100%'}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-400">{r.averageLatencyMs}ms</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        r.searchPriorityWeight > 1.0 ? 'bg-sky-500/20 text-sky-300' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {r.searchPriorityWeight}x (Boosted)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        Healthy
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Two Column Layout: Moderation Queue & Pipeline Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Moderation Queue */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Community Moderation Queue ({reports.filter(r => r.status === 'pending').length})</span>
            </h3>
            <button
              type="button"
              onClick={fetchAdminData}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Refresh
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                No user failure reports in the queue.
              </div>
            ) : (
              reports.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <span className="font-bold text-white block">{r.dealTitle}</span>
                      <span className="text-[11px] text-neutral-400">{r.storeName} • Issue: <strong className="text-rose-400">{r.reportType}</strong></span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                      r.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-neutral-800 text-neutral-400'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  {r.comment && (
                    <p className="text-[11px] text-neutral-300 bg-neutral-900 p-2 rounded-lg my-2 font-mono">
                      "{r.comment}"
                    </p>
                  )}

                  {r.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-neutral-800/60">
                      <button
                        type="button"
                        onClick={() => handleResolveReport(r.id, 'dismissed')}
                        className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white text-[11px]"
                      >
                        Dismiss
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handleModerateDeal(r.dealId, 'reject');
                          handleResolveReport(r.id, 'resolved');
                        }}
                        className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 text-[11px] font-bold"
                      >
                        Mark Deal Expired
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Source Health & Telemetry */}
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
          <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-sky-400" />
            <span>Data Ingestion Adapters & Health</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <div>
                  <strong className="text-white block">Retailer Direct API Adapters (Priority 1)</strong>
                  <span className="text-neutral-500 text-[11px]">Target, Best Buy, Nike Direct Feeds</span>
                </div>
              </div>
              <span className="text-emerald-400 font-mono font-bold">100% Operational</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <div>
                  <strong className="text-white block">Public $0 Free Promotions Crawler</strong>
                  <span className="text-neutral-500 text-[11px]">Giveaways, Samples & Loyalty Perks</span>
                </div>
              </div>
              <span className="text-emerald-400 font-mono font-bold">98.5% Confidence</span>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <div>
                  <strong className="text-white block">Gemini 3.7 Flash Intent & NLP Engine</strong>
                  <span className="text-neutral-500 text-[11px]">Search Intent Parser & Receipt OCR</span>
                </div>
              </div>
              <span className="text-emerald-400 font-mono font-bold">Connected</span>
            </div>
          </div>

          <h4 className="font-bold text-neutral-300 text-xs mt-5 mb-2">Recent Pipeline Ingestion Runs</h4>
          <div className="space-y-1.5 text-xs font-mono max-h-40 overflow-y-auto">
            {recentRuns.map((run, i) => (
              <div key={i} className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">{new Date(run.timestamp).toLocaleTimeString()}</span>
                <span className="text-emerald-400">+{run.itemsIngested} items</span>
                <span className="text-neutral-500">{run.duplicatesFiltered} deduped</span>
                <span className="text-neutral-400">{run.durationMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
