import type { ID, Timestamp } from "./common";
import type { User } from "./user";

export interface Meeting {
  id: ID;
  title: string;
  description?: string;
  organizationId: ID;
  hostId: ID;
  host?: User;
  participants: MeetingParticipant[];
  status: "scheduled" | "live" | "ended" | "cancelled";
  scheduledAt: Timestamp;
  startedAt?: Timestamp;
  endedAt?: Timestamp;
  durationMs?: number;
  recordingUrl?: string;
  hasRecording: boolean;
  hasTranscript: boolean;
  hasRecap: boolean;
  roomToken?: string;
  calendarEventId?: string;
  calendarProvider?: "google" | "outlook" | "ical";
  createdAt: Timestamp;
}

export interface MeetingParticipant {
  userId: ID;
  user?: User;
  joinedAt?: Timestamp;
  leftAt?: Timestamp;
  role: "host" | "co-host" | "participant";
  audioEnabled: boolean;
  videoEnabled: boolean;
  screenSharing: boolean;
  talkTimeMs?: number;
}

export interface MeetingTranscript {
  id: ID;
  meetingId: ID;
  segments: TranscriptSegment[];
  language: string;
  durationMs: number;
  createdAt: Timestamp;
}

export interface TranscriptSegment {
  id: ID;
  speakerId?: ID;
  speakerName?: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface MeetingRecap {
  id: ID;
  meetingId: ID;
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  topics: string[];
  sentiment: "positive" | "neutral" | "negative";
  engagementScore: number;
  generatedAt: Timestamp;
}

export interface ActionItem {
  id: ID;
  description: string;
  assigneeId?: ID;
  assigneeName?: string;
  dueDate?: Timestamp;
  status: "open" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  meetingId: ID;
  createdAt: Timestamp;
}

export interface Recording {
  id: ID;
  meetingId: ID;
  url: string;
  duration: number;
  size: number;
  format: "mp4" | "webm";
  status: "processing" | "ready" | "failed";
  createdAt: Timestamp;
}
