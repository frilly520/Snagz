import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Gift, 
  ExternalLink,
  Copy,
  Check,
  MoreVertical,
  EyeOff,
  Bookmark,
  Flag
} from 'lucide-react';
import { Deal, SupportedCurrency } from '../types';

interface CouponCardProps {
  deal: Deal;
  isSaved?: boolean;
  currency?: SupportedCurrency;
  onToggleSave?: (dealId: string) => void;
  onOpenDetails?: (deal: Deal) => void;
  onOpenAddToList?: (deal: Deal) => void;
  onVote?: (dealId: string, type: 'works' | 'doesnt_work') => void;
  onOpenWhyNotFree?: (deal: Deal) => void;
  onTriggerConfirmation?: (deal: Deal) => void;
  onHideDeal?: (deal: Deal) => void;
  onReportDeal?: (deal: Deal) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  deal,
  isSaved = false,
  currency = 'USD',
  onToggleSave,
  onOpenDetails,
  onTriggerConfirmation,
  onHideDeal,
  onReportDeal
}) => {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleCardClick = () => {
    if (onOpenDetails) onOpenDetails(deal);
  };

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code);
    setCopied(true);
    if (onTriggerConfirmation) onTriggerConfirmation(deal);
    setTimeout(() => setCopied(false), 2000);
  };

  // Price calculations
  const displayPrice = deal.estimatedFinalPrice !== undefined && deal.estimatedFinalPrice < deal.currentPrice 
    ? deal.estimatedFinalPrice 
    : deal.currentPrice;
  const originalPrice = deal.originalPrice;
  const savingsAmount = deal.estimatedSavingsDollar || (originalPrice && originalPrice > displayPrice ? originalPrice - displayPrice : 0);

  return (
    <div 
      id={`deal-card-${deal.id}`}
      onClick={handleCardClick}
      className="group flex flex-col justify-between bg-[#121624] hover:bg-[#161c2e] border border-[#222b3e] hover:border-[#33415c] rounded-2xl p-5 transition-all duration-150 cursor-pointer shadow-sm relative"
    >
      <div>
        {/* Top Header: Store Info & Options Menu */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#0a0d14] border border-[#222b3e] flex items-center justify-center p-1 shrink-0">
              <img 
                src={deal.storeLogo} 
                alt={deal.storeName} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate block">
                {deal.storeName}
              </span>
              {deal.verification?.status === 'VERIFIED_ACTIVE' && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-blue-400 font-semibold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Menu (Save & Three-Dot Options) */}
          <div className="flex items-center gap-1 shrink-0" ref={menuRef}>
            {/* Quick Heart Save */}
            <button
              id={`btn-save-${deal.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onToggleSave) onToggleSave(deal.id);
              }}
              title={isSaved ? 'Remove from Saved' : 'Save Deal'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSaved 
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30' 
                  : 'bg-[#182032] text-slate-400 hover:text-white border-[#222b3e] hover:border-slate-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
            </button>

            {/* Three-Dot Options Button */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                aria-label="Deal options"
                className="p-1.5 rounded-lg bg-[#182032] hover:bg-[#222d46] border border-[#222b3e] hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Options Dropdown */}
              {showMenu && (
                <div 
                  className="absolute right-0 top-full mt-1.5 w-44 rounded-xl bg-[#0f1422] border border-[#222b3e] shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      if (onHideDeal) onHideDeal(deal);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1a2133] flex items-center gap-2 transition-colors"
                  >
                    <EyeOff className="w-4 h-4 text-amber-400" />
                    <span>Hide this deal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      if (onToggleSave) onToggleSave(deal.id);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#1a2133] flex items-center gap-2 transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-blue-400" />
                    <span>{isSaved ? 'Remove from Saved' : 'Save deal'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      if (onReportDeal) onReportDeal(deal);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-[#1a2133] flex items-center gap-2 transition-colors"
                  >
                    <Flag className="w-4 h-4 text-rose-400" />
                    <span>Report deal</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Name (Larger & Prominent) */}
        <h3 className="font-bold text-white text-lg leading-snug group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {deal.title}
        </h3>

        {/* One Short Clean Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {deal.description}
        </p>
      </div>

      {/* Bottom Pricing & Primary CTA */}
      <div className="pt-4 border-t border-[#1f2638] mt-2">
        <div className="flex items-baseline justify-between gap-2 mb-3.5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && originalPrice > displayPrice && (
              <span className="text-sm text-slate-400 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          {savingsAmount > 0 ? (
            <span className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-lg">
              SAVE {formatPrice(savingsAmount)}
            </span>
          ) : deal.discountPercent ? (
            <span className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/25 px-2.5 py-1 rounded-lg">
              {deal.discountPercent}% OFF
            </span>
          ) : null}
        </div>

        {/* Action Button: Copy Code + View Deal */}
        <div className="flex items-center gap-2">
          {deal.code ? (
            <button
              type="button"
              onClick={handleCopyCode}
              className="px-3 py-2.5 rounded-xl bg-[#182032] hover:bg-[#222d46] border border-[#2c3750] text-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors"
              title={`Copy code: ${deal.code}`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-blue-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="font-mono">{copied ? 'Copied' : deal.code}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold tracking-wide transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/20"
          >
            <span>VIEW DEAL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

