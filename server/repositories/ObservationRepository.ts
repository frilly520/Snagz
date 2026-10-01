import { query } from '../dbClient';

export interface ObservationRecord {
  id?: number;
  product_id: string;
  retailer_id: string;
  store_id?: string | null;
  retailer_product_id: string;
  observed_price: number;
  list_price?: number | null;
  availability: string;
  inventory_count?: number | null;
  source: string;
  source_url?: string | null;
  observed_at?: string;
}

export class ObservationRepository {
  /**
   * Append an immutable price observation record.
   */
  async recordObservation(obs: ObservationRecord): Promise<boolean> {
    const res = await query(
      `INSERT INTO price_observations (
        product_id, retailer_id, store_id, retailer_product_id, observed_price, list_price, availability, inventory_count, source, source_url
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        obs.product_id,
        obs.retailer_id,
        obs.store_id || null,
        obs.retailer_product_id,
        obs.observed_price,
        obs.list_price || null,
        obs.availability,
        obs.inventory_count || null,
        obs.source,
        obs.source_url || null
      ]
    );

    return !!(res && res.rows.length > 0);
  }

  /**
   * Get historical observations for a product.
   */
  async getHistoryForProduct(productId: string, limit = 50): Promise<ObservationRecord[]> {
    const res = await query<ObservationRecord>(
      `SELECT * FROM price_observations 
       WHERE product_id = $1 
       ORDER BY observed_at DESC 
       LIMIT $2`,
      [productId, limit]
    );

    return res ? res.rows : [];
  }
}

export const observationRepository = new ObservationRepository();
