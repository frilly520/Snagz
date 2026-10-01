import { query } from '../dbClient';
import { db } from '../db';
import { PromoCode, PromoCodeStatus } from '../../src/types';

export class CouponRepository {
  /**
   * Find active promo codes, optionally filtered by store slug.
   */
  async findActive(storeSlug?: string): Promise<PromoCode[]> {
    try {
      let sql = `
        SELECT c.*, r.name as store_name, r.id as store_slug, r.logo_url as store_logo, r.domain as store_domain
        FROM coupons c
        JOIN retailers r ON c.retailer_id = r.id
        WHERE c.is_active = TRUE
      `;
      const params: any[] = [];
      if (storeSlug && storeSlug !== 'all') {
        sql += ' AND (r.id = $1 OR r.name ILIKE $1)';
        params.push(storeSlug);
      }
      sql += ' ORDER BY c.created_at DESC';

      const res = await query(sql, params);
      if (res && res.rows.length > 0) {
        return res.rows.map((row: any): PromoCode => {
          let discountType: 'PERCENT_OFF' | 'DOLLAR_OFF' | 'FREE_SHIPPING' | 'NEW_CUSTOMER' | 'CLEARANCE' = 'PERCENT_OFF';
          if (row.coupon_type === 'FIXED_AMOUNT') discountType = 'DOLLAR_OFF';
          else if (row.coupon_type === 'FREE_SHIPPING') discountType = 'FREE_SHIPPING';

          let verificationStatus: PromoCodeStatus = 'VERIFIED';
          if (row.verification_status === 'UNVERIFIED') verificationStatus = 'UNVERIFIED';
          else if (row.verification_status === 'EXPIRED') verificationStatus = 'EXPIRED';

          return {
            id: row.id,
            storeName: row.store_name,
            storeSlug: row.store_slug,
            storeLogo: row.store_logo || '',
            storeUrl: `https://${row.store_domain || 'example.com'}`,
            code: row.code,
            discount: row.offer_headline || `${row.discount_value}% OFF`,
            discountType,
            discountValue: Number(row.discount_value) || 0,
            minPurchase: Number(row.min_purchase) || undefined,
            description: row.description || '',
            restrictions: row.terms || undefined,
            expirationDate: row.expires_at || undefined,
            lastVerified: 'Recently',
            lastVerifiedTimestamp: row.last_verified_at ? new Date(row.last_verified_at).getTime() : Date.now(),
            verificationStatus,
            verificationSource: 'OFFICIAL_PROMOTION_PAGE',
            isStaffPick: true
          };
        });
      }
    } catch {
      // In-memory fallback
    }

    let codes = [...db.promoCodes];
    if (storeSlug && storeSlug !== 'all') {
      codes = codes.filter(c => c.storeSlug === storeSlug || c.storeName.toLowerCase().includes(storeSlug.toLowerCase()));
    }
    return codes;
  }

  /**
   * Find a single coupon by ID.
   */
  async findById(id: string): Promise<PromoCode | null> {
    try {
      const res = await query(
        `SELECT c.*, r.name as store_name, r.id as store_slug, r.logo_url as store_logo, r.domain as store_domain
         FROM coupons c
         JOIN retailers r ON c.retailer_id = r.id
         WHERE c.id = $1 LIMIT 1`,
        [id]
      );
      if (res && res.rows.length > 0) {
        const row = res.rows[0];
        let discountType: 'PERCENT_OFF' | 'DOLLAR_OFF' | 'FREE_SHIPPING' | 'NEW_CUSTOMER' | 'CLEARANCE' = 'PERCENT_OFF';
        if (row.coupon_type === 'FIXED_AMOUNT') discountType = 'DOLLAR_OFF';
        else if (row.coupon_type === 'FREE_SHIPPING') discountType = 'FREE_SHIPPING';

        let verificationStatus: PromoCodeStatus = 'VERIFIED';
        if (row.verification_status === 'UNVERIFIED') verificationStatus = 'UNVERIFIED';
        else if (row.verification_status === 'EXPIRED') verificationStatus = 'EXPIRED';

        return {
          id: row.id,
          storeName: row.store_name,
          storeSlug: row.store_slug,
          storeLogo: row.store_logo || '',
          storeUrl: `https://${row.store_domain || 'example.com'}`,
          code: row.code,
          discount: row.offer_headline || `${row.discount_value}% OFF`,
          discountType,
          discountValue: Number(row.discount_value) || 0,
          minPurchase: Number(row.min_purchase) || undefined,
          description: row.description || '',
          restrictions: row.terms || undefined,
          expirationDate: row.expires_at || undefined,
          lastVerified: 'Recently',
          lastVerifiedTimestamp: row.last_verified_at ? new Date(row.last_verified_at).getTime() : Date.now(),
          verificationStatus,
          verificationSource: 'OFFICIAL_PROMOTION_PAGE',
          isStaffPick: true
        };
      }
    } catch {
      // Fallback
    }

    const inMem = db.promoCodes.find(c => c.id === id);
    return inMem || null;
  }
}

export const couponRepository = new CouponRepository();
