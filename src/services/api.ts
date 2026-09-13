import {
  Deal,
  Store,
  UserList,
  DealAlert,
  ProductWatchlistItem,
  UserReport,
  AdminMetrics,
  StackingBreakdown,
  NaturalSearchIntent,
  ReceiptScanResult,
  BestDealEvaluation,
  PriceDropCombinationAlert,
  SavingsTrackerState,
  UserPrivacySettings,
  PennyItem,
  PennyListHealth,
  PennyFeedbackType,
  PennyReportSubmission
} from '../types';
import { FALLBACK_DEALS, FALLBACK_STORES } from './fallbackDeals';

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  const res = await fetch(url, { ...init, headers });
  const contentType = res.headers.get('content-type') || '';

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    if (contentType.includes('application/json')) {
      try {
        const body = await res.json();
        message = body.error || body.message || message;
      } catch {
        // ignore
      }
    } else {
      try {
        const text = await res.text();
        if (text && text.length < 200) message = text;
      } catch {
        // ignore
      }
    }
    throw new Error(message);
  }

  if (contentType.includes('application/json')) {
    return res.json();
  }

  // If response is not JSON
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response received from ${url}`);
  }
}

export const api = {
  // Deals
  async getDeals(params?: {
    q?: string;
    category?: string;
    storeId?: string;
    freeType?: string;
    freeOnly?: boolean;
    moneyMakerOnly?: boolean;
    recipesOnly?: boolean;
    sort?: string;
    minScore?: number;
    minConfidence?: number;
    expiringOnly?: boolean;
    featuredOnly?: boolean;
    channel?: string;
    localOnly?: boolean;
    zip?: string;
  }): Promise<{ count: number; deals: Deal[] }> {
    const query = new URLSearchParams();
    if (params?.q) query.set('q', params.q);
    if (params?.category) query.set('category', params.category);
    if (params?.storeId) query.set('storeId', params.storeId);
    if (params?.freeType) query.set('freeType', params.freeType);
    if (params?.freeOnly) query.set('freeOnly', 'true');
    if (params?.moneyMakerOnly) query.set('moneyMakerOnly', 'true');
    if (params?.recipesOnly) query.set('recipesOnly', 'true');
    if (params?.sort) query.set('sort', params.sort);
    if (params?.minScore) query.set('minScore', params.minScore.toString());
    if (params?.minConfidence) query.set('minConfidence', params.minConfidence.toString());
    if (params?.expiringOnly) query.set('expiringOnly', 'true');
    if (params?.featuredOnly) query.set('featuredOnly', 'true');
    if (params?.channel) query.set('channel', params.channel);
    if (params?.localOnly) query.set('localOnly', 'true');
    if (params?.zip) query.set('zip', params.zip);

    try {
      const res = await request<{ count: number; deals: Deal[] }>(`/api/deals?${query.toString()}`);
      if (res && Array.isArray(res.deals) && res.deals.length > 0) {
        return res;
      }
      // If server returned 0 deals for default empty query, use verified fallback catalog
      if (!params?.q && (!params?.category || params.category === 'All') && (!res || !res.deals || res.deals.length === 0)) {
        return { count: FALLBACK_DEALS.length, deals: FALLBACK_DEALS };
      }
      return res || { count: 0, deals: [] };
    } catch (err) {
      console.warn('Network request to /api/deals failed, using verified deals fallback:', err);
      let results = [...FALLBACK_DEALS];
      if (params?.q) {
        const q = params.q.toLowerCase();
        results = results.filter(d => 
          d.title.toLowerCase().includes(q) || 
          d.storeName.toLowerCase().includes(q) || 
          d.description.toLowerCase().includes(q)
        );
      }
      if (params?.category && params.category !== 'All') {
        results = results.filter(d => d.category.toLowerCase() === params.category!.toLowerCase());
      }
      if (params?.storeId) {
        results = results.filter(d => d.storeId === params.storeId);
      }
      if (params?.freeOnly) {
        results = results.filter(d => d.freeClassification === '$0_FREE' || d.currentPrice === 0);
      }
      if (params?.moneyMakerOnly) {
        results = results.filter(d => d.isMoneyMaker || (d.moneyMakerAmount && d.moneyMakerAmount > 0));
      }
      if (params?.recipesOnly) {
        results = results.filter(d => d.savingsRecipe && (d.savingsRecipe.coupons?.length > 0 || d.savingsRecipe.outOfPocketToday !== undefined));
      }
      return { count: results.length, deals: results };
    }
  },

  async getDealById(id: string): Promise<Deal> {
    try {
      return await request<Deal>(`/api/deals/${id}`);
    } catch (err) {
      const found = FALLBACK_DEALS.find(d => d.id === id);
      if (found) return found;
      throw err;
    }
  },

  // Best Deal Intelligence Engine
  async getBestDeal(q?: string, category?: string): Promise<{ bestDeal: Deal; evaluation: BestDealEvaluation }> {
    const query = new URLSearchParams();
    if (q) query.set('q', q);
    if (category) query.set('category', category);
    try {
      return await request<{ bestDeal: Deal; evaluation: BestDealEvaluation }>(`/api/best-deal?${query.toString()}`);
    } catch (err) {
      const best = FALLBACK_DEALS.find(d => d.bestDealEvaluation?.isRankOne) || FALLBACK_DEALS[0];
      return {
        bestDeal: best,
        evaluation: best.bestDealEvaluation || {
          isRankOne: true,
          productTarget: best.title,
          regularPrice: best.originalPrice || 100,
          currentPrice: best.currentPrice,
          couponDiscount: 0,
          cashbackDiscount: 0,
          shippingCost: 0,
          estimatedEffectivePrice: best.estimatedFinalPrice || best.currentPrice,
          estimatedTotalSavings: (best.originalPrice || 0) - (best.estimatedFinalPrice || best.currentPrice),
          savingsPercentage: best.estimatedSavingsPercent || 0,
          whyBestDealExplanation: 'Top ranked verified deal.',
          whyBestDealBullets: [],
          historicalRecordNote: 'Lowest recorded price in tracked history',
          independentDealScore: best.dealScore,
          independentDataConfidence: best.dataConfidence,
          affiliateCommissionBiased: false,
          competingOffers: []
        }
      };
    }
  },

  // Price Drop Alerts
  async getPriceDropAlerts(): Promise<PriceDropCombinationAlert[]> {
    return request<PriceDropCombinationAlert[]>('/api/alerts/price-drops');
  },

  // Personal Savings Tracker & Confirmation
  async getSavingsTracker(): Promise<SavingsTrackerState> {
    return request<SavingsTrackerState>('/api/savings-tracker');
  },

  async confirmSavings(dealId: string, amountSaved: number, couponCode?: string): Promise<{ success: boolean; savingsTracker: SavingsTrackerState }> {
    return request<{ success: boolean; savingsTracker: SavingsTrackerState }>('/api/savings-tracker/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, amountSaved, couponCode })
    });
  },

  // Privacy & Settings
  async getPrivacySettings(): Promise<{ settings: UserPrivacySettings; searchHistory: string[] }> {
    return request<{ settings: UserPrivacySettings; searchHistory: string[] }>('/api/settings/privacy');
  },

  async updatePrivacySettings(settings: Partial<UserPrivacySettings>): Promise<{ success: boolean; settings: UserPrivacySettings }> {
    return request<{ success: boolean; settings: UserPrivacySettings }>('/api/settings/privacy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
  },

  async clearSearchHistory(): Promise<void> {
    return request<void>('/api/privacy/clear-history', { method: 'POST' });
  },

  async purgeUserData(): Promise<void> {
    return request<void>('/api/privacy/purge-data', { method: 'POST' });
  },

  // Community Feedback & Multi-Type Issue Reporting
  async voteDeal(id: string, voteType: 'works' | 'doesnt_work'): Promise<{
    success: boolean;
    userConfirmations: number;
    userFailureReports: number;
    confidenceScore: number;
    status: string;
  }> {
    return request<{
      success: boolean;
      userConfirmations: number;
      userFailureReports: number;
      confidenceScore: number;
      status: string;
    }>(`/api/deals/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType })
    });
  },

  async reportDeal(id: string, reportType: string, comment?: string, savedAmountReported?: number): Promise<{ success: boolean; report: UserReport }> {
    return request<{ success: boolean; report: UserReport }>(`/api/deals/${id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportType, comment, savedAmountReported })
    });
  },

  // Stores
  async getStores(): Promise<Store[]> {
    try {
      const res = await request<Store[]>('/api/stores');
      if (Array.isArray(res) && res.length > 0) return res;
      return FALLBACK_STORES;
    } catch (err) {
      console.warn('Network request to /api/stores failed, using fallback stores:', err);
      return FALLBACK_STORES;
    }
  },

  async getStoreById(id: string): Promise<{ store: Store; deals: Deal[] }> {
    try {
      return await request<{ store: Store; deals: Deal[] }>(`/api/stores/${id}`);
    } catch (err) {
      const store = FALLBACK_STORES.find(s => s.id === id) || FALLBACK_STORES[0];
      const deals = FALLBACK_DEALS.filter(d => d.storeId === id);
      return { store, deals };
    }
  },

  async toggleFollowStore(id: string): Promise<{ isFollowed: boolean }> {
    return request<{ isFollowed: boolean }>(`/api/stores/${id}/follow`, { method: 'POST' });
  },

  // Categories
  async getCategories(): Promise<{ name: string; count: number }[]> {
    try {
      const res = await request<{ name: string; count: number }[]>('/api/categories');
      if (Array.isArray(res) && res.length > 0) return res;
      const map = new Map<string, number>();
      FALLBACK_DEALS.forEach(d => {
        if (d.category) map.set(d.category, (map.get(d.category) || 0) + 1);
      });
      return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    } catch {
      const map = new Map<string, number>();
      FALLBACK_DEALS.forEach(d => {
        if (d.category) map.set(d.category, (map.get(d.category) || 0) + 1);
      });
      return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
    }
  },

  // Shopping Trip Optimizer
  async optimizeShoppingTrip(params: {
    items: (string | { name: string; quantity?: number })[];
    mode?: 'MAXIMUM_SAVINGS' | 'MINIMUM_TRAVEL';
  }) {
    return request('/api/shopping-trip/optimize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  },

  // Deal Comparison
  async compareDeals(dealIds: string[]): Promise<(Deal & { isBestChoice?: boolean })[]> {
    return request<(Deal & { isBestChoice?: boolean })[]>('/api/deals/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealIds })
    });
  },

  // Calculator
  async calculateStack(params: {
    originalPrice: number;
    storeSalePercent?: number;
    storeSaleDollar?: number;
    couponPercent?: number;
    couponDollar?: number;
    mfrCouponDollar?: number;
    cashbackPercent?: number;
    freeShipping?: boolean;
    shippingCost?: number;
  }): Promise<StackingBreakdown> {
    return request<StackingBreakdown>('/api/calculator/stack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  },

  // AI
  async parseSearchIntent(query: string, location?: string): Promise<NaturalSearchIntent> {
    return request<NaturalSearchIntent>('/api/ai/search-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, location })
    });
  },

  async askAssistant(message: string, history: any[] = []): Promise<{ reply: string }> {
    return request<{ reply: string }>('/api/ai/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
  },

  async scanReceipt(params: { imageBase64?: string; receiptText?: string; mimeType?: string }): Promise<ReceiptScanResult> {
    return request<ReceiptScanResult>('/api/ai/receipt-scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  },

  // Extension Match
  async matchExtension(url: string, cartTotal?: number) {
    return request('/api/extension/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, cartTotal })
    });
  },

  // User Custom Lists
  async getUserLists(): Promise<UserList[]> {
    return request<UserList[]>('/api/user/lists');
  },

  async createUserList(name: string, description?: string, icon?: string): Promise<UserList> {
    return request<UserList>('/api/user/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, icon })
    });
  },

  async addDealToList(listId: string, dealId: string, note?: string): Promise<UserList> {
    return request<UserList>(`/api/user/lists/${listId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId, note })
    });
  },

  async removeDealFromList(listId: string, dealId: string): Promise<UserList> {
    return request<UserList>(`/api/user/lists/${listId}/remove/${dealId}`, { method: 'DELETE' });
  },

  async deleteUserList(listId: string): Promise<void> {
    return request<void>(`/api/user/lists/${listId}`, { method: 'DELETE' });
  },

  // Saved
  async getSavedDeals(): Promise<{ savedDealIds: string[]; deals: Deal[] }> {
    return request<{ savedDealIds: string[]; deals: Deal[] }>('/api/user/saved');
  },

  async toggleSaveDeal(dealId: string): Promise<{ isSaved: boolean; savedCount: number }> {
    return request<{ isSaved: boolean; savedCount: number }>('/api/user/saved/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dealId })
    });
  },

  // Watchlist
  async getWatchlist(): Promise<ProductWatchlistItem[]> {
    return request<ProductWatchlistItem[]>('/api/user/watchlist');
  },

  async addToWatchlist(item: {
    productName: string;
    targetPrice: number;
    currentBestPrice: number;
    bestStore: string;
    imageUrl?: string;
    dealId?: string;
  }): Promise<ProductWatchlistItem> {
    return request<ProductWatchlistItem>('/api/user/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
  },

  async removeFromWatchlist(id: string): Promise<void> {
    return request<void>(`/api/user/watchlist/${id}`, { method: 'DELETE' });
  },

  // Alerts
  async getAlerts(): Promise<DealAlert[]> {
    return request<DealAlert[]>('/api/user/alerts');
  },

  async createAlert(params: Partial<DealAlert>): Promise<DealAlert> {
    return request<DealAlert>('/api/user/alerts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
  },

  async deleteAlert(id: string): Promise<void> {
    return request<void>(`/api/user/alerts/${id}`, { method: 'DELETE' });
  },

  // Admin
  async getAdminMetrics(): Promise<{ metrics: AdminMetrics; recentRuns: any[] }> {
    return request<{ metrics: AdminMetrics; recentRuns: any[] }>('/api/admin/metrics');
  },

  async getAdminReports(): Promise<UserReport[]> {
    return request<UserReport[]>('/api/admin/reports');
  },

  async resolveReport(id: string, status = 'resolved'): Promise<UserReport> {
    return request<UserReport>(`/api/admin/reports/${id}/resolve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  async triggerIngestionPipeline(): Promise<any> {
    return request('/api/admin/pipeline/trigger', { method: 'POST' });
  },

  // -------------------------------------------------------------
  // SNAGZ PENNY LIST API
  // -------------------------------------------------------------
  async getPennyItems(params?: {
    retailerId?: string;
    category?: string;
    status?: string;
    sort?: string;
    q?: string;
    zip?: string;
    activeOnly?: boolean;
  }): Promise<{ items: PennyItem[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.retailerId) query.set('retailerId', params.retailerId);
    if (params?.category) query.set('category', params.category);
    if (params?.status) query.set('status', params.status);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.q) query.set('q', params.q);
    if (params?.zip) query.set('zip', params.zip);
    if (params?.activeOnly) query.set('activeOnly', 'true');
    return request<{ items: PennyItem[]; count: number }>(`/api/penny?${query.toString()}`);
  },

  async getPennyItemById(id: string): Promise<PennyItem> {
    return request<PennyItem>(`/api/penny/${id}`);
  },

  async getPennyHealth(): Promise<PennyListHealth> {
    return request<PennyListHealth>('/api/penny/health');
  },

  async getDollarGeneralPennyItems(params?: { category?: string; sort?: string; q?: string }): Promise<{ items: PennyItem[]; count: number }> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.q) query.set('q', params.q);
    return request<{ items: PennyItem[]; count: number }>(`/api/penny/dollar-general?${query.toString()}`);
  },

  async submitPennyFeedback(id: string, feedbackType: PennyFeedbackType, notes?: string): Promise<{ success: boolean; item: PennyItem }> {
    return request<{ success: boolean; item: PennyItem }>(`/api/penny/${id}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedbackType, notes })
    });
  },

  async submitPennyReport(report: PennyReportSubmission): Promise<{ success: boolean; message: string; itemId?: string }> {
    return request<{ success: boolean; message: string; itemId?: string }>('/api/penny/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report)
    });
  },

  // AI & API Key Security Architecture Status
  async getAiStatus(): Promise<{
    status: string;
    aiEnabled: boolean;
    provider: string;
    proxyArchitecture: string;
    clientExposure: string;
    keyConfigured: boolean;
  }> {
    return request('/api/ai/status');
  }
};
