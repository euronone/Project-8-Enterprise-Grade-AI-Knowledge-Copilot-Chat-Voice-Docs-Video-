import type { Metadata } from 'next';

import { VoiceAssistant } from '@/components/voice/VoiceAssistant';

export const metadata: Metadata = { title: 'Voice Assistant' };

export default function VoicePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
          Voice Assistant
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Speak naturally — KnowledgeForge will listen and respond with knowledge from your
          documents.
        </p>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          <VoiceAssistant />
        </div>
      </div>
    </div>
  );
}
