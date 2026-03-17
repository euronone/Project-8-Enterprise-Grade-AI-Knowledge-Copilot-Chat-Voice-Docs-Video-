import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Console"
        description="Govern users, organizations, roles, models, security, compliance, and platform health."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Users</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Invite, suspend, and manage access policies.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Security</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Enforce MFA, SSO, audit logs, and IP controls.</CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Monitor API, workers, queue depth, and incident status.</CardContent>
        </Card>
      </div>
    </div>
  );
}
