"use client";

import { Card, CardContent, CardHeader, CardTitle, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const stats = [
  { label: "Total Queries", value: "184,293", change: "+12.3%" },
  { label: "Active Users", value: "1,847", change: "+5.7%" },
  { label: "Avg Response Time", value: "1.2s", change: "-8.1%" },
  { label: "Token Usage", value: "24.8M", change: "+18.4%" },
];

const topQueries = [
  { query: "How do I reset my VPN credentials?", count: 342, latency: "0.8s" },
  { query: "What is the PTO policy for 2026?", count: 287, latency: "1.1s" },
  { query: "Deploy process for staging environment", count: 234, latency: "1.4s" },
  { query: "Q4 revenue projections", count: 198, latency: "1.6s" },
  { query: "New hire onboarding checklist", count: 176, latency: "0.9s" },
];

export default function UsagePage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Usage Metrics" description="Monitor platform usage and query analytics." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded-md bg-muted flex items-center justify-center text-muted-foreground">Chart placeholder</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Queries This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Query</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="text-right">Avg Latency</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topQueries.map((q) => (
                <TableRow key={q.query}>
                  <TableCell className="font-medium">{q.query}</TableCell>
                  <TableCell className="text-right">{q.count}</TableCell>
                  <TableCell className="text-right">{q.latency}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
