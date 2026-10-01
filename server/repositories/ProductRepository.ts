import { query } from '../dbClient';

export interface ProductRecord {
  id: string;
  upc?: string | null;
  gtin?: string | null;
  mpn?: string | null;
  brand?: string | null;
  product_name: string;
  normalized_title: string;
  category: string;
  subcategory?: string | null;
  description?: string | null;
  image_url?: string | null;
  package_quantity?: number | null;
  package_unit?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class ProductRepository {
  /**
   * Find a canonical product by UPC or GTIN.
   */
  async findByBarcode(barcode: string): Promise<ProductRecord | null> {
    const clean = barcode.trim();
    const res = await query<ProductRecord>(
      'SELECT * FROM products WHERE upc = $1 OR gtin = $1 LIMIT 1',
      [clean]
    );
    if (res && res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  }

  /**
   * Find product by ID.
   */
  async findById(id: string): Promise<ProductRecord | null> {
    const res = await query<ProductRecord>(
      'SELECT * FROM products WHERE id = $1 LIMIT 1',
      [id]
    );
    if (res && res.rows.length > 0) {
      return res.rows[0];
    }
    return null;
  }

  /**
   * Search canonical products by normalized title tokens or MPN.
   */
  async search(searchQuery: string, limit = 20): Promise<ProductRecord[]> {
    const res = await query<ProductRecord>(
      `SELECT * FROM products 
       WHERE normalized_title ILIKE $1 OR mpn ILIKE $1 OR brand ILIKE $1 
       LIMIT $2`,
      [`%${searchQuery}%`, limit]
    );
    return res ? res.rows : [];
  }

  /**
   * Insert or return canonical product.
   */
  async upsert(product: Omit<ProductRecord, 'id'>): Promise<ProductRecord | null> {
    const res = await query<ProductRecord>(
      `INSERT INTO products (
        upc, gtin, mpn, brand, product_name, normalized_title, category, subcategory, description, image_url, package_quantity, package_unit
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (upc) DO UPDATE SET updated_at = NOW(), product_name = EXCLUDED.product_name
       RETURNING *`,
      [
        product.upc || null,
        product.gtin || null,
        product.mpn || null,
        product.brand || null,
        product.product_name,
        product.normalized_title,
        product.category,
        product.subcategory || null,
        product.description || null,
        product.image_url || null,
        product.package_quantity || null,
        product.package_unit || null
      ]
    );
    return res && res.rows.length > 0 ? res.rows[0] : null;
  }
}

export const productRepository = new ProductRepository();
