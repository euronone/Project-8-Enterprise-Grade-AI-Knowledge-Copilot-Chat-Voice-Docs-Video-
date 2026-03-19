import type { Metadata } from 'next';
import { MessageSquarePlus } from 'lucide-react';

import { ConversationList } from '@/components/chat/ConversationList';

export const metadata: Metadata = { title: 'Chat' };

export default function ChatPage() {
  return (
    <div className="flex h-full">
      {/* Conversation list panel */}
      <div className="w-72 shrink-0 border-r border-surface-100 bg-white dark:border-surface-800 dark:bg-surface-950 overflow-y-auto">
        <ConversationList />
      </div>

      {/* Empty state — no conversation selected */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-50 dark:bg-brand-950">
          <MessageSquarePlus className="h-10 w-10 text-brand-600 dark:text-brand-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
            Select a conversation
          </h2>
          <p className="mt-2 text-sm text-surface-500">
            Choose from the list on the left, or start a new chat.
          </p>
        </div>
      </div>
    </div>
  );
}
