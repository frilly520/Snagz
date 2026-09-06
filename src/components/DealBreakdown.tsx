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
    <div className="space-y-4 text-slate-800">
      {/* 1. MONEY MAKER or 100% FREE ALERT BANNER */}
      {dynamicIsMoneyMaker && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl p-4 shadow-sm border border-emerald-400/30 flex items-start gap-3">
          <div className="bg-white/20 p-2 rounded-lg mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wide uppercase bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-xs">
                Money Maker
              </span>
              <span className="text-base font-extrabold text-white">
                +${dynamicMoneyMakerProfit.toFixed(2)} Net Profit
              </span>
            </div>
            <p className="text-xs text-emerald-50 mt-1 leading-relaxed">
              Your combined store rewards (${dynamicRewards.toFixed(2)}) and cashback rebates (${dynamicRebates.toFixed(2)}) 
              exceed your register out-of-pocket cost (${dynamicOutOfPocket.toFixed(2)}) by <strong>${dynamicMoneyMakerProfit.toFixed(2)}</strong>!
            </p>
          </div>
        </div>
      )}

      {!dynamicIsMoneyMaker && dynamicEffectiveNet === 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-4 shadow-sm border border-blue-400/30 flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Award className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-extrabold text-sm tracking-wide uppercase text-amber-300">
              100% Free Deal ($0.00 Net Cost)
            </div>
            <p className="text-xs text-blue-50 mt-0.5">
              Full retail value refunded in rewards or manufacturer discount at checkout.
            </p>
          </div>
        </div>
      )}

      {/* 2. SAVINGS RECIPE DIAGRAM (The Step-by-Step Waterfall) */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Receipt className="w-4 h-4 text-blue-600" />
            Savings Recipe & Out-of-Pocket Breakdown
          </h4>
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
            {recipe.whatToBuy}
          </span>
        </div>

        {/* The Math Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 pt-1">
          {/* Step 1: Starting Price & Sale */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
            <div className="text-xs text-slate-500 font-medium">1. Store Retail Price</div>
            <div className="my-1.5">
              <div className="text-sm line-through text-slate-400">${dynamicRegularTotal.toFixed(2)}</div>
              <div className="text-lg font-bold text-slate-800">${dynamicSaleTotal.toFixed(2)}</div>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              Save ${(dynamicRegularTotal - dynamicSaleTotal).toFixed(2)} instantly
            </div>
          </div>

          {/* Step 2: Coupons Deducted */}
          <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between">
            <div className="text-xs text-slate-500 font-medium">2. Clip Coupons</div>
            <div className="my-1.5">
              <div className="text-lg font-bold text-emerald-600">-${dynamicCouponTotal.toFixed(2)}</div>
              <div className="text-[11px] text-slate-500">
                {recipe.coupons.length} coupon{recipe.coupons.length > 1 ? 's' : ''} applied
              </div>
            </div>
            <div className="text-[11px] text-slate-600 truncate">
              {recipe.coupons[0]?.title ? recipe.coupons[0].title.slice(0, 24) + '...' : 'Digital clipped'}
            </div>
          </div>

          {/* Step 3: Out-of-Pocket at Register (Crucial distinction!) */}
          <div className="bg-amber-50/70 border border-amber-300 rounded-lg p-3 flex flex-col justify-between shadow-xs">
            <div className="text-xs text-amber-800 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>3. Pay at Register</span>
              <span className="text-[10px] bg-amber-200/80 text-amber-900 px-1.5 py-0.5 rounded font-bold">Today</span>
            </div>
            <div className="my-1.5">
              <div className="text-xl font-extrabold text-amber-950">${dynamicOutOfPocket.toFixed(2)}</div>
              <div className="text-[11px] text-amber-800 font-medium">
                Amount charged to card/cash
              </div>
            </div>
            <div className="text-[10px] text-amber-700">
              Tax applies to this register total
            </div>
          </div>

          {/* Step 4: Final Effective Net Cost */}
          <div className={`border rounded-lg p-3 flex flex-col justify-between shadow-xs ${
            dynamicIsMoneyMaker 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : dynamicEffectiveNet === 0 
                ? 'bg-blue-50 border-blue-300 text-blue-950' 
                : 'bg-slate-900 text-white border-slate-800'
          }`}>
            <div className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
              dynamicIsMoneyMaker ? 'text-emerald-800' : dynamicEffectiveNet === 0 ? 'text-blue-800' : 'text-slate-300'
            }`}>
              <span>4. Effective Net Cost</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase bg-white/20">
                {dynamicIsMoneyMaker ? 'Profit' : 'After Rewards'}
              </span>
            </div>
            <div className="my-1.5">
              <div className={`text-xl font-black ${
                dynamicIsMoneyMaker ? 'text-emerald-700' : dynamicEffectiveNet === 0 ? 'text-blue-700' : 'text-emerald-400'
              }`}>
                {dynamicIsMoneyMaker ? `-$${dynamicMoneyMakerProfit.toFixed(2)}` : `$${dynamicEffectiveNet.toFixed(2)}`}
              </div>
              <div className={`text-[11px] ${dynamicIsMoneyMaker || dynamicEffectiveNet === 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                {interactiveQty > 1 ? `$${(dynamicEffectiveNet / interactiveQty).toFixed(2)} ea (${interactiveQty} items)` : 'Total final net expense'}
              </div>
            </div>
            <div className={`text-[10px] font-medium ${dynamicIsMoneyMaker ? 'text-emerald-800' : 'text-slate-400'}`}>
              Includes ${dynamicRewards.toFixed(2)} rewards + ${dynamicRebates.toFixed(2)} rebate
            </div>
          </div>
        </div>
      </div>

      {/* 3. COUPONS & REWARDS BREAKDOWN DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Active Coupons List */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Stackable Coupons ({recipe.coupons.length})
            </span>
            <span className="text-xs font-bold text-emerald-600">
              -${dynamicCouponTotal.toFixed(2)}
            </span>
          </div>
          
          <div className="space-y-2 pt-1">
            {recipe.coupons.map((coupon, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      coupon.type === 'MANUFACTURER' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                    }`}>
                      {coupon.type === 'MANUFACTURER' ? 'Manufacturer' : 'Store CRT'}
                    </span>
                    {coupon.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Source: {coupon.source} {coupon.restrictions ? `• ${coupon.restrictions}` : ''}
                  </div>
                </div>
                <div className="font-bold text-emerald-700 text-sm whitespace-nowrap">
                  -${coupon.discountAmount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rewards & Rebates List */}
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              Rewards & Cashback ({recipe.rewardsEarned.length + recipe.cashbackRebates.length})
            </span>
            <span className="text-xs font-bold text-indigo-600">
              +${(dynamicRewards + dynamicRebates).toFixed(2)} Back
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {/* Store Rewards */}
            {recipe.rewardsEarned.map((reward, idx) => (
              <div key={`rew-${idx}`} className="bg-purple-50/70 border border-purple-200 rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-purple-950 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-200 text-purple-900">
                      Store Reward
                    </span>
                    {reward.name}
                  </div>
                  <div className="text-[11px] text-purple-800">
                    Timing: {reward.timing === 'EARNED_FOR_NEXT_TRANSACTION' ? 'Prints immediately on receipt / loads to card' : 'Instant at checkout'}
                    {reward.rollingAllowed ? ' • Rollable to next transaction' : ''}
                  </div>
                </div>
                <div className="font-bold text-purple-900 text-sm whitespace-nowrap">
                  +${reward.amount.toFixed(2)}
                </div>
              </div>
            ))}

            {/* Third-Party Cashback */}
            {recipe.cashbackRebates.map((rebate, idx) => (
              <div key={`reb-${idx}`} className="bg-teal-50/70 border border-teal-200 rounded-lg p-2.5 text-xs flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-semibold text-teal-950 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-teal-200 text-teal-900">
                      {rebate.provider}
                    </span>
                    Receipt Rebate
                  </div>
                  <div className="text-[11px] text-teal-800">
                    {rebate.submissionRequirement}
                  </div>
                </div>
                <div className="font-bold text-teal-900 text-sm whitespace-nowrap">
                  +${rebate.amount.toFixed(2)}
                </div>
              </div>
            ))}

            {recipe.rewardsEarned.length === 0 && recipe.cashbackRebates.length === 0 && (
              <div className="text-xs text-slate-400 italic py-2 text-center">
                No future rewards required — all savings are instant at register!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. TRANSACTION BUILDER (THRESHOLD SPEND / QUANTITY OPTIMIZER) */}
      {recipe.transactionScenario && (
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Transaction Threshold Builder
              </span>
            </div>
            
            {/* Quantity Controller */}
            <div className="flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-2 py-1 shadow-2xs">
              <span className="text-xs text-slate-600 font-medium">Quantity:</span>
              <button 
                onClick={() => setInteractiveQty(Math.max(1, interactiveQty - 1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-slate-900 w-4 text-center">{interactiveQty}</span>
              <button 
                onClick={() => setInteractiveQty(interactiveQty + 1)}
                className="p-1 hover:bg-slate-100 rounded text-slate-700 transition-colors"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <p className="text-xs text-blue-800 leading-relaxed">
            {recipe.transactionScenario.savingsExplanation}
          </p>

          {/* Progress bar towards spend or quantity threshold */}
          {recipe.transactionScenario.thresholdType === 'SPEND' && (
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-blue-900">
                <span>Spend Qualifying Progress: ${dynamicSaleTotal.toFixed(2)}</span>
                <span>Threshold: ${recipe.transactionScenario.thresholdAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-blue-200/80 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    dynamicSaleTotal >= recipe.transactionScenario.thresholdAmount ? 'bg-emerald-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(100, (dynamicSaleTotal / recipe.transactionScenario.thresholdAmount) * 100)}%` }}
                />
              </div>
              {dynamicSaleTotal < recipe.transactionScenario.thresholdAmount && (
                <div className="text-[10px] text-amber-700 font-medium flex items-center gap-1 pt-0.5">
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
        <div className="border border-purple-200 bg-purple-50/40 rounded-xl overflow-hidden">
          <button
            onClick={() => setShowRollingDetails(!showRollingDetails)}
            className="w-full p-3.5 flex items-center justify-between text-left hover:bg-purple-100/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <div>
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider block">
                  Pro Strategy: 2-Transaction Rolling ExtraBucks
                </span>
                <span className="text-[11px] text-purple-700">
                  How to roll your earned ${recipe.totalRewardsEarned.toFixed(2)} reward to pay $0 on your next grocery or household item
                </span>
              </div>
            </div>
            {showRollingDetails ? (
              <ChevronUp className="w-4 h-4 text-purple-700" />
            ) : (
              <ChevronDown className="w-4 h-4 text-purple-700" />
            )}
          </button>

          {showRollingDetails && (
            <div className="p-3.5 pt-0 space-y-3 text-xs border-t border-purple-200/60 mt-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {/* Transaction 1 */}
                <div className="bg-white border border-purple-200 rounded-lg p-3 space-y-1.5">
                  <div className="font-bold text-purple-950 flex items-center justify-between">
                    <span>{recipe.rollingRewardScenario.transaction1.title}</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">Step 1</span>
                  </div>
                  <div className="text-slate-600">{recipe.rollingRewardScenario.transaction1.items}</div>
                  <div className="text-slate-700 font-medium">
                    Pay at register: <strong className="text-slate-900">${recipe.rollingRewardScenario.transaction1.payToday.toFixed(2)}</strong>
                  </div>
                  <div className="text-purple-800 font-bold bg-purple-50 p-1.5 rounded text-[11px]">
                    Receive: {recipe.rollingRewardScenario.transaction1.rewardName} on receipt
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    {recipe.rollingRewardScenario.transaction1.instructions}
                  </p>
                </div>

                {/* Transaction 2 */}
                <div className="bg-white border border-purple-200 rounded-lg p-3 space-y-1.5">
                  <div className="font-bold text-purple-950 flex items-center justify-between">
                    <span>{recipe.rollingRewardScenario.transaction2.title}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Step 2</span>
                  </div>
                  <div className="text-slate-600">{recipe.rollingRewardScenario.transaction2.items}</div>
                  <div className="text-slate-700 font-medium">
                    Apply Step 1 ExtraBucks: <strong className="text-purple-700">-${recipe.rollingRewardScenario.transaction2.rollRewardUsed.toFixed(2)}</strong>
                  </div>
                  <div className="text-emerald-800 font-bold bg-emerald-50 p-1.5 rounded text-[11px]">
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
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              In-Store Execution Checklist
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
                      ? 'bg-emerald-50/70 border-emerald-200 text-slate-500 line-through' 
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border text-white text-[10px] ${
                    isChecked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300 bg-white'
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
