import { cn } from "@/lib/utils";
import type { Message } from "@/types/chat";
import { CitationCard } from "./citation-card";
import { FeedbackButtons } from "./feedback-buttons";

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("chat-message-wrapper", isUser ? "chat-message-user" : "chat-message-ai")}>
      <div>
        {/* Message content with prose styling */}
        <div className="prose-chat">{message.content}</div>

        {/* Citations section */}
        {message.citations?.length ? (
          <div className="chat-message-citations">
            {message.citations.map((citation) => (
              <CitationCard key={citation.id} citation={citation} />
            ))}
          </div>
        ) : null}

        {/* Feedback buttons for AI messages only */}
        {!isUser ? (
          <div className="mt-3">
            <FeedbackButtons messageId={message.id} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
