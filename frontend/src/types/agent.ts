import type { ID, Timestamp } from "./common";

export interface Agent {
  id: ID;
  name: string;
  description: string;
  organizationId: ID;
  createdBy: ID;
  avatar?: string;
  status: "active" | "inactive";
  systemPrompt: string;
  model: string;
  temperature: number;
  tools: AgentTool[];
  collectionIds: ID[];
  maxSteps: number;
  runCount: number;
  lastRunAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  config?: Record<string, unknown>;
}

export type PrebuiltToolId =
  | "web_search"
  | "calculator"
  | "code_executor"
  | "email_sender"
  | "calendar"
  | "database_query"
  | "api_caller"
  | "file_manager"
  | "knowledge_search";

export interface AgentExecution {
  id: ID;
  agentId: ID;
  userId: ID;
  status: "running" | "success" | "failed" | "cancelled";
  input: string;
  output?: string;
  steps: AgentStep[];
  tokenCount?: number;
  durationMs?: number;
  error?: string;
  startedAt: Timestamp;
  completedAt?: Timestamp;
}

export interface AgentStep {
  id: ID;
  type: "thought" | "action" | "observation" | "response";
  content: string;
  tool?: string;
  toolInput?: unknown;
  toolOutput?: unknown;
  timestamp: Timestamp;
}

export interface AgentTemplate {
  id: ID;
  name: string;
  description: string;
  category: string;
  icon: string;
  agent: Partial<Agent>;
  useCase: string;
}
