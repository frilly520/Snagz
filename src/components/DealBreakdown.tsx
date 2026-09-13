import React, { useState } from 'react';
import { DealSavingsRecipe, Deal } from '../types';
import { 
  DollarSign, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Receipt, 
  ShoppingBag, 
  TrendingDown, 
  Award, 
  Plus, 
  Minus, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';

interface DealBreakdownProps {
  deal: Deal;
  isCompact?: boolean; // Used inside card preview
}

export const DealBreakdown: React.FC<DealBreakdownProps> = ({ deal, isCompact = false }) => {
  // Synthesize intelligent recipe if not explicitly present
  const recipe: DealSavingsRecipe = deal.savingsRecipe || {
    whatToBuy: `1x ${deal.title}`,
    quantityRequired: 1,
    regularUnitPrice: deal.originalPrice || deal.currentPrice || 10.00,
    saleUnitPrice: deal.currentPrice || deal.originalPrice || 10.00,
    couponsToClip: deal.code ? [
      {
        name: `Promo Code: ${deal.code}`,
        amount: Math.max(0, (deal.originalPrice || 0) - (deal.currentPrice || 0)) || 2.00,
        type: 'DIGITAL_MFR',
        sourceAppOrSite: deal.storeName,
        isAutoClipped: false,
        clipUrl: deal.targetUrl
      }
    ] : [],
    totalCouponsDiscount: Math.max(0, (deal.originalPrice || 0) - (deal.currentPrice || 0)),
    outOfPocketToday: deal.currentPrice || 0,
    rewardsEarned: deal.dealType === 'EXTRABUCKS' ? [
      {
        name: 'Store Rewards / ExtraBucks',
        amount: deal.estimatedSavingsDollar || 5.00,
        currencyType: 'EXTRABUCKS',
        rollingEligible: true,
        notes: 'Prints at bottom of receipt / loads to loyalty card'
      }
    ] : [],
    totalRewardsEarned: deal.dealType === 'EXTRABUCKS' ? (deal.estimatedSavingsDollar || 5.00) : 0,
    cashbackRebates: [],
    totalCashbackRebates: 0,
    effectiveNetCost: deal.estimatedFinalPrice ?? deal.currentPrice ?? 0,
    stepByStepInstructions: [
      {
        stepNumber: 1,
        instruction: `Locate ${deal.title} at ${deal.storeName} (${deal.channel === 'IN_STORE' ? 'in-store aisle' : 'online website'}).`,
        highlightedTip: 'Verify size and variant matches promotion terms.'
      },
      ...(deal.code ? [{
        stepNumber: 2,
        instruction: `Apply promo code "${deal.code}" or clip digital coupon in ${deal.storeName} account.`,
        highlightedTip: 'Discount will deduct immediately from subtotal.'
      }] : []),
      {
        stepNumber: deal.code ? 3 : 2,
        instruction: `Pay checkout out-of-pocket amount of $${(deal.currentPrice || 0).toFixed(2)}.`,
        highlightedTip: 'Prior to applicable local sales tax.'
      },
      ...(deal.estimatedSavingsDollar ? [{
        stepNumber: deal.code ? 4 : 3,
        instruction: `Confirm total savings of $${deal.estimatedSavingsDollar.toFixed(2)} (${deal.estimatedSavingsPercent?.toFixed(0) || '50'}% off regular $${(deal.originalPrice || 0).toFixed(2)} price)!`,
        highlightedTip: 'Savings recipe verified active by SNAGZ.'
      }] : [])
    ]
  };

  const [interactiveQty, setInteractiveQty] = useState<number>(recipe.quantityRequired || 1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showRollingDetails, setShowRollingDetails] = useState<boolean>(false);

  // Calculate dynamic values if user toggles quantity in transaction builder
  const baseQty = Math.max(1, recipe.quantityRequired || 1);
  const qtyMultiplier = interactiveQty / baseQty;

  const dynamicRegularTotal = Number((recipe.regularUnitPrice * interactiveQty).toFixed(2));
  const dynamicSaleTotal = Number(((recipe.saleUnitPrice ?? recipe.regularUnitPrice) * interactiveQty).toFixed(2));
  
  // Coupon math scaling (usually 1 digital coupon per account, additional units pay sale price)
  const dynamicCouponTotal = interactiveQty >= baseQty 
    ? recipe.totalCouponsDiscount 
    : Number((recipe.totalCouponsDiscount * (interactiveQty / baseQty)).toFixed(2));

  const dynamicOutOfPocket = Number(Math.max(0, dynamicSaleTotal - dynamicCouponTotal).toFixed(2));
  
  // Rewards calculation based on threshold
  let dynamicRewards = 0;
  if (recipe.transactionScenario?.thresholdType === 'SPEND') {
    dynamicRewards = dynamicSaleTotal >= recipe.transactionScenario.thresholdAmount 
      ? recipe.totalRewardsEarned 
      : 0;
  } else if (recipe.transactionScenario?.thresholdType === 'QUANTITY') {
    dynamicRewards = interactiveQty >= recipe.transactionScenario.thresholdAmount 
      ? recipe.totalRewardsEarned 
      : 0;
  } else {
    dynamicRewards = recipe.totalRewardsEarned;
  }

  const dynamicRebates = recipe.totalCashbackRebates;
  const dynamicEffectiveNet = Number((dynamicOutOfPocket - dynamicRewards - dynamicRebates).toFixed(2));
  const dynamicIsMoneyMaker = dynamicEffectiveNet < 0;
  const dynamicMoneyMakerProfit = dynamicIsMoneyMaker ? Math.abs(dynamicEffectiveNet) : 0;

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-4 text-slate-300">
      {/* 1. MONEY MAKER or 100% FREE ALERT BANNER */}
      {dynamicIsMoneyMaker && (
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-white rounded-xl p-4 shadow-sm border border-blue-500/30 flex items-start gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg mt-0.5 text-blue-300">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs tracking-wide uppercase bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Money Maker
              </span>
              <span className="text-base font-extrabold text-white">
                +${dynamicMoneyMakerProfit.toFixed(2)} Net Profit
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your combined store rewards (${dynamicRewards.toFixed(2)}) and cashback rebates (${dynamicRebates.toFixed(2)}) 
              exceed your register out-of-pocket cost (${dynamicOutOfPocket.toFixed(2)}) by <strong className="text-white">${dynamicMoneyMakerProfit.toFixed(2)}</strong>!
            </p>
          </div>
        </div>
      )}

      {!dynamicIsMoneyMaker && dynamicEffectiveNet === 0 && (
        <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 text-white rounded-xl p-4 shadow-sm border border-blue-500/30 flex items-center gap-3">
          <div className="bg-blue-500/20 p-2 rounded-lg text-amber-300">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-extrabold text-xs tracking-wide uppercase text-amber-300">
              100% Free Deal ($0.00 Net Cost)
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Full retail value refunded in rewards or manufacturer discount at checkout.
            </p>
          </div>
        </div>
      )}

      {/* 2. SAVINGS RECIPE DIAGRAM (The Step-by-Step Waterfall) */}
      <div className="bg-[#101422] border border-[#222b3e] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-blue-400" />
            <span>Savings Recipe & Out-of-Pocket Breakdown</span>
          </h4>
          <span className="text-xs font-medium text-slate-300 bg-[#0d101a] px-2 py-1 rounded-md border border-[#222b3e]">
            {recipe.whatToBuy}
          </span>
        </div>

        {/* The Math Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
          {/* Step 1: Starting Price & Sale */}
          <div className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-3 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-medium">1. Store Retail Price</div>
            <div className="my-1.5">
              <div className="text-xs line-through text-slate-500">${dynamicRegularTotal.toFixed(2)}</div>
              <div className="text-lg font-bold text-white">${dynamicSaleTotal.toFixed(2)}</div>
            </div>
            <div className="text-[11px] text-blue-400 font-medium flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Save ${(dynamicRegularTotal - dynamicSaleTotal).toFixed(2)} instantly
            </div>
          </div>

          {/* Step 2: Coupons Deducted */}
          <div className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-3 flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-medium">2. Clip Coupons</div>
            <div className="my-1.5">
              <div className="text-lg font-bold text-blue-400">-${dynamicCouponTotal.toFixed(2)}</div>
              <div className="text-[11px] text-slate-400">
                {recipe.coupons.length} coupon{recipe.coupons.length > 1 ? 's' : ''} applied
              </div>
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {recipe.coupons[0]?.title ? recipe.coupons[0].title.slice(0, 24) + '...' : 'Digital clipped'}
            </div>
          </div>

          {/* Step 3: Out-of-Pocket at Register (Crucial distinction!) */}
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-lg p-3 flex flex-col justify-between shadow-xs">
            <div className="text-xs text-amber-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>3. Pay at Register</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold border border-amber-500/30">Today</span>
            </div>
            <div className="my-1.5">
              <div className="text-xl font-black text-amber-300 font-mono">${dynamicOutOfPocket.toFixed(2)}</div>
              <div className="text-[11px] text-amber-400/80 font-medium">
                Amount charged to card/cash
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Tax applies to this register total
            </div>
          </div>

          {/* Step 4: Final Effective Net Cost */}
          <div className={`border rounded-lg p-3 flex flex-col justify-between shadow-xs ${
            dynamicIsMoneyMaker 
              ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' 
              : dynamicEffectiveNet === 0 
                ? 'bg-indigo-950/40 border-indigo-500/40 text-indigo-200' 
                : 'bg-[#141926] text-white border-[#222b3e]'
          }`}>
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
              dynamicIsMoneyMaker ? 'text-blue-300' : dynamicEffectiveNet === 0 ? 'text-indigo-300' : 'text-slate-300'
            }`}>
              <span>4. Effective Net Cost</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-white/10 text-white">
                {dynamicIsMoneyMaker ? 'Profit' : 'After Rewards'}
              </span>
            </div>
            <div className="my-1.5">
              <div className={`text-xl font-black font-mono ${
                dynamicIsMoneyMaker ? 'text-blue-300' : dynamicEffectiveNet === 0 ? 'text-indigo-300' : 'text-blue-400'
              }`}>
                {dynamicIsMoneyMaker ? `-$${dynamicMoneyMakerProfit.toFixed(2)}` : `$${dynamicEffectiveNet.toFixed(2)}`}
              </div>
              <div className="text-[11px] text-slate-400">
                {interactiveQty > 1 ? `$${(dynamicEffectiveNet / interactiveQty).toFixed(2)} ea (${interactiveQty} items)` : 'Total final net expense'}
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Includes ${dynamicRewards.toFixed(2)} rewards + ${dynamicRebates.toFixed(2)} rebate
            </div>
          </div>
        </div>
      </div>

      {/* 3. COUPONS & REWARDS BREAKDOWN DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Active Coupons List */}
        <div className="bg-[#101422] border border-[#222b3e] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[#222b3e] pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Stackable Coupons ({recipe.coupons.length})</span>
            </span>
            <span className="text-xs font-bold text-blue-400 font-mono">
              -${dynamicCouponTotal.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-2 pt-1">
            {recipe.coupons.map((coupon, idx) => (
              <div key={idx} className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      coupon.type === 'MANUFACTURER' ? 'bg-blue-900/50 text-blue-300 border border-blue-700/50' : 'bg-indigo-900/50 text-indigo-300 border border-indigo-700/50'
                    }`}>
                      {coupon.type === 'MANUFACTURER' ? 'Manufacturer' : 'Store CRT'}
                    </span>
                    <span>{coupon.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Source: {coupon.source} {coupon.restrictions ? `• ${coupon.restrictions}` : ''}
                  </div>
                </div>
                <div className="font-bold text-blue-400 text-sm whitespace-nowrap font-mono">
                  -${coupon.discountAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards & Rebates List */}
        <div className="bg-[#101422] border border-[#222b3e] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[#222b3e] pb-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Rewards & Cashback ({recipe.rewardsEarned.length + recipe.cashbackRebates.length})</span>
            </span>
            <span className="text-xs font-bold text-blue-400 font-mono">
              +${(dynamicRewards + dynamicRebates).toFixed(2)} Back
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {/* Store Rewards */}
            {recipe.rewardsEarned.map((reward, idx) => (
              <div key={`rew-${idx}`} className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-900/50 text-indigo-300 border border-indigo-700/50">
                      Store Reward
                    </span>
                    <span>{reward.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Timing: {reward.timing === 'EARNED_FOR_NEXT_TRANSACTION' ? 'Prints immediately on receipt / loads to card' : 'Instant at checkout'}
                    {reward.rollingAllowed ? ' • Rollable to next transaction' : ''}
                  </div>
                </div>
                <div className="font-bold text-indigo-400 text-sm whitespace-nowrap font-mono">
                  +${reward.amount.toFixed(2)}
                </div>
              </div>
            ))}

            {/* Third-Party Cashback */}
            {recipe.cashbackRebates.map((rebate, idx) => (
              <div key={`reb-${idx}`} className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-900/50 text-blue-300 border border-blue-700/50">
                      {rebate.provider}
                    </span>
                    <span>Receipt Rebate</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {rebate.submissionRequirement}
                  </div>
                </div>
                <div className="font-bold text-blue-400 text-sm whitespace-nowrap font-mono">
                  +${rebate.amount.toFixed(2)}
                </div>
              </div>
            ))}

            {recipe.rewardsEarned.length === 0 && recipe.cashbackRebates.length === 0 && (
              <div className="text-xs text-slate-500 italic py-2 text-center">
                No future rewards required — all savings are instant at register!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. TRANSACTION BUILDER (THRESHOLD SPEND / QUANTITY OPTIMIZER) */}
      {recipe.transactionScenario && (
        <div className="bg-[#101422] border border-[#222b3e] rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Transaction Threshold Builder
              </span>
            </div>
            
            {/* Quantity Controller */}
            <div className="flex items-center gap-2 bg-[#0d101a] border border-[#222b3e] rounded-lg px-2 py-1">
              <span className="text-xs text-slate-400 font-medium">Quantity:</span>
              <button 
                onClick={() => setInteractiveQty(Math.max(1, interactiveQty - 1))}
                className="p-1 hover:bg-[#1a2133] rounded text-slate-300 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-white w-4 text-center">{interactiveQty}</span>
              <button 
                onClick={() => setInteractiveQty(interactiveQty + 1)}
                className="p-1 hover:bg-[#1a2133] rounded text-slate-300 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {recipe.transactionScenario.savingsExplanation}
          </p>

          {/* Progress bar towards spend or quantity threshold */}
          {recipe.transactionScenario.thresholdType === 'SPEND' && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                <span>Spend Qualifying Progress: ${dynamicSaleTotal.toFixed(2)}</span>
                <span>Threshold: ${recipe.transactionScenario.thresholdAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-[#0d101a] rounded-full h-2 overflow-hidden border border-[#222b3e]">
                <div 
                  className={`h-full transition-all duration-300 ${
                    dynamicSaleTotal >= recipe.transactionScenario.thresholdAmount ? 'bg-blue-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, (dynamicSaleTotal / recipe.transactionScenario.thresholdAmount) * 100)}%` }}
                />
              </div>
              {dynamicSaleTotal < recipe.transactionScenario.thresholdAmount && (
                <div className="text-[10px] text-amber-400 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3" />
                  Add ${(recipe.transactionScenario.thresholdAmount - dynamicSaleTotal).toFixed(2)} more qualifying items to unlock the ${recipe.totalRewardsEarned.toFixed(2)} ExtraBucks reward!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. ROLLING REWARDS 2-TRANSACTION BLUEPRINT */}
      {recipe.rollingRewardScenario && (
        <div className="border border-[#222b3e] bg-[#101422] rounded-xl overflow-hidden">
          <button
            onClick={() => setShowRollingDetails(!showRollingDetails)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-[#141926] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Pro Strategy: 2-Transaction Rolling ExtraBucks
                </span>
                <span className="text-[11px] text-slate-400">
                  How to roll your earned ${recipe.totalRewardsEarned.toFixed(2)} reward to pay $0 on your next grocery or household item
                </span>
              </div>
            </div>
            {showRollingDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showRollingDetails && (
            <div className="p-3.5 pt-0 space-y-3 text-xs border-t border-[#222b3e] mt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Transaction 1 */}
                <div className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-3 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{recipe.rollingRewardScenario.transaction1.title}</span>
                    <span className="text-[10px] bg-blue-900/50 text-blue-300 border border-blue-700/50 px-1.5 py-0.5 rounded font-bold">Step 1</span>
                  </div>
                  <div className="text-slate-400">{recipe.rollingRewardScenario.transaction1.items}</div>
                  <div className="text-slate-300 font-medium">
                    Pay at register: <strong className="text-white font-mono">${recipe.rollingRewardScenario.transaction1.payToday.toFixed(2)}</strong>
                  </div>
                  <div className="text-blue-300 font-bold bg-blue-950/60 border border-blue-800/60 p-1.5 rounded text-[11px]">
                    Receive: {recipe.rollingRewardScenario.transaction1.rewardName} on receipt
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {recipe.rollingRewardScenario.transaction1.instructions}
                  </p>
                </div>

                {/* Transaction 2 */}
                <div className="bg-[#0d101a] border border-[#222b3e] rounded-lg p-3 space-y-1.5">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{recipe.rollingRewardScenario.transaction2.title}</span>
                    <span className="text-[10px] bg-indigo-900/50 text-indigo-300 border border-indigo-700/50 px-1.5 py-0.5 rounded font-bold">Step 2</span>
                  </div>
                  <div className="text-slate-400">{recipe.rollingRewardScenario.transaction2.items}</div>
                  <div className="text-slate-300 font-medium">
                    Apply Step 1 ExtraBucks: <strong className="text-blue-400 font-mono">-${recipe.rollingRewardScenario.transaction2.rollRewardUsed.toFixed(2)}</strong>
                  </div>
                  <div className="text-blue-300 font-bold bg-blue-950/60 border border-blue-800/60 p-1.5 rounded text-[11px]">
                    New register out-of-pocket: ${recipe.rollingRewardScenario.transaction2.finalPayToday.toFixed(2)}!
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {recipe.rollingRewardScenario.transaction2.instructions}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. IN-STORE EXECUTION CHECKLIST */}
      {deal.howToGetSteps && deal.howToGetSteps.length > 0 && (
        <div className="bg-[#101422] border border-[#222b3e] rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-[#222b3e] pb-1.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>In-Store Execution Checklist</span>
            </span>
            <span className="text-[10px] text-slate-500">Tap to check off while shopping</span>
          </div>

          <div className="space-y-1.5 pt-1">
            {deal.howToGetSteps.map((step, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <button
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-start gap-2.5 transition-colors border ${
                    isChecked 
                      ? 'bg-[#0d101a]/50 border-[#222b3e]/50 text-slate-500 line-through' 
                      : 'bg-[#0d101a] border-[#222b3e] hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white text-[10px] ${
                    isChecked ? 'bg-blue-600 border-blue-600' : 'border-slate-700 bg-[#141926]'
                  }`}>
                    {isChecked && '✓'}
                  </div>
                  <span className="flex-1 leading-snug">{step}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
