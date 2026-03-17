import { describe, it, expect, beforeEach } from "vitest";
import { useVoiceStore } from "@/stores/voice-store";

describe("useVoiceStore", () => {
  beforeEach(() => {
    useVoiceStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useVoiceStore.getState();
    expect(state.isListening).toBe(false);
    expect(state.isProcessing).toBe(false);
    expect(state.isSpeaking).toBe(false);
    expect(state.transcript).toBe("");
    expect(state.interimTranscript).toBe("");
    expect(state.sessionId).toBeNull();
    expect(state.audioLevel).toBe(0);
    expect(state.error).toBeNull();
  });

  it("setListening updates isListening", () => {
    useVoiceStore.getState().setListening(true);
    expect(useVoiceStore.getState().isListening).toBe(true);
  });

  it("setProcessing updates isProcessing", () => {
    useVoiceStore.getState().setProcessing(true);
    expect(useVoiceStore.getState().isProcessing).toBe(true);
  });

  it("setSpeaking updates isSpeaking", () => {
    useVoiceStore.getState().setSpeaking(true);
    expect(useVoiceStore.getState().isSpeaking).toBe(true);
  });

  it("setTranscript updates transcript", () => {
    useVoiceStore.getState().setTranscript("Hello world");
    expect(useVoiceStore.getState().transcript).toBe("Hello world");
  });

  it("setInterimTranscript updates interimTranscript", () => {
    useVoiceStore.getState().setInterimTranscript("partial");
    expect(useVoiceStore.getState().interimTranscript).toBe("partial");
  });

  it("setSessionId updates sessionId", () => {
    useVoiceStore.getState().setSessionId("sess-123");
    expect(useVoiceStore.getState().sessionId).toBe("sess-123");
  });

  it("setAudioLevel updates audioLevel", () => {
    useVoiceStore.getState().setAudioLevel(0.75);
    expect(useVoiceStore.getState().audioLevel).toBe(0.75);
  });

  it("setError updates error", () => {
    useVoiceStore.getState().setError("Microphone access denied");
    expect(useVoiceStore.getState().error).toBe("Microphone access denied");
  });

  it("updateConfig merges config values", () => {
    useVoiceStore.getState().updateConfig({ speed: 1.5, language: "fr-FR" });
    const config = useVoiceStore.getState().config;
    expect(config.speed).toBe(1.5);
    expect(config.language).toBe("fr-FR");
    expect(config.voiceId).toBe("default"); // unchanged
  });

  it("reset restores initial state but preserves config", () => {
    useVoiceStore.getState().setListening(true);
    useVoiceStore.getState().setTranscript("some text");
    useVoiceStore.getState().setAudioLevel(0.5);
    useVoiceStore.getState().reset();
    const state = useVoiceStore.getState();
    expect(state.isListening).toBe(false);
    expect(state.transcript).toBe("");
    expect(state.audioLevel).toBe(0);
  });
});
