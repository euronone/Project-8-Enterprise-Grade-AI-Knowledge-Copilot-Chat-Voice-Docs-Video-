"use client";

import type { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
        <Button
          key={conversation.id}
          variant={activeId === conversation.id ? "secondary" : "outline"}
          className="w-full justify-start h-auto flex-col items-start p-3 rounded-[10px]"
          onClick={() => onSelect(conversation.id)}
        >
          <p className="font-medium line-clamp-1">{conversation.title}</p>
          <p className="mt-1 text-xs text-[#9CA3AF] line-clamp-1">{conversation.messageCount} messages</p>
        </Button>
      ))}
    </div>
  );
}
