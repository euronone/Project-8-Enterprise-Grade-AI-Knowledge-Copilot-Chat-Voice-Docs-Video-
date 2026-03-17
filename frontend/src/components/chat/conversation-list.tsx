"use client";

import type { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";

export function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId?: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="space-y-1">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          className={cn(
            "w-full rounded-md border p-3 text-left text-sm",
            activeId === conversation.id ? "border-primary bg-primary/5" : "hover:bg-muted"
          )}
          onClick={() => onSelect(conversation.id)}
        >
          <p className="font-medium line-clamp-1">{conversation.title}</p>
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{conversation.messageCount} messages</p>
        </button>
      ))}
    </div>
  );
}
