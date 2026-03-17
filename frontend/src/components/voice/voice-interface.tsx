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
      <div className="rounded-[14px] border border-[#374151] bg-[#1F2937] p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        <h2 className="text-lg font-semibold text-[#F9FAFB]">Voice Assistant</h2>
        <p className="mt-1 text-sm text-[#9CA3AF]">Ask questions naturally. AI will listen, transcribe, and respond.</p>
        <div className="mt-6 flex flex-col items-center gap-4">
          <WaveformVisualizer active={isListening} />
          <VoiceControls isListening={isListening} onStart={start} onStop={stop} />
        </div>
      </div>
      <TranscriptLive transcript={transcript} interim={interimTranscript} />
    </div>
  );
}
