import type { ID, Timestamp } from "./common";

export interface VoiceSession {
  id: ID;
  userId: ID;
  status: "idle" | "listening" | "processing" | "speaking";
  language: string;
  voiceId: string;
  createdAt: Timestamp;
}

export interface VoiceConfig {
  voiceId: string;
  speed: number;
  pitch: number;
  language: string;
  model: "elevenlabs" | "polly";
  pushToTalk: boolean;
  noiseReduction: boolean;
  wakeWord?: string;
}

export interface TranscriptSegment {
  id: ID;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
  speaker?: string;
  isFinal: boolean;
}

export interface VoiceTranscription {
  id: ID;
  sessionId: ID;
  segments: TranscriptSegment[];
  fullText: string;
  language: string;
  durationMs: number;
  createdAt: Timestamp;
}

export interface AvailableVoice {
  id: string;
  name: string;
  description: string;
  previewUrl: string;
  gender: "male" | "female" | "neutral";
  accent?: string;
  provider: "elevenlabs" | "polly";
  languages: string[];
}
