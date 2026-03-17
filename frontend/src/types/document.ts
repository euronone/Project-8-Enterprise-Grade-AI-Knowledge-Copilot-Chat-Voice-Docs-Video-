import type { ID, Timestamp } from "./common";

export type DocumentStatus = "processing" | "indexed" | "failed" | "archived";
export type DocumentType =
  | "pdf"
  | "docx"
  | "xlsx"
  | "pptx"
  | "markdown"
  | "html"
  | "txt"
  | "csv"
  | "json"
  | "code"
  | "image"
  | "email"
  | "video";

export interface Document {
  id: ID;
  title: string;
  description?: string;
  type: DocumentType;
  status: DocumentStatus;
  organizationId: ID;
  collectionIds: ID[];
  uploadedBy: ID;
  fileSize: number;
  pageCount?: number;
  wordCount?: number;
  language?: string;
  tags: string[];
  metadata: DocumentMetadata;
  s3Key: string;
  vectorIds?: string[];
  chunkCount?: number;
  qualityScore?: number;
  hasPii: boolean;
  version: number;
  parentDocumentId?: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  indexedAt?: Timestamp;
}

export interface DocumentMetadata {
  author?: string;
  createdDate?: string;
  modifiedDate?: string;
  source?: string;
  sourceUrl?: string;
  entities?: string[];
  topics?: string[];
  summary?: string;
}

export interface DocumentChunk {
  id: ID;
  documentId: ID;
  content: string;
  chunkIndex: number;
  tokenCount: number;
  metadata: Record<string, unknown>;
  pageNumber?: number;
}

export interface DocumentVersion {
  id: ID;
  documentId: ID;
  version: number;
  changes: string;
  uploadedBy: ID;
  createdAt: Timestamp;
}

export interface Collection {
  id: ID;
  name: string;
  description?: string;
  organizationId: ID;
  documentCount: number;
  color: string;
  icon: string;
  isPublic: boolean;
  createdBy: ID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DataConnector {
  id: ID;
  name: string;
  type: ConnectorType;
  organizationId: ID;
  status: "connected" | "syncing" | "error" | "paused";
  config: Record<string, unknown>;
  lastSyncAt?: Timestamp;
  nextSyncAt?: Timestamp;
  syncFrequency: "realtime" | "hourly" | "daily" | "weekly" | "manual";
  documentCount: number;
  errorMessage?: string;
  createdAt: Timestamp;
}

export type ConnectorType =
  | "google_drive"
  | "sharepoint"
  | "onedrive"
  | "dropbox"
  | "confluence"
  | "notion"
  | "slack"
  | "teams"
  | "gmail"
  | "outlook"
  | "github"
  | "gitlab"
  | "jira"
  | "salesforce"
  | "hubspot"
  | "zendesk"
  | "database"
  | "api"
  | "web_crawler";

export interface WebCrawler {
  id: ID;
  name: string;
  startUrl: string;
  maxDepth: number;
  maxPages: number;
  includePatterns: string[];
  excludePatterns: string[];
  frequency: string;
  status: "idle" | "running" | "completed" | "failed";
  pagesCrawled: number;
  lastRunAt?: Timestamp;
  organizationId: ID;
  createdAt: Timestamp;
}
