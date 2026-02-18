import { query } from '../db/index.js';
import { Zone } from '../types/index.js';

export const zoneRepository = {
  async findAll(): Promise<Zone[]> {
    const result = await query('SELECT * FROM zones ORDER BY position_y, position_x');
    return result.rows;
  },
  async findById(id: string): Promise<Zone | null> {
    const result = await query('SELECT * FROM zones WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async create(input: Pick<Zone, 'name' | 'position_x' | 'position_y'>): Promise<Zone> {
    const result = await query(
      'INSERT INTO zones (name, position_x, position_y) VALUES ($1, $2, $3) RETURNING *',
      [input.name, input.position_x, input.position_y]
    );
    return result.rows[0];
  },
  async update(id: string, input: Partial<Pick<Zone, 'name' | 'position_x' | 'position_y'>>): Promise<Zone> {
    const fields: string[] = [];
    const values: unknown[] = [];

    if (input.name !== undefined) {
      fields.push(`name = $${fields.length + 1}`);
      values.push(input.name);
    }
    if (input.position_x !== undefined) {
      fields.push(`position_x = $${fields.length + 1}`);
      values.push(input.position_x);
    }
    if (input.position_y !== undefined) {
      fields.push(`position_y = $${fields.length + 1}`);
      values.push(input.position_y);
    }

    if (fields.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Zone not found');
      }
      return existing;
    }

    const result = await query(
      `UPDATE zones SET ${fields.join(', ')} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    return result.rows[0];
  },
  async remove(id: string): Promise<void> {
    await query('DELETE FROM zones WHERE id = $1', [id]);
  }
};
