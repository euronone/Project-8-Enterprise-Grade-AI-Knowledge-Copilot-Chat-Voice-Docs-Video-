"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";

const crawlers = [
  { id: 1, name: "Company Blog", url: "https://blog.acme.com", depth: 3, pages: 142, lastRun: "Mar 15, 2026", status: "Completed" },
  { id: 2, name: "Documentation Site", url: "https://docs.acme.com", depth: 5, pages: 1893, lastRun: "Mar 14, 2026", status: "Completed" },
  { id: 3, name: "Help Center", url: "https://help.acme.com", depth: 2, pages: 312, lastRun: "Mar 13, 2026", status: "Running" },
  { id: 4, name: "Developer Portal", url: "https://developers.acme.com", depth: 4, pages: 67, lastRun: "Mar 10, 2026", status: "Failed" },
];

const statusVariant: Record<string, "default" | "secondary" | "danger" | "outline"> = {
  Completed: "default",
  Running: "secondary",
  Failed: "danger",
};

export default function CrawlersPage() {
  return (
    <div>
      <PageHeader
        title="Web Crawlers"
        description="Manage automated web crawlers for ingesting website content."
        actions={<Button>Create Crawler</Button>}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Start URL</TableHead>
            <TableHead>Depth</TableHead>
            <TableHead>Pages Crawled</TableHead>
            <TableHead>Last Run</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {crawlers.map((c) => (
            <TableRow key={c.id} className="cursor-pointer">
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-muted-foreground text-xs max-w-[200px] truncate">{c.url}</TableCell>
              <TableCell>{c.depth}</TableCell>
              <TableCell>{c.pages.toLocaleString()}</TableCell>
              <TableCell>{c.lastRun}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[c.status] ?? "outline"}>{c.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
