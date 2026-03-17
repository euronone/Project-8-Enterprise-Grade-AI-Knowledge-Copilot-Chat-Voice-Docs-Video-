"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const insights = [
  { title: "Engineering Query Spike", description: "Engineering team queries spiked 40% this week, driven primarily by deployment-related questions.", impact: "High" as const },
  { title: "Stale Legal Content", description: "Legal documents have 12% stale content that hasn't been updated in over 6 months.", impact: "High" as const },
  { title: "Onboarding Knowledge Gap", description: "New hires ask 3x more questions in their first week than the knowledge base can answer confidently.", impact: "Medium" as const },
  { title: "Duplicate Documentation", description: "23 pairs of near-duplicate documents detected across Sales and Marketing collections.", impact: "Medium" as const },
  { title: "Underutilized Video Library", description: "Only 18% of uploaded training videos have been viewed more than once in the past quarter.", impact: "Low" as const },
  { title: "Peak Usage Pattern", description: "Query volume peaks between 10-11 AM EST on Tuesdays, consider pre-caching popular results.", impact: "Low" as const },
];

const impactColor: Record<string, string> = {
  High: "danger",
  Medium: "default",
  Low: "secondary",
};

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="AI-Generated Insights" description="Intelligence derived from your organization's knowledge usage patterns." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight) => (
          <Card key={insight.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">AI</div>
                <Badge variant={impactColor[insight.impact] as "danger" | "default" | "secondary"}>{insight.impact}</Badge>
              </div>
              <CardTitle className="text-base mt-2">{insight.title}</CardTitle>
              <CardDescription>{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
