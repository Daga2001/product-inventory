import api from './client';
import { Product, Zone } from './types';

export const fetchZones = async (): Promise<Zone[]> => {
  const response = await api.get<Zone[]>('/zones');
  return response.data;
};

export const createZone = async (payload: Pick<Zone, 'name' | 'position_x' | 'position_y'>): Promise<Zone> => {
  const response = await api.post<Zone>('/zones', payload);
  return response.data;
};

export const updateZone = async (
  id: string,
  payload: Partial<Pick<Zone, 'name' | 'position_x' | 'position_y'>>
): Promise<Zone> => {
  const response = await api.put<Zone>(`/zones/${id}`, payload);
  return response.data;
};

export const fetchZoneProducts = async (zoneId: string): Promise<Product[]> => {
  const response = await api.get<Product[]>(`/zones/${zoneId}/products`);
  return response.data;
};

export const fetchProducts = async (params?: Record<string, string>): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products', { params });
  return response.data;
};

export const createProduct = async (payload: Omit<Product, 'id' | 'created_at'>): Promise<Product> => {
  const response = await api.post<Product>('/products', payload);
  return response.data;
};

export const updateProduct = async (
  id: string,
  payload: Partial<Omit<Product, 'id' | 'created_at'>>
): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, payload);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
