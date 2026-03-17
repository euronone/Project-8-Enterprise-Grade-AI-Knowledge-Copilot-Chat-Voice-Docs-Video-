import axios, { type AxiosInstance, type AxiosRequestConfig, isAxiosError } from "axios";
import { API_V1 } from "./constants";
import type { ApiError } from "@/types/api";

let tokenGetter: (() => Promise<string | null>) | null = null;

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn;
}

const http: AxiosInstance = axios.create({
  baseURL: API_V1,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (isAxiosError(error) && error.response) {
      const apiError: ApiError = {
        status: error.response.status,
        code: error.response.data?.code ?? "UNKNOWN",
        message: error.response.data?.message ?? "An unexpected error occurred",
        details: error.response.data?.details,
      };
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    http.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.post<T>(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.put<T>(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    http.patch<T>(url, data, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    http.delete<T>(url, config).then((r) => r.data),
};

export async function streamChat(
  url: string,
  body: unknown,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: string) => void,
  signal?: AbortSignal
) {
  let token: string | null = null;
  if (tokenGetter) token = await tokenGetter();

  const res = await fetch(`${API_V1}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    onError(`HTTP ${res.status}`);
    return;
  }

  const reader = res.body?.getReader();
  if (!reader) {
    onError("No response body");
    return;
  }

  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) { onDone(); break; }
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter((l) => l.startsWith("data:"));
    for (const line of lines) {
      const data = line.slice(5).trim();
      if (data === "[DONE]") { onDone(); return; }
      try {
        const event = JSON.parse(data);
        if (event.type === "token") onToken(event.content);
        else if (event.type === "error") onError(event.message);
      } catch {
        // ignore malformed SSE
      }
    }
  }
}

export default http;

