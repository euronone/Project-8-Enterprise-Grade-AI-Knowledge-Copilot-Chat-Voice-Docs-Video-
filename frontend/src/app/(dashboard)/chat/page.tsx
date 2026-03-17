"use client";

import { useEffect } from "react";
import { ChatInterface } from "@/components/chat/chat-interface";
import { Button } from "@/components/ui";
import { PageHeader } from "@/components/shared/page-header";
import { useCreateConversation } from "@/hooks/use-chat";
import { useChatStore } from "@/stores/chat-store";

export default function ChatPage() {
  const { activeConversationId, setActiveConversation } = useChatStore();
  const { mutateAsync: createConversation } = useCreateConversation();

  useEffect(() => {
    if (!activeConversationId) {
      void createConversation({ title: "New conversation" }).then((conv) => {
        setActiveConversation(conv.id);
      });
    }
  }, [activeConversationId, createConversation, setActiveConversation]);

  return (
    <div className="space-y-4">
      <PageHeader
        title="AI Chat"
        description="Ask questions across docs, meetings, code, and enterprise systems with citations."
        actions={<Button onClick={() => void createConversation({ title: "New conversation" })}>New chat</Button>}
      />
      {activeConversationId ? <ChatInterface conversationId={activeConversationId} /> : null}
    </div>
  );
}
