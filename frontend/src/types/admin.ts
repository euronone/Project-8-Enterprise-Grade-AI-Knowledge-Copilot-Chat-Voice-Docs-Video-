import type { ID, Timestamp, UserRole } from "./common";
import type { User, Organization } from "./user";

export interface Role {
  id: ID;
  name: string;
  description: string;
  organizationId?: ID;
  permissions: string[];
  isBuiltin: boolean;
  userCount: number;
  createdAt: Timestamp;
}

export interface AuditLog {
  id: ID;
  userId: ID;
  user?: Pick<User, "id" | "name" | "email">;
  action: string;
  resource: string;
  resourceId?: ID;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  organizationId: ID;
  createdAt: Timestamp;
  severity: "info" | "warning" | "critical";
}

export interface SystemHealth {
  status: "healthy" | "degraded" | "down";
  services: ServiceHealth[];
  uptime: number;
  lastCheckedAt: Timestamp;
}

export interface ServiceHealth {
  name: string;
  status: "healthy" | "degraded" | "down";
  latencyMs: number;
  errorRate: number;
  message?: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalOrganizations: number;
  totalDocuments: number;
  totalQueries: number;
  storageUsedBytes: number;
  avgResponseTime: number;
}

export interface FeatureFlag {
  id: ID;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetOrgs?: ID[];
  updatedAt: Timestamp;
}

export interface DataGovernancePolicy {
  id: ID;
  name: string;
  type: "retention" | "classification" | "access" | "dlp";
  description: string;
  rules: Record<string, unknown>;
  organizationId: ID;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface Integration {
  id: ID;
  name: string;
  type: string;
  description: string;
  logoUrl?: string;
  status: "connected" | "disconnected" | "error";
  config: Record<string, unknown>;
  organizationId: ID;
  connectedAt?: Timestamp;
  connectedBy?: ID;
}

export interface BillingSubscription {
  id: ID;
  organizationId: ID;
  plan: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "cancelled" | "past_due" | "trialing";
  currentPeriodStart: Timestamp;
  currentPeriodEnd: Timestamp;
  seatCount: number;
  storageGb: number;
  queryLimit: number;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface Invoice {
  id: ID;
  organizationId: ID;
  amount: number;
  currency: string;
  status: "paid" | "open" | "void";
  period: string;
  downloadUrl?: string;
  createdAt: Timestamp;
}
