import type { ID, Timestamp } from "./common";

export interface Workflow {
  id: ID;
  name: string;
  description?: string;
  organizationId: ID;
  createdBy: ID;
  status: "active" | "inactive" | "error";
  trigger: WorkflowTrigger;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  runCount: number;
  lastRunAt?: Timestamp;
  successRate: number;
  avgDurationMs: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface WorkflowTrigger {
  type: TriggerType;
  config: Record<string, unknown>;
}

export type TriggerType =
  | "schedule"
  | "webhook"
  | "new_document"
  | "slack_message"
  | "email"
  | "manual";

export interface WorkflowNode {
  id: ID;
  type: NodeType;
  label: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export type NodeType =
  | "trigger"
  | "condition"
  | "action"
  | "ai_step"
  | "human_approval"
  | "delay"
  | "loop";

export interface WorkflowEdge {
  id: ID;
  source: ID;
  target: ID;
  label?: string;
  condition?: string;
}

export interface WorkflowRun {
  id: ID;
  workflowId: ID;
  status: "running" | "success" | "failed" | "cancelled";
  startedAt: Timestamp;
  completedAt?: Timestamp;
  durationMs?: number;
  stepResults: StepResult[];
  error?: string;
  triggeredBy: string;
}

export interface StepResult {
  nodeId: ID;
  status: "pending" | "running" | "success" | "failed" | "skipped";
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  output?: unknown;
  error?: string;
}

export interface WorkflowTemplate {
  id: ID;
  name: string;
  description: string;
  category: string;
  icon: string;
  workflow: Omit<Workflow, "id" | "organizationId" | "createdBy" | "createdAt" | "updatedAt">;
}
