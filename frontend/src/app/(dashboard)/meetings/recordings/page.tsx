"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui";

const recordings = [
  { id: 1, name: "Sprint Planning - Week 12", date: "Mar 15, 2026", duration: "47 min", participants: 8, size: "256 MB", daysAgo: 2 },
  { id: 2, name: "Product Roadmap Review", date: "Mar 14, 2026", duration: "1h 12 min", participants: 14, size: "412 MB", daysAgo: 3 },
  { id: 3, name: "Engineering Standup", date: "Mar 13, 2026", duration: "15 min", participants: 6, size: "82 MB", daysAgo: 4 },
  { id: 4, name: "Customer Onboarding Call", date: "Mar 10, 2026", duration: "32 min", participants: 4, size: "178 MB", daysAgo: 7 },
  { id: 5, name: "Q1 All-Hands", date: "Feb 28, 2026", duration: "1h 45 min", participants: 48, size: "623 MB", daysAgo: 17 },
];

function RecordingTable({ items }: { items: typeof recordings }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Recording Name</TableHead>
          <TableHead>Meeting Date</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Participants</TableHead>
          <TableHead>Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((r) => (
          <TableRow key={r.id} className="cursor-pointer">
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell>{r.date}</TableCell>
            <TableCell>{r.duration}</TableCell>
            <TableCell>{r.participants}</TableCell>
            <TableCell>{r.size}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function RecordingsPage() {
  return (
    <div>
      <PageHeader title="Recordings" description="Browse and search meeting recordings." />

      <div className="mb-4">
        <Input placeholder="Search recordings..." className="max-w-sm" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <RecordingTable items={recordings} />
        </TabsContent>
        <TabsContent value="week" className="mt-4">
          <RecordingTable items={recordings.filter((r) => r.daysAgo <= 7)} />
        </TabsContent>
        <TabsContent value="month" className="mt-4">
          <RecordingTable items={recordings.filter((r) => r.daysAgo <= 30)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
