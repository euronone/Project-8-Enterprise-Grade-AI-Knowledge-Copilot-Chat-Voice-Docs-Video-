"use client";

import { Mic, MicOff, Square } from "lucide-react";
import { Button } from "@/components/ui";

interface VoiceControlsProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function VoiceControls({ isListening, onStart, onStop }: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {isListening ? (
        <Button variant="destructive" onClick={onStop}>
          <Square className="mr-2 h-4 w-4" />
          Stop Listening
        </Button>
      ) : (
        <Button onClick={onStart}>
          <Mic className="mr-2 h-4 w-4" />
          Start Listening
        </Button>
      )}
      <Button variant="outline" size="icon" aria-label="Toggle mute">
        {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
      </Button>
    </div>
  );
}
