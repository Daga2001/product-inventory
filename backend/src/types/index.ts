export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  created_at: string;
}

export interface Zone {
  id: string;
  user_id: string;
  name: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export interface Product {
  id: string;
  user_id: string;
  name: string;
  batch_number: string;
  quantity: number;
  expiration_date: string | null;
  created_at: string;
  zone_id: string | null;
}
