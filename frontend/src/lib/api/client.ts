import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import type { ApiError } from '@/types';

const BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000';

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });
  failedQueue = [];
}

function createApiClient(): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor — attach access token
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor — handle 401 and token refresh
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`;
            }
            return instance(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token');

          const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          instance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          processQueue(null, accessToken);

          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // Normalise error shape
      const apiError: ApiError = {
        message: error.response?.data?.message ?? error.message ?? 'An unexpected error occurred',
        code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
        details: error.response?.data?.details,
        statusCode: error.response?.status ?? 0,
      };

      return Promise.reject(apiError);
    }
  );

  return instance;
}

export const apiClient = createApiClient();
export default apiClient;
