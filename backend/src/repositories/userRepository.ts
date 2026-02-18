import { query } from '../db/index.js';
import { User } from '../types/index.js';

export const userRepository = {
  async findByEmail(email: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] ?? null;
  },
  async findById(id: string): Promise<User | null> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] ?? null;
  },
  async create(input: Pick<User, 'name' | 'email' | 'password_hash' | 'role'>): Promise<User> {
    const result = await query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
      [input.name, input.email, input.password_hash, input.role]
    );
    return result.rows[0];
  }
};
