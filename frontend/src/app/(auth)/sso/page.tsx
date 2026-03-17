import { Card, CardContent, CardDescription, CardHeader, CardTitle, Spinner } from "@/components/ui";

export default function SSOPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Single Sign-On</CardTitle>
        <CardDescription>Completing authentication with your identity provider.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center py-8">
        <Spinner className="h-6 w-6" />
      </CardContent>
    </Card>
  );
}
