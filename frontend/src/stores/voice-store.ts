import { create } from "zustand";

interface VoiceState {
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  transcript: string;
  interimTranscript: string;
  sessionId: string | null;
  audioLevel: number;
  error: string | null;
  config: VoiceConfig;

  setListening: (v: boolean) => void;
  setProcessing: (v: boolean) => void;
  setSpeaking: (v: boolean) => void;
  setTranscript: (t: string) => void;
  setInterimTranscript: (t: string) => void;
  setSessionId: (id: string | null) => void;
  setAudioLevel: (level: number) => void;
  setError: (err: string | null) => void;
  updateConfig: (cfg: Partial<VoiceConfig>) => void;
  reset: () => void;
}

interface VoiceConfig {
  voiceId: string;
  language: string;
  speed: number;
  pushToTalk: boolean;
  noiseReduction: boolean;
}

const defaultConfig: VoiceConfig = {
  voiceId: "default",
  language: "en-US",
  speed: 1.0,
  pushToTalk: false,
  noiseReduction: true,
};

export const useVoiceStore = create<VoiceState>((set) => ({
  isListening: false,
  isProcessing: false,
  isSpeaking: false,
  transcript: "",
  interimTranscript: "",
  sessionId: null,
  audioLevel: 0,
  error: null,
  config: defaultConfig,

  setListening: (isListening) => set({ isListening }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  setSpeaking: (isSpeaking) => set({ isSpeaking }),
  setTranscript: (transcript) => set({ transcript }),
  setInterimTranscript: (interimTranscript) => set({ interimTranscript }),
  setSessionId: (sessionId) => set({ sessionId }),
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  setError: (error) => set({ error }),
  updateConfig: (cfg) => set((s) => ({ config: { ...s.config, ...cfg } })),
  reset: () =>
    set({
      isListening: false,
      isProcessing: false,
      isSpeaking: false,
      transcript: "",
      interimTranscript: "",
      audioLevel: 0,
      error: null,
    }),
}));
