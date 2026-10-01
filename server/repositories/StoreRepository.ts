import { query } from '../dbClient';
import { db } from '../db';
import { Store } from '../../src/types';

export class StoreRepository {
  /**
   * Find all stores.
   * Returns database retailers/stores if available; otherwise falls back to db.stores.
   */
  async findAll(): Promise<Store[]> {
    try {
      const res = await query('SELECT * FROM retailers ORDER BY name ASC');
      if (res && res.rows.length > 0) {
        return res.rows.map((r: any) => ({
          id: `store-${r.id}`,
          name: r.name,
          slug: r.id,
          domain: r.domain,
          logo: r.logo_url || '',
          category: 'Retail',
          description: `${r.name} store profile and verified deals.`,
          cashbackRate: 2.0,
          cashbackProvider: r.affiliate_network || 'Direct',
          allowsStacking: r.supports_coupons,
          couponCount: 10,
          dealCount: 25,
          popularDiscountText: 'Verified Retailer',
          verifiedScore: 95,
          isFollowed: true
        }));
      }
    } catch {
      // In-memory fallback
    }

    return db.stores;
  }

  /**
   * Find a store by slug or ID.
   */
  async findBySlug(slug: string): Promise<Store | null> {
    try {
      const res = await query('SELECT * FROM retailers WHERE id = $1 LIMIT 1', [slug]);
      if (res && res.rows.length > 0) {
        const r = res.rows[0];
        return {
          id: `store-${r.id}`,
          name: r.name,
          slug: r.id,
          domain: r.domain,
          logo: r.logo_url || '',
          category: 'Retail',
          description: `${r.name} store profile and verified deals.`,
          cashbackRate: 2.0,
          cashbackProvider: r.affiliate_network || 'Direct',
          allowsStacking: r.supports_coupons,
          couponCount: 10,
          dealCount: 25,
          popularDiscountText: 'Verified Retailer',
          verifiedScore: 95,
          isFollowed: true
        };
      }
    } catch {
      // In-memory fallback
    }

    const inMem = db.stores.find(s => s.slug === slug || s.id === slug);
    return inMem || null;
  }
}

export const storeRepository = new StoreRepository();
