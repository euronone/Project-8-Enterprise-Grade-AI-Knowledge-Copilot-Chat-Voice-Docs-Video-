import type { ID, Timestamp } from "./common";

export interface Video {
  id: ID;
  title: string;
  description?: string;
  organizationId: ID;
  uploadedBy: ID;
  status: "processing" | "ready" | "failed";
  duration: number;
  size: number;
  thumbnailUrl?: string;
  streamUrl?: string;
  language?: string;
  hasTranscript: boolean;
  hasSummary: boolean;
  hasChapters: boolean;
  tags: string[];
  viewCount: number;
  collectionIds: ID[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface VideoChapter {
  id: ID;
  videoId: ID;
  title: string;
  startTime: number;
  endTime: number;
  summary?: string;
  thumbnailUrl?: string;
}

export interface VideoTranscript {
  id: ID;
  videoId: ID;
  language: string;
  segments: VideoTranscriptSegment[];
  fullText: string;
}

export interface VideoTranscriptSegment {
  id: ID;
  text: string;
  startTime: number;
  endTime: number;
  speaker?: string;
  confidence: number;
}

export interface VideoClip {
  id: ID;
  videoId: ID;
  title: string;
  startTime: number;
  endTime: number;
  url?: string;
  createdBy: ID;
  createdAt: Timestamp;
}

export interface VideoAnalysis {
  videoId: ID;
  summary: string;
  topics: string[];
  entities: string[];
  sentiment: "positive" | "neutral" | "negative";
  keyMoments: Array<{ time: number; description: string }>;
  actionItems: string[];
}
