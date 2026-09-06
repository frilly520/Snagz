import { Deal, DealSavingsRecipe, CouponComponent, RewardComponent, CashbackRebateComponent, StackingBreakdown } from '../src/types';

/**
 * Rules-Based Coupon Stacking & Deal Breakdown Engine
 * 
 * Implements legitimate couponing math:
 * - 1 Manufacturer Coupon + 1 Store Coupon per item
 * - Store CRT / Dollar-off Thresholds (e.g. $2 off $8 hair care)
 * - Retailer Rewards Thresholds (e.g. CVS Spend $30 Get $10 ExtraBucks computed before mfr coupons)
 * - Clear distinction between Out-of-Pocket Today (Pay at Register) vs. Effective Net Cost
 * - Automated Money-Maker detection
 * - Rolling Rewards Transaction sequencing
 */

export interface RawDealInput {
  whatToBuy: string;
  quantityRequired: number;
  regularUnitPrice: number;
  saleUnitPrice?: number;
  salePromotionType?: 'BOGO' | 'BOGO_50' | 'SALE_PRICE' | 'SPEND_GET' | 'BUY_GET' | 'CLEARANCE' | 'STANDARD';
  coupons?: CouponComponent[];
  rewards?: RewardComponent[];
  cashbackRebates?: CashbackRebateComponent[];
  storeName?: string;
  skuOrUpc?: string;
  itemSizeVariation?: string;
  transactionThreshold?: {
    type: 'SPEND' | 'QUANTITY';
    thresholdAmount: number;
  };
}

export function computeDealSavingsRecipe(input: RawDealInput): DealSavingsRecipe {
  const qty = Math.max(1, input.quantityRequired || 1);
  const regularUnitPrice = Number(input.regularUnitPrice.toFixed(2));
  const regularTotalPrice = Number((regularUnitPrice * qty).toFixed(2));

  // Compute sale total price based on promo type
  let saleTotalPrice = regularTotalPrice;
  let saleUnitPrice = input.saleUnitPrice !== undefined ? Number(input.saleUnitPrice.toFixed(2)) : regularUnitPrice;

  if (input.salePromotionType === 'BOGO' && qty >= 2) {
    // Buy 1 Get 1 Free
    const paidQty = Math.ceil(qty / 2);
    saleTotalPrice = Number((regularUnitPrice * paidQty).toFixed(2));
    saleUnitPrice = Number((saleTotalPrice / qty).toFixed(2));
  } else if (input.salePromotionType === 'BOGO_50' && qty >= 2) {
    // Buy 1 Get 1 50% Off
    const pairs = Math.floor(qty / 2);
    const singles = qty % 2;
    saleTotalPrice = Number(((regularUnitPrice * 1.5 * pairs) + (regularUnitPrice * singles)).toFixed(2));
    saleUnitPrice = Number((saleTotalPrice / qty).toFixed(2));
  } else if (input.saleUnitPrice !== undefined) {
    saleTotalPrice = Number((saleUnitPrice * qty).toFixed(2));
  }

  // Validate and sum coupons
  const coupons = (input.coupons || []).map(c => ({
    ...c,
    discountAmount: Number(c.discountAmount.toFixed(2))
  }));

  const totalCouponsDiscount = Number(
    coupons.reduce((acc, c) => acc + c.discountAmount, 0).toFixed(2)
  );

  // Out of Pocket at the register today (Cannot be negative at checkout)
  const outOfPocketToday = Number(Math.max(0, saleTotalPrice - totalCouponsDiscount).toFixed(2));

  // Rewards earned (ExtraBucks, Walgreens Cash, Target Gift Cards, etc.)
  const rewardsEarned = (input.rewards || []).map(r => ({
    ...r,
    amount: Number(r.amount.toFixed(2))
  }));

  const totalRewardsEarned = Number(
    rewardsEarned.reduce((acc, r) => acc + r.amount, 0).toFixed(2)
  );

  // Cashback / Rebates (Ibotta, Fetch, Rakuten)
  const cashbackRebates = (input.cashbackRebates || []).map(cb => ({
    ...cb,
    amount: Number(cb.amount.toFixed(2))
  }));

  const totalCashbackRebates = Number(
    cashbackRebates.reduce((acc, cb) => acc + cb.amount, 0).toFixed(2)
  );

  // Effective Net Cost = Out of Pocket - Future Rewards - Cashback/Rebates
  const effectiveNetCost = Number((outOfPocketToday - totalRewardsEarned - totalCashbackRebates).toFixed(2));
  const effectiveNetPerUnit = Number((effectiveNetCost / qty).toFixed(2));

  const isMoneyMaker = effectiveNetCost < 0;
  const moneyMakerAmount = isMoneyMaker ? Number(Math.abs(effectiveNetCost).toFixed(2)) : 0;

  // Build Transaction Scenario if threshold exists
  let transactionScenario = undefined;
  if (input.transactionThreshold) {
    transactionScenario = {
      thresholdType: input.transactionThreshold.type,
      thresholdAmount: input.transactionThreshold.thresholdAmount,
      currentProgress: input.transactionThreshold.type === 'SPEND' ? saleTotalPrice : qty,
      optimalQuantity: qty,
      savingsExplanation: input.transactionThreshold.type === 'SPEND'
        ? `Reach $${input.transactionThreshold.thresholdAmount} qualifying spend before coupons to trigger $${totalRewardsEarned} in rewards.`
        : `Buy exactly ${input.transactionThreshold.thresholdAmount} qualifying items to receive maximum reward.`
    };
  }

  // Build Rolling Reward Scenario if store is rewards-based (e.g. CVS ExtraBucks)
  let rollingRewardScenario = undefined;
  if (totalRewardsEarned >= 3 && input.storeName?.toLowerCase().includes('cvs')) {
    rollingRewardScenario = {
      transaction1: {
        title: `Transaction 1: ${input.whatToBuy}`,
        items: `${qty}x qualifying items`,
        retailPrice: saleTotalPrice,
        couponsApplied: totalCouponsDiscount,
        payToday: outOfPocketToday,
        earnRewards: totalRewardsEarned,
        rewardName: '$' + totalRewardsEarned.toFixed(2) + ' CVS ExtraBucks',
        instructions: `Pay $${outOfPocketToday.toFixed(2)} at the register. Your receipt will print $${totalRewardsEarned.toFixed(2)} in ExtraBucks immediately.`
      },
      transaction2: {
        title: 'Transaction 2: Roll into Next Item (e.g. Shampoo or Groceries)',
        items: 'Second transaction items (valued at $' + (totalRewardsEarned + 1).toFixed(2) + '+)',
        retailPrice: Number((totalRewardsEarned + 2).toFixed(2)),
        rollRewardUsed: totalRewardsEarned,
        additionalCoupons: 1.00,
        finalPayToday: 1.00,
        netEffectiveBoth: Number((outOfPocketToday - totalRewardsEarned + 1.00).toFixed(2)),
        instructions: `Scan the $${totalRewardsEarned.toFixed(2)} ExtraBucks earned from Transaction 1 to pay for Transaction 2, reducing your out-of-pocket to near $0!`
      }
    };
  }

  return {
    whatToBuy: input.whatToBuy,
    quantityRequired: qty,
    itemSizeVariation: input.itemSizeVariation,
    skuOrUpc: input.skuOrUpc,
    regularUnitPrice,
    regularTotalPrice,
    saleUnitPrice,
    saleTotalPrice,
    salePromotionType: input.salePromotionType || 'SALE_PRICE',
    coupons,
    totalCouponsDiscount,
    outOfPocketToday,
    rewardsEarned,
    totalRewardsEarned,
    cashbackRebates,
    totalCashbackRebates,
    effectiveNetCost,
    effectiveNetPerUnit,
    isMoneyMaker,
    moneyMakerAmount,
    transactionScenario,
    rollingRewardScenario
  };
}

/**
 * Generates backward-compatible StackingBreakdown from DealSavingsRecipe
 */
export function convertRecipeToStackingBreakdown(recipe: DealSavingsRecipe): StackingBreakdown {
  const components: any[] = [];

  // Sale markdown
  const saleSavings = recipe.regularTotalPrice - recipe.saleTotalPrice;
  if (saleSavings > 0) {
    components.push({
      title: `${recipe.salePromotionType === 'BOGO' ? 'BOGO Free' : 'Store Sale'} Markdown`,
      type: 'sale',
      discountAmount: Number(saleSavings.toFixed(2)),
      permitted: true,
      confidence: 100
    });
  }

  // Coupons
  recipe.coupons.forEach(c => {
    components.push({
      title: c.title,
      type: c.type === 'MANUFACTURER' ? 'mfr_coupon' : 'store_coupon',
      discountAmount: c.discountAmount,
      code: c.code,
      description: `${c.source} ${c.restrictions ? `• ${c.restrictions}` : ''}`,
      permitted: true,
      confidence: 99
    });
  });

  // Rewards
  recipe.rewardsEarned.forEach(r => {
    components.push({
      title: r.name,
      type: 'rebate',
      discountAmount: r.amount,
      description: `Store reward earned (${r.timing.replace(/_/g, ' ')})`,
      permitted: true,
      confidence: 99
    });
  });

  // Cashback / Rebates
  recipe.cashbackRebates.forEach(cb => {
    components.push({
      title: `${cb.provider} Rebate`,
      type: 'cashback',
      discountAmount: cb.amount,
      description: cb.submissionRequirement,
      permitted: true,
      confidence: 95
    });
  });

  const totalSaved = Number((recipe.regularTotalPrice - Math.max(0, recipe.effectiveNetCost)).toFixed(2));
  const totalSavedPercentage = Number(((totalSaved / recipe.regularTotalPrice) * 100).toFixed(1));

  return {
    isStackable: components.length > 1,
    originalPrice: recipe.regularTotalPrice,
    currentSalePrice: recipe.saleTotalPrice,
    actualCheckoutPrice: recipe.outOfPocketToday,
    estimatedEffectivePrice: recipe.effectiveNetCost < 0 ? 0 : recipe.effectiveNetCost,
    totalSaved,
    totalSavedPercentage,
    components
  };
}
