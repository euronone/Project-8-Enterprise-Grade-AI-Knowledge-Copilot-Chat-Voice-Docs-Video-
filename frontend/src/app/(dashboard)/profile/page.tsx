"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/ui";

export default function ProfilePage() {
  return (
    <div>
      <PageHeader title="Profile & Settings" description="Manage your account, preferences, and security." />

      <div className="space-y-6 max-w-3xl">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your name, email, and avatar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-muted-foreground">JD</div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium" htmlFor="p-name">Full Name</label>
                <Input id="p-name" defaultValue="Jane Doe" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="p-email">Email</label>
                <Input id="p-email" defaultValue="jane.doe@acme.com" className="mt-1" />
              </div>
            </div>
            <Button size="sm">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Customize your experience.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-xs text-muted-foreground">Choose light or dark mode</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="default" className="cursor-pointer">Light</Badge>
                <Badge variant="outline" className="cursor-pointer">Dark</Badge>
                <Badge variant="outline" className="cursor-pointer">System</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Language</p>
                <p className="text-xs text-muted-foreground">Interface language</p>
              </div>
              <Badge variant="secondary">English (US)</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive email digests</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your password and two-factor authentication.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" size="sm">Change Password</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Badge variant="secondary">Not Enabled</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
