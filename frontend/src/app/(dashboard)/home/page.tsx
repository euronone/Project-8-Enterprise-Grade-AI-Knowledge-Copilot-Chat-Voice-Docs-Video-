'use client';

import { useState } from 'react';

import {
  Activity,
  AlertTriangle,
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
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// ── Mock data ──────────────────────────────────────────────────────────────────

const queryData = [
  { date: 'Mar 13', queries: 1240, users: 89 },
  { date: 'Mar 14', queries: 1580, users: 112 },
  { date: 'Mar 15', queries: 980, users: 74 },
  { date: 'Mar 16', queries: 2100, users: 156 },
  { date: 'Mar 17', queries: 1760, users: 134 },
  { date: 'Mar 18', queries: 2340, users: 178 },
  { date: 'Mar 19', queries: 2890, users: 203 },
];

const knowledgePieData = [
  { name: 'Documents', value: 42, color: '#4f46e5' },
  { name: 'Slack / Teams', value: 23, color: '#7c3aed' },
  { name: 'Confluence', value: 18, color: '#06b6d4' },
  { name: 'Code Repos', value: 10, color: '#10b981' },
  { name: 'Other', value: 7, color: '#f59e0b' },
];

const recentActivity = [
  { user: 'Sarah K.', action: 'Uploaded Q1 2026 Financial Report.pdf', time: '2 min ago', icon: FileText, color: 'text-blue-500' },
  { user: 'Alex M.', action: 'Started a meeting — Product Roadmap Sync', time: '14 min ago', icon: Video, color: 'text-violet-500' },
  { user: 'Jordan P.', action: 'Asked 12 questions via AI chat', time: '31 min ago', icon: MessageSquare, color: 'text-indigo-500' },
  { user: 'System', action: 'Synced 1,240 records from Salesforce connector', time: '1 hr ago', icon: Database, color: 'text-emerald-500' },
  { user: 'Priya R.', action: 'Ran Compliance Agent on GDPR Policy v3', time: '2 hr ago', icon: Bot, color: 'text-amber-500' },
  { user: 'System', action: 'Knowledge gap detected — 3 stale documents', time: '3 hr ago', icon: AlertTriangle, color: 'text-orange-500' },
];

const systemServices = [
  { name: 'AI Chat API', status: 'healthy', latency: '312 ms', uptime: '99.98%' },
  { name: 'Voice STT', status: 'healthy', latency: '188 ms', uptime: '99.95%' },
  { name: 'Vector Search', status: 'healthy', latency: '78 ms', uptime: '100%' },
  { name: 'Document Ingestion', status: 'degraded', latency: '2.4 s', uptime: '98.2%' },
  { name: 'Meeting Bot', status: 'healthy', latency: '—', uptime: '99.9%' },
  { name: 'Kafka Queue', status: 'healthy', latency: '12 ms', uptime: '100%' },
];

const capabilities = [
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Multi-turn RAG conversations over your entire knowledge base with real-time streaming and source citations.',
    href: '/chat',
    color: 'bg-indigo-500',
    badge: 'Core',
  },
  {
    icon: Mic,
    title: 'Voice Assistant',
    description: 'Speak naturally and get instant spoken answers. Push-to-talk or wake word activation with 20+ languages.',
    href: '/voice',
    color: 'bg-violet-500',
    badge: 'Core',
  },
  {
    icon: Video,
    title: 'Meeting Intelligence',
    description: 'Auto-join meetings, transcribe in real-time, extract action items, and search past meetings by spoken content.',
    href: '/video',
    color: 'bg-cyan-500',
    badge: 'Core',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Base',
    description: 'Ingest PDFs, Slack, GitHub, Notion, Confluence and 20+ more. Semantic chunking, deduplication, and OCR.',
    href: '/knowledge',
    color: 'bg-emerald-500',
    badge: 'Core',
  },
  {
    icon: Bot,
    title: 'AI Agents',
    description: 'Autonomous agents for research, writing, data analysis, compliance checking, code reviews, and onboarding.',
    href: '/agents',
    color: 'bg-amber-500',
    badge: 'Pro',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description: 'Visual drag-and-drop builder with event triggers, conditionals, parallel execution, and human-in-the-loop steps.',
    href: '/workflows',
    color: 'bg-rose-500',
    badge: 'Pro',
  },
  {
    icon: Globe,
    title: 'Enterprise Search',
    description: 'Hybrid semantic + BM25 full-text search with reranking, faceted filters, and personalized results.',
    href: '/search',
    color: 'bg-teal-500',
    badge: 'Core',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Usage analytics, AI performance scores, knowledge gap analysis, and ROI calculation dashboards.',
    href: '/analytics',
    color: 'bg-blue-500',
    badge: 'Pro',
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  change,
  changeLabel,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  color: string;
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

function ServiceStatusDot({ status }: { status: string }) {
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === 'healthy' && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
      )}
      <span
        className={cn(
          'relative inline-flex h-2.5 w-2.5 rounded-full',
          status === 'healthy' ? 'bg-emerald-500' :
          status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
        )}
      />
    </span>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [activeChart, setActiveChart] = useState<'queries' | 'users'>('queries');

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">

      {/* ── Top hero bar ─────────────────────────────────── */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Welcome back 👋
            </h1>
            <p className="mt-0.5 text-sm text-surface-500">
              Here&apos;s what&apos;s happening across KnowledgeForge today — March 19, 2026
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All systems operational</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">

        {/* ── KPI Stat Cards ───────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon={MessageSquare} label="Total Queries Today" value="2,890" change={23} changeLabel="vs yesterday" color="bg-indigo-500" />
          <StatCard icon={Users} label="Active Users" value="203" change={14} changeLabel="vs yesterday" color="bg-violet-500" />
          <StatCard icon={BookOpen} label="Documents Indexed" value="48,312" change={3.2} changeLabel="this week" color="bg-emerald-500" />
          <StatCard icon={Zap} label="Avg Response Time" value="312 ms" change={-8} changeLabel="vs last week" color="bg-amber-500" />
        </div>

        {/* ── Charts row ───────────────────────────────────── */}
        <div className="grid gap-4 lg:grid-cols-3">

          {/* Query / Users chart */}
          <Card variant="bordered" className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-surface-900 dark:text-surface-100">Activity Overview</h2>
                <p className="text-xs text-surface-400">Last 7 days</p>
              </div>
              <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden text-xs font-medium">
                <button
                  onClick={() => setActiveChart('queries')}
                  className={cn(
                    'px-3 py-1.5 transition-colors',
                    activeChart === 'queries'
                      ? 'bg-brand-600 text-white'
                      : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  Queries
                </button>
                <button
                  onClick={() => setActiveChart('users')}
                  className={cn(
                    'px-3 py-1.5 transition-colors',
                    activeChart === 'users'
                      ? 'bg-brand-600 text-white'
                      : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  Users
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={queryData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="grad1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  labelStyle={{ color: '#334155', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey={activeChart}
                  stroke="#4f46e5"
                  strokeWidth={2}
                  fill="url(#grad1)"
                  name={activeChart === 'queries' ? 'Queries' : 'Active Users'}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Knowledge breakdown pie */}
          <Card variant="bordered">
            <h2 className="mb-4 font-semibold text-surface-900 dark:text-surface-100">Knowledge Sources</h2>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={knowledgePieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {knowledgePieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {knowledgePieData.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-surface-600 dark:text-surface-400">{d.name}</span>
                  </div>
                  <span className="font-medium text-surface-700 dark:text-surface-300">{d.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── System Health + Recent Activity ──────────────── */}
        <div className="grid gap-4 lg:grid-cols-2">

          {/* System health */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-surface-900 dark:text-surface-100">System Health</h2>
              <Badge variant="success" size="sm">
                <Activity className="mr-1 h-3 w-3" />
                Operational
              </Badge>
            </div>
            <div className="space-y-3">
              {systemServices.map((svc) => (
                <div key={svc.name} className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2 dark:bg-surface-800/50">
                  <div className="flex items-center gap-2.5">
                    <ServiceStatusDot status={svc.status} />
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">{svc.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-surface-400">
                    <span className="hidden sm:inline">{svc.latency}</span>
                    <span className={cn('font-medium', svc.status === 'healthy' ? 'text-emerald-600' : 'text-amber-600')}>
                      {svc.uptime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent activity */}
          <Card variant="bordered">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-surface-900 dark:text-surface-100">Recent Activity</h2>
              <Link href="/analytics" className="flex items-center gap-1 text-xs text-brand-600 hover:underline dark:text-brand-400">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-100 dark:bg-surface-800', item.color)}>
                    <item.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-surface-700 dark:text-surface-300">
                      <span className="font-medium text-surface-900 dark:text-surface-100">{item.user}</span>{' '}
                      {item.action}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-surface-400">
                      <Clock className="h-3 w-3" />
                      {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Knowledge Base Stats ──────────────────────────── */}
        <div>
          <h2 className="mb-3 text-base font-semibold text-surface-900 dark:text-surface-100">Knowledge Base</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Documents', value: '48,312', icon: FileText, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
              { label: 'Active Connectors', value: '9 / 20', icon: Database, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
              { label: 'Storage Used', value: '18.4 GB', icon: Brain, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
              { label: 'Pending Sync', value: '3 sources', icon: Clock, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
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

        {/* ── Core Capabilities ─────────────────────────────── */}
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
                <Card
                  variant="bordered"
                  className="group flex h-full flex-col gap-3 cursor-pointer transition-all hover:shadow-card-hover hover:border-brand-200 dark:hover:border-brand-800"
                >
                  <div className="flex items-center justify-between">
                    <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', cap.color)}>
                      <cap.icon className="h-5 w-5" />
                    </div>
                    <Badge size="sm" variant={cap.badge === 'Core' ? 'primary' : 'warning'}>
                      {cap.badge}
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900 group-hover:text-brand-600 dark:text-surface-100 dark:group-hover:text-brand-400 transition-colors">
                      {cap.title}
                    </h3>
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
