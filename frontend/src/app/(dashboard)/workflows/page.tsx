'use client';

import { useState } from 'react';

import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  GitBranch,
  Layers,
  Mail,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Settings,
  Slack,
  Trash2,
  Webhook,
  Workflow,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const workflows = [
  {
    id: '1',
    name: 'New Document → Summarize & Notify',
    description: 'When a document is uploaded, AI summarizes it and posts to Slack #knowledge-updates.',
    trigger: 'Document Upload',
    triggerIcon: Layers,
    steps: 3,
    status: 'active',
    runs: 248,
    lastRun: '5 min ago',
    successRate: 99.2,
  },
  {
    id: '2',
    name: 'Support Ticket Auto-Resolve',
    description: 'Searches knowledge base for answers; auto-responds to Zendesk tickets. Escalates if confidence < 80%.',
    trigger: 'Zendesk Ticket',
    triggerIcon: MessageSquare,
    steps: 5,
    status: 'active',
    runs: 1042,
    lastRun: '2 min ago',
    successRate: 94.7,
  },
  {
    id: '3',
    name: 'Meeting Recap → Jira Tasks',
    description: 'After every meeting, extracts action items and creates Jira tickets with assignees and due dates.',
    trigger: 'Meeting End',
    triggerIcon: Webhook,
    steps: 4,
    status: 'active',
    runs: 87,
    lastRun: '1 hr ago',
    successRate: 97.8,
  },
  {
    id: '4',
    name: 'Weekly Knowledge Digest',
    description: 'Every Monday at 9AM, sends a personalized digest of new knowledge base content to each team.',
    trigger: 'Schedule (Weekly)',
    triggerIcon: Clock,
    steps: 2,
    status: 'active',
    runs: 12,
    lastRun: '3 days ago',
    successRate: 100,
  },
  {
    id: '5',
    name: 'Stale Document Cleanup',
    description: 'Detects documents not accessed in 180 days and sends owners a review request before archiving.',
    trigger: 'Schedule (Daily)',
    triggerIcon: Clock,
    steps: 3,
    status: 'paused',
    runs: 30,
    lastRun: '8 days ago',
    successRate: 88.3,
  },
  {
    id: '6',
    name: 'Onboarding Welcome Sequence',
    description: 'Sends personalised onboarding resources and assigns the Onboarding Agent to new employees.',
    trigger: 'New User Created',
    triggerIcon: Zap,
    steps: 6,
    status: 'draft',
    runs: 0,
    lastRun: '—',
    successRate: 0,
  },
];

const templates = [
  { name: 'Document Ingestion Alert', icon: Layers, color: 'bg-blue-500', tags: ['Knowledge', 'Slack'] },
  { name: 'AI Answer to Email', icon: Mail, color: 'bg-violet-500', tags: ['Email', 'AI'] },
  { name: 'Slack → Knowledge Article', icon: Slack, color: 'bg-amber-500', tags: ['Slack', 'Knowledge'] },
  { name: 'Weekly Team Report', icon: Activity, color: 'bg-emerald-500', tags: ['Analytics', 'Schedule'] },
];

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const, icon: CheckCircle2 },
  paused: { label: 'Paused', variant: 'warning' as const, icon: Pause },
  draft: { label: 'Draft', variant: 'default' as const, icon: GitBranch },
  error: { label: 'Error', variant: 'danger' as const, icon: AlertCircle },
};

export default function WorkflowsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');

  const filtered = filter === 'all' ? workflows : workflows.filter((w) => w.status === filter);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">

      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Workflow Automation</h1>
            <p className="mt-0.5 text-sm text-surface-500">
              Event-driven automations that connect your knowledge base to the tools your team uses.
            </p>
          </div>
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
            New Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Workflows', value: '6', sub: '5 enabled', color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950' },
            { label: 'Runs Today', value: '312', sub: '+18% vs yesterday', color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950' },
            { label: 'Avg Success Rate', value: '96.8%', sub: 'Last 30 days', color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950' },
            { label: 'Time Saved', value: '41 hrs', sub: 'This month', color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950' },
          ].map((s) => (
            <Card key={s.label} variant="bordered">
              <div className={cn('mb-2 inline-flex rounded-lg px-2 py-1 text-xs font-semibold', s.color)}>{s.value}</div>
              <p className="text-sm font-medium text-surface-700 dark:text-surface-300">{s.label}</p>
              <p className="text-xs text-surface-400">{s.sub}</p>
            </Card>
          ))}
        </div>

        {/* Templates */}
        <div>
          <h2 className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">Quick Start Templates</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((t) => (
              <button
                key={t.name}
                className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 text-left transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-900"
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white', t.color)}>
                  <t.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{t.name}</p>
                  <div className="mt-0.5 flex gap-1">
                    {t.tags.map((tag) => (
                      <span key={tag} className="rounded bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:bg-surface-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-surface-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-surface-400 mr-1">Filter:</span>
          {(['all', 'active', 'paused', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                filter === f
                  ? 'bg-brand-600 text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Workflow list */}
        <div className="space-y-3">
          {filtered.map((wf) => {
            const sc = statusConfig[wf.status as keyof typeof statusConfig];
            const StatusIcon = sc.icon;
            return (
              <Card key={wf.id} variant="bordered" className="group hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                      <Workflow className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-surface-900 dark:text-surface-100 text-sm">{wf.name}</h3>
                        <Badge size="sm" variant={sc.variant}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {sc.label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-surface-500 leading-relaxed">{wf.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-400">
                        <span className="flex items-center gap-1">
                          <Zap className="h-3 w-3 text-amber-500" /> Trigger: {wf.trigger}
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" /> {wf.steps} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" /> {wf.runs.toLocaleString()} runs
                        </span>
                        {wf.lastRun !== '—' && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Last run {wf.lastRun}
                          </span>
                        )}
                        {wf.successRate > 0 && (
                          <span className={cn('font-medium', wf.successRate >= 95 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400')}>
                            {wf.successRate}% success
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    {wf.status === 'active' ? (
                      <Button size="sm" variant="ghost" title="Pause">
                        <Pause className="h-4 w-4" />
                      </Button>
                    ) : wf.status === 'paused' ? (
                      <Button size="sm" variant="ghost" title="Resume">
                        <Play className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button size="sm" variant="ghost" title="Settings">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="Delete" className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}
