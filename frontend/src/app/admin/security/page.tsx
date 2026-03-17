"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

const settings = [
  { title: "Password Policy", description: "Minimum 12 characters, uppercase, lowercase, number, and special character required.", detail: "Min length: 12", status: "Enforced" },
  { title: "MFA Settings", description: "Multi-factor authentication using TOTP, SMS, or WebAuthn.", detail: "TOTP + WebAuthn", status: "Required" },
  { title: "Session Management", description: "Automatic session expiry and concurrent session limits.", detail: "Timeout: 30 min", status: "Active" },
  { title: "IP Allowlist", description: "Restrict access to approved IP addresses and CIDR ranges.", detail: "4 ranges configured", status: "Enabled" },
  { title: "API Security", description: "Rate limiting and request throttling for API endpoints.", detail: "1000 req/min", status: "Active" },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security Settings" description="Configure authentication, session, and access security policies." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.map((s) => (
          <Card key={s.title}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{s.title}</CardTitle>
                <Badge variant="default">{s.status}</Badge>
              </div>
              <CardDescription>{s.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{s.detail}</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
