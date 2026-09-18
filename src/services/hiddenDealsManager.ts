import { Deal, HiddenDealItem, HideDealReason } from '../types';
import { api } from './api';

const STORAGE_KEY = 'snagz_hidden_deals_v1';

class HiddenDealsManager {
  private hiddenMap: Map<string, HiddenDealItem> = new Map();
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: HiddenDealItem[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.hiddenMap.clear();
          parsed.forEach(item => {
            if (item && item.dealId) {
              this.hiddenMap.set(item.dealId, item);
            }
          });
        }
      }
    } catch (e) {
      console.warn('[HiddenDeals] Error reading from localStorage:', e);
    }
  }

  private saveToStorage() {
    try {
      const items = Array.from(this.hiddenMap.values());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('[HiddenDeals] Error saving to localStorage:', e);
    }
  }

  private notify() {
    this.listeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error(e);
      }
    });
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    // Synchronize with server
    try {
      const serverRes = await api.getHiddenDeals();
      if (serverRes && Array.isArray(serverRes.hiddenDeals)) {
        serverRes.hiddenDeals.forEach(serverItem => {
          if (!this.hiddenMap.has(serverItem.dealId)) {
            this.hiddenMap.set(serverItem.dealId, serverItem);
          }
        });
        this.saveToStorage();
        this.notify();
      }
    } catch (err) {
      // Offline or server unavailable: local state is preserved
    }
  }

  getHiddenDeals(): HiddenDealItem[] {
    return Array.from(this.hiddenMap.values()).sort(
      (a, b) => new Date(b.hiddenAt).getTime() - new Date(a.hiddenAt).getTime()
    );
  }

  getHiddenDealIds(): Set<string> {
    return new Set(this.hiddenMap.keys());
  }

  isDealHidden(dealId: string): boolean {
    return this.hiddenMap.has(dealId);
  }

  filterVisibleDeals(deals: Deal[]): Deal[] {
    return deals.filter(deal => !this.isDealHidden(deal.id));
  }

  async setReason(dealId: string, reason: HideDealReason): Promise<void> {
    return this.updateReason(dealId, reason);
  }

  async hideDeal(deal: Deal, reason?: HideDealReason): Promise<HiddenDealItem> {
    const item: HiddenDealItem = {
      dealId: deal.id,
      dealTitle: deal.title,
      storeName: deal.storeName,
      storeLogo: deal.storeLogo,
      price: deal.estimatedFinalPrice ?? deal.currentPrice,
      originalPrice: deal.originalPrice,
      reason,
      hiddenAt: new Date().toISOString()
    };

    // Update local immediately for instantaneous UI reaction
    this.hiddenMap.set(deal.id, item);
    this.saveToStorage();
    this.notify();

    // Sync with backend API
    try {
      await api.hideDeal(item);
    } catch (err) {
      console.warn('[HiddenDeals] Server sync warning:', err);
    }

    return item;
  }

  async updateReason(dealId: string, reason: HideDealReason): Promise<void> {
    const existing = this.hiddenMap.get(dealId);
    if (!existing) return;

    existing.reason = reason;
    this.saveToStorage();
    this.notify();

    try {
      await api.hideDeal(existing);
    } catch (err) {
      console.warn('[HiddenDeals] Server sync warning:', err);
    }
  }

  async restoreDeal(dealId: string): Promise<void> {
    if (!this.hiddenMap.has(dealId)) return;

    this.hiddenMap.delete(dealId);
    this.saveToStorage();
    this.notify();

    try {
      await api.restoreHiddenDeal(dealId);
    } catch (err) {
      console.warn('[HiddenDeals] Server sync warning:', err);
    }
  }

  async restoreAll(): Promise<void> {
    this.hiddenMap.clear();
    this.saveToStorage();
    this.notify();

    try {
      await api.restoreAllHiddenDeals();
    } catch (err) {
      console.warn('[HiddenDeals] Server sync warning:', err);
    }
  }
}

export const hiddenDealsManager = new HiddenDealsManager();
