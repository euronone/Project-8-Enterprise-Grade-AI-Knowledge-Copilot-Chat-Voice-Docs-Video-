import type { ID, Timestamp } from "./common";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface HealthCheck {
  status: "ok" | "degraded" | "down";
  version: string;
  timestamp: Timestamp;
  services: Record<string, "ok" | "degraded" | "down">;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface WebSocketEvent<T = unknown> {
  type: string;
  payload: T;
  timestamp: Timestamp;
  id: ID;
}

