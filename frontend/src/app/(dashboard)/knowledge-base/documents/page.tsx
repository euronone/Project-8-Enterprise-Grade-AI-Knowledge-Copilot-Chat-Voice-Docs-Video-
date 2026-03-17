"use client";

import { PageHeader } from "@/components/shared/page-header";
import {
  Badge,
  Button,
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

const documents = [
  { id: 1, name: "Q1 Revenue Report.pdf", type: "PDF", collection: "Finance", size: "2.4 MB", indexed: "Mar 15, 2026", status: "Indexed" },
  { id: 2, name: "API Design Guidelines.md", type: "MD", collection: "Engineering", size: "48 KB", indexed: "Mar 14, 2026", status: "Indexed" },
  { id: 3, name: "Employee Handbook.docx", type: "DOCX", collection: "HR & Legal", size: "1.8 MB", indexed: "Mar 12, 2026", status: "Indexed" },
  { id: 4, name: "Sales Pipeline Q1.xlsx", type: "XLSX", collection: "Sales", size: "540 KB", indexed: "Mar 10, 2026", status: "Processing" },
  { id: 5, name: "Product Roadmap 2026.pptx", type: "PPTX", collection: "Product", size: "4.1 MB", indexed: "Mar 8, 2026", status: "Indexed" },
];

const typeCategory: Record<string, string> = { PDF: "pdf", MD: "other", DOCX: "docx", XLSX: "spreadsheets", PPTX: "other" };

function DocTable({ items }: { items: typeof documents }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Collection</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Indexed Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((d) => (
          <TableRow key={d.id} className="cursor-pointer">
            <TableCell className="font-medium">{d.name}</TableCell>
            <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
            <TableCell>{d.collection}</TableCell>
            <TableCell>{d.size}</TableCell>
            <TableCell>{d.indexed}</TableCell>
            <TableCell>
              <Badge variant={d.status === "Indexed" ? "default" : "secondary"}>{d.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader
        title="Documents"
        description="Browse and manage all indexed documents."
        actions={<Button>Upload</Button>}
      />

      <div className="mb-4">
        <Input placeholder="Search documents..." className="max-w-sm" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
          <TabsTrigger value="docx">DOCX</TabsTrigger>
          <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <DocTable items={documents} />
        </TabsContent>
        <TabsContent value="pdf" className="mt-4">
          <DocTable items={documents.filter((d) => typeCategory[d.type] === "pdf")} />
        </TabsContent>
        <TabsContent value="docx" className="mt-4">
          <DocTable items={documents.filter((d) => typeCategory[d.type] === "docx")} />
        </TabsContent>
        <TabsContent value="spreadsheets" className="mt-4">
          <DocTable items={documents.filter((d) => typeCategory[d.type] === "spreadsheets")} />
        </TabsContent>
        <TabsContent value="other" className="mt-4">
          <DocTable items={documents.filter((d) => typeCategory[d.type] === "other")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
