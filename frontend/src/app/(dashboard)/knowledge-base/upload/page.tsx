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
} from "@/components/ui";

const supportedFormats = ["PDF", "DOCX", "XLSX", "PPTX", "CSV", "MD", "HTML", "TXT"];

export default function UploadPage() {
  return (
    <div>
      <PageHeader title="Upload Documents" description="Add documents to your knowledge base for AI indexing." />

      <div className="max-w-3xl space-y-6">
        {/* Drop zone */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-10 text-center min-h-[220px]">
            <div className="text-4xl mb-3">📁</div>
            <p className="text-sm font-medium">Drag and drop files here</p>
            <p className="text-xs text-muted-foreground mt-1">or click to browse — upload multiple files at once</p>
            <Button variant="outline" size="sm" className="mt-4">Browse Files</Button>
          </CardContent>
        </Card>

        {/* Supported formats */}
        <Card>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
            <CardDescription>The following file types can be ingested and indexed.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {supportedFormats.map((f) => (
                <Badge key={f} variant="secondary" className="px-3 py-1">{f}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Collection selector */}
        <Card>
          <CardHeader>
            <CardTitle>Target Collection</CardTitle>
            <CardDescription>Choose which collection these documents belong to.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["General", "Engineering", "Product", "HR & Legal", "Customer Data"].map((c, i) => (
                <Badge key={c} variant={i === 0 ? "default" : "outline"} className="cursor-pointer px-3 py-1">{c}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Processing options */}
        <Card>
          <CardHeader>
            <CardTitle>Processing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">OCR for Scanned Documents</p>
                <p className="text-xs text-muted-foreground">Extract text from images and scanned PDFs</p>
              </div>
              <Badge variant="default">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">PII Detection & Redaction</p>
                <p className="text-xs text-muted-foreground">Automatically detect and mask sensitive data</p>
              </div>
              <Badge variant="secondary">Disabled</Badge>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full">Upload &amp; Process Documents</Button>
      </div>
    </div>
  );
}
