"use client";

import { Card, CardContent, Badge, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const organizations = [
  { name: "Acme Corporation", plan: "Enterprise", members: 847, storage: "234 GB", status: "Active", created: "2025-06-15" },
  { name: "TechStart Inc.", plan: "Professional", members: 52, storage: "18 GB", status: "Active", created: "2025-09-22" },
  { name: "Global Legal LLP", plan: "Enterprise", members: 215, storage: "89 GB", status: "Active", created: "2025-08-01" },
  { name: "MedHealth Systems", plan: "Professional", members: 34, storage: "12 GB", status: "Trial", created: "2026-03-01" },
  { name: "DataVenture Labs", plan: "Starter", members: 8, storage: "2 GB", status: "Suspended", created: "2025-11-10" },
];

const statusColor: Record<string, "default" | "secondary" | "danger"> = {
  Active: "default",
  Trial: "secondary",
  Suspended: "danger",
};

export default function OrganizationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Organizations" description="Manage tenant organizations and their configurations." actions={<Button>Create Organization</Button>} />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead className="text-right">Members</TableHead>
                <TableHead>Storage Used</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.map((org) => (
                <TableRow key={org.name}>
                  <TableCell className="font-medium">{org.name}</TableCell>
                  <TableCell><Badge variant="outline">{org.plan}</Badge></TableCell>
                  <TableCell className="text-right">{org.members}</TableCell>
                  <TableCell>{org.storage}</TableCell>
                  <TableCell><Badge variant={statusColor[org.status] ?? "default"}>{org.status}</Badge></TableCell>
                  <TableCell>{org.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
