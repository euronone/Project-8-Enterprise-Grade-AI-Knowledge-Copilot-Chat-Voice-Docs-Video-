"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";
import { useAuth } from "@/hooks/use-auth";

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithMicrosoft, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to access your enterprise AI workspace.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onSubmit} className="space-y-3">
          <Input type="email" placeholder="Work email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" type="submit" disabled={isLoading}>
            Sign in
          </Button>
        </form>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => void loginWithGoogle()}>
            Google
          </Button>
          <Button variant="outline" onClick={() => void loginWithMicrosoft()}>
            Microsoft
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex items-center justify-between">
          <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>
          <Link href="/register" className="hover:underline">Create account</Link>
        </div>
      </CardContent>
    </Card>
  );
}
