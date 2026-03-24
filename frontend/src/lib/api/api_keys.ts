import apiClient from './client';

export interface ApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export interface GeneratedApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  rawKey: string;
  createdAt: string;
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const { data } = await apiClient.get<ApiKey[]>('/api-keys');
  return data;
}

export async function generateApiKey(name: string): Promise<GeneratedApiKey> {
  const { data } = await apiClient.post<GeneratedApiKey>('/api-keys', { name });
  return data;
}

export async function revokeApiKey(id: string): Promise<void> {
  await apiClient.delete(`/api-keys/${id}`);
}
