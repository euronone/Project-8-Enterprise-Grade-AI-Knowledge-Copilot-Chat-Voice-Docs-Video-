'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { ConnectorCard } from '@/components/knowledge/ConnectorCard';
import * as knowledgeApi from '@/lib/api/knowledge';
import { useKnowledgeStore } from '@/stores/knowledgeStore';

const AVAILABLE_CONNECTORS = [
  { type: 'google_drive', name: 'Google Drive', description: 'Files and folders from Google Drive', logo: '📁' },
  { type: 'sharepoint', name: 'SharePoint', description: 'Microsoft SharePoint sites', logo: '📋' },
  { type: 'onedrive', name: 'OneDrive', description: 'Personal and business OneDrive', logo: '☁️' },
  { type: 'confluence', name: 'Confluence', description: 'Atlassian Confluence spaces', logo: '🌐' },
  { type: 'notion', name: 'Notion', description: 'Notion pages and databases', logo: '📝' },
  { type: 'jira', name: 'Jira', description: 'Jira issues and projects', logo: '🎯' },
  { type: 'github', name: 'GitHub', description: 'GitHub repositories and wikis', logo: '🐙' },
  { type: 'gitlab', name: 'GitLab', description: 'GitLab projects', logo: '🦊' },
  { type: 'slack', name: 'Slack', description: 'Slack channels and messages', logo: '💬' },
  { type: 'teams', name: 'Microsoft Teams', description: 'Teams channels and chats', logo: '👥' },
  { type: 'salesforce', name: 'Salesforce', description: 'CRM records and documents', logo: '☁️' },
  { type: 'hubspot', name: 'HubSpot', description: 'Marketing and CRM content', logo: '🧲' },
  { type: 'zendesk', name: 'Zendesk', description: 'Support tickets and articles', logo: '🎫' },
  { type: 'intercom', name: 'Intercom', description: 'Customer conversations', logo: '💭' },
  { type: 'dropbox', name: 'Dropbox', description: 'Dropbox files and folders', logo: '📦' },
  { type: 'box', name: 'Box', description: 'Box files and collaboration', logo: '📤' },
  { type: 'figma', name: 'Figma', description: 'Design files and assets', logo: '🎨' },
  { type: 'linear', name: 'Linear', description: 'Issues and projects', logo: '📐' },
  { type: 'asana', name: 'Asana', description: 'Tasks and projects', logo: '✅' },
  { type: 'airtable', name: 'Airtable', description: 'Bases and tables', logo: '🗃️' },
  { type: 'web_scraper', name: 'Web Scraper', description: 'Scrape any public website', logo: '🕷️' },
  { type: 's3', name: 'Amazon S3', description: 'S3 buckets and objects', logo: '🪣' },
];

export default function ConnectorsPage() {
  const { connectors, setConnectors } = useKnowledgeStore();

  const { isLoading } = useQuery({
    queryKey: ['connectors'],
    queryFn: async () => {
      const data = await knowledgeApi.listConnectors();
      setConnectors(data);
      return data;
    },
  });

  const connectedTypes = new Set(connectors.map((c) => c.type));

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Data Connectors
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              Connect your tools and data sources to build a unified knowledge base.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-surface-500">
            <span className="font-semibold text-surface-700 dark:text-surface-300">
              {connectors.length}
            </span>
            connected
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {/* Active connectors */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : connectors.length > 0 ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                Connected ({connectors.length})
              </h2>
              <Button
                leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                size="sm"
                variant="ghost"
              >
                Sync all
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {connectors.map((connector) => (
                <ConnectorCard key={connector.id} connector={connector} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Available connectors */}
        <div>
          <h2 className="mb-4 text-sm font-semibold text-surface-700 dark:text-surface-300">
            Available Connectors
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {AVAILABLE_CONNECTORS.filter((c) => !connectedTypes.has(c.type as never)).map(
              (connector) => (
                <button
                  key={connector.type}
                  className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white p-3 text-left transition-all hover:border-brand-300 hover:shadow-card-hover dark:border-surface-700 dark:bg-surface-900 dark:hover:border-brand-700"
                >
                  <span className="text-2xl">{connector.logo}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-surface-800 dark:text-surface-200">
                      {connector.name}
                    </p>
                    <p className="truncate text-xs text-surface-400">{connector.description}</p>
                  </div>
                  <Plus className="ml-auto h-4 w-4 shrink-0 text-surface-300" />
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
