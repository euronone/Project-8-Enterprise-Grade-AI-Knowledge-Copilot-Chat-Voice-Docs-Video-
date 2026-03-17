export const APP_NAME = "KnowledgeForge";
export const APP_DESCRIPTION = "Enterprise AI Knowledge Copilot";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000";
export const API_V1 = `${API_URL}/api/v1`;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  SSO: "/sso",
  DASHBOARD: "/home",
  CHAT: "/chat",
  VOICE: "/voice",
  MEETINGS: "/meetings",
  KNOWLEDGE_BASE: "/knowledge-base",
  VIDEO: "/video",
  SEARCH: "/search",
  WORKFLOWS: "/workflows",
  AGENTS: "/agents",
  ANALYTICS: "/analytics",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  PLAYGROUND: "/playground",
  TEAMS: "/teams",
  ADMIN: "/admin",
} as const;

export const AI_MODELS = [
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "anthropic" },
  { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku", provider: "anthropic" },
  { id: "gpt-4o", name: "GPT-4o", provider: "openai" },
  { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "openai" },
] as const;

export const SUPPORTED_FILE_TYPES = {
  documents: [".pdf", ".docx", ".xlsx", ".pptx", ".txt", ".md", ".csv", ".json", ".xml"],
  images: [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
  code: [".js", ".ts", ".py", ".java", ".go", ".rs", ".c", ".cpp", ".cs", ".rb", ".php"],
  email: [".eml", ".msg"],
} as const;

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_VIDEO_SIZE = 10 * 1024 * 1024 * 1024; // 10GB
export const MAX_CHUNK_SIZE = 8 * 1024 * 1024; // 8MB for chunked uploads

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZES: [10, 20, 50, 100],
} as const;

export const TOAST_DURATION = 4000;

export const QUERY_KEYS = {
  CONVERSATIONS: "conversations",
  MESSAGES: "messages",
  DOCUMENTS: "documents",
  COLLECTIONS: "collections",
  CONNECTORS: "connectors",
  MEETINGS: "meetings",
  VIDEOS: "videos",
  SEARCH: "search",
  WORKFLOWS: "workflows",
  AGENTS: "agents",
  ANALYTICS: "analytics",
  USERS: "users",
  ORGANIZATIONS: "organizations",
  TEAMS: "teams",
  NOTIFICATIONS: "notifications",
  AUDIT_LOGS: "audit_logs",
  SYSTEM_HEALTH: "system_health",
} as const;

export const KEYBOARD_SHORTCUTS = {
  SEARCH: "mod+k",
  NEW_CHAT: "mod+n",
  TOGGLE_SIDEBAR: "mod+b",
  VOICE: "mod+shift+v",
  SETTINGS: "mod+,",
} as const;

export const COLORS = {
  BRAND_PRIMARY: "#0ea5e9",
  BRAND_DARK: "#0369a1",
  SUCCESS: "#22c55e",
  WARNING: "#f59e0b",
  ERROR: "#ef4444",
  INFO: "#3b82f6",
} as const;

