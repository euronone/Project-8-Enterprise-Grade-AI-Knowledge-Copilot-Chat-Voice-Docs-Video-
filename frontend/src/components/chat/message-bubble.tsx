import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { CitationCard } from "./citation-card";
import { FeedbackButtons } from "./feedback-buttons";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-xl px-4 py-3 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-card border"
        )}
      >
        <div className="prose-chat whitespace-pre-wrap">{message.content}</div>
        {message.citations?.length ? (
          <div className="mt-3 grid gap-2">
            {message.citations.map((citation) => (
              <CitationCard key={citation.id} citation={citation} />
            ))}
          </div>
        ) : null}
        {!isUser ? <FeedbackButtons messageId={message.id} /> : null}
      </div>
    </div>
  );
}
