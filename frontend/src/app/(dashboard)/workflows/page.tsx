'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  GitBranch,
  Layers,
  Loader2,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Slack,
  Trash2,
  Webhook,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import * as workflowApi from '@/lib/api/workflows';
import { useWorkflowStore } from '@/stores/workflowStore';
import { cn } from '@/lib/utils';
import type { Workflow as WFType, WorkflowStep } from '@/types/workflows';

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const, icon: CheckCircle2 },
  paused: { label: 'Paused', variant: 'warning' as const, icon: Pause },
  draft:  { label: 'Draft',  variant: 'default' as const, icon: GitBranch },
};

const TEMPLATES: Array<{
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tags: string[];
  trigger_type: 'manual' | 'document_upload';
  steps: WorkflowStep[];
}> = [
  {
    name: 'Document → AI Summary',
    description: 'When a document is uploaded, AI summarizes it.',
    icon: Layers,
    color: 'bg-blue-500',
    tags: ['Knowledge', 'AI'],
    trigger_type: 'document_upload',
    steps: [
      { type: 'search_knowledge', label: 'Find document content', config: { query: '{filename}', limit: '8' } },
      { type: 'ai_summarize',     label: 'Summarize content',    config: { text: '{context}' } },
    ],
  },
  {
    name: 'AI Answer → Slack',
    description: 'Answer a question from knowledge base and post to Slack.',
    icon: Slack,
    color: 'bg-amber-500',
    tags: ['Slack', 'AI'],
    trigger_type: 'manual',
    steps: [
      { type: 'ai_qa',         label: 'Answer question', config: { question: 'Summarize the latest knowledge base content' } },
      { type: 'slack_webhook', label: 'Post to Slack',   config: { webhook_url: '', message: '{answer}' } },
    ],
  },
  {
    name: 'Search & Summarize',
    description: 'Search knowledge base for a topic and produce an AI summary.',
    icon: MessageSquare,
    color: 'bg-violet-500',
    tags: ['Knowledge', 'AI'],
    trigger_type: 'manual',
    steps: [
      { type: 'search_knowledge', label: 'Search knowledge base', config: { query: 'key findings', limit: '5' } },
      { type: 'ai_summarize',     label: 'Summarize results',    config: { text: '{context}' } },
    ],
  },
  {
    name: 'Webhook Notification',
    description: 'Generate an AI answer and send it to any HTTP endpoint.',
    icon: Webhook,
    color: 'bg-emerald-500',
    tags: ['Webhook', 'AI'],
    trigger_type: 'manual',
    steps: [
      { type: 'ai_qa',        label: 'Generate answer',  config: { question: 'Latest updates?' } },
      { type: 'http_webhook', label: 'Send to endpoint', config: { url: '', method: 'POST', body: '{"message": "{answer}"}' } },
    ],
  },
];

// ── Run Result Modal ─────────────────────────────────────────────────────────
function RunResultModal({ run, onClose }: { run: WFType['recentRuns'][0]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[80vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl dark:bg-surface-900">
        <div className="flex items-center justify-between border-b border-surface-100 px-5 py-4 dark:border-surface-800">
          <h3 className="font-semibold text-surface-900 dark:text-surface-100">
            Run Result — {run.status === 'success' ? '✅ Success' : '❌ Failed'}
          </h3>
          <button onClick={onClose}><X className="h-4 w-4 text-surface-400" /></button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5">
          {run.stepResults.map((sr, i) => (
            <div key={i} className={cn(
              'rounded-xl border p-4',
              sr.status === 'success'
                ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/30'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30',
            )}>
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-surface-500">Step {i + 1}</span>
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{sr.label}</span>
                <span className={cn('ml-auto text-xs font-semibold', sr.status === 'success' ? 'text-emerald-600' : 'text-red-500')}>
                  {sr.status}
                </span>
              </div>
              {sr.error && <p className="text-xs text-red-600 dark:text-red-400">{sr.error}</p>}
              {sr.output && <p className="whitespace-pre-wrap text-xs text-surface-600 dark:text-surface-400">{sr.output}</p>}
              {sr.outputs && Object.entries(sr.outputs)
                .filter(([k]) => ['summary', 'answer'].includes(k))
                .map(([k, v]) => (
                  <div key={k} className="mt-2">
                    <p className="text-[10px] font-semibold uppercase text-surface-400">{k}</p>
                    <p className="mt-0.5 whitespace-pre-wrap text-xs text-surface-700 dark:text-surface-300">{String(v)}</p>
                  </div>
                ))}
            </div>
          ))}
          {run.error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/30">
              <p className="text-xs font-semibold text-red-600">Error</p>
              <p className="mt-1 text-xs text-red-500">{run.error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Create Workflow Modal ────────────────────────────────────────────────────
function CreateWorkflowModal({ onClose, onCreated }: { onClose: () => void; onCreated: (wf: WFType) => void }) {
  const [step, setStep] = useState<'template' | 'configure'>('template');
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [slackUrl, setSlackUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSelect = (tpl: typeof TEMPLATES[0]) => {
    setSelected(tpl);
    setName(tpl.name);
    setDescription(tpl.description);
    setStep('configure');
  };

  const handleCreate = async () => {
    if (!selected || !name.trim()) return;
    setSaving(true);
    try {
      const steps = selected.steps.map((s) =>
        s.type === 'slack_webhook' && slackUrl
          ? { ...s, config: { ...s.config, webhook_url: slackUrl } }
          : s
      );
      const wf = await workflowApi.createWorkflow({
        name: name.trim(),
        description: description.trim() || undefined,
        trigger_type: selected.trigger_type,
        steps,
        status: 'active',
      });
      onCreated(wf);
      toast.success(`Workflow "${wf.name}" created!`);
      onClose();
    } catch {
      toast.error('Failed to create workflow');
    } finally {
      setSaving(false);
    }
  };

  const needsSlack = selected?.steps.some((s) => s.type === 'slack_webhook');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl dark:bg-surface-900">
        <div className="flex items-center justify-between border-b border-surface-100 px-6 py-4 dark:border-surface-800">
          <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">
            {step === 'template' ? 'Choose a template' : 'Configure workflow'}
          </h2>
          <button onClick={onClose}><X className="h-4 w-4 text-surface-400" /></button>
        </div>

        {step === 'template' ? (
          <div className="grid grid-cols-2 gap-3 p-6">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.name}
                onClick={() => handleSelect(tpl)}
                className="flex flex-col gap-2 rounded-xl border border-surface-200 bg-surface-50 p-4 text-left transition-all hover:border-brand-400 hover:shadow-sm dark:border-surface-700 dark:bg-surface-800"
              >
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-white', tpl.color)}>
                  <tpl.icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{tpl.name}</p>
                <p className="text-xs leading-relaxed text-surface-400">{tpl.description}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {tpl.tags.map((t) => (
                    <span key={t} className="rounded bg-surface-200 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:bg-surface-700">{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4 p-6">
            <div className="rounded-xl bg-surface-50 p-3 dark:bg-surface-800">
              <p className="mb-2 text-xs font-semibold text-surface-500">Steps ({selected!.steps.length})</p>
              <div className="space-y-1">
                {selected!.steps.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-surface-600 dark:text-surface-400">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600 dark:bg-brand-900 dark:text-brand-400">{i + 1}</span>
                    {s.label}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">Description <span className="text-surface-400">(optional)</span></label>
              <input value={description} onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100" />
            </div>
            {needsSlack && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">Slack Webhook URL <span className="text-surface-400">(optional)</span></label>
                <input value={slackUrl} onChange={(e) => setSlackUrl(e.target.value)}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full rounded-xl border border-surface-200 bg-surface-50 px-3 py-2 text-sm outline-none focus:border-brand-500 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100" />
                <p className="mt-1 text-xs text-surface-400">Skip to test without Slack posting.</p>
              </div>
            )}
          </div>
        )}

        {step === 'configure' && (
          <div className="flex justify-between border-t border-surface-100 px-6 py-4 dark:border-surface-800">
            <Button variant="ghost" onClick={() => setStep('template')}>Back</Button>
            <Button onClick={handleCreate} disabled={saving || !name.trim()}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : 'Create Workflow'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function WorkflowsPage() {
  const { workflows, setWorkflows, addWorkflow, updateWorkflow, removeWorkflow } = useWorkflowStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [showCreate, setShowCreate] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [runResult, setRunResult] = useState<WFType['recentRuns'][0] | null>(null);

  const { isLoading } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      const data = await workflowApi.listWorkflows();
      setWorkflows(data);
      return data;
    },
    staleTime: 30_000,
  });

  const filtered = filter === 'all' ? workflows : workflows.filter((w) => w.status === filter);
  const activeCount = workflows.filter((w) => w.status === 'active').length;
  const totalRuns = workflows.reduce((s, w) => s + w.runCount, 0);

  const handlePause = async (wf: WFType) => {
    try {
      const updated = await workflowApi.pauseWorkflow(wf.id);
      updateWorkflow(wf.id, { status: updated.status });
      toast.success('Workflow paused');
    } catch { toast.error('Failed to pause'); }
  };

  const handleResume = async (wf: WFType) => {
    try {
      const updated = await workflowApi.resumeWorkflow(wf.id);
      updateWorkflow(wf.id, { status: updated.status });
      toast.success('Workflow resumed');
    } catch { toast.error('Failed to resume'); }
  };

  const handleDelete = async (wf: WFType) => {
    if (!confirm(`Delete workflow "${wf.name}"?`)) return;
    try {
      await workflowApi.deleteWorkflow(wf.id);
      removeWorkflow(wf.id);
      toast.success('Workflow deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleRun = async (wf: WFType) => {
    setRunningId(wf.id);
    const tid = toast.loading(`Running "${wf.name}"...`);
    try {
      const run = await workflowApi.runWorkflow(wf.id);
      updateWorkflow(wf.id, { runCount: wf.runCount + 1, lastRunAt: run.startedAt });
      toast.success(run.status === 'success' ? 'Workflow completed!' : 'Workflow finished with errors — see results', { id: tid });
      setRunResult(run);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Run failed';
      toast.error(msg, { id: tid });
    } finally {
      setRunningId(null);
    }
  };

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
          <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>
            New Workflow
          </Button>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Total Workflows', value: String(workflows.length), sub: `${activeCount} active`,  color: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950' },
            { label: 'Total Runs',      value: totalRuns.toLocaleString(), sub: 'all time',              color: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950' },
            { label: 'Step Types',      value: '5',                        sub: 'AI, Search, Webhooks', color: 'text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-950' },
            { label: 'Triggers',        value: '2',                        sub: 'Manual, Doc Upload',   color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950' },
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
            {TEMPLATES.map((t) => (
              <button key={t.name} onClick={() => setShowCreate(true)}
                className="flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3 text-left transition-all hover:border-brand-300 hover:shadow-sm dark:border-surface-700 dark:bg-surface-900"
              >
                <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white', t.color)}>
                  <t.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-surface-900 dark:text-surface-100">{t.name}</p>
                  <div className="mt-0.5 flex gap-1">
                    {t.tags.map((tag) => (
                      <span key={tag} className="rounded bg-surface-100 px-1.5 py-0.5 text-[10px] font-medium text-surface-500 dark:bg-surface-800">{tag}</span>
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
          <span className="mr-1 text-sm text-surface-400">Filter:</span>
          {(['all', 'active', 'paused', 'draft'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn('rounded-full px-3 py-1 text-xs font-medium capitalize transition-colors',
                filter === f ? 'bg-brand-600 text-white' : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-400'
              )}>
              {f}
            </button>
          ))}
        </div>

        {/* Workflow list */}
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-surface-200 py-16 text-center dark:border-surface-700">
            <Workflow className="h-10 w-10 text-surface-300" />
            <p className="text-sm font-medium text-surface-500">No workflows yet</p>
            <p className="text-xs text-surface-400">Click <strong>New Workflow</strong> to create your first automation.</p>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowCreate(true)}>Create Workflow</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((wf) => {
              const sc = statusConfig[wf.status] ?? statusConfig.draft;
              const StatusIcon = sc.icon;
              const isRunning = runningId === wf.id;
              return (
                <Card key={wf.id} variant="bordered" className="group transition-shadow hover:shadow-card-hover">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
                        <Workflow className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">{wf.name}</h3>
                          <Badge size="sm" variant={sc.variant}>
                            <StatusIcon className="mr-1 h-3 w-3" />{sc.label}
                          </Badge>
                        </div>
                        {wf.description && <p className="mt-0.5 text-xs leading-relaxed text-surface-500">{wf.description}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-surface-400">
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-amber-500" />
                            {wf.triggerType === 'document_upload' ? 'Document Upload' : 'Manual'}
                          </span>
                          <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" />{wf.steps.length} steps</span>
                          <span className="flex items-center gap-1"><Activity className="h-3 w-3" />{wf.runCount.toLocaleString()} runs</span>
                          {wf.lastRunAt && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />Last run {formatDistanceToNow(new Date(wf.lastRunAt), { addSuffix: true })}
                            </span>
                          )}
                          {wf.recentRuns.length > 0 && (
                            <button onClick={() => setRunResult(wf.recentRuns[0]!)}
                              className="flex items-center gap-1 text-brand-500 hover:underline">
                              <AlertCircle className="h-3 w-3" />View last result
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      {wf.status !== 'paused' && (
                        <Button size="sm" variant="ghost" title="Run now" disabled={isRunning} onClick={() => handleRun(wf)}>
                          {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 text-emerald-500" />}
                        </Button>
                      )}
                      {wf.status === 'active' && (
                        <Button size="sm" variant="ghost" title="Pause" onClick={() => handlePause(wf)}><Pause className="h-4 w-4" /></Button>
                      )}
                      {wf.status === 'paused' && (
                        <Button size="sm" variant="ghost" title="Resume" onClick={() => handleResume(wf)}><Play className="h-4 w-4" /></Button>
                      )}
                      <Button size="sm" variant="ghost" title="Delete" className="text-red-400 hover:text-red-600" onClick={() => handleDelete(wf)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && <CreateWorkflowModal onClose={() => setShowCreate(false)} onCreated={(wf) => addWorkflow(wf)} />}
      {runResult && <RunResultModal run={runResult} onClose={() => setRunResult(null)} />}
    </div>
  );
}
