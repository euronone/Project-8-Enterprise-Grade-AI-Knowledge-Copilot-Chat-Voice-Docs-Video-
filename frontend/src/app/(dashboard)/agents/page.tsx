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
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";

const agents = [
  { id: 1, name: "Research Agent", description: "Deep research across the knowledge base with multi-step reasoning.", capabilities: ["Search", "Summarize", "Compare"], status: "Active", usage: 1284, owner: "system" },
  { id: 2, name: "Writing Agent", description: "Draft documents, emails, and reports using organizational context.", capabilities: ["Write", "Email", "Format"], status: "Active", usage: 876, owner: "system" },
  { id: 3, name: "Data Analyst", description: "Query databases, generate charts, and analyze trends.", capabilities: ["SQL", "Charts", "Export"], status: "Active", usage: 543, owner: "system" },
  { id: 4, name: "Support Agent", description: "Answer customer questions and create support tickets.", capabilities: ["Search", "Tickets", "Email"], status: "Draft", usage: 0, owner: "user" },
  { id: 5, name: "Onboarding Bot", description: "Guide new employees through company knowledge and processes.", capabilities: ["Search", "Calendar", "Slack"], status: "Active", usage: 312, owner: "user" },
];

function AgentGrid({ items }: { items: typeof agents }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((agent) => (
        <Card key={agent.id} className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <Badge variant={agent.status === "Active" ? "default" : "secondary"}>{agent.status}</Badge>
            </div>
            <CardDescription>{agent.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1 mb-3">
              {agent.capabilities.map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{agent.usage.toLocaleString()} executions</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AgentsPage() {
  return (
    <div>
      <PageHeader
        title="AI Agents"
        description="Deploy and manage autonomous AI agents."
        actions={<Button>Create Agent</Button>}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="my">My Agents</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <AgentGrid items={agents} />
        </TabsContent>
        <TabsContent value="my" className="mt-4">
          <AgentGrid items={agents.filter((a) => a.owner === "user")} />
        </TabsContent>
        <TabsContent value="templates" className="mt-4">
          <AgentGrid items={agents.filter((a) => a.owner === "system")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
