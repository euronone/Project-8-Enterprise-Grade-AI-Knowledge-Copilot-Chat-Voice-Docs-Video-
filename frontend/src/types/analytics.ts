import type { ID, Timestamp } from "./common";

export interface UsageAnalytics {
  queryVolume: TimeSeriesData[];
  activeUsers: TimeSeriesData[];
  topsources: Array<{ name: string; count: number; percentage: number }>;
  topQueries: Array<{ query: string; count: number; avgRank: number }>;
  responseTimeP50: number;
  responseTimeP95: number;
  totalQueries: number;
  totalUsers: number;
  totalDocuments: number;
  period: "day" | "week" | "month" | "quarter";
}

export interface TimeSeriesData {
  date: string;
  value: number;
  label?: string;
}

export interface AiPerformanceMetrics {
  avgResponseLatency: number;
  avgFirstTokenLatency: number;
  qualityScore: number;
  thumbsUpRate: number;
  thumbsDownRate: number;
  hallucinations: number;
  citationAccuracy: number;
  totalTokensUsed: number;
  totalCost: number;
  costByModel: Array<{ model: string; tokens: number; cost: number }>;
  guardrailTriggers: number;
}

export interface KnowledgeGap {
  id: ID;
  query: string;
  count: number;
  lastAskedAt: Timestamp;
  suggestedSources: string[];
  status: "open" | "addressed" | "dismissed";
}

export interface EngagementMetrics {
  dau: TimeSeriesData[];
  wau: TimeSeriesData[];
  mau: TimeSeriesData[];
  sessionDuration: TimeSeriesData[];
  featureAdoption: Array<{ feature: string; adoptionRate: number; userCount: number }>;
  retentionRate: number;
  nps: number;
}

export interface CostMetrics {
  daily: TimeSeriesData[];
  byModel: Array<{ model: string; cost: number; tokens: number }>;
  byTeam: Array<{ team: string; cost: number; queries: number }>;
  totalCost: number;
  projectedMonthlyCost: number;
  budget?: number;
}

export interface AnalyticsDashboard {
  usage: UsageAnalytics;
  aiPerformance: AiPerformanceMetrics;
  knowledgeGaps: KnowledgeGap[];
  engagement: EngagementMetrics;
  cost: CostMetrics;
}
