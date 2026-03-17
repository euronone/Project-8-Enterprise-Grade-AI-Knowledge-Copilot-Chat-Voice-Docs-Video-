"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const stats = [
  { label: "Unanswered Queries", value: "1,247", change: "+8%" },
  { label: "Low Confidence Responses", value: "3,891", change: "-3%" },
  { label: "Missing Topics", value: "64", change: "+12" },
  { label: "Stale Documents", value: "189", change: "+23" },
];

const unanswered = [
  { question: "What is the process for international wire transfers?", count: 87, department: "Finance", action: "Create documentation" },
  { question: "How to configure SSO for third-party vendors?", count: 64, department: "IT", action: "Update IT wiki" },
  { question: "Employee stock option vesting schedule details", count: 52, department: "HR", action: "Add to benefits docs" },
  { question: "Data retention policy for EU customers", count: 48, department: "Legal", action: "Draft policy doc" },
  { question: "API rate limits for production environment", count: 41, department: "Engineering", action: "Update API docs" },
  { question: "Brand guidelines for partner co-marketing", count: 35, department: "Marketing", action: "Create guide" },
];

const deptColor: Record<string, "default" | "secondary" | "outline" | "danger"> = {
  Finance: "default",
  IT: "secondary",
  HR: "outline",
  Legal: "danger",
  Engineering: "default",
  Marketing: "secondary",
};

export default function KnowledgeGapsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Knowledge Gaps" description="Identify missing or insufficient knowledge coverage areas." />

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
          <CardTitle>Frequently Unanswered Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Question</TableHead>
                <TableHead className="text-right">Ask Count</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Suggested Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unanswered.map((q) => (
                <TableRow key={q.question}>
                  <TableCell className="font-medium">{q.question}</TableCell>
                  <TableCell className="text-right">{q.count}</TableCell>
                  <TableCell><Badge variant={deptColor[q.department] ?? "default"}>{q.department}</Badge></TableCell>
                  <TableCell>{q.action}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
