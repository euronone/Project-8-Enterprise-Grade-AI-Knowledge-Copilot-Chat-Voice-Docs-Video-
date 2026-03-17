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
  Textarea,
} from "@/components/ui";

export default function VideoUploadPage() {
  return (
    <div>
      <PageHeader title="Upload Video" description="Add video content to your knowledge base." />

      <div className="grid gap-6 lg:grid-cols-2 max-w-5xl">
        {/* Drop zone */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Video File</CardTitle>
            <CardDescription>Drag and drop or click to browse. Supports MP4, MOV, WebM up to 10 GB.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 min-h-[260px] text-center">
            <div className="text-4xl mb-3">🎥</div>
            <p className="text-sm font-medium">Drop your video here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse files</p>
            <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium" htmlFor="v-title">Title</label>
                <Input id="v-title" placeholder="e.g. Q1 Product Demo" className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium" htmlFor="v-desc">Description</label>
                <Textarea id="v-desc" placeholder="Describe the video content..." className="mt-1" rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Collection</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {["Product Demos", "Training", "All Hands", "Customer Calls"].map((c, i) => (
                    <Badge key={c} variant={i === 0 ? "default" : "outline"} className="cursor-pointer px-3 py-1">{c}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Processing Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Auto-transcribe</p>
                  <p className="text-xs text-muted-foreground">Generate searchable transcript</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Generate Chapters</p>
                  <p className="text-xs text-muted-foreground">AI-powered chapter markers</p>
                </div>
                <Badge variant="default">Enabled</Badge>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full">Upload Video</Button>
        </div>
      </div>
    </div>
  );
}
