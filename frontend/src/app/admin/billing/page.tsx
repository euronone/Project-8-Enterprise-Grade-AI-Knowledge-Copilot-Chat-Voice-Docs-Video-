"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button, Progress, Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const invoices = [
  { id: "INV-2026-003", date: "2026-03-01", amount: "$2,499.00", status: "Paid" },
  { id: "INV-2026-002", date: "2026-02-01", amount: "$2,499.00", status: "Paid" },
  { id: "INV-2026-001", date: "2026-01-01", amount: "$2,499.00", status: "Paid" },
  { id: "INV-2025-012", date: "2025-12-01", amount: "$1,999.00", status: "Paid" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Subscription" description="Manage your plan, payment methods, and invoices." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Professional Plan</CardTitle>
                <CardDescription>$2,499 / month • Billed annually</CardDescription>
              </div>
              <Badge variant="default">Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Queries: 38,241 / 50,000</span>
                <span>76%</span>
              </div>
              <Progress value={76} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage: 67 GB / 100 GB</span>
                <span>67%</span>
              </div>
              <Progress value={67} />
            </div>
            <Button variant="outline" size="sm">Change Plan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Visa ending in 4242</p>
            <p className="text-sm text-muted-foreground">Expires 08/2028</p>
            <Button variant="outline" size="sm" className="w-full">Update</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.id}</TableCell>
                  <TableCell>{inv.date}</TableCell>
                  <TableCell>{inv.amount}</TableCell>
                  <TableCell><Badge variant={inv.status === "Paid" ? "default" : "secondary"}>{inv.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
