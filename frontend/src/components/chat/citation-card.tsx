import type { Citation } from "@/types/chat";
import { Badge } from "@/components/ui";

export function CitationCard({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url ?? "#"}
      target="_blank"
      rel="noreferrer"
      className="block rounded-lg border bg-muted/40 p-3 hover:bg-muted"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium text-xs line-clamp-1">{citation.documentTitle}</p>
        <Badge variant="secondary">{Math.round(citation.score * 100)}%</Badge>
      </div>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{citation.chunk}</p>
    </a>
  );
}
