'use client';

import { useEffect, useState } from 'react';

import {
  Activity,
  BarChart3,
  Bot,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Mic,
  Shield,
  TrendingUp,
  Users,
  Video,
  Workflow,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

interface HomeStats {
  queriesToday: number;
  queriesChange: number;
  totalDocuments: number;
  activeConnectors: number;
  totalConversations: number;
  chartData: { date: string; queries: number }[];
  recentActivity: { type: string; action: string; time: string }[];
}

async function fetchHomeStats(): Promise<HomeStats | null> {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${API_BASE}/analytics/home-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

const capabilities = [
  { icon: MessageSquare, title: 'AI Chat', description: 'Multi-turn RAG conversations over your entire knowledge base with real-time streaming and source citations.', href: '/chat', color: 'bg-indigo-500', badge: 'Core' },
  { icon: Mic, title: 'Voice Assistant', description: 'Speak naturally and get instant spoken answers. Push-to-talk or wake word activation with 20+ languages.', href: '/voice', color: 'bg-violet-500', badge: 'Core' },
  { icon: Video, title: 'Meeting Intelligence', description: 'Auto-join meetings, transcribe in real-time, extract action items, and search past meetings by spoken content.', href: '/video', color: 'bg-cyan-500', badge: 'Core' },
  { icon: BookOpen, title: 'Knowledge Base', description: 'Ingest PDFs, Slack, GitHub, Notion, Confluence and 20+ more. Semantic chunking, deduplication, and OCR.', href: '/knowledge', color: 'bg-emerald-500', badge: 'Core' },
  { icon: Bot, title: 'AI Agents', description: 'Autonomous agents for research, writing, data analysis, compliance checking, code reviews, and onboarding.', href: '/agents', color: 'bg-amber-500', badge: 'Pro' },
  { icon: Workflow, title: 'Workflow Automation', description: 'Visual drag-and-drop builder with event triggers, conditionals, parallel execution, and human-in-the-loop steps.', href: '/workflows', color: 'bg-rose-500', badge: 'Pro' },
  { icon: Globe, title: 'Enterprise Search', description: 'Hybrid semantic + BM25 full-text search with reranking, faceted filters, and personalized results.', href: '/search', color: 'bg-teal-500', badge: 'Core' },
  { icon: BarChart3, title: 'Analytics & Insights', description: 'Usage analytics, AI performance scores, knowledge gap analysis, and ROI calculation dashboards.', href: '/analytics', color: 'bg-blue-500', badge: 'Pro' },
];

function StatCard({ icon: Icon, label, value, change, changeLabel, color }: {
  icon: React.ElementType; label: string; value: string;
  change: number; changeLabel: string; color: string;
}) {
  const positive = change >= 0;
  return (
    <Card variant="bordered" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">{label}</span>
        <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl text-white', color)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
        <p className={cn('mt-1 flex items-center gap-1 text-xs font-medium', positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500')}>
          <TrendingUp className={cn('h-3 w-3', !positive && 'rotate-180')} />
          {Math.abs(change)}% {changeLabel}
        </p>
      </div>
    </Card>
  );
}

export default function HomePage() {
  const [stats, setStats] = useState<HomeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeStats().then((s) => {
      setStats(s);
      setLoading(false);
    });
  }, []);

  const chartData = stats?.chartData ?? [];
  const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">

      {/* Hero bar */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Welcome back 👋</h1>
            <p className="mt-0.5 text-sm text-surface-500">Here&apos;s what&apos;s happening across KnowledgeForge today — {today}</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All systems operational</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={MessageSquare} label="Queries Today"
            value={loading ? '…' : stats?.queriesToday.toLocaleString() ?? '0'}
            change={stats?.queriesChange ?? 0} changeLabel="vs yesterday" color="bg-indigo-500"
          />
          <StatCard
            icon={Users} label="Conversations"
            value={loading ? '…' : stats?.totalConversations.toLocaleString() ?? '0'}
            change={0} changeLabel="total" color="bg-violet-500"
          />
          <StatCard
            icon={BookOpen} label="Documents Indexed"
            value={loading ? '…' : stats?.totalDocuments.toLocaleString() ?? '0'}
            change={0} changeLabel="total" color="bg-emerald-500"
          />
          <StatCard
            icon={Zap} label="Active Connectors"
            value={loading ? '…' : stats?.activeConnectors.toLocaleString() ?? '0'}
            change={0} changeLabel="connected" color="bg-amber-500"
          />
        </div>

        {/* Chart + Activity */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Queries chart — real data */}
          <Card variant="bordered" className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="font-semibold text-surface-900 dark:text-surface-100">Query Activity</h2>
              <p className="text-xs text-surface-400">Your queries over the last 7 days</p>
            </div>
            {loading ? (
              <div className="flex h-[200px] items-center justify-center text-sm text-surface-400">Loading…</div>
            ) : chartData.length === 0 || chartData.every(d => d.queries === 0) ? (
              <div className="flex h-[200px] flex-col items-center justify-center gap-2 text-center">
                <MessageSquare className="h-8 w-8 text-surface-300" />
                <p className="text-sm text-surface-400">No queries yet. Start a chat to see activity here.</p>
                <Link href="/chat" className="text-xs font-medium text-brand-600 hover:underline">Go to Chat →</Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }} />
                  <Area type="monotone" dataKey="queries" stroke="#4f46e5" strokeWidth={2} fill="url(#grad1)" name="Queries" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>

          {/* Recent Activity — real data */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-surface-900 dark:text-surface-100">Recent Activity</h2>
              <Link href="/knowledge" className="flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-400">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800" />)}
              </div>
            ) : !stats?.recentActivity?.length ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <Activity className="h-8 w-8 text-surface-300" />
                <p className="text-sm text-surface-400">No activity yet. Upload documents or start a chat.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800',
                      item.type === 'chat' ? 'text-indigo-500' : 'text-blue-500')}>
                      {item.type === 'chat' ? <MessageSquare className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-surface-700 dark:text-surface-300">{item.action}</p>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-surface-400">
                        <Clock className="h-3 w-3" />
                        {timeAgo(item.time)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Knowledge Base Stats — real */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-surface-900 dark:text-surface-100">Knowledge Base</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Documents', value: loading ? '…' : (stats?.totalDocuments ?? 0).toLocaleString(), icon: FileText, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
              { label: 'Active Connectors', value: loading ? '…' : (stats?.activeConnectors ?? 0).toString(), icon: Database, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
              { label: 'Total Queries', value: loading ? '…' : (stats?.queriesToday ?? 0).toString(), icon: Brain, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
              { label: 'Conversations', value: loading ? '…' : (stats?.totalConversations ?? 0).toString(), icon: MessageSquare, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
            ].map((s) => (
              <Card key={s.label} variant="bordered" className="flex items-center gap-3">
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', s.color)}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-surface-900 dark:text-surface-100">{s.value}</p>
                  <p className="text-xs text-surface-400">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Core Capabilities */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-surface-900 dark:text-surface-100">Core Capabilities</h2>
            <div className="flex items-center gap-1 text-xs text-surface-400">
              <Shield className="h-3.5 w-3.5" />
              SOC 2 · GDPR · HIPAA compliant
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((cap) => (
              <Link key={cap.href} href={cap.href}>
                <Card variant="bordered" className="group flex h-full flex-col gap-3 cursor-pointer transition-all hover:shadow-card-hover hover:border-brand-200 dark:hover:border-brand-800">
                  <div className="flex items-center justify-between">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', cap.color)}>
                      <cap.icon className="h-5 w-5" />
                    </div>
                    <Badge size="sm" variant={cap.badge === 'Core' ? 'primary' : 'warning'}>{cap.badge}</Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400 transition-colors">{cap.title}</h3>
                    <p className="mt-1 text-xs text-surface-500 leading-relaxed">{cap.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ChevronRight className="h-3 w-3" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
