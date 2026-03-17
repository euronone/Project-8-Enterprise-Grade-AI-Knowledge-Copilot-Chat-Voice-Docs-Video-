import type { ID, Timestamp } from "./common";
import type { User } from "./user";

export type MessageRole = "user" | "assistant" | "system";

export interface Citation {
  id: ID;
  documentId: ID;
  documentTitle: string;
  documentType: string;
  chunk: string;
  score: number;
  url?: string;
  pageNumber?: number;
}

export interface Message {
  id: ID;
  conversationId: ID;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  followUpSuggestions?: string[];
  model?: string;
  tokenCount?: number;
  latencyMs?: number;
  feedback?: MessageFeedback;
  attachments?: MessageAttachment[];
  createdAt: Timestamp;
  isStreaming?: boolean;
  parentMessageId?: ID;
  branchIds?: ID[];
}

export interface MessageFeedback {
  rating: "thumbs_up" | "thumbs_down";
  comment?: string;
  submittedAt: Timestamp;
}

export interface MessageAttachment {
  id: ID;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface Conversation {
  id: ID;
  title: string;
  organizationId: ID;
  userId: ID;
  user?: User;
  model: string;
  systemPrompt?: string;
  collectionIds?: ID[];
  messageCount: number;
  lastMessage?: Message;
  isPinned: boolean;
  tags: string[];
  shareId?: string;
  isShared: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ConversationShare {
  id: ID;
  conversationId: ID;
  shareId: string;
  expiresAt?: Timestamp;
  isPublic: boolean;
  viewCount: number;
}

export type ChatStreamEvent =
  | { type: "token"; content: string }
  | { type: "citation"; citation: Citation }
  | { type: "suggestions"; suggestions: string[] }
  | { type: "done"; messageId: ID; tokenCount: number }
  | { type: "error"; message: string };
