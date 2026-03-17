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
} from "@/components/ui";

const collections = [
  { id: 1, name: "Engineering", docs: 342, description: "Technical documentation, architecture decisions, and code guidelines.", updated: "2 hours ago" },
  { id: 2, name: "Product", docs: 156, description: "Product specs, roadmaps, user research, and design docs.", updated: "1 day ago" },
  { id: 3, name: "HR & Legal", docs: 89, description: "Employee handbook, policies, compliance documents, and contracts.", updated: "3 days ago" },
  { id: 4, name: "Customer Data", docs: 234, description: "Customer feedback, support tickets, and success playbooks.", updated: "5 hours ago" },
  { id: 5, name: "Finance", docs: 67, description: "Financial reports, budgets, forecasts, and audit documents.", updated: "1 week ago" },
  { id: 6, name: "Sales", docs: 198, description: "Sales playbooks, proposals, case studies, and competitive intel.", updated: "12 hours ago" },
];

export default function CollectionsPage() {
  return (
    <div>
      <PageHeader
        title="Collections"
        description="Organize knowledge into thematic collections."
        actions={<Button>Create Collection</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <Card key={col.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="text-lg">{col.name}</CardTitle>
              <CardDescription>{col.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <Badge variant="secondary">{col.docs} documents</Badge>
              <span className="text-xs text-muted-foreground">Updated {col.updated}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
