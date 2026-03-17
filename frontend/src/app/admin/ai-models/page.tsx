"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const models = [
  { name: "Claude 3.5 Sonnet", provider: "Anthropic", status: "Active", maxTokens: 200000, temperature: 0.1, cost: "$3.00 / $15.00" },
  { name: "GPT-4o", provider: "OpenAI", status: "Active", maxTokens: 128000, temperature: 0.2, cost: "$2.50 / $10.00" },
  { name: "GPT-4o-mini", provider: "OpenAI", status: "Inactive", maxTokens: 128000, temperature: 0.3, cost: "$0.15 / $0.60" },
];

export default function AIModelsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI Model Configuration" description="Configure and manage AI models used across the platform." actions={<Button>Add Model</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {models.map((model) => (
          <Card key={model.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{model.name}</CardTitle>
                <Badge variant={model.status === "Active" ? "default" : "secondary"}>{model.status}</Badge>
              </div>
              <CardDescription>
                <Badge variant="outline" className="mt-1">{model.provider}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Max Tokens</dt>
                  <dd className="font-medium">{model.maxTokens.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Temperature</dt>
                  <dd className="font-medium">{model.temperature}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cost (In/Out per 1K)</dt>
                  <dd className="font-medium">{model.cost}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
