import { VoiceInterface } from "@/components/voice/voice-interface";
import { PageHeader } from "@/components/shared/page-header";

export default function VoicePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Voice Assistant"
        description="Talk naturally with your enterprise knowledge copilot using real-time transcription and response playback."
      />
      <VoiceInterface />
    </div>
  );
}
