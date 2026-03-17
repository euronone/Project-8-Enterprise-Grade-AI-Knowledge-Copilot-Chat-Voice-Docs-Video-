"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";

const workflows = [
  { id: 1, name: "New Document Ingestion", trigger: "Document Upload", status: "Active", lastRun: "2 hours ago", successRate: "98%" },
  { id: 2, name: "Weekly Report Generation", trigger: "Schedule (Mon 9AM)", status: "Active", lastRun: "3 days ago", successRate: "100%" },
  { id: 3, name: "Slack Alert on Mention", trigger: "Slack Event", status: "Draft", lastRun: "Never", successRate: "—" },
  { id: 4, name: "Customer Ticket Triage", trigger: "Webhook", status: "Active", lastRun: "15 min ago", successRate: "94%" },
  { id: 5, name: "Quarterly Compliance Audit", trigger: "Schedule (Quarterly)", status: "Archived", lastRun: "90 days ago", successRate: "100%" },
];

const statusColor: Record<string, string> = {
  Active: "default",
  Draft: "secondary",
  Archived: "outline",
};

function WorkflowTable({ items }: { items: typeof workflows }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Trigger</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Run</TableHead>
          <TableHead>Success Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((w) => (
          <TableRow key={w.id}>
            <TableCell className="font-medium">{w.name}</TableCell>
            <TableCell>{w.trigger}</TableCell>
            <TableCell>
              <Badge variant={statusColor[w.status] as "default" | "secondary" | "outline"}>{w.status}</Badge>
            </TableCell>
            <TableCell>{w.lastRun}</TableCell>
            <TableCell>{w.successRate}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function WorkflowsPage() {
  return (
    <div>
      <PageHeader
        title="Workflows"
        description="Automate processes with event-driven workflows."
        actions={<Button>Create Workflow</Button>}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <WorkflowTable items={workflows} />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
          <WorkflowTable items={workflows.filter((w) => w.status === "Active")} />
        </TabsContent>
        <TabsContent value="draft" className="mt-4">
          <WorkflowTable items={workflows.filter((w) => w.status === "Draft")} />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <WorkflowTable items={workflows.filter((w) => w.status === "Archived")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
