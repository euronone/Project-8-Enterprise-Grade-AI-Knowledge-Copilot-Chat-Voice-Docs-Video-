"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";

export default function ScheduleMeetingPage() {
  return (
    <div>
      <PageHeader title="Schedule Meeting" description="Set up a new meeting with your team." />

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>Provide core information for the meeting.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium" htmlFor="m-title">Title</label>
              <Input id="m-title" placeholder="e.g. Sprint Planning" className="mt-1" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="m-date">Date & Time</label>
                <Input id="m-date" type="datetime-local" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Duration</label>
                <div className="mt-1 flex gap-2">
                  {["15 min", "30 min", "45 min", "1 hour", "1.5 hours"].map((d, i) => (
                    <Badge key={d} variant={i === 3 ? "default" : "outline"} className="cursor-pointer px-2 py-1 text-xs">{d}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="m-participants">Participants</label>
              <Input id="m-participants" placeholder="Search by name or email..." className="mt-1" />
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary">Sarah Chen</Badge>
                <Badge variant="secondary">Alex Kim</Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="m-agenda">Agenda</label>
              <Textarea id="m-agenda" placeholder="Outline the meeting topics..." className="mt-1" rows={3} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-record</p>
                <p className="text-xs text-muted-foreground">Automatically record and transcribe</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">AI Meeting Assistant</p>
                <p className="text-xs text-muted-foreground">Generate recap and action items</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Schedule Meeting</Button>
        </div>
      </div>
    </div>
  );
}
