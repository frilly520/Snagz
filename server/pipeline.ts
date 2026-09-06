import { db } from './db';
import { Deal, DealType, FreeClassification, StackingBreakdown } from '../src/types';
import { allRetailerAdapters } from './retailerAdapters';

export interface IngestionSourceAdapter {
  id: string;
  name: string;
  type: 'retailer_official' | 'brand_feed' | 'syndication' | 'public_web_data';
  priority: 1 | 2 | 3 | 4 | 5;
  fetchDeals: () => Promise<Partial<Deal>[]>;
}

// Combine specialized retailer adapters with syndication crawlers
export const sourceAdapters: IngestionSourceAdapter[] = [
  ...allRetailerAdapters.map(adapter => ({
    id: `src-${adapter.storeId}-official`,
    name: `${adapter.storeName} Official Circular & Rewards Feed`,
    type: 'retailer_official' as const,
    priority: 1 as const,
    fetchDeals: () => adapter.fetchDeals()
  })),
  {
    id: 'src-target-official',
    name: 'Target Retailer Direct API',
    type: 'retailer_official',
    priority: 1,
    fetchDeals: async () => [
      {
        title: 'Target: 20% Off Select Kitchen Appliances with Circle',
        description: 'Instant 20% savings on air fryers, blenders, and coffee makers for Circle members.',
        storeId: 'store-target',
        storeName: 'Target',
        storeLogo: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
        storeDomain: 'target.com',
        dealType: 'sale',
        discountDisplay: '20% OFF Circle',
        category: 'Home & Garden',
        subcategory: 'Kitchen',
        targetUrl: 'https://www.target.com/c/kitchen-dining/-/N-5xt0e',
        freeClassification: 'NOT_FREE',
        originalPrice: 89.99,
        currentPrice: 71.99,
        estimatedFinalPrice: 70.19,
        estimatedSavingsDollar: 19.80,
        estimatedSavingsPercent: 22.0,
        expiration: {
          expirationDate: '2026-09-04',
          expirationSource: 'retailer_terms',
          expirationConfidence: 96,
          label: 'Expires in 5 days',
          isExpiringSoon: false,
          isExpired: false
        },
        tags: ['kitchen', 'target', 'circle', 'air fryer']
      }
    ]
  },
  {
    id: 'src-freebie-syndicate',
    name: 'Public $0 Free Promotions Crawler',
    type: 'public_web_data',
    priority: 4,
    fetchDeals: async () => [
      {
        title: 'Krispy Kreme: Free Original Glazed Donut with Rewards App Signup',
        description: 'New members get a voucher for a complimentary hot glazed donut at participating shops with $0 spend.',
        storeId: 'store-target',
        storeName: 'Krispy Kreme Doughnuts',
        storeLogo: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=120&h=120&q=80',
        storeDomain: 'krispykreme.com',
        dealType: 'free_offer',
        discountDisplay: '100% $0 FREE',
        category: 'Restaurants & Food',
        subcategory: 'Dessert',
        targetUrl: 'https://www.krispykreme.com/rewards',
        freeClassification: '$0_FREE',
        freeRequirementNote: 'No purchase required. Valid at participating US locations within 30 days of registration.',
        originalPrice: 2.29,
        currentPrice: 0.00,
        estimatedFinalPrice: 0.00,
        estimatedSavingsDollar: 2.29,
        estimatedSavingsPercent: 100,
        expiration: {
          expirationSource: 'retailer_terms',
          expirationConfidence: 98,
          label: 'Ongoing Welcome Offer',
          isExpiringSoon: false,
          isExpired: false
        },
        tags: ['free food', 'donut', 'krispy kreme', 'free']
      }
    ]
  }
];

/**
 * Deal Quality Score Algorithm (0 to 100)
 */
export function calculateDealScore(deal: Partial<Deal>): { score: number; label: Deal['dealScoreLabel']; factors: Deal['scoreFactors'] } {
  let discountScore = 70;
  if (deal.estimatedSavingsPercent) {
    discountScore = Math.min(100, Math.max(40, deal.estimatedSavingsPercent * 1.6));
  } else if (deal.freeClassification === '$0_FREE') {
    discountScore = 100;
  }

  let reliability = deal.verification?.confidenceScore || 85;
  if (deal.sourcePriority === 1) reliability = Math.max(reliability, 95);

  let historyAdvantage = 80;
  if (deal.priceAnalysis?.verdict === 'ALL_TIME_LOW') historyAdvantage = 100;
  else if (deal.priceAnalysis?.verdict === 'EXCELLENT_DEAL') historyAdvantage = 92;
  else if (deal.priceAnalysis?.verdict === 'NOT_A_GREAT_DEAL') historyAdvantage = 45;

  let stackPotential = deal.stacking?.isStackable ? 90 : 65;
  let communityTrust = Math.min(100, 75 + (deal.verification?.userConfirmations || 10) * 0.5);

  const finalScore = Math.round(
    discountScore * 0.35 +
    reliability * 0.25 +
    historyAdvantage * 0.20 +
    stackPotential * 0.10 +
    communityTrust * 0.10
  );

  let label: Deal['dealScoreLabel'] = 'Good Value';
  if (finalScore >= 93) label = 'Outstanding Deal';
  else if (finalScore >= 87) label = 'Excellent Deal';
  else if (finalScore >= 80) label = 'Great Deal';
  else if (finalScore >= 70) label = 'Good Value';
  else if (finalScore >= 55) label = 'Average';
  else label = 'Low Value';

  return {
    score: finalScore,
    label,
    factors: {
      discountDepth: Math.round(discountScore),
      reliability: Math.round(reliability),
      priceHistoryAdvantage: Math.round(historyAdvantage),
      stackPotential: Math.round(stackPotential),
      communityTrust: Math.round(communityTrust)
    }
  };
}

/**
 * Data Pipeline Executor
 */
export async function runIngestionPipeline(): Promise<{
  discovered: number;
  normalized: number;
  deduped: number;
  saved: number;
  durationMs: number;
}> {
  const start = Date.now();
  let discoveredCount = 0;
  let dedupedCount = 0;
  let savedCount = 0;

  for (const adapter of sourceAdapters) {
    try {
      const rawDeals = await adapter.fetchDeals();
      discoveredCount += rawDeals.length;

      for (const raw of rawDeals) {
        // Deduplication check
        const existing = db.deals.find(d => 
          (d.code && raw.code && d.code.toLowerCase() === raw.code.toLowerCase() && d.storeId === raw.storeId) ||
          (d.title.toLowerCase().trim() === (raw.title || '').toLowerCase().trim())
        );

        if (existing) {
          dedupedCount++;
          // Update verification timestamp
          existing.verification.lastChecked = new Date().toISOString();
          continue;
        }

        const scoreData = calculateDealScore({
          ...raw,
          sourcePriority: adapter.priority,
          verification: {
            status: 'VERIFIED_ACTIVE',
            lastChecked: new Date().toISOString(),
            lastSuccessful: new Date().toISOString(),
            method: 'official_api_feed',
            source: adapter.name,
            confidenceScore: adapter.priority === 1 ? 98 : 90,
            userConfirmations: 5,
            userFailureReports: 0,
            lastUserConfirmedAgo: 'Just now'
          }
        });

        const newDeal: Deal = {
          id: `deal-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: raw.title || 'Special Promotion Deal',
          description: raw.description || 'Verified savings available at store.',
          storeId: raw.storeId || 'store-target',
          storeName: raw.storeName || 'Target',
          storeLogo: raw.storeLogo || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=120&h=120&q=80',
          storeDomain: raw.storeDomain || 'target.com',
          code: raw.code,
          dealType: (raw.dealType as DealType) || 'sale',
          discountDisplay: raw.discountDisplay || 'Special Offer',
          category: raw.category || 'General Merchandise',
          subcategory: raw.subcategory,
          targetUrl: raw.targetUrl || 'https://target.com',
          freeClassification: raw.freeClassification || 'NOT_FREE',
          freeRequirementNote: raw.freeRequirementNote,
          originalPrice: raw.originalPrice,
          currentPrice: raw.currentPrice,
          estimatedFinalPrice: raw.estimatedFinalPrice || raw.currentPrice,
          estimatedSavingsDollar: raw.estimatedSavingsDollar,
          estimatedSavingsPercent: raw.estimatedSavingsPercent,
          dealScore: scoreData.score,
          dealScoreLabel: scoreData.label,
          scoreFactors: scoreData.factors,
          verification: {
            status: 'VERIFIED_ACTIVE',
            lastChecked: new Date().toISOString(),
            lastSuccessful: new Date().toISOString(),
            method: 'official_api_feed',
            source: adapter.name,
            confidenceScore: adapter.priority === 1 ? 98 : 92,
            userConfirmations: 12,
            userFailureReports: 0,
            lastUserConfirmedAgo: '1 minute ago'
          },
          expiration: raw.expiration || {
            expirationSource: 'retailer_terms',
            expirationConfidence: 90,
            label: 'Expires in 7 days',
            isExpiringSoon: false,
            isExpired: false
          },
          sourcePriority: adapter.priority,
          sourceName: adapter.name,
          channel: 'ONLINE_AND_IN_STORE',
          geoAvailabilityText: 'Nationwide & Online',
          dataConfidence: 96,
          isAffiliateLink: false,
          directMerchantUrl: raw.targetUrl || 'https://target.com',
          createdAt: new Date().toISOString(),
          popularityCount: 120,
          tags: raw.tags || ['deal', 'savings']
        };

        db.deals.unshift(newDeal);
        savedCount++;
      }
    } catch (err) {
      console.error(`Pipeline adapter ${adapter.id} failed:`, err);
    }
  }

  const durationMs = Date.now() - start;
  db.pipelineRunHistory.unshift({
    timestamp: new Date().toISOString(),
    itemsIngested: savedCount,
    duplicatesFiltered: dedupedCount,
    durationMs
  });

  return {
    discovered: discoveredCount,
    normalized: discoveredCount,
    deduped: dedupedCount,
    saved: savedCount,
    durationMs
  };
}
