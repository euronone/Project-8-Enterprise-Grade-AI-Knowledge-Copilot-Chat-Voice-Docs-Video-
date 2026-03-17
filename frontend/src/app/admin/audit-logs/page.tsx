"use client";

import { useState } from "react";
import { Card, CardContent, Badge, Button, Input, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const logs = [
  { timestamp: "2026-03-17 09:14:22", user: "alice@company.com", action: "User login", resource: "Auth", ip: "192.168.1.42", status: "Success" },
  { timestamp: "2026-03-17 09:12:05", user: "bob@company.com", action: "Document uploaded", resource: "Q1-Report.pdf", ip: "10.0.0.15", status: "Success" },
  { timestamp: "2026-03-17 09:10:33", user: "carol@company.com", action: "Role modified", resource: "Team Admin", ip: "172.16.0.8", status: "Success" },
  { timestamp: "2026-03-17 09:08:17", user: "david@company.com", action: "Failed login attempt", resource: "Auth", ip: "203.0.113.55", status: "Failed" },
  { timestamp: "2026-03-17 09:05:44", user: "alice@company.com", action: "API key created", resource: "API Keys", ip: "192.168.1.42", status: "Success" },
  { timestamp: "2026-03-17 08:58:12", user: "frank@company.com", action: "Collection deleted", resource: "Archive-2024", ip: "10.0.0.22", status: "Success" },
  { timestamp: "2026-03-17 08:45:09", user: "eva@company.com", action: "User invited", resource: "new-hire@company.com", ip: "10.0.0.30", status: "Success" },
  { timestamp: "2026-03-17 08:30:55", user: "bob@company.com", action: "Settings updated", resource: "Organization", ip: "10.0.0.15", status: "Success" },
];

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const filtered = logs.filter((l) => l.action.toLowerCase().includes(search.toLowerCase()) || l.user.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="View a comprehensive log of all actions and events across the platform." />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-4">
            <Input placeholder="Search by action or user…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
            <Button variant="outline">Filter by date</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((l, i) => (
                <TableRow key={i}>
                  <TableCell className="text-xs font-mono">{l.timestamp}</TableCell>
                  <TableCell>{l.user}</TableCell>
                  <TableCell className="font-medium">{l.action}</TableCell>
                  <TableCell>{l.resource}</TableCell>
                  <TableCell className="font-mono text-xs">{l.ip}</TableCell>
                  <TableCell><Badge variant={l.status === "Success" ? "default" : "danger"}>{l.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
