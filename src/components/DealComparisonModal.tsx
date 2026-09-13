import React from 'react';
import { X, Check, ExternalLink, ShieldCheck, Sparkles, TrendingDown, Layers, ArrowRight, Award } from 'lucide-react';
import { Deal } from '../types';

interface DealComparisonModalProps {
  deals: (Deal & { isBestChoice?: boolean })[];
  onClose: () => void;
  onSelectDeal: (deal: Deal) => void;
}

export const DealComparisonModal: React.FC<DealComparisonModalProps> = ({
  deals,
  onClose,
  onSelectDeal
}) => {
  if (!deals || deals.length === 0) return null;

  return (
    <div 
      id="deal-comparison-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        id="deal-comparison-modal"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-2xl my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-comparison"
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-950 border border-sky-500/30 text-sky-400">
              Side-by-Side Comparison
            </span>
            <span className="text-xs text-neutral-400">Independent mathematical analysis • 0% affiliate ranking bias</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            Comparing {deals.length} Savings Opportunities
          </h2>
        </div>

        {/* Comparison Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(deals.length, 3)} gap-4`}>
          {deals.map((deal, idx) => {
            const isBest = deal.isBestChoice || idx === 0;
            const effPrice = deal.estimatedFinalPrice || deal.currentPrice || 0;
            const regPrice = deal.originalPrice || deal.currentPrice || 0;
            const savings = deal.estimatedSavingsDollar || (regPrice - effPrice);

            return (
              <div 
                key={deal.id}
                className={`relative rounded-2xl p-5 flex flex-col justify-between transition-all ${
                  isBest 
                    ? 'bg-[#0f1422] border-2 border-blue-500/80 shadow-lg shadow-blue-950/40'
                    : 'bg-[#0e121d] border border-[#1e2638]'
                }`}
              >
                {/* Best Choice Badge */}
                {isBest && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1 shadow">
                    <Award className="w-3.5 h-3.5" />
                    <span>Best Deal Overall</span>
                  </div>
                )}

                <div>
                  {/* Retailer Info */}
                  <div className="flex items-center gap-3 mb-3 pt-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#161c2c] border border-[#263147] p-1 shrink-0 flex items-center justify-center">
                      <img 
                        src={deal.storeLogo} 
                        alt={deal.storeName} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{deal.storeName}</h3>
                      <p className="text-xs text-neutral-400">{deal.channel.replace(/_/g, ' ')}</p>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-neutral-200 text-xs line-clamp-2 mb-4 h-8">
                    {deal.title}
                  </h4>

                  {/* Effective Price Callout */}
                  <div className="p-3 rounded-xl bg-[#141a28] border border-[#222b3e] mb-4 text-center">
                    <span className="text-[10px] text-neutral-400 block uppercase font-mono tracking-wider">Effective Net Price</span>
                    <span className={`text-2xl font-black font-mono ${isBest ? 'text-blue-400' : 'text-white'}`}>
                      ${effPrice.toFixed(2)}
                    </span>
                    {savings > 0 && (
                      <span className="text-xs text-blue-400 font-mono block mt-0.5">
                        Save ${savings.toFixed(2)} ({deal.estimatedSavingsPercent || Math.round((savings / regPrice) * 100)}%)
                      </span>
                    )}
                  </div>

                  {/* Feature Breakdown Table */}
                  <div className="space-y-2 text-xs font-mono mb-5 border-t border-[#1e2638] pt-3">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Regular Price:</span>
                      <span className="text-neutral-200">${regPrice.toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Current Price:</span>
                      <span className="text-neutral-200">${(deal.currentPrice || regPrice).toFixed(2)}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Coupon Code:</span>
                      <span className="text-blue-400 font-bold">{deal.code || 'None needed'}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Deal Score:</span>
                      <span className="text-neutral-200 font-bold">{deal.dealScore}/100</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Confidence:</span>
                      <span className="text-sky-400">{deal.dataConfidence}%</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Expires:</span>
                      <span className="text-neutral-300 truncate max-w-[120px]">{deal.expiration.label}</span>
                    </div>

                    <div className="flex items-center justify-between text-neutral-400">
                      <span>12-Mo Record:</span>
                      <span className="text-neutral-300">{deal.priceAnalysis?.verdict?.replace(/_/g, ' ') || 'Fair'}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-[#1e2638]">
                  <button
                    type="button"
                    onClick={() => onSelectDeal(deal)}
                    className="w-full py-2 px-3 rounded-xl bg-[#1a2133] hover:bg-[#232d44] text-neutral-200 font-semibold text-xs transition-colors"
                  >
                    View Breakdown & DNA
                  </button>
                  <a
                    href={deal.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow ${
                      isBest 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white font-black' 
                        : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                    }`}
                  >
                    <span>Get Deal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
