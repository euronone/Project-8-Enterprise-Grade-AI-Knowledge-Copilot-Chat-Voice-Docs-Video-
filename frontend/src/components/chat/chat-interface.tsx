"use client";

import { useMemo } from "react";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { TypingIndicator } from "./typing-indicator";
import { FollowUpSuggestions } from "./follow-up-suggestions";
import { useChatStore } from "@/stores/chat-store";
import { useMessages, useSendMessage } from "@/hooks/use-chat";

export function ChatInterface({ conversationId }: { conversationId: string }) {
  const { getActiveMessages, streamingMessageId } = useChatStore();
  useMessages(conversationId);
  const sendMessage = useSendMessage(conversationId);

  const messages = getActiveMessages();
  const suggestions = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i].role === "assistant") {
        return messages[i].followUpSuggestions ?? [];
      }
    }
    return [];
  }, [messages]);

  return (
    <div className="grid grid-rows-[1fr_auto_auto] gap-3 h-[calc(100vh-10rem)]">
      {/* Message list container with modern workspace styling */}
      <div className="chat-container overflow-hidden">
        <MessageList messages={messages} />
      </div>

      {/* Typing indicator */}
      {streamingMessageId ? (
        <div className="px-4 py-2">
          <TypingIndicator />
        </div>
      ) : null}

      {/* Follow-up suggestions */}
      <div className="px-4">
        <FollowUpSuggestions suggestions={suggestions} onSelect={(s) => void sendMessage(s)} />
      </div>

      {/* Chat input */}
      <div className="px-4 pb-4">
        <ChatInput onSend={(text) => sendMessage(text)} disabled={Boolean(streamingMessageId)} />
      </div>
    </div>
  );
}
