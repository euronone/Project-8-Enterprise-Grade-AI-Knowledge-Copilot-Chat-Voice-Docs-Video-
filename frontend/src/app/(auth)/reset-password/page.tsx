import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from "@/components/ui";

export default function ResetPasswordPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Set new password</CardTitle>
        <CardDescription>Use a strong password with uppercase, number, and symbol.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Input type="password" placeholder="New password" />
        <Input type="password" placeholder="Confirm password" />
        <Button className="w-full">Update password</Button>
      </CardContent>
    </Card>
  );
}
