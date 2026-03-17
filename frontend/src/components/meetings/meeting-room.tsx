import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/ui";

export function MeetingRoom() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Meeting Room</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="aspect-video rounded-lg bg-muted" />
          <div className="aspect-video rounded-lg bg-muted" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button>Join Meeting</Button>
          <Button variant="secondary">Record</Button>
        </div>
      </CardContent>
    </Card>
  );
}
