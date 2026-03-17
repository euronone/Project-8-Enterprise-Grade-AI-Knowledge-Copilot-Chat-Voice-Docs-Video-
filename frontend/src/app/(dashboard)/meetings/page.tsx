import { MeetingRoom } from "@/components/meetings/meeting-room";
import { PageHeader } from "@/components/shared/page-header";

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Meetings Intelligence"
        description="Run AI-assisted meetings with live transcription, summaries, and action extraction."
      />
      <MeetingRoom />
    </div>
  );
}
