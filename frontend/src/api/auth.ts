import api from './client';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

export const login = async (email: string, password: string): Promise<{ token: string }> => {
  const response = await api.post<{ token: string }>('/auth/login', { email, password });
  return response.data;
};

export const fetchMe = async (): Promise<AuthUser> => {
  const response = await api.get<AuthUser>('/auth/me');
  return response.data;
};
