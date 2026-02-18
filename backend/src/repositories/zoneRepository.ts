import { query } from '../db/index.js';
import { Zone } from '../types/index.js';

export const zoneRepository = {
  async findAll(userId: string): Promise<Zone[]> {
    const result = await query('SELECT * FROM zones WHERE user_id = $1 ORDER BY position_y, position_x', [userId]);
    return result.rows;
  },
  async findById(userId: string, id: string): Promise<Zone | null> {
    const result = await query('SELECT * FROM zones WHERE id = $1 AND user_id = $2', [id, userId]);
    return result.rows[0] ?? null;
  },
  async create(userId: string, input: Pick<Zone, 'name' | 'position_x' | 'position_y'>): Promise<Zone> {
    const result = await query(
      'INSERT INTO zones (user_id, name, position_x, position_y) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, input.name, input.position_x, input.position_y]
    );
    return result.rows[0];
  },
  async update(
    userId: string,
    id: string,
    input: Partial<Pick<Zone, 'name' | 'position_x' | 'position_y'>>
  ): Promise<Zone> {
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
      const existing = await this.findById(userId, id);
      if (!existing) {
        throw new Error('Zone not found');
      }
      return existing;
    }

    const result = await query(
      `UPDATE zones SET ${fields.join(', ')} WHERE id = $${fields.length + 1} AND user_id = $${
        fields.length + 2
      } RETURNING *`,
      [...values, id, userId]
    );

    return result.rows[0];
  },
  async remove(userId: string, id: string): Promise<void> {
    await query('DELETE FROM zones WHERE id = $1 AND user_id = $2', [id, userId]);
  }
};
