import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function VideoPlayer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-lg bg-black/90" />
      </CardContent>
    </Card>
  );
}
