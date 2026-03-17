import { PageHeader } from "@/components/shared/page-header";
import { VideoPlayer } from "@/components/video/video-player";

export default function VideoLibraryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Video Knowledge"
        description="Upload, transcribe, chapter, and query organizational video assets."
      />
      <VideoPlayer />
    </div>
  );
}
