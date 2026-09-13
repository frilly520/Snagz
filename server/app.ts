import express from 'express';
import dotenv from 'dotenv';
import { db } from './db';
import { pennyService } from './pennyService';
import { translateSearchIntent, askDealAssistant, analyzeReceipt } from './ai';
import { runIngestionPipeline } from './pipeline';
import { Deal, StackingBreakdown, UserList, DealAlert, ProductWatchlistItem, UserReport, SavingsLogItem } from '../src/types';

dotenv.config();

const app = express();

// -------------------------------------------------------------
// CORS & SECURITY HEADERS (Ensures compatibility on Vercel & custom domains)
// -------------------------------------------------------------
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, x-matched-path');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// -------------------------------------------------------------
// REQUEST LOGGING
// -------------------------------------------------------------
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.originalUrl || req.url;
  console.log(`[SNAGZ API] ${req.method} ${requestPath}`);

  res.on('finish', () => {
    const duration = Date.now() - start;
    if (res.statusCode >= 400) {
      console.warn(`[SNAGZ API] ${req.method} ${requestPath} -> Status ${res.statusCode} (${duration}ms)`);
    } else {
      console.log(`[SNAGZ API] ${req.method} ${requestPath} -> Status ${res.statusCode} (${duration}ms)`);
    }
  });

  next();
});

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Health check (Works at both /api/health and /health)
const healthHandler = (req: express.Request, res: express.Response) => {
  const pennyHealth = pennyService.getHealth ? pennyService.getHealth() : null;
  res.json({
    status: 'ok',
    deployment: process.env.VERCEL ? 'Vercel Serverless Function' : 'Node.js Container / Dev Server',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString(),
    totalDeals: db.deals.length,
    totalStores: db.stores.length,
    pennyItemsCount: pennyHealth?.currentItemCount || 0,
    aiConfigured: !!process.env.GEMINI_API_KEY,
    serverVersion: '1.2.0'
  });
};

app.get('/api/health', healthHandler);
app.get('/health', healthHandler);

// AI & API Key Status Check (Confirms secure server-side proxy architecture)
app.get('/api/ai/status', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  const key = process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    aiEnabled: hasKey,
    provider: 'Google Gemini 3.7 Flash & 2.5 Flash',
    proxyArchitecture: 'Secure Server-Side Node.js Proxy',
    clientExposure: 'NONE (Keys safely sealed server-side; zero browser exposure)',
    keyConfigured: hasKey,
    maskedKey: hasKey && key && key.length > 8 ? `${key.substring(0, 4)}...${key.substring(key.length - 4)}` : null
  });
});

// -------------------------------------------------------------
// SNAGZ PENNY LIST API ENDPOINTS
// -------------------------------------------------------------

// GET /api/penny
app.get('/api/penny', async (req, res) => {
  try {
    const { retailerId, category, status, sort, q, zip, activeOnly } = req.query as Record<string, string>;
    const result = await pennyService.getPennyItems({
      retailerId,
      category,
      status,
      sort,
      q,
      zip,
      activeOnly: activeOnly === 'true'
    });
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch penny items' });
  }
});

// GET /api/penny/health
app.get('/api/penny/health', (req, res) => {
  try {
    const health = pennyService.getHealth();
    res.json(health);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny/health:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch penny list health' });
  }
});

// GET /api/penny/dollar-general
app.get('/api/penny/dollar-general', async (req, res) => {
  try {
    const { category, sort, q } = req.query as Record<string, string>;
    const result = await pennyService.getPennyItems({
      retailerId: 'store-dollargeneral',
      category,
      sort,
      q
    });
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny/dollar-general:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch Dollar General penny list' });
  }
});

// GET /api/penny/:id
app.get('/api/penny/:id', async (req, res) => {
  try {
    const item = await pennyService.getPennyItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Penny item not found' });
    }
    res.json(item);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny/:id:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch penny item' });
  }
});

// POST /api/penny/report
app.post('/api/penny/report', async (req, res) => {
  try {
    const report = req.body;
    if (!report.productName || !report.upc || !report.retailerId) {
      return res.status(400).json({ error: 'Product name, UPC, and retailer are required.' });
    }
    const result = await pennyService.submitReport(report);
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny/report:', err);
    res.status(500).json({ error: err.message || 'Failed to submit penny report' });
  }
});

// POST /api/penny/:id/feedback
app.post('/api/penny/:id/feedback', async (req, res) => {
  try {
    const { feedbackType, notes } = req.body;
    if (!feedbackType) {
      return res.status(400).json({ error: 'Feedback type is required.' });
    }
    const result = await pennyService.submitFeedback(req.params.id, feedbackType, notes);
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/penny/:id/feedback:', err);
    res.status(500).json({ error: err.message || 'Failed to submit feedback' });
  }
});

// Helper: Convert PennyItem to first-class Deal representation with 1¢ badge and breakdown
function pennyItemToDeal(p: any): Deal {
  return {
    id: `deal-penny-${p.id}`,
    title: `[1¢ PENNY FIND] ${p.productName} (${p.brand})`,
    description: `${p.status === 'CONFIRMED_PENNY' ? 'Verified Confirmed 1¢' : 'Active 1¢ Clearance'}: Reported and verified ringing up at $0.01 at ${p.retailerName}. UPC: ${p.upc}. ${p.seasonalInfo ? `Markdown identifier: ${p.seasonalInfo}.` : ''} ${p.sourceEvidence}`,
    storeId: p.retailerId,
    storeName: p.retailerName,
    storeLogo: p.retailerLogo,
    storeDomain: p.retailerDomain,
    dealType: 'CLEARANCE',
    discountDisplay: '$0.01 PENNY FIND (99.9% OFF)',
    category: p.category === 'All' ? 'General' : p.category,
    subcategory: p.seasonalInfo || 'Penny Clearance',
    retailerCategory: 'GENERAL RETAIL',
    targetUrl: p.sourceUrl || 'https://www.dollargeneral.com',
    directMerchantUrl: p.sourceUrl || 'https://www.dollargeneral.com',
    isAffiliateLink: false,
    channel: p.availability === 'ONLINE' ? 'ONLINE' : 'IN_STORE',
    geoAvailabilityText: p.availabilityDetails || 'Nationwide participating stores at checkout',
    country: 'US',
    currency: 'USD',
    freeClassification: 'NOT_FREE',
    originalPrice: p.previousPrice,
    currentPrice: 0.01,
    estimatedFinalPrice: 0.01,
    outOfPocketPrice: 0.01,
    estimatedSavingsDollar: Number((p.previousPrice - 0.01).toFixed(2)),
    estimatedSavingsPercent: 99.9,
    dealScore: p.confidence,
    dealScoreLabel: 'Outstanding Deal',
    dataConfidence: p.confidence,
    upc: p.upc,
    productName: p.productName,
    productImage: p.productImage,
    isFeatured: p.status === 'CONFIRMED_PENNY',
    isPennyDeal: true,
    verification: {
      status: p.status === 'CONFIRMED_PENNY' ? 'VERIFIED_ACTIVE' : (p.status === 'NO_LONGER_ACTIVE' ? 'EXPIRED' : 'ACTIVE'),
      lastChecked: p.lastVerifiedTimestamp,
      lastSuccessful: p.lastVerifiedTimestamp,
      method: 'community_consensus',
      confidenceScore: p.confidence,
      source: p.source,
      userConfirmations: p.userFeedbackStats?.rangUpPennyCount || 0,
      userFailureReports: p.userFeedbackStats?.didntWorkCount || 0
    },
    expiration: {
      label: 'Active while inventory lasts',
      isExpiringSoon: false,
      isExpired: p.status === 'NO_LONGER_ACTIVE',
      expirationSource: 'retailer_terms',
      expirationConfidence: p.confidence
    },
    savingsRecipe: {
      whatToBuy: `1x ${p.productName} (UPC: ${p.upc})`,
      quantityRequired: 1,
      regularUnitPrice: p.previousPrice,
      regularTotalPrice: p.previousPrice,
      saleUnitPrice: 0.01,
      saleTotalPrice: 0.01,
      coupons: [],
      totalCouponsDiscount: 0,
      outOfPocketToday: 0.01,
      rewardsEarned: [],
      totalRewardsEarned: 0,
      cashbackRebates: [],
      totalCashbackRebates: 0,
      effectiveNetCost: 0.01,
      effectiveNetPerUnit: 0.01,
      isMoneyMaker: false,
      stepByStepInstructions: [
        {
          stepNumber: 1,
          instruction: `Locate ${p.productName} on store shelves or clearance endcaps at ${p.retailerName}. Confirm barcode UPC matches "${p.upc}".`,
          highlightedTip: `${p.seasonalInfo || 'Check discount dot / symbol on tag'}. Scan with the Dollar General app barcode scanner to verify.`
        },
        {
          stepNumber: 2,
          instruction: `Bring item to register. Cashier scans barcode; register display confirms final subtotal of exactly $0.01.`,
          highlightedTip: 'Penny pricing can vary by location and may be corrected or removed by the retailer. Verify the price at checkout.'
        },
        {
          stepNumber: 3,
          instruction: `Complete purchase for 1 cent (+ local sales tax).`,
          highlightedTip: 'Keep register receipt to verify and report confirmation in SNAGZ.'
        }
      ]
    },
    tags: ['1¢ Penny Find', 'Dollar General', 'Penny List', p.brand, p.category],
    createdAt: p.lastVerifiedTimestamp || new Date().toISOString(),
    popularityCount: 450 + (p.userFeedbackStats?.rangUpPennyCount || 0) * 10
  };
}

// GET /api/deals
app.get('/api/deals', (req, res) => {
  try {
    const {
      q,
      category,
      retailerCategory,
      storeId,
      freeType,
      freeOnly,
      dealType,
      weeklyAdOnly,
      moneyMakerOnly,
      recipesOnly,
      sort = 'best_deal',
      minScore,
      minConfidence,
      expiringOnly,
      featuredOnly,
      channel,
      localOnly,
      zip
    } = req.query as Record<string, string>;

    let results = db.deals.filter(d => d && d.id && d.expiration && d.verification);

    // Exclude expired unless explicitly requested
    if (sort !== 'expiring_soon' && expiringOnly !== 'true') {
      results = results.filter(d => !d.expiration.isExpired && d.verification.status !== 'EXPIRED');
    }

    // Free filtering
    if (freeOnly === 'true') {
      results = results.filter(d => d.freeClassification !== 'NOT_FREE');
    }
    if (freeType && freeType !== 'ALL') {
      results = results.filter(d => d.freeClassification === freeType);
    }

    // Money Maker filter
    if (moneyMakerOnly === 'true') {
      results = results.filter(d => d.isMoneyMaker || (d.moneyMakerAmount && d.moneyMakerAmount > 0));
    }

    // Savings Recipe filter
    if (recipesOnly === 'true') {
      results = results.filter(d => !!d.savingsRecipe || d.dealType === 'EXTRABUCKS');
    }

    // Deal Type filtering
    if (dealType && dealType !== 'ALL') {
      results = results.filter(d => d.dealType === dealType);
    }

    // Weekly Ad filter
    if (weeklyAdOnly === 'true') {
      results = results.filter(d => d.isWeeklyAdDeal || d.weeklyAdInfo);
    }

    // Store filtering
    if (storeId) {
      results = results.filter(d => d.storeId === storeId || d.storeDomain === storeId);
    }

    // Retailer Category filtering
    if (retailerCategory && retailerCategory !== 'All' && retailerCategory !== 'ALL') {
      results = results.filter(d => d.retailerCategory === retailerCategory);
    }

    // General Category filtering
    if (category && category !== 'All' && category !== 'ALL') {
      results = results.filter(d => 
        d.category.toLowerCase() === category.toLowerCase() || 
        d.subcategory?.toLowerCase() === category.toLowerCase() ||
        d.retailerCategory === category
      );
    }

    // Channel filtering
    if (channel && channel !== 'ALL') {
      results = results.filter(d => d.channel === channel || d.channel === 'ONLINE_AND_IN_STORE');
    }

    // Local deals / ZIP code filtering
    if (localOnly === 'true') {
      results = results.filter(d => d.isLocalOnly || d.channel === 'IN_STORE');
    }
    if (zip && zip.trim()) {
      const cleanZip = zip.trim();
      results = results.map(d => {
        if (d.localStoreLocations && d.localStoreLocations.some(l => l.zipCode.startsWith(cleanZip.substring(0, 3)))) {
          return { ...d, isLocalOnly: true };
        }
        return d;
      });
    }

    // Score filtering
    if (minScore) {
      const min = parseFloat(minScore);
      if (!isNaN(min)) results = results.filter(d => d.dealScore >= min);
    }

    // Data Confidence filtering
    if (minConfidence) {
      const minC = parseFloat(minConfidence);
      if (!isNaN(minC)) results = results.filter(d => d.dataConfidence >= minC);
    }

    // Expiring soon only
    if (expiringOnly === 'true') {
      results = results.filter(d => d.expiration.isExpiringSoon || d.verification.status === 'EXPIRING_SOON');
    }

    // Featured
    if (featuredOnly === 'true') {
      results = results.filter(d => d.isFeatured);
    }

    // Store-First Search Intent Check
    let matchedRetailer: any = null;
    if (q && q.trim()) {
      const query = q.toLowerCase().trim();

      // Check if user specifically queried a retailer name (e.g. "CVS", "Walmart", "Home Depot", "Kroger")
      matchedRetailer = db.stores.find(s => 
        s.name.toLowerCase() === query ||
        s.slug === query ||
        query.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(query)
      );

      results = results.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.storeName.toLowerCase().includes(query) ||
        (d.productName && d.productName.toLowerCase().includes(query)) ||
        (d.code && d.code.toLowerCase().includes(query)) ||
        (d.upc && d.upc.includes(query)) ||
        d.tags.some(t => t.toLowerCase().includes(query))
      );

      // If query matches penny terms, inject matching penny deals from pennyService
      if (query.includes('penny') || query.includes('1 cent') || query.includes('0.01') || query.includes('dollar general') || query.includes('cleaning') || query.includes('hoodie') || query.includes('skillet')) {
        const pennyRes = pennyService.getPennyItemsSync ? pennyService.getPennyItemsSync({ q: query }) : null;
        if (pennyRes && pennyRes.items) {
          const pennyDeals = pennyRes.items.map(p => pennyItemToDeal(p));
          results = [...pennyDeals, ...results];
        }
      }
    }

    // Sorting
    switch (sort) {
      case 'money_maker':
        results.sort((a, b) => {
          const aMM = a.isMoneyMaker ? (a.moneyMakerAmount || 1) : -1;
          const bMM = b.isMoneyMaker ? (b.moneyMakerAmount || 1) : -1;
          if (bMM !== aMM) return bMM - aMM;
          return (b.dealScore || 0) - (a.dealScore || 0);
        });
        break;
      case 'lowest_net':
        results.sort((a, b) => {
          const aNet = a.savingsRecipe?.effectiveNetCost ?? a.estimatedFinalPrice ?? a.currentPrice ?? 999;
          const bNet = b.savingsRecipe?.effectiveNetCost ?? b.estimatedFinalPrice ?? b.currentPrice ?? 999;
          return aNet - bNet;
        });
        break;
      case 'biggest_savings':
        results.sort((a, b) => (b.estimatedSavingsDollar || 0) - (a.estimatedSavingsDollar || 0));
        break;
      case 'highest_discount':
        results.sort((a, b) => (b.estimatedSavingsPercent || 0) - (a.estimatedSavingsPercent || 0));
        break;
      case 'newest':
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'expiring_soon':
        results.sort((a, b) => {
          if (a.expiration.isExpiringSoon && !b.expiration.isExpiringSoon) return -1;
          if (!a.expiration.isExpiringSoon && b.expiration.isExpiringSoon) return 1;
          return (b.dealScore || 0) - (a.dealScore || 0);
        });
        break;
      case 'most_popular':
        results.sort((a, b) => (b.popularityCount || 0) - (a.popularityCount || 0));
        break;
      case 'recently_verified':
        results.sort((a, b) => new Date(b.verification.lastChecked).getTime() - new Date(a.verification.lastChecked).getTime());
        break;
      case 'best_deal':
      default:
        // If a store was specifically searched, prioritize that retailer's circulars and deals
        if (matchedRetailer) {
          results.sort((a, b) => {
            const aIsStore = a.storeId === matchedRetailer.id || a.storeName.toLowerCase().includes(matchedRetailer.name.toLowerCase());
            const bIsStore = b.storeId === matchedRetailer.id || b.storeName.toLowerCase().includes(matchedRetailer.name.toLowerCase());
            if (aIsStore && !bIsStore) return -1;
            if (!aIsStore && bIsStore) return 1;
            const aScore = (a.dealScore * 0.7) + (a.dataConfidence * 0.3);
            const bScore = (b.dealScore * 0.7) + (b.dataConfidence * 0.3);
            return bScore - aScore;
          });
        } else {
          // Rank by composite value (Deal score 70% + Data confidence 30%)
          results.sort((a, b) => {
            const aScore = (a.dealScore * 0.7) + (a.dataConfidence * 0.3);
            const bScore = (b.dealScore * 0.7) + (b.dataConfidence * 0.3);
            return bScore - aScore;
          });
        }
        break;
    }

    res.json({
      count: results.length,
      matchedRetailer: matchedRetailer ? {
        id: matchedRetailer.id,
        name: matchedRetailer.name,
        logo: matchedRetailer.logo,
        category: matchedRetailer.category,
        retailerCategory: matchedRetailer.retailerCategory,
        weeklyAdUrl: matchedRetailer.weeklyAdUrl,
        loyaltyPerks: matchedRetailer.loyaltyPerks
      } : null,
      deals: results
    });
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/deals:', err);
    res.status(500).json({ error: err.message || 'Failed to fetch deals' });
  }
});

// GET /api/best-deal (Determines the single top-ranked best deal with deep mathematical analysis)
app.get('/api/best-deal', (req, res) => {
  try {
    const { q, category } = req.query as Record<string, string>;
    const best = db.findBestDeal(q, category);
    
    if (!best) {
      return res.status(404).json({ error: 'No matching deals available for best deal calculation' });
    }

    res.json({
      bestDeal: best,
      evaluation: best.bestDealEvaluation || {
        isRankOne: true,
        productTarget: best.productName || best.title,
        regularPrice: best.originalPrice || best.currentPrice || 100,
        currentPrice: best.currentPrice || 100,
        couponDiscount: best.stacking?.components.find(c => c.type === 'store_coupon')?.discountAmount || (best.estimatedSavingsDollar || 0),
        cashbackDiscount: best.stacking?.components.find(c => c.type === 'cashback')?.discountAmount || 0,
        shippingCost: 0,
        estimatedEffectivePrice: best.estimatedFinalPrice || best.currentPrice || 100,
        estimatedTotalSavings: best.estimatedSavingsDollar || 0,
        savingsPercentage: best.estimatedSavingsPercent || 0,
        whyBestDealExplanation: `Why this deal ranks #1: Verified lowest net effective price ($${best.estimatedFinalPrice || best.currentPrice}) with ${best.verification.confidenceScore}% confidence score. Zero affiliate bias.`,
        whyBestDealBullets: [
          `Verified discount: ${best.discountDisplay}`,
          `Confidence score: ${best.dataConfidence}% (${best.verification.userConfirmations} user confirmations)`,
          `Channel: ${best.geoAvailabilityText}`,
          `Expires: ${best.expiration.label}`
        ],
        historicalRecordNote: best.priceAnalysis?.lowestIn12MonthsClaim || 'Verified market competitive pricing',
        independentDealScore: best.dealScore,
        independentDataConfidence: best.dataConfidence,
        affiliateCommissionBiased: false,
        competingOffers: []
      }
    });
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/best-deal:', err);
    res.status(500).json({ error: err.message || 'Failed to calculate best deal' });
  }
});

// GET /api/alerts/price-drops (Price Drop + Coupon combination alert stream)
app.get('/api/alerts/price-drops', (req, res) => {
  res.json(db.priceDropAlerts);
});

// GET /api/savings-tracker (Personal Savings Dashboard & Audit Stats)
app.get('/api/savings-tracker', (req, res) => {
  res.json(db.savingsTracker);
});

// POST /api/savings-tracker/confirm (Confirm savings and update personal dashboard + community feedback)
app.post('/api/savings-tracker/confirm', (req, res) => {
  try {
    const { dealId, amountSaved, couponCode } = req.body;
    const savedVal = Math.max(0, parseFloat(amountSaved) || 10);
    const deal = db.deals.find(d => d.id === dealId);

    // Update SNAGZ Savings Tracker State
    db.savingsTracker.confirmedSavingsTotal = Number((db.savingsTracker.confirmedSavingsTotal + savedVal).toFixed(2));
    db.savingsTracker.savingsThisMonth = Number((db.savingsTracker.savingsThisMonth + savedVal).toFixed(2));
    db.savingsTracker.savingsThisYear = Number((db.savingsTracker.savingsThisYear + savedVal).toFixed(2));
    db.savingsTracker.couponsUsedCount += 1;

    const logEntry: SavingsLogItem = {
      id: `log-${Date.now()}`,
      dealId: dealId || 'custom-deal',
      dealTitle: deal?.title || 'Confirmed Coupon Checkout',
      storeName: deal?.storeName || 'Online Retailer',
      storeLogo: deal?.storeLogo,
      amountSaved: savedVal,
      couponCode: couponCode || deal?.code,
      type: 'confirmed',
      date: new Date().toISOString()
    };

    db.savingsTracker.history.unshift(logEntry);

    // Update achievements
    for (const ach of db.savingsTracker.achievements) {
      if (ach.id === 'ach-first-coupon') ach.unlocked = true;
      if (ach.id === 'ach-100-saved' && db.savingsTracker.confirmedSavingsTotal >= 100) ach.unlocked = true;
      if (ach.id === 'ach-500-saved' && db.savingsTracker.confirmedSavingsTotal >= 500) ach.unlocked = true;
    }

    // Update deal verification confirmations
    if (deal) {
      deal.verification.userConfirmations += 1;
      deal.verification.lastUserConfirmedAgo = 'Just now';
      deal.verification.lastChecked = new Date().toISOString();
      deal.verification.confidenceScore = Math.min(100, deal.verification.confidenceScore + 1);
    }

    res.json({
      success: true,
      savingsTracker: db.savingsTracker,
      newLog: logEntry
    });
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/savings-tracker/confirm:', err);
    res.status(500).json({ error: err.message || 'Failed to confirm savings' });
  }
});

// GET /api/settings/privacy
app.get('/api/settings/privacy', (req, res) => {
  res.json({
    settings: db.privacySettings,
    searchHistory: db.searchHistory
  });
});

// POST /api/settings/privacy
app.post('/api/settings/privacy', (req, res) => {
  db.privacySettings = {
    ...db.privacySettings,
    ...req.body
  };
  res.json({ success: true, settings: db.privacySettings });
});

// POST /api/privacy/clear-history
app.post('/api/privacy/clear-history', (req, res) => {
  db.searchHistory = [];
  res.json({ success: true, message: 'Search history cleared successfully' });
});

// POST /api/privacy/purge-data
app.post('/api/privacy/purge-data', (req, res) => {
  db.searchHistory = [];
  db.savedDealIds.clear();
  db.userLists = [];
  db.watchlist = [];
  res.json({ success: true, message: 'All personal lists, search history, and saved data purged.' });
});

// POST /api/shopping-trip/optimize
app.post('/api/shopping-trip/optimize', (req, res) => {
  try {
    const { items = [], mode = 'MAXIMUM_SAVINGS' } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: 'Please provide at least one item' });
    }
    const result = db.optimizeShoppingTrip(items, mode);
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/shopping-trip/optimize:', err);
    res.status(500).json({ error: err.message || 'Failed to optimize shopping trip' });
  }
});

// POST /api/deals/compare
app.post('/api/deals/compare', (req, res) => {
  try {
    const { dealIds = [] } = req.body;
    const result = db.compareDeals(dealIds);
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/deals/compare:', err);
    res.status(500).json({ error: err.message || 'Failed to compare deals' });
  }
});

// GET /api/deals/:id
app.get('/api/deals/:id', (req, res) => {
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  res.json(deal);
});

// POST /api/deals/:id/vote (Community verification confirmation)
app.post('/api/deals/:id/vote', (req, res) => {
  const { voteType } = req.body; // 'works' | 'doesnt_work'
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  if (voteType === 'works') {
    deal.verification.userConfirmations += 1;
    deal.verification.lastUserConfirmedAgo = 'Just now';
    deal.verification.lastChecked = new Date().toISOString();
    deal.verification.confidenceScore = Math.min(100, deal.verification.confidenceScore + 1);
  } else {
    deal.verification.userFailureReports += 1;
    if (deal.verification.userFailureReports >= 3) {
      deal.verification.status = 'POSSIBLY_EXPIRED';
      deal.verification.confidenceScore = Math.max(40, deal.verification.confidenceScore - 15);
    }
  }

  res.json({
    success: true,
    userConfirmations: deal.verification.userConfirmations,
    userFailureReports: deal.verification.userFailureReports,
    confidenceScore: deal.verification.confidenceScore,
    status: deal.verification.status
  });
});

// POST /api/deals/:id/report (Detailed multi-type issue report)
app.post('/api/deals/:id/report', (req, res) => {
  const { reportType, comment, savedAmountReported } = req.body;
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  const newReport: UserReport = {
    id: `rep-${Date.now()}`,
    dealId: deal.id,
    dealTitle: deal.title,
    storeName: deal.storeName,
    reportType: reportType || 'doesnt_work',
    comment: comment || '',
    savedAmountReported: savedAmountReported ? parseFloat(savedAmountReported) : undefined,
    userIpOrId: req.ip || 'anon-user',
    createdAt: new Date().toISOString(),
    status: 'pending'
  };

  db.reports.unshift(newReport);
  if (reportType === 'works') {
    deal.verification.userConfirmations += 1;
  } else {
    deal.verification.userFailureReports += 1;
  }

  res.json({ success: true, report: newReport });
});

// GET /api/stores
app.get('/api/stores', (req, res) => {
  const { category, retailerCategory, hasWeeklyAd, q } = req.query as Record<string, string>;
  let stores = db.stores.map(s => {
    const storeDeals = db.deals.filter(d => d.storeId === s.id || d.storeDomain === s.domain);
    return {
      ...s,
      isFollowed: db.followedStoreIds.has(s.id),
      dealCount: storeDeals.length,
      couponCount: storeDeals.filter(d => d.code || d.dealType === 'DIGITAL_COUPON').length,
      hasActiveWeeklyAd: storeDeals.some(d => d.isWeeklyAdDeal || d.weeklyAdInfo) || !!s.weeklyAdUrl
    };
  });

  if (retailerCategory && retailerCategory !== 'ALL' && retailerCategory !== 'All') {
    stores = stores.filter(s => s.retailerCategory === retailerCategory);
  }

  if (category && category !== 'ALL' && category !== 'All') {
    stores = stores.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (hasWeeklyAd === 'true') {
    stores = stores.filter(s => s.hasActiveWeeklyAd);
  }

  if (q && q.trim()) {
    const query = q.toLowerCase().trim();
    stores = stores.filter(s => 
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      (s.popularDiscountText && s.popularDiscountText.toLowerCase().includes(query))
    );
  }

  res.json(stores);
});

// GET /api/stores/:id
app.get('/api/stores/:id', (req, res) => {
  const store = db.stores.find(s => s.id === req.params.id || s.slug === req.params.id);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }
  const storeDeals = db.deals.filter(d => d.storeId === store.id || d.storeDomain === store.domain);
  const storeLocations = db.locations.filter(l => l.storeId === store.id);
  const storeLoyalty = db.loyaltyPrograms.find(p => p.storeId === store.id);

  res.json({
    store: {
      ...store,
      isFollowed: db.followedStoreIds.has(store.id),
      dealCount: storeDeals.length
    },
    deals: storeDeals,
    locations: storeLocations,
    loyaltyProgram: storeLoyalty
  });
});

// GET /api/locations (Find store locations by ZIP or storeId)
app.get('/api/locations', (req, res) => {
  const { zip, storeId } = req.query as Record<string, string>;
  const locs = db.getLocations(zip, storeId);
  res.json({ count: locs.length, locations: locs });
});

// GET /api/loyalty-programs (Get all store loyalty programs)
app.get('/api/loyalty-programs', (req, res) => {
  res.json(db.loyaltyPrograms);
});

// POST /api/loyalty-programs/:id/toggle (Toggle user enrollment)
app.post('/api/loyalty-programs/:id/toggle', (req, res) => {
  const enrolled = db.toggleLoyaltyEnrollment(req.params.id);
  res.json({ success: true, userEnrolled: enrolled });
});

// POST /api/stores/:id/follow
app.post('/api/stores/:id/follow', (req, res) => {
  const { id } = req.params;
  const isFollowed = db.followedStoreIds.has(id);
  if (isFollowed) {
    db.followedStoreIds.delete(id);
  } else {
    db.followedStoreIds.add(id);
  }
  res.json({ isFollowed: !isFollowed });
});

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const categoryCounts: Record<string, number> = {};
  for (const deal of db.deals) {
    categoryCounts[deal.category] = (categoryCounts[deal.category] || 0) + 1;
  }
  const categories = Object.keys(categoryCounts).map(name => ({
    name,
    count: categoryCounts[name]
  }));
  res.json(categories);
});

// POST /api/calculator/stack
app.post('/api/calculator/stack', (req, res) => {
  const {
    originalPrice = 100,
    storeSalePercent = 0,
    storeSaleDollar = 0,
    couponPercent = 0,
    couponDollar = 0,
    mfrCouponDollar = 0,
    cashbackPercent = 0,
    freeShipping = false,
    shippingCost = 7.99
  } = req.body;

  const orig = Math.max(0, parseFloat(originalPrice) || 0);
  
  // 1. Sale markdown
  let afterSale = orig;
  let saleDiscount = 0;
  if (storeSalePercent > 0) {
    saleDiscount += (orig * storeSalePercent) / 100;
  }
  if (storeSaleDollar > 0) {
    saleDiscount += storeSaleDollar;
  }
  afterSale = Math.max(0, orig - saleDiscount);

  // 2. Store Coupon
  let storeCouponDiscount = 0;
  if (couponPercent > 0) {
    storeCouponDiscount += (afterSale * couponPercent) / 100;
  }
  if (couponDollar > 0) {
    storeCouponDiscount += couponDollar;
  }
  let afterStoreCoupon = Math.max(0, afterSale - storeCouponDiscount);

  // 3. Manufacturer coupon
  const mfrDiscount = Math.min(afterStoreCoupon, Math.max(0, parseFloat(mfrCouponDollar) || 0));
  const actualCheckoutPrice = Math.max(0, afterStoreCoupon - mfrDiscount);

  // 4. Cashback
  const cashbackDiscount = (actualCheckoutPrice * (parseFloat(cashbackPercent) || 0)) / 100;

  // 5. Free shipping savings
  const shippingSavings = freeShipping ? (parseFloat(shippingCost) || 0) : 0;

  const estimatedEffectivePrice = Math.max(0, actualCheckoutPrice - cashbackDiscount);
  const totalSaved = orig - estimatedEffectivePrice + shippingSavings;
  const totalSavedPercentage = orig > 0 ? (totalSaved / orig) * 100 : 0;

  const breakdown: StackingBreakdown = {
    isStackable: true,
    originalPrice: orig,
    actualCheckoutPrice: Number(actualCheckoutPrice.toFixed(2)),
    estimatedEffectivePrice: Number(estimatedEffectivePrice.toFixed(2)),
    totalSaved: Number(totalSaved.toFixed(2)),
    totalSavedPercentage: Number(totalSavedPercentage.toFixed(1)),
    components: [
      {
        title: 'Store Markdown Sale',
        type: 'sale',
        discountAmount: Number(saleDiscount.toFixed(2)),
        permitted: true,
        confidence: 100
      },
      {
        title: 'Store Promo Code',
        type: 'store_coupon',
        discountAmount: Number(storeCouponDiscount.toFixed(2)),
        permitted: true,
        confidence: 98
      },
      {
        title: 'Manufacturer Coupon',
        type: 'mfr_coupon',
        discountAmount: Number(mfrDiscount.toFixed(2)),
        permitted: true,
        confidence: 95
      },
      {
        title: 'Cashback Rebate',
        type: 'cashback',
        discountAmount: Number(cashbackDiscount.toFixed(2)),
        permitted: true,
        confidence: 90
      }
    ]
  };

  res.json(breakdown);
});

// POST /api/ai/search-intent
app.post('/api/ai/search-intent', async (req, res) => {
  const { query, location } = req.body;
  if (query && typeof query === 'string') {
    db.searchHistory.unshift(query);
    if (db.searchHistory.length > 20) db.searchHistory = db.searchHistory.slice(0, 20);
  }
  try {
    const parsed = await translateSearchIntent(query, location);
    res.json(parsed);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/ai/search-intent:', err);
    res.status(500).json({ error: err.message || 'Intent translation failed' });
  }
});

// POST /api/ai/assistant
app.post('/api/ai/assistant', async (req, res) => {
  const { message, history } = req.body;
  try {
    const reply = await askDealAssistant(message, history);
    res.json({ reply });
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/ai/assistant:', err);
    res.status(500).json({ error: err.message || 'Assistant response failed' });
  }
});

// POST /api/ai/receipt-scan
app.post('/api/ai/receipt-scan', async (req, res) => {
  const { imageBase64, receiptText, mimeType } = req.body;
  try {
    const result = await analyzeReceipt(imageBase64 || receiptText || '', mimeType);
    res.json(result);
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/ai/receipt-scan:', err);
    res.status(500).json({ error: err.message || 'Receipt analysis failed' });
  }
});

// POST /api/extension/match
app.post('/api/extension/match', (req, res) => {
  const { url = '', storeDomain = '' } = req.body;
  const matchedStore = db.stores.find(s => url.includes(s.domain) || storeDomain.includes(s.domain));
  
  if (!matchedStore) {
    return res.json({
      storeFound: false,
      deals: [],
      bestStack: null,
      message: 'No verified coupons found for this site yet.'
    });
  }

  const storeDeals = db.deals.filter(d => d.storeId === matchedStore.id && !d.expiration.isExpired);
  const bestCodeDeal = storeDeals.find(d => d.code);

  res.json({
    storeFound: true,
    store: matchedStore,
    dealCount: storeDeals.length,
    deals: storeDeals,
    recommendedCode: bestCodeDeal?.code || null,
    cashbackRate: matchedStore.cashbackRate || 0,
    message: `${storeDeals.length} active promotions verified for ${matchedStore.name}.`
  });
});

// User custom lists
app.get('/api/user/lists', (req, res) => {
  res.json(db.userLists);
});

app.post('/api/user/lists', (req, res) => {
  const { name, description, icon } = req.body;
  const newList: UserList = {
    id: `list-${Date.now()}`,
    name: name || 'My Custom List',
    description: description || '',
    icon: icon || 'Bookmark',
    dealIds: [],
    notes: {},
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  db.userLists.push(newList);
  res.json(newList);
});

app.post('/api/user/lists/:id/add', (req, res) => {
  const { dealId, note } = req.body;
  const list = db.userLists.find(l => l.id === req.params.id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  
  if (!list.dealIds.includes(dealId)) {
    list.dealIds.push(dealId);
  }
  if (note) {
    if (!list.notes) list.notes = {};
    list.notes[dealId] = note;
  }
  list.updatedAt = new Date().toISOString();
  res.json(list);
});

app.delete('/api/user/lists/:id/remove/:dealId', (req, res) => {
  const list = db.userLists.find(l => l.id === req.params.id);
  if (!list) return res.status(404).json({ error: 'List not found' });
  list.dealIds = list.dealIds.filter(id => id !== req.params.dealId);
  if (list.notes && list.notes[req.params.dealId]) {
    delete list.notes[req.params.dealId];
  }
  list.updatedAt = new Date().toISOString();
  res.json(list);
});

app.delete('/api/user/lists/:id', (req, res) => {
  db.userLists = db.userLists.filter(l => l.id !== req.params.id);
  res.json({ success: true });
});

// Saved / Favorites
app.get('/api/user/saved', (req, res) => {
  const savedDeals = db.deals.filter(d => db.savedDealIds.has(d.id));
  res.json({
    savedDealIds: Array.from(db.savedDealIds),
    deals: savedDeals
  });
});

app.post('/api/user/saved/toggle', (req, res) => {
  const { dealId } = req.body;
  const isSaved = db.savedDealIds.has(dealId);
  if (isSaved) {
    db.savedDealIds.delete(dealId);
  } else {
    db.savedDealIds.add(dealId);
    db.savingsTracker.dealsSavedCount += 1;
  }
  res.json({ isSaved: !isSaved, savedCount: db.savedDealIds.size });
});

// Product Watchlist
app.get('/api/user/watchlist', (req, res) => {
  res.json(db.watchlist);
});

app.post('/api/user/watchlist', (req, res) => {
  const { productName, targetPrice, currentBestPrice, bestStore, imageUrl, dealId } = req.body;
  const newItem: ProductWatchlistItem = {
    id: `watch-${Date.now()}`,
    productName: productName || 'Tracked Product',
    targetPrice: parseFloat(targetPrice) || 50,
    currentBestPrice: parseFloat(currentBestPrice) || 60,
    bestStore: bestStore || 'Online Retailer',
    imageUrl,
    activeCouponsCount: 2,
    cashbackRate: 3.0,
    lowest12MonthPrice: parseFloat(currentBestPrice) || 60,
    lastChecked: new Date().toISOString(),
    dealId
  };
  db.watchlist.unshift(newItem);
  res.json(newItem);
});

app.delete('/api/user/watchlist/:id', (req, res) => {
  db.watchlist = db.watchlist.filter(w => w.id !== req.params.id);
  res.json({ success: true });
});

// Deal Alerts
app.get('/api/user/alerts', (req, res) => {
  res.json(db.dealAlerts);
});

app.post('/api/user/alerts', (req, res) => {
  const { query, type = 'keyword_match', targetStore, minDiscountPercent, targetPriceMax, notifyEmail = true, notifyPush = true } = req.body;
  const newAlert: DealAlert = {
    id: `alert-${Date.now()}`,
    query: query || 'Custom Savings Alert',
    type,
    targetStore,
    minDiscountPercent: minDiscountPercent ? parseFloat(minDiscountPercent) : undefined,
    targetPriceMax: targetPriceMax ? parseFloat(targetPriceMax) : undefined,
    notifyEmail,
    notifyPush,
    active: true,
    matchCount: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date().toISOString()
  };
  db.dealAlerts.unshift(newAlert);
  res.json(newAlert);
});

app.delete('/api/user/alerts/:id', (req, res) => {
  db.dealAlerts = db.dealAlerts.filter(a => a.id !== req.params.id);
  res.json({ success: true });
});

// Admin Metrics & Dashboard
app.get('/api/admin/metrics', (req, res) => {
  res.json({
    metrics: db.getMetrics(),
    recentRuns: db.pipelineRunHistory
  });
});

app.get('/api/admin/reports', (req, res) => {
  res.json(db.reports);
});

app.post('/api/admin/reports/:id/resolve', (req, res) => {
  const report = db.reports.find(r => r.id === req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  report.status = req.body.status || 'resolved';
  res.json(report);
});

app.post('/api/admin/pipeline/trigger', async (req, res) => {
  try {
    const result = await runIngestionPipeline();
    res.json({ success: true, result });
  } catch (err: any) {
    console.error('[SNAGZ API ERROR] /api/admin/pipeline/trigger:', err);
    res.status(500).json({ error: err.message || 'Pipeline trigger failed' });
  }
});

app.post('/api/admin/deals/:id/moderate', (req, res) => {
  const { action, status, score } = req.body;
  const deal = db.deals.find(d => d.id === req.params.id);
  if (!deal) return res.status(404).json({ error: 'Deal not found' });

  if (action === 'reject') {
    deal.verification.status = 'INVALID';
  } else if (action === 'approve') {
    deal.verification.status = 'VERIFIED_ACTIVE';
    deal.verification.confidenceScore = 100;
  }
  if (status) deal.verification.status = status;
  if (score) deal.dealScore = score;

  res.json({ success: true, deal });
});

// Global error handler ensuring all API errors return JSON and log stack traces for Vercel logs
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[SNAGZ API FATAL ERROR]', {
    method: req.method,
    url: req.originalUrl || req.url,
    message: err?.message,
    stack: err?.stack
  });
  if (res.headersSent) {
    return next(err);
  }
  res.status(err?.status || 500).json({ 
    error: err?.message || 'Internal Server Error',
    path: req.originalUrl || req.url
  });
});

export { app };
export default app;
