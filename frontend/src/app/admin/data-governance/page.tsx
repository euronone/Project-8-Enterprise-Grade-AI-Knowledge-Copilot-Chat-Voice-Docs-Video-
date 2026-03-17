"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const policies = [
  { name: "Default Retention Policy", type: "Retention", scope: "Organization-wide", status: "Active", created: "2026-01-15" },
  { name: "PII Auto-Classification", type: "Classification", scope: "All documents", status: "Active", created: "2026-01-20" },
  { name: "External Sharing Rules", type: "Access", scope: "External users", status: "Active", created: "2026-02-01" },
  { name: "HIPAA Data Handling", type: "Classification", scope: "Healthcare collections", status: "Draft", created: "2026-03-10" },
  { name: "Archive After 1 Year", type: "Retention", scope: "Meeting recordings", status: "Active", created: "2026-02-15" },
];

const typeColor: Record<string, "default" | "secondary" | "outline"> = {
  Retention: "default",
  Classification: "secondary",
  Access: "outline",
};

export default function DataGovernancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Data Governance" description="Define and enforce data handling, classification, and retention policies." actions={<Button>Create Policy</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data Classification</CardTitle>
            <CardDescription>Automatic classification levels</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><Badge variant="danger" className="mr-2">Restricted</Badge>14 documents</p>
            <p><Badge variant="default" className="mr-2">Confidential</Badge>238 documents</p>
            <p><Badge variant="secondary" className="mr-2">Internal</Badge>1,847 documents</p>
            <p><Badge variant="outline" className="mr-2">Public</Badge>423 documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retention Settings</CardTitle>
            <CardDescription>Default data lifecycle rules</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Documents: <span className="font-medium">Retain 3 years</span></p>
            <p>Conversations: <span className="font-medium">Retain 2 years</span></p>
            <p>Recordings: <span className="font-medium">Retain 1 year</span></p>
            <p>Audit logs: <span className="font-medium">Retain 7 years</span></p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">PII Handling</CardTitle>
            <CardDescription>Personally Identifiable Information rules</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p>Auto-detection: <span className="font-medium">Enabled</span></p>
            <p>Auto-redaction: <span className="font-medium">Enabled</span></p>
            <p>PII types monitored: <span className="font-medium">12</span></p>
            <p>Flagged this month: <span className="font-medium">47 documents</span></p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Governance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {policies.map((p) => (
                <TableRow key={p.name}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell><Badge variant={typeColor[p.type] ?? "default"}>{p.type}</Badge></TableCell>
                  <TableCell>{p.scope}</TableCell>
                  <TableCell><Badge variant={p.status === "Active" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                  <TableCell>{p.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
