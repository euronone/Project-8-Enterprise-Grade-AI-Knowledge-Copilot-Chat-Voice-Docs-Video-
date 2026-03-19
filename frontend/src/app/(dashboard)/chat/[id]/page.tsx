import type { Metadata } from 'next';

import { ConversationList } from '@/components/chat/ConversationList';
import { ChatInterface } from '@/components/chat/ChatInterface';

interface ChatConversationPageProps {
  params: { id: string };
}

export const metadata: Metadata = { title: 'Chat' };

export default function ChatConversationPage({ params }: ChatConversationPageProps) {
  return (
    <div className="flex h-full">
      {/* Sidebar conversation list */}
      <div className="w-72 shrink-0 border-r border-surface-100 bg-white dark:border-surface-800 dark:bg-surface-950 overflow-y-auto">
        <ConversationList />
      </div>

      {/* Chat interface */}
      <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-surface-950">
        <ChatInterface conversationId={params.id} />
      </div>
    </div>
  );
}
