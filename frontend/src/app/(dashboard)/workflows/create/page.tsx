"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Textarea,
} from "@/components/ui";

export default function CreateWorkflowPage() {
  return (
    <div>
      <PageHeader title="Create Workflow" description="Build a new automated workflow." />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Details</CardTitle>
              <CardDescription>Name and describe your workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="wf-name">Workflow Name</label>
                <Input id="wf-name" placeholder="e.g. New Document Ingestion" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="wf-desc">Description</label>
                <Textarea id="wf-desc" placeholder="Describe what this workflow does..." className="mt-1" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trigger</CardTitle>
              <CardDescription>Choose what starts this workflow.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {["Document Upload", "Schedule", "Webhook", "Slack Event", "Email Received", "Manual"].map((t) => (
                  <Card key={t} className="cursor-pointer border-2 p-3 text-center text-sm hover:border-primary">
                    <CardContent className="p-0">{t}</CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Workflow Canvas</CardTitle>
            <CardDescription>Drag and drop steps to build your workflow.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 min-h-[320px]">
            <p className="text-sm text-muted-foreground">Visual workflow builder will appear here</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button>Save Workflow</Button>
      </div>
    </div>
  );
}
