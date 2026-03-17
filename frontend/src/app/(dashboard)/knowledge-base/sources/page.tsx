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

const sources = [
  { id: 1, icon: "📂", name: "Google Drive (Engineering)", type: "Google Drive", status: "Connected", lastSync: "10 min ago", docs: 1243 },
  { id: 2, icon: "💬", name: "Slack — #engineering", type: "Slack", status: "Syncing", lastSync: "In progress", docs: 8901 },
  { id: 3, icon: "🗃️", name: "Confluence — Product Space", type: "Confluence", status: "Connected", lastSync: "1 hour ago", docs: 567 },
  { id: 4, icon: "🐙", name: "GitHub — knowledgeforge/core", type: "GitHub", status: "Connected", lastSync: "30 min ago", docs: 2341 },
  { id: 5, icon: "☁️", name: "SharePoint — Company Wiki", type: "SharePoint", status: "Error", lastSync: "Failed 2h ago", docs: 432 },
];

const statusVariant: Record<string, "default" | "secondary" | "outline" | "danger"> = {
  Connected: "default",
  Syncing: "secondary",
  Error: "danger",
};

export default function SourcesPage() {
  return (
    <div>
      <PageHeader
        title="Connected Sources"
        description="Manage data source integrations and sync status."
        actions={<Button>Add Source</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((s) => (
          <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base truncate">{s.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">{s.type}</Badge>
                    <Badge variant={statusVariant[s.status] ?? "outline"} className="text-xs">{s.status}</Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Last sync: {s.lastSync}</span>
              <span>{s.docs.toLocaleString()} docs</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
