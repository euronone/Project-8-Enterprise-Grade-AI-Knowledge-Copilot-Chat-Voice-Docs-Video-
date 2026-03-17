import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";

interface FeaturePageProps {
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
}

export function FeaturePage({ title, description, primaryAction, secondaryAction }: FeaturePageProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} />
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {primaryAction ? <Button>{primaryAction}</Button> : null}
          {secondaryAction ? <Button variant="secondary">{secondaryAction}</Button> : null}
        </CardContent>
      </Card>
    </div>
  );
}
