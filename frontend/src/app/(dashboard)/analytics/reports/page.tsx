"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const reports = [
  { name: "Weekly Usage Summary", type: "Usage", created: "2026-03-10", schedule: "Weekly", lastGenerated: "2026-03-14", status: "Active" },
  { name: "Monthly Knowledge Coverage", type: "Knowledge", created: "2026-02-01", schedule: "Monthly", lastGenerated: "2026-03-01", status: "Active" },
  { name: "Q1 ROI Analysis", type: "Executive", created: "2026-03-15", schedule: "One-time", lastGenerated: "2026-03-15", status: "Completed" },
  { name: "AI Performance Report", type: "Performance", created: "2026-01-20", schedule: "Weekly", lastGenerated: "2026-03-14", status: "Active" },
  { name: "Department Engagement", type: "Engagement", created: "2026-03-05", schedule: "Monthly", lastGenerated: "2026-03-05", status: "Active" },
  { name: "Security Audit Export", type: "Compliance", created: "2026-03-12", schedule: "One-time", lastGenerated: "2026-03-12", status: "Completed" },
];

const typeColor: Record<string, "default" | "secondary" | "outline"> = {
  Usage: "default",
  Knowledge: "secondary",
  Executive: "outline",
  Performance: "default",
  Engagement: "secondary",
  Compliance: "outline",
};

export default function ReportsPage() {
  const [tab, setTab] = useState("all");

  const filtered = tab === "all" ? reports : tab === "scheduled" ? reports.filter((r) => r.schedule !== "One-time") : reports.filter((r) => r.schedule === "One-time");

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Generate and manage custom analytics reports." actions={<Button>Create Report</Button>} />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="one-time">One-time</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Last Generated</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.name}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell><Badge variant={typeColor[r.type] ?? "default"}>{r.type}</Badge></TableCell>
                      <TableCell>{r.created}</TableCell>
                      <TableCell>{r.schedule}</TableCell>
                      <TableCell>{r.lastGenerated}</TableCell>
                      <TableCell><Badge variant={r.status === "Active" ? "default" : "secondary"}>{r.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
