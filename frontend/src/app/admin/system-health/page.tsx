"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const services = [
  { name: "API", status: "Healthy", color: "default" as const },
  { name: "Database", status: "Healthy", color: "default" as const },
  { name: "Redis", status: "Healthy", color: "default" as const },
  { name: "Elasticsearch", status: "Degraded", color: "secondary" as const },
  { name: "Vector DB", status: "Healthy", color: "default" as const },
];

const metrics = [
  { title: "Response Time", value: "142ms", trend: "↓ 12% from last hour" },
  { title: "Error Rate", value: "0.08%", trend: "↓ 0.02% from last hour" },
  { title: "Queue Depth", value: "23", trend: "Celery worker queue" },
  { title: "Active Connections", value: "1,247", trend: "WebSocket + HTTP" },
];

export default function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="System Health" description="Real-time monitoring of platform infrastructure and services." />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {services.map((s) => (
          <Card key={s.name}>
            <CardContent className="pt-6 text-center">
              <p className="text-sm font-medium mb-2">{s.name}</p>
              <Badge variant={s.color}>{s.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{m.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{m.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
