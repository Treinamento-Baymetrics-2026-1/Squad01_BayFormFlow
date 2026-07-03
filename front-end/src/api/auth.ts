import { apiClient } from './client';

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginEdgeFunction = async ({ email, password }: LoginCredentials) => {
  const response = await apiClient.post('/auth/v1/token?grant_type=password', {
    email,
    password,
  });
  return response.data;
};