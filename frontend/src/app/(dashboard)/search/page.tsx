import type { Metadata } from 'next';

import { SearchInterface } from '@/components/search/SearchInterface';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
          Search
        </h1>
        <p className="mt-1 text-sm text-surface-500">
          Search across all your documents, conversations, and meetings.
        </p>
      </div>
      <div className="flex-1 p-6">
        <SearchInterface />
      </div>
    </div>
  );
}
