import type { Citation } from "@/types/chat";
import { Badge } from "@/components/ui";

export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url ?? "#"}
      target="_blank"
      rel="noreferrer"
      className="block rounded-[14px] border border-[#374151] bg-[#1F2937] p-3 hover:bg-[#252e3f] hover:border-[#6366F1]/50 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-xs line-clamp-1">{citation.documentTitle}</p>
        <Badge variant="secondary">{Math.round(citation.score * 100)}%</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{citation.chunk}</p>
    </a>
  );
}
