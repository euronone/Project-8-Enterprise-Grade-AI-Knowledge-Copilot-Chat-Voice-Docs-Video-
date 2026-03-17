"use client";

import { useState } from "react";
import { Card, CardContent, Badge, Button, Input, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const users = [
  { name: "Alice Johnson", email: "alice@company.com", role: "Super Admin", status: "Active", lastLogin: "2026-03-17 09:14" },
  { name: "Bob Chen", email: "bob@company.com", role: "Org Admin", status: "Active", lastLogin: "2026-03-17 08:42" },
  { name: "Carol Williams", email: "carol@company.com", role: "Member", status: "Active", lastLogin: "2026-03-16 17:30" },
  { name: "David Kim", email: "david@company.com", role: "Member", status: "Suspended", lastLogin: "2026-02-28 11:05" },
  { name: "Eva Martinez", email: "eva@company.com", role: "Viewer", status: "Active", lastLogin: "2026-03-15 14:22" },
  { name: "Frank Patel", email: "frank@company.com", role: "Team Admin", status: "Active", lastLogin: "2026-03-17 07:58" },
];

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="Manage users, roles, and access across your organization." actions={<Button>Invite User</Button>} />

      <Card>
        <CardContent className="pt-6 space-y-4">
          <Input placeholder="Search users by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.email}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                  <TableCell><Badge variant={u.status === "Active" ? "default" : "danger"}>{u.status}</Badge></TableCell>
                  <TableCell>{u.lastLogin}</TableCell>
                  <TableCell><Button variant="ghost" size="sm">Edit</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
