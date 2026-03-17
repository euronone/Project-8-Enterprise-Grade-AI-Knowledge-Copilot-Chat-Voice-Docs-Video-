import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { UsageChart } from "@/components/analytics/usage-chart";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track AI quality, operational cost, adoption, and organizational knowledge gaps."
      />
      <Card>
        <CardHeader>
          <CardTitle>Usage Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <UsageChart />
        </CardContent>
      </Card>
    </div>
  );
}
