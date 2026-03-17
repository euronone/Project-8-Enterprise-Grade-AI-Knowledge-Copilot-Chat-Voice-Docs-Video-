import type { ID, Timestamp, UserRole } from "./common";

export interface User {
  id: ID;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  organizationId: ID;
  teamIds: ID[];
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastActiveAt?: Timestamp;
  isActive: boolean;
  mfaEnabled: boolean;
}

export interface UserPreferences {
  theme: "light" | "dark" | "high-contrast" | "system";
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  aiModel?: string;
  sidebarCollapsed: boolean;
  fontSize: "sm" | "md" | "lg";
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  slack: boolean;
  inApp: boolean;
  digest: "realtime" | "daily" | "weekly" | "never";
}

export interface Organization {
  id: ID;
  name: string;
  slug: string;
  logo?: string;
  domain?: string;
  plan: "free" | "starter" | "professional" | "enterprise";
  settings: OrgSettings;
  createdAt: Timestamp;
  memberCount: number;
}

export interface OrgSettings {
  defaultRole: UserRole;
  allowedDomains: string[];
  ssoEnabled: boolean;
  mfaRequired: boolean;
  dataRetentionDays: number;
  customBranding?: {
    primaryColor: string;
    logo: string;
    favicon: string;
  };
}

export interface Team {
  id: ID;
  name: string;
  description?: string;
  organizationId: ID;
  memberCount: number;
  createdAt: Timestamp;
  avatarColor: string;
}

export interface Invitation {
  id: ID;
  email: string;
  role: UserRole;
  organizationId: ID;
  expiresAt: Timestamp;
  status: "pending" | "accepted" | "expired";
}

export interface Session {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Timestamp;
}
