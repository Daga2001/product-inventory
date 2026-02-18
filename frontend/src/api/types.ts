export interface Zone {
  id: string;
  name: string;
  position_x: number;
  position_y: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  batch_number: string;
  quantity: number;
  expiration_date: string | null;
  created_at: string;
  zone_id: string | null;
}
