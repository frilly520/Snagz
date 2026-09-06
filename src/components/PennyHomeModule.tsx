import React, { useState, useEffect } from 'react';
import { 
  Barcode, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  Tag
} from 'lucide-react';
import { PennyItem } from '../types';
import { api } from '../services/api';

interface PennyHomeModuleProps {
  onViewAllPennyFinds: () => void;
}

export const PennyHomeModule: React.FC<PennyHomeModuleProps> = ({
  onViewAllPennyFinds
}) => {
  const [items, setItems] = useState<PennyItem[]>([]);
  const [copiedUpcId, setCopiedUpcId] = useState<string | null>(null);
  const [count, setCount] = useState<number>(12);

  useEffect(() => {
    async function loadTopPennyItems() {
      try {
        const res = await api.getPennyItems({
          status: 'CONFIRMED_PENNY',
          sort: 'highest_confidence',
          activeOnly: true
        });
        if (res && res.items && res.items.length > 0) {
          setItems(res.items.slice(0, 3));
          setCount(res.count || 12);
        }
      } catch (err) {
        console.error('Failed to load top penny items for home module:', err);
      }
    }
    loadTopPennyItems();
  }, []);

  const handleCopyUpc = (item: PennyItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.upc);
    setCopiedUpcId(item.id);
    setTimeout(() => setCopiedUpcId(null), 2000);
  };

  return (
    <div 
      id="homepage-penny-finds-module"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 border border-neutral-800/90 p-4 sm:p-5 shadow-lg"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-neutral-950 tracking-wider">
              1¢ PENNY FINDS
            </span>
            <span className="text-[11px] font-bold text-amber-300 font-mono">
              {count} CURRENT PENNY FINDS
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>Last updated moments ago • Dollar General Verified Point-of-Sale Markdowns</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewAllPennyFinds}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors group shrink-0"
        >
          <span>VIEW ALL PENNY FINDS</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Quick 3-card preview row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={onViewAllPennyFinds}
            className="group/card cursor-pointer bg-neutral-950/70 hover:bg-neutral-950 border border-neutral-800/80 hover:border-amber-500/40 rounded-xl p-3 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {item.brand}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  CONFIRMED 1¢
                </span>
              </div>

              <div className="flex gap-2.5 items-start mb-2">
                <div className="w-12 h-12 rounded-lg bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover/card:text-amber-300 transition-colors">
                    {item.productName}
                  </h4>
                  {item.seasonalInfo && (
                    <span className="text-[10px] text-amber-400/90 block truncate mt-0.5">
                      {item.seasonalInfo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-amber-400 font-mono">$0.01</span>
                <span className="text-[10px] text-neutral-500 line-through font-mono">${item.previousPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={(e) => handleCopyUpc(item, e)}
                title="Copy UPC Barcode"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 text-[10px] font-semibold text-neutral-300 hover:text-white border border-neutral-800 transition-colors"
              >
                {copiedUpcId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Barcode className="w-3 h-3 text-neutral-400" />
                    <span>UPC</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
