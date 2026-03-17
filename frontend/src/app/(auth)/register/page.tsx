"use client";

import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";

export default function RegisterPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create organization</CardTitle>
        <CardDescription>Start your KnowledgeForge workspace in minutes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input placeholder="Full name" />
        <Input type="email" placeholder="Work email" />
        <Input placeholder="Organization" />
        <Input type="password" placeholder="Password" />
        <Button className="w-full">Create account</Button>
        <p className="text-sm text-muted-foreground">
          Already registered? <Link href="/login" className="hover:underline">Sign in</Link>
        </p>
      </CardContent>
    </Card>
  );
}
