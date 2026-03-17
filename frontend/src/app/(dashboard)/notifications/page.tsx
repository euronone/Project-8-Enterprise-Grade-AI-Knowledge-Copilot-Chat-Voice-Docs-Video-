"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui";

const notifications = [
  { id: 1, icon: "📄", message: "New document 'Q1 Revenue Report' was indexed successfully.", time: "5 min ago", read: false, type: "system" },
  { id: 2, icon: "💬", message: "Sarah Chen mentioned you in a conversation about API design.", time: "23 min ago", read: false, type: "mention" },
  { id: 3, icon: "🔔", message: "Your workflow 'Customer Ticket Triage' completed with 3 warnings.", time: "1 hour ago", read: true, type: "system" },
  { id: 4, icon: "👥", message: "You were added to the 'Engineering' team by Alex Kim.", time: "3 hours ago", read: true, type: "system" },
  { id: 5, icon: "💬", message: "David Park mentioned you in meeting recap for Sprint Planning.", time: "Yesterday", read: true, type: "mention" },
];

function NotificationList({ items }: { items: typeof notifications }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No notifications</p>}
      {items.map((n) => (
        <Card key={n.id} className={n.read ? "opacity-70" : ""}>
          <CardContent className="flex items-start gap-3 py-3">
            <span className="text-xl">{n.icon}</span>
            <div className="flex-1">
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
            {!n.read && <Badge variant="default" className="text-[10px]">New</Badge>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay up to date with activity across your workspace."
        actions={<Button variant="outline">Mark All Read</Button>}
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <NotificationList items={notifications} />
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          <NotificationList items={notifications.filter((n) => !n.read)} />
        </TabsContent>
        <TabsContent value="mentions" className="mt-4">
          <NotificationList items={notifications.filter((n) => n.type === "mention")} />
        </TabsContent>
        <TabsContent value="system" className="mt-4">
          <NotificationList items={notifications.filter((n) => n.type === "system")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
