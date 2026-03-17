import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>Enter your email and we’ll send a reset link.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="email" placeholder="Work email" />
        <Button className="w-full">Send reset link</Button>
      </CardContent>
    </Card>
  );
}
