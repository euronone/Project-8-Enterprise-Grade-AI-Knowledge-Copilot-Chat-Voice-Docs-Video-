import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export function VideoPlayer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#F9FAFB]">Video Player</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video rounded-[10px] border border-[#374151] bg-[#0F172A] shadow-sm" />
      </CardContent>
    </Card>
  );
}
