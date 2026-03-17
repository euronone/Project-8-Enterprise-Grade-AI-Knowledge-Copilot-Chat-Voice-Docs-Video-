"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const integrations = [
  { name: "Slack", description: "Send notifications and interact via Slack channels.", status: "Connected" },
  { name: "Microsoft Teams", description: "Meeting integration and Teams channel notifications.", status: "Connected" },
  { name: "Google Drive", description: "Sync documents from Google Drive folders.", status: "Connected" },
  { name: "SharePoint", description: "Index SharePoint sites and document libraries.", status: "Available" },
  { name: "Confluence", description: "Sync Confluence spaces and pages.", status: "Connected" },
  { name: "Jira", description: "Import Jira issues, comments, and project docs.", status: "Available" },
  { name: "GitHub", description: "Index repositories, issues, PRs, and wikis.", status: "Connected" },
  { name: "Salesforce", description: "Sync CRM knowledge articles and case data.", status: "Available" },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Integrations" description="Connect external services and data sources to your knowledge base." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {integrations.map((i) => (
          <Card key={i.name}>
            <CardHeader>
              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground mb-2">{i.name.slice(0, 2)}</div>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{i.name}</CardTitle>
                <Badge variant={i.status === "Connected" ? "default" : "secondary"}>{i.status}</Badge>
              </div>
              <CardDescription>{i.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant={i.status === "Connected" ? "outline" : "default"} size="sm" className="w-full">
                {i.status === "Connected" ? "Configure" : "Connect"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
