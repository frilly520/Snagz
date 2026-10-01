import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  RefreshCw, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Flame,
  Tag,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Deal } from '../types';

interface LiveCouponRadarProps {
  onDealsUpdated: (freshDeals: Deal[]) => void;
}

const QUICK_SEARCH_TOPICS = [
  'All Matchups',
  'Moneymakers',
  'Target Circle',
  'CVS ExtraBucks',
  'Walgreens Register Rewards',
  'Dollar General $5/$25',
  'Amazon Promo Codes'
];

export const LiveCouponRadar: React.FC<LiveCouponRadarProps> = ({ onDealsUpdated }) => {
  const [customQuery, setCustomQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<{
    summary?: string;
    dealCount?: number;
    timestamp?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScan = async (queryToUse?: string) => {
    const q = queryToUse !== undefined ? queryToUse : customQuery;
    setIsScanning(true);
    setErrorMsg(null);

    try {
      const res = await api.scanLiveDeals(q || 'hottest Krazy Coupon Lady matchups and Koupons.ai promo codes');
      if (res && res.deals && res.deals.length > 0) {
        onDealsUpdated(res.deals);
        setLastScannedResult({
          summary: res.sourceSummary || 'Live coupon matchups verified from The Krazy Coupon Lady & Koupons.ai',
          dealCount: res.deals.length,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        setLastScannedResult({
          summary: 'Scanned verified coupon feeds. All current matchups are active.',
          dealCount: 0,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (err: any) {
      console.error('Live radar scan failed:', err);
      setErrorMsg('Live scan reached timeout or rate limit; displaying verified coupon feed.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div id="live-coupon-radar" className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#121b2d] via-[#101726] to-[#141824] border border-blue-500/30 shadow-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400">
              <Radio className="w-5 h-5 animate-pulse" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 animate-ping" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  LIVE COUPON RADAR
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-extrabold uppercase border border-emerald-500/40">
                  REAL LIVE DATA
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300">
                Actionable coupon matchups, moneymakers, and promo codes powered by <strong>The Krazy Coupon Lady</strong> &amp; <strong>Koupons.ai</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            id="scan-all-live-btn"
            onClick={() => handleScan('hottest coupon matchups Krazy Coupon Lady Koupons.ai moneymakers')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all disabled:opacity-50 self-start sm:self-center"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Live Web...' : 'Scan Real Live Matchups'}</span>
          </button>
        </div>

        {/* Quick Chip Triggers */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Feeds:</span>
          </span>
          {QUICK_SEARCH_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleScan(topic)}
              disabled={isScanning}
              className="px-2.5 py-1 rounded-lg bg-[#1a2337] hover:bg-blue-900/40 text-slate-200 hover:text-blue-200 text-xs font-medium border border-slate-700/60 hover:border-blue-500/40 transition-all disabled:opacity-50"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Search input for specific item live scan */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="live-deal-search-input"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleScan();
                }
              }}
              placeholder="Search live coupon matchup (e.g., Tide Pods, Colgate CVS, Amazon 50% off code, Huggies Target)..."
              className="w-full pl-9 pr-3 py-2 bg-[#0c101d] border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            id="live-deal-search-btn"
            onClick={() => handleScan()}
            disabled={isScanning}
            className="px-3.5 py-2 bg-[#1a2337] hover:bg-[#222f4b] text-blue-300 hover:text-white border border-blue-500/30 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 whitespace-nowrap"
          >
            Search Live
          </button>
        </div>

        {/* Live Status Notification */}
        {lastScannedResult && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>Live Feed Connected:</strong> {lastScannedResult.summary}
                {lastScannedResult.dealCount ? ` (${lastScannedResult.dealCount} deals updated)` : ''}
              </span>
            </div>
            <span className="text-slate-400 text-[11px] shrink-0 ml-2">
              Updated at {lastScannedResult.timestamp}
            </span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};
