"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Textarea,
} from "@/components/ui";

export default function PlaygroundPage() {
  return (
    <div>
      <PageHeader title="AI Prompt Playground" description="Experiment with prompts, models, and parameters." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                placeholder="You are a helpful enterprise AI assistant..."
                defaultValue="You are KnowledgeForge AI, a helpful enterprise assistant. Answer using only the provided context. Cite sources."
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Model</label>
                <div className="mt-1 flex gap-2">
                  {["Claude Sonnet 4", "GPT-4o", "Claude Haiku"].map((m, i) => (
                    <Badge key={m} variant={i === 0 ? "default" : "outline"} className="cursor-pointer px-3 py-1">
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Temperature</label>
                <div className="mt-1 flex items-center gap-3">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div className="h-2 w-1/4 rounded-full bg-primary" />
                  </div>
                  <span className="text-sm font-mono">0.25</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Max Tokens</span>
                <span className="font-mono">4,096</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Token Usage</span>
                <span className="font-mono">0 / 4,096</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="flex-1 rounded-lg border bg-muted/30 p-4 min-h-[280px]">
              <p className="text-sm text-muted-foreground italic">Send a message to see the AI response here...</p>
            </div>
            <div className="flex gap-2">
              <Textarea placeholder="Type your message..." rows={2} className="flex-1" />
              <Button className="self-end">Send</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
