import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function TranscriptLive({ transcript, interim }: { transcript: string; interim?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Transcript</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-wrap">{transcript || "Start speaking to see transcription..."}</p>
        {interim ? <p className="mt-2 text-sm text-muted-foreground italic">{interim}</p> : null}
      </CardContent>
    </Card>
  );
}
