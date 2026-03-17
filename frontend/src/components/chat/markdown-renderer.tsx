import { cn } from "@/lib/utils";

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  return <div className={cn("prose-chat whitespace-pre-wrap", className)}>{content}</div>;
}
