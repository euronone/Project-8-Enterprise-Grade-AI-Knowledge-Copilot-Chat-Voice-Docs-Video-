"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const roles = [
  { name: "Super Admin", description: "Full platform access. Can manage all organizations, users, and settings.", users: 2, permissions: 48, builtIn: true },
  { name: "Org Admin", description: "Full access within an organization. Can manage members, settings, and billing.", users: 8, permissions: 36, builtIn: true },
  { name: "Team Admin", description: "Manage team members and team-level knowledge collections.", users: 15, permissions: 24, builtIn: true },
  { name: "Member", description: "Standard access to chat, search, knowledge base, and meetings.", users: 234, permissions: 18, builtIn: true },
  { name: "Viewer", description: "Read-only access to shared knowledge and conversations.", users: 47, permissions: 8, builtIn: true },
  { name: "Guest", description: "Limited access for external collaborators with time-restricted sessions.", users: 12, permissions: 5, builtIn: true },
];

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Role Management" description="Configure roles and permissions for access control." actions={<Button>Create Role</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => (
          <Card key={role.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{role.name}</CardTitle>
                <Badge variant={role.builtIn ? "secondary" : "outline"}>{role.builtIn ? "Built-in" : "Custom"}</Badge>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{role.users} users</span>
                <span>{role.permissions} permissions</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
