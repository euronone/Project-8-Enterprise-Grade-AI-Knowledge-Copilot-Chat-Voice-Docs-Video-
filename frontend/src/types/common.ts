export type ID = string;
export type Timestamp = string; // ISO 8601

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface CursorPaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  status: number;
}

export type Theme = "light" | "dark" | "high-contrast";
export type Status = "idle" | "loading" | "success" | "error";

export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: string;
}

export interface FileUpload {
  id: ID;
  name: string;
  size: number;
  type: string;
  url?: string;
  progress?: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export type SortOrder = "asc" | "desc";

export interface SortConfig {
  field: string;
  order: SortOrder;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type UserRole = "super_admin" | "org_admin" | "team_admin" | "member" | "viewer" | "guest";

