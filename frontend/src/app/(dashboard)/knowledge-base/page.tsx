import { PageHeader } from "@/components/shared/page-header";
import { UploadZone } from "@/components/knowledge/upload-zone";

export default function KnowledgeBasePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Ingest documents, connectors, and crawled web sources into a unified semantic index."
      />
      <UploadZone />
    </div>
  );
}
