"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const standards = [
  { name: "SOC 2", status: "Compliant", color: "default" as const },
  { name: "GDPR", status: "Compliant", color: "default" as const },
  { name: "HIPAA", status: "Partial", color: "secondary" as const },
  { name: "CCPA", status: "Compliant", color: "default" as const },
];

const events = [
  { event: "Annual SOC 2 Type II audit completed", standard: "SOC 2", status: "Passed", date: "2026-03-10" },
  { event: "GDPR data subject access request fulfilled", standard: "GDPR", status: "Completed", date: "2026-03-08" },
  { event: "HIPAA risk assessment scheduled", standard: "HIPAA", status: "Pending", date: "2026-03-15" },
  { event: "CCPA opt-out mechanism updated", standard: "CCPA", status: "Completed", date: "2026-03-05" },
  { event: "Encryption at rest verification", standard: "SOC 2", status: "Passed", date: "2026-03-01" },
];

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Compliance Dashboard" description="Monitor compliance status across regulatory frameworks." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {standards.map((s) => (
          <Card key={s.name}>
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-semibold mb-2">{s.name}</p>
              <Badge variant={s.color}>{s.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Standard</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{e.event}</TableCell>
                  <TableCell>{e.standard}</TableCell>
                  <TableCell><Badge variant={e.status === "Pending" ? "secondary" : "default"}>{e.status}</Badge></TableCell>
                  <TableCell>{e.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Retention Policy</CardTitle>
          <CardDescription>Current data retention and lifecycle settings</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Chat Conversations</dt>
              <dd className="font-medium">Retained 2 years</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Audit Logs</dt>
              <dd className="font-medium">Retained 7 years</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Deleted Content</dt>
              <dd className="font-medium">Purged after 30 days</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
