import React, { useState, useEffect } from 'react';
import { 
  Barcode, 
  Check, 
  ArrowRight, 
  Clock 
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
      className="rounded-xl bg-[#121624] border border-[#222b3e] p-4 sm:p-5"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
              <span>🪙 Penny Finds</span>
            </h3>
            <span className="text-[11px] font-bold text-amber-300 font-mono bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded">
              {count} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dollar General & retailer confirmed $0.01 point-of-sale clearance markdowns
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAllPennyFinds}
          className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors shrink-0"
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3-card preview row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={onViewAllPennyFinds}
            className="cursor-pointer bg-[#141926] hover:bg-[#181f30] border border-[#222b3e] hover:border-amber-400/30 rounded-lg p-3 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                  {item.brand}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  1¢ CONFIRMED
                </span>
              </div>

              <div className="flex gap-2.5 items-start mb-2">
                <div className="w-11 h-11 rounded-lg bg-[#0e121c] border border-[#222b3e] overflow-hidden shrink-0">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {item.productName}
                  </h4>
                  {item.seasonalInfo && (
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                      {item.seasonalInfo}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#1f2638] flex items-center justify-between">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-amber-400 font-mono">$0.01</span>
                <span className="text-[11px] text-slate-400 line-through font-mono">${item.previousPrice.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={(e) => handleCopyUpc(item, e)}
                title="Copy UPC Barcode"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1a2133] hover:bg-[#222b3e] text-[10px] font-semibold text-slate-300 hover:text-white border border-[#222b3e] transition-colors"
              >
                {copiedUpcId === item.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Barcode className="w-3 h-3 text-slate-400" />
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
