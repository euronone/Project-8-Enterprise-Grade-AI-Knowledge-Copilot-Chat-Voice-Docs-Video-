import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";

export function MeetingRoom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[#F9FAFB]">Meeting Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="aspect-video rounded-[10px] border border-[#374151] bg-[#0F172A] shadow-sm" />
          <div className="aspect-video rounded-[10px] border border-[#374151] bg-[#0F172A] shadow-sm" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button>Join Meeting</Button>
          <Button variant="secondary">Record</Button>
        </div>
      </CardContent>
    </Card>
  );
}
