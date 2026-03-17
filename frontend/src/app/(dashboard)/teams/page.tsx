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
} from "@/components/ui";

const teams = [
  { id: 1, name: "Engineering", members: 24, description: "Backend, frontend, and infrastructure engineers building the core platform.", lead: "Alex Kim" },
  { id: 2, name: "Product", members: 8, description: "Product management, design, and research driving roadmap priorities.", lead: "Sarah Chen" },
  { id: 3, name: "Customer Success", members: 12, description: "Customer onboarding, support, and account management.", lead: "David Park" },
  { id: 4, name: "Data Science", members: 6, description: "ML models, analytics, and data pipeline development.", lead: "Maria Lopez" },
  { id: 5, name: "Marketing", members: 9, description: "Brand, growth, content, and demand generation.", lead: "James Wright" },
];

export default function TeamsPage() {
  return (
    <div>
      <PageHeader
        title="Teams"
        description="Organize people and manage team-level access."
        actions={<Button>Create Team</Button>}
      />

      <div className="mb-6">
        <Input placeholder="Search teams..." className="max-w-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{team.name}</CardTitle>
              <CardDescription>{team.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{team.members} members</Badge>
              </div>
              <span className="text-xs text-muted-foreground">Lead: {team.lead}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
