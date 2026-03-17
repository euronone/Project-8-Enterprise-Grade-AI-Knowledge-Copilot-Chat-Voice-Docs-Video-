"use client";

import { useVoiceStore } from "@/stores/voice-store";
import { VoiceControls } from "./voice-controls";
import { WaveformVisualizer } from "./waveform-visualizer";
import { TranscriptLive } from "./transcript-live";

export function VoiceInterface() {
  const {
    isListening,
    transcript,
    interimTranscript,
    setListening,
    setTranscript,
    setInterimTranscript,
  } = useVoiceStore();

  const start = () => {
    setListening(true);
    setInterimTranscript("Listening...");
  };

  const stop = () => {
    setListening(false);
    setTranscript(transcript + (transcript ? "\n" : "") + "Session ended.");
    setInterimTranscript("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Voice Assistant</h2>
        <p className="mt-1 text-sm text-muted-foreground">Ask questions naturally. AI will listen, transcribe, and respond.</p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <WaveformVisualizer active={isListening} />
          <VoiceControls isListening={isListening} onStart={start} onStop={stop} />
        </div>
      </div>
      <TranscriptLive transcript={transcript} interim={interimTranscript} />
    </div>
  );
}
