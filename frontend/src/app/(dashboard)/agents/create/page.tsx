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

const tools = ["Web Search", "Calculator", "Code Executor", "Email Sender", "Calendar", "Database Query", "API Caller", "File Manager"];

export default function CreateAgentPage() {
  return (
    <div>
      <PageHeader title="Create Agent" description="Configure a new AI agent with custom tools and knowledge." />

      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Details</CardTitle>
              <CardDescription>Name and describe your agent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="a-name">Agent Name</label>
                <Input id="a-name" placeholder="e.g. Research Agent" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="a-desc">Description</label>
                <Textarea id="a-desc" placeholder="What does this agent do?" className="mt-1" rows={2} />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="a-prompt">System Prompt</label>
                <Textarea id="a-prompt" placeholder="You are an AI agent that..." className="mt-1" rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Knowledge Scope</CardTitle>
              <CardDescription>Restrict which collections this agent can access.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["All Collections", "Engineering Docs", "Product Specs", "Customer Data", "HR Policies"].map((c, i) => (
                  <Badge key={c} variant={i === 0 ? "default" : "outline"} className="cursor-pointer px-3 py-1">{c}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tools & Capabilities</CardTitle>
            <CardDescription>Select which tools this agent can use.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tools.map((tool) => (
                <label key={tool} className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                  <span className="text-sm">{tool}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline">Test Agent</Button>
        <Button>Save Agent</Button>
      </div>
    </div>
  );
}
