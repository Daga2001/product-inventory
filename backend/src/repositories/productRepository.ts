import { query } from '../db/index.js';
import { Product } from '../types/index.js';

export interface ProductFilters {
  name?: string;
  batch_number?: string;
  expiration_date?: string;
  zone_id?: string;
}

export interface ProductCreateInput {
  name: string;
  batch_number: string;
  quantity: number;
  expiration_date?: string | null;
  zone_id?: string | null;
}

export type ProductUpdateInput = Partial<ProductCreateInput>;

const buildFilters = (filters: ProductFilters) => {
  const clauses: string[] = [];
  const values: unknown[] = [];

  if (filters.name) {
    clauses.push(`name ILIKE $${clauses.length + 1}`);
    values.push(`%${filters.name}%`);
  }
  if (filters.batch_number) {
    clauses.push(`batch_number ILIKE $${clauses.length + 1}`);
    values.push(`%${filters.batch_number}%`);
  }
  if (filters.expiration_date) {
    clauses.push(`expiration_date = $${clauses.length + 1}`);
    values.push(filters.expiration_date);
  }
  if (filters.zone_id) {
    clauses.push(`zone_id = $${clauses.length + 1}`);
    values.push(filters.zone_id);
  }

  return { clauses, values };
};

export const productRepository = {
  async findAll(userId: string, filters: ProductFilters = {}): Promise<Product[]> {
    const { clauses, values } = buildFilters(filters);
    clauses.push(`user_id = $${clauses.length + 1}`);
    values.push(userId);
    const where = `WHERE ${clauses.join(' AND ')}`;
    const result = await query(
      `SELECT * FROM products ${where} ORDER BY created_at DESC`,
      values
    );
    return result.rows;
  },
  async findById(userId: string, id: string): Promise<Product | null> {
    const result = await query('SELECT * FROM products WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] ?? null;
  },
  async findByZoneId(userId: string, zoneId: string): Promise<Product[]> {
    const result = await query(
      'SELECT * FROM products WHERE zone_id = $1 AND user_id = $2 ORDER BY name',
      [zoneId, userId]
    );
    return result.rows;
  },
  async create(userId: string, input: ProductCreateInput): Promise<Product> {
    const result = await query(
      `INSERT INTO products (user_id, name, batch_number, quantity, expiration_date, zone_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, input.name, input.batch_number, input.quantity, input.expiration_date, input.zone_id]
    );
    return result.rows[0];
  },
  async update(userId: string, id: string, input: ProductUpdateInput): Promise<Product> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const append = (field: keyof Product, value: unknown) => {
      fields.push(`${String(field)} = $${fields.length + 1}`);
      values.push(value);
    };

    if (input.name !== undefined) append('name', input.name);
    if (input.batch_number !== undefined) append('batch_number', input.batch_number);
    if (input.quantity !== undefined) append('quantity', input.quantity);
    if (input.expiration_date !== undefined) append('expiration_date', input.expiration_date);
    if (input.zone_id !== undefined) append('zone_id', input.zone_id);

    if (fields.length === 0) {
      const existing = await this.findById(userId, id);
      if (!existing) {
        throw new Error('Product not found');
      }
      return existing;
    }

    const result = await query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${fields.length + 1} AND user_id = $${
        fields.length + 2
      } RETURNING *`,
      [...values, id, userId]
    );

    return result.rows[0];
  },
  async remove(userId: string, id: string): Promise<void> {
    await query('DELETE FROM products WHERE id = $1 AND user_id = $2', [id, userId]);
  }
};
