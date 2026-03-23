'use client';

import { useRouter } from 'next/navigation';

import { MessageSquarePlus } from 'lucide-react';

import { MessageInput } from '@/components/chat/MessageInput';
import { ConversationList } from '@/components/chat/ConversationList';
import { useCreateConversation } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';

export default function ChatPage() {
  const router = useRouter();
  const createConversation = useCreateConversation();
  const { selectedModel } = useChatStore();

  const handleSend = async (content: string) => {
    const title = content.slice(0, 60) || 'New Conversation';
    const conversation = await createConversation.mutateAsync({ title, model: selectedModel });
    router.push(`/chat/${conversation.id}?q=${encodeURIComponent(content)}`);
  };

  return (
    <div className="flex h-full">
      <div className="w-72 shrink-0 border-r border-surface-100 bg-white dark:border-surface-800 dark:bg-surface-950 overflow-y-auto">
        <ConversationList />
      </div>
      <div className="flex flex-1 flex-col">
        {/* Empty state */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 dark:bg-brand-950">
            <MessageSquarePlus className="h-10 w-10 text-brand-600 dark:text-brand-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Start a new conversation
            </h2>
            <p className="mt-2 text-sm text-surface-500">
              Ask anything — your knowledge base is ready.
            </p>
          </div>
        </div>

        {/* Chat input at the bottom */}
        <MessageInput
          onSend={handleSend}
          disabled={createConversation.isPending}
          placeholder="Ask anything to start a new chat..."
        />
      </div>
    </div>
  );
}
