import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  ExternalLink, 
  Heart, 
  Plus, 
  ShieldCheck, 
  Clock, 
  Layers, 
  ThumbsUp, 
  ThumbsDown, 
  TrendingDown, 
  Sparkles,
  Info,
  Gift,
  HelpCircle,
  AlertTriangle,
  Store as StoreIcon,
  Globe,
  Calendar,
  Tag,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Receipt,
  ShoppingBag
} from 'lucide-react';
import { Deal, FreeClassification, VerificationStatus, SupportedCurrency } from '../types';
import { DealBreakdown } from './DealBreakdown';

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
}

export const CouponCard: React.FC<CouponCardProps> = ({
  deal,
  isSaved = false,
  currency = 'USD',
  onToggleSave,
  onOpenDetails,
  onOpenAddToList,
  onVote,
  onOpenWhyNotFree,
  onTriggerConfirmation
}) => {
  const [copied, setCopied] = useState(false);
  const [userVoted, setUserVoted] = useState<'works' | 'doesnt_work' | null>(null);
  const [showRecipe, setShowRecipe] = useState(false);

  const formatPrice = (val: number) => {
    const symbol = currency === 'CAD' ? 'C$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
    return `${symbol}${val.toFixed(2)}`;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!deal.code) return;
    navigator.clipboard.writeText(deal.code);
    setCopied(true);
    if (onTriggerConfirmation) onTriggerConfirmation(deal);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVote = (e: React.MouseEvent, type: 'works' | 'doesnt_work') => {
    e.stopPropagation();
    if (userVoted) return;
    setUserVoted(type);
    if (onVote) onVote(deal.id, type);
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40';
    if (score >= 80) return 'text-sky-400 border-sky-500/30 bg-sky-950/40';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-950/40';
    return 'text-neutral-400 border-neutral-700 bg-neutral-900/50';
  };

  // Verification status display
  const getVerificationBadge = (status: VerificationStatus, confidence: number) => {
    switch (status) {
      case 'VERIFIED_ACTIVE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified Active ({confidence}%)</span>
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-950/60 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Expiring Soon</span>
          </span>
        );
      case 'POSSIBLY_EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-950/60 text-rose-300 border border-rose-500/30">
            <Info className="w-3.5 h-3.5 text-rose-400" />
            <span>Unconfirmed</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>Active ({confidence}%)</span>
          </span>
        );
    }
  };

  // Deal Type badge helper
  const renderDealTypeBadge = () => {
    switch (deal.dealType) {
      case 'WEEKLY_AD_ITEM':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <Calendar className="w-3 h-3" />
            <span>Weekly Ad {deal.weeklyAdInfo?.pageNumber ? `(Page ${deal.weeklyAdInfo.pageNumber})` : 'Circular'}</span>
          </span>
        );
      case 'DIGITAL_COUPON':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <Tag className="w-3 h-3" />
            <span>Digital Coupon</span>
          </span>
        );
      case 'STORE_REWARDS':
      case 'LOYALTY_ONLY':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Gift className="w-3 h-3" />
            <span>{deal.loyaltyProgramName || 'Store Rewards'}</span>
          </span>
        );
      case 'BUY_X_GET_Y':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Layers className="w-3 h-3" />
            <span>BOGO Offer</span>
          </span>
        );
      case 'REBATE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40">
            <DollarSign className="w-3 h-3" />
            <span>Rebate</span>
          </span>
        );
      case 'CLEARANCE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <Sparkles className="w-3 h-3" />
            <span>Clearance</span>
          </span>
        );
      default:
        return null;
    }
  };

  const renderFreeBadge = (freeType: FreeClassification) => {
    if (freeType === 'NOT_FREE') return null;

    let text = '$0 FREE';
    let color = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';

    if (freeType === 'FREE_WITH_PURCHASE') {
      text = 'Free w/ Purchase';
      color = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    } else if (freeType === 'FREE_TRIAL') {
      text = 'Free Trial';
      color = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    } else if (freeType === 'FREE_SAMPLE') {
      text = 'Free Sample';
      color = 'bg-pink-500/20 text-pink-300 border-pink-500/40';
    } else if (freeType === 'FREE_SHIPPING') {
      text = 'Free Shipping';
      color = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    } else if (freeType === 'NEARLY_FREE') {
      text = 'Nearly Free (<$1)';
      color = 'bg-teal-500/20 text-teal-300 border-teal-500/40';
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold border ${color}`}>
        <Gift className="w-3 h-3" />
        {text}
      </span>
    );
  };

  return (
    <div 
      id={`deal-card-${deal.id}`}
      onClick={() => onOpenDetails && onOpenDetails(deal)}
      className="group relative flex flex-col bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 rounded-xl p-4 sm:p-5 transition-all duration-200 shadow-lg hover:shadow-neutral-950/60 cursor-pointer"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Store Logo */}
          <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center p-1 shrink-0">
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
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-sm text-neutral-200 group-hover:text-white">
                {deal.storeName}
              </span>
              <span className="text-xs text-neutral-500">• {deal.storeDomain}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {getVerificationBadge(deal.verification.status, deal.verification.confidenceScore)}
              {renderFreeBadge(deal.freeClassification)}
            </div>
          </div>
        </div>

        {/* Top Right: Scores & Favorite */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Deal Quality Score */}
          <div 
            title={`Deal Quality Score: ${deal.dealScore}/100 (${deal.dealScoreLabel})`}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-bold ${getScoreColor(deal.dealScore)}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: {deal.dealScore}</span>
          </div>

          {/* Save Button */}
          <button
            id={`btn-save-${deal.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onToggleSave) onToggleSave(deal.id);
            }}
            title={isSaved ? 'Remove from Saved' : 'Save Deal'}
            className={`p-2 rounded-lg border transition-colors ${
              isSaved 
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                : 'bg-neutral-800/60 text-neutral-400 hover:text-white border-neutral-700/60 hover:bg-neutral-800'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Outdated Verification Warning Pill */}
      {deal.verification.isOutdatedVerification && (
        <div className="mb-2.5 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Verification may be outdated ({deal.verification.verificationAgeHours}h ago) — verification check running</span>
        </div>
      )}

      {/* Money Maker Banner */}
      {deal.isMoneyMaker && (
        <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-500/50 text-xs flex items-center justify-between">
          <span className="font-bold text-emerald-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>MONEY MAKER</span>
          </span>
          <span className="font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded text-[11px]">
            +${(deal.moneyMakerAmount ?? 0).toFixed(2)} Net Profit
          </span>
        </div>
      )}

      {/* 1¢ Penny Item Banner */}
      {(deal.isPennyDeal || deal.currentPrice === 0.01) && (
        <div className="mb-2.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-950/90 via-yellow-950/80 to-amber-950/90 border border-amber-500/60 text-xs flex items-center justify-between shadow-sm">
          <span className="font-bold text-amber-300 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-[10px] shadow-sm">1¢</span>
            <span>PENNY FIND (Active $0.01)</span>
          </span>
          {deal.upc && (
            <span className="font-mono text-[10px] text-amber-200 bg-amber-900/50 px-2 py-0.5 rounded border border-amber-500/40">
              UPC: {deal.upc}
            </span>
          )}
        </div>
      )}

      {/* Discount Highlight & Deal Title */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <span className="text-lg sm:text-xl font-extrabold text-emerald-400 tracking-tight">
            {deal.discountDisplay}
          </span>
          {deal.originalPrice && deal.estimatedFinalPrice !== undefined && deal.estimatedFinalPrice < deal.originalPrice && (
            <span className="text-xs text-neutral-400 font-mono">
              <span className="line-through text-neutral-500">{formatPrice(deal.originalPrice)}</span>
              {' → '}
              <span className="text-emerald-300 font-bold">{formatPrice(deal.estimatedFinalPrice)}</span>
            </span>
          )}
        </div>

        {/* Out of Pocket vs Effective Net Cost Breakdown Pills */}
        {(deal.outOfPocketPrice !== undefined || deal.savingsRecipe) && (
          <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
            <div className="bg-amber-950/40 border border-amber-500/40 rounded-md px-2 py-1 text-amber-300">
              <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider block">Pay at Register</span>
              <span className="font-extrabold text-xs text-amber-200">
                {formatPrice(deal.outOfPocketPrice ?? deal.savingsRecipe?.outOfPocketToday ?? deal.currentPrice)}
              </span>
            </div>
            <div className="text-neutral-500">→</div>
            <div className={`border rounded-md px-2 py-1 ${
              deal.isMoneyMaker 
                ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-300' 
                : 'bg-indigo-950/40 border-indigo-500/40 text-indigo-300'
            }`}>
              <span className="text-[10px] uppercase font-bold tracking-wider block text-indigo-300">Effective Net</span>
              <span className="font-extrabold text-xs">
                {deal.isMoneyMaker ? `-$${(deal.moneyMakerAmount ?? 0).toFixed(2)}` : formatPrice(deal.estimatedFinalPrice)}
              </span>
            </div>
            {deal.savingsRecipe?.totalRewardsEarned ? (
              <span className="text-[11px] text-purple-400 font-medium self-end pb-1">
                (+${deal.savingsRecipe.totalRewardsEarned.toFixed(2)} Rewards)
              </span>
            ) : null}
          </div>
        )}

        <h3 className="font-semibold text-neutral-100 text-sm sm:text-base leading-snug line-clamp-2">
          {deal.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
          {deal.description}
        </p>
      </div>

      {/* Savings Recipe / Deal Breakdown Accordion Trigger */}
      <div className="mb-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowRecipe(!showRecipe);
          }}
          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            showRecipe 
              ? 'bg-sky-950/40 border-sky-500/50 text-sky-200' 
              : 'bg-neutral-950/70 hover:bg-neutral-950 border-neutral-800 hover:border-neutral-700 text-neutral-300'
          }`}
        >
          <span className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <Receipt className="w-3.5 h-3.5" />
            <span>{showRecipe ? 'Hide Deal Breakdown' : '⚡ View Step-by-Step Deal Breakdown'}</span>
          </span>
          {showRecipe ? (
            <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          )}
        </button>

        {/* Inline Expanded Deal Breakdown */}
        {showRecipe && (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="mt-2.5 p-3 rounded-xl bg-white text-slate-900 border border-neutral-700 shadow-xl overflow-hidden animate-in fade-in duration-200"
          >
            <DealBreakdown deal={deal} isCompact />
          </div>
        )}
      </div>

      {/* Free Requirement / "Why isn't this free?" trigger */}
      {deal.freeClassification !== 'NOT_FREE' && (
        <div className="mb-3 p-2 rounded-lg bg-neutral-950/90 border border-neutral-800/90 flex items-center justify-between text-xs gap-2">
          <div className="text-neutral-300 truncate text-[11px]">
            {deal.freeRequirementNote || 'Requires promotional terms'}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenWhyNotFree) onOpenWhyNotFree(deal);
            }}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-semibold underline shrink-0 flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3" />
            <span>Why isn't this free?</span>
          </button>
        </div>
      )}

      {/* Middle Tags Row: Expiration, Channel, Stacking */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-400 mb-4 pt-2 border-t border-neutral-800/60">
        <span className={`inline-flex items-center gap-1 font-medium ${deal.expiration.isExpiringSoon ? 'text-amber-400' : 'text-neutral-400'}`}>
          <Clock className="w-3 h-3" />
          {deal.expiration.label}
        </span>
        
        {/* Shopping Channel */}
        <span className="inline-flex items-center gap-1 text-neutral-300 bg-neutral-800/70 px-1.5 py-0.5 rounded text-[11px]">
          {deal.channel === 'IN_STORE' ? <StoreIcon className="w-3 h-3 text-amber-400" /> : <Globe className="w-3 h-3 text-sky-400" />}
          <span>{deal.geoAvailabilityText || deal.channel}</span>
        </span>

        {deal.dealType === 'EXTRABUCKS' && (
          <span className="inline-flex items-center gap-1 text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-700/50 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            ExtraBucks Deal
          </span>
        )}
        {deal.dealType === 'SPEND_X_GET_Y' && (
          <span className="inline-flex items-center gap-1 text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700/50 text-[11px] font-bold">
            <ShoppingBag className="w-3 h-3 text-indigo-400" />
            Spend Threshold Deal
          </span>
        )}
        {deal.dealType === 'REBATE' && (
          <span className="inline-flex items-center gap-1 text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-700/50 text-[11px] font-bold">
            <Receipt className="w-3 h-3 text-teal-400" />
            Rebate Stacking
          </span>
        )}
        {deal.savingsRecipe?.rollingRewardScenario && (
          <span className="inline-flex items-center gap-1 text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-700/50 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Rolling Rewards Blueprint
          </span>
        )}
        {deal.stacking?.isStackable && (
          <span className="inline-flex items-center gap-1 text-sky-400 bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-800/40 text-[11px]">
            <Layers className="w-3 h-3" />
            Stackable
          </span>
        )}
        {deal.priceAnalysis?.verdict === 'ALL_TIME_LOW' && (
          <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40 text-[11px]">
            <TrendingDown className="w-3 h-3" />
            All-Time Low
          </span>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="mt-auto pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Left: Code Box or Claim Banner */}
        {deal.code ? (
          <button
            id={`btn-copy-code-${deal.id}`}
            type="button"
            onClick={handleCopy}
            title="Click to copy coupon code"
            className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-neutral-950 border border-dashed border-emerald-500/50 hover:border-emerald-400 text-xs font-mono font-bold text-emerald-400 hover:bg-emerald-950/30 transition-all"
          >
            <span>{deal.code}</span>
            <span className="flex items-center gap-1 text-[11px] font-sans font-medium text-neutral-300">
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Copy</span>
                </>
              )}
            </span>
          </button>
        ) : (
          <div className="text-xs text-neutral-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>No code required • Auto-applied</span>
          </div>
        )}

        {/* Right: Add to List & Get Deal CTA */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-add-list-${deal.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenAddToList) onOpenAddToList(deal);
            }}
            title="Add to Custom List"
            className="p-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <a
            id={`btn-get-deal-${deal.id}`}
            href={deal.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation();
              if (onTriggerConfirmation) onTriggerConfirmation(deal);
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-emerald-950"
          >
            <span>Get Deal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Community Confirmation Bar */}
      <div className="mt-2.5 pt-2 border-t border-neutral-800/40 flex items-center justify-between text-[11px] text-neutral-500">
        <span className="flex items-center gap-1">
          <Check className="w-3 h-3 text-emerald-400" />
          <span>{deal.verification.userConfirmations} confirmed working</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            id={`vote-works-${deal.id}`}
            type="button"
            disabled={userVoted !== null}
            onClick={(e) => handleVote(e, 'works')}
            title="Confirm this coupon worked for you"
            className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
              userVoted === 'works' ? 'text-emerald-400' : 'text-neutral-400 hover:text-emerald-300'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>
          <button
            id={`vote-failed-${deal.id}`}
            type="button"
            disabled={userVoted !== null}
            onClick={(e) => handleVote(e, 'doesnt_work')}
            title="Report this coupon failed or expired"
            className={`p-1 rounded hover:bg-neutral-800 transition-colors ${
              userVoted === 'doesnt_work' ? 'text-rose-400' : 'text-neutral-400 hover:text-rose-300'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
