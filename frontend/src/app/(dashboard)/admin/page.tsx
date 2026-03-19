'use client';

import { useState } from 'react';

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Database,
  Globe,
  Key,
  Lock,
  MoreHorizontal,
  Plus,
  Search,
  Server,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

// ── Mock data ─────────────────────────────────────────────────────────────────

const users = [
  { id: '1', name: 'Sarah Kim', email: 'sarah@acme.com', role: 'Admin', team: 'Product', status: 'active', lastSeen: '2 min ago', avatar: '' },
  { id: '2', name: 'Alex Morgan', email: 'alex@acme.com', role: 'Member', team: 'Engineering', status: 'active', lastSeen: '15 min ago', avatar: '' },
  { id: '3', name: 'Jordan Park', email: 'jordan@acme.com', role: 'Member', team: 'Design', status: 'active', lastSeen: '1 hr ago', avatar: '' },
  { id: '4', name: 'Priya Rajan', email: 'priya@acme.com', role: 'Team Admin', team: 'Legal', status: 'active', lastSeen: '3 hr ago', avatar: '' },
  { id: '5', name: 'Tom Wilson', email: 'tom@acme.com', role: 'Viewer', team: 'Sales', status: 'inactive', lastSeen: '5 days ago', avatar: '' },
  { id: '6', name: 'Nina Patel', email: 'nina@acme.com', role: 'Guest', team: '—', status: 'pending', lastSeen: 'Invited', avatar: '' },
];

const auditLogs = [
  { actor: 'Sarah Kim', action: 'Updated RBAC policy for Engineering team', resource: 'Policy', time: '10 min ago', severity: 'info' },
  { actor: 'System', action: 'Auto-rotated API key: svc-knowledge-ingest', resource: 'API Key', time: '2 hr ago', severity: 'info' },
  { actor: 'Alex Morgan', action: 'Deleted 3 documents from HR collection', resource: 'Knowledge', time: '4 hr ago', severity: 'warning' },
  { actor: 'Priya Rajan', action: 'Exported 480 records for legal hold', resource: 'Export', time: '1 day ago', severity: 'warning' },
  { actor: 'System', action: 'Failed login attempt from 185.234.x.x (5x)', resource: 'Auth', time: '2 days ago', severity: 'danger' },
];

const billing = {
  plan: 'Professional',
  seats: { used: 48, total: 100 },
  storage: { used: 18.4, total: 100 },
  nextBilling: 'Apr 1, 2026',
  amount: '$960 / mo',
};

const roleColors: Record<string, 'primary' | 'success' | 'warning' | 'danger' | 'default' | 'info' | 'outline'> = {
  'Super Admin': 'danger',
  Admin: 'primary',
  'Team Admin': 'info',
  Member: 'success',
  Viewer: 'default',
  Guest: 'outline',
};

const severityConfig = {
  info: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950', icon: CheckCircle2 },
  warning: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950', icon: AlertTriangle },
  danger: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950', icon: Shield },
};

const adminTabs = ['Users', 'Security', 'Billing', 'System'] as const;
type AdminTab = typeof adminTabs[number];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('Users');
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">

      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Admin Console</h1>
              <p className="text-xs text-surface-500">Organisation: Acme Corp · Super Admin access</p>
            </div>
          </div>
          <Badge variant="danger" size="sm">
            <Lock className="mr-1 h-3 w-3" />
            Restricted Area
          </Badge>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 overflow-x-auto">
          {adminTabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                tab === t
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                  : 'text-surface-500 hover:bg-surface-50 hover:text-surface-700 dark:hover:bg-surface-800'
              )}
            >
              {t === 'Users' && <Users className="h-4 w-4" />}
              {t === 'Security' && <Shield className="h-4 w-4" />}
              {t === 'Billing' && <CreditCard className="h-4 w-4" />}
              {t === 'System' && <Server className="h-4 w-4" />}
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">

        {/* ── USERS TAB ── */}
        {tab === 'Users' && (
          <>
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: 'Total Users', value: `${users.length}`, icon: Users, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
                { label: 'Active Now', value: '3', icon: Activity, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
                { label: 'Pending Invites', value: '1', icon: UserPlus, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
                { label: 'Seats Available', value: `${billing.seats.total - billing.seats.used}`, icon: UserCheck, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
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

            {/* User table */}
            <Card variant="bordered">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full rounded-lg border border-surface-200 bg-surface-50 pl-8 pr-3 py-1.5 text-sm placeholder:text-surface-400 focus:border-brand-500 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
                  />
                </div>
                <Button size="sm" leftIcon={<UserPlus className="h-4 w-4" />}>
                  Invite User
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 dark:border-surface-800">
                      {['User', 'Role', 'Team', 'Status', 'Last Seen', ''].map((h) => (
                        <th key={h} className="py-2 text-left text-xs font-semibold uppercase tracking-wider text-surface-400 pr-4">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-50 dark:divide-surface-800/50">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={u.name} size="sm" status={u.status === 'active' ? 'online' : 'offline'} />
                            <div>
                              <p className="font-medium text-surface-900 dark:text-surface-100">{u.name}</p>
                              <p className="text-xs text-surface-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge size="sm" variant={roleColors[u.role] ?? 'default'}>{u.role}</Badge>
                        </td>
                        <td className="py-3 pr-4 text-surface-500">{u.team}</td>
                        <td className="py-3 pr-4">
                          <Badge
                            size="sm"
                            variant={u.status === 'active' ? 'success' : u.status === 'pending' ? 'warning' : 'default'}
                          >
                            {u.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 text-surface-400 text-xs">{u.lastSeen}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="ghost" title="Edit"><Settings className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" title="Remove" className="text-red-400 hover:text-red-600">
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}

        {/* ── SECURITY TAB ── */}
        {tab === 'Security' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Auth settings */}
              <Card variant="bordered">
                <h2 className="mb-4 font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <Lock className="h-4 w-4 text-brand-600" /> Authentication
                </h2>
                {[
                  { label: 'Multi-Factor Authentication', value: 'Required for all users', on: true },
                  { label: 'SAML 2.0 SSO', value: 'Okta — Connected', on: true },
                  { label: 'Session timeout', value: '8 hours', on: true },
                  { label: 'IP Allowlist', value: '3 ranges configured', on: true },
                  { label: 'Device Trust', value: 'Disabled', on: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-surface-50 dark:border-surface-800 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.label}</p>
                      <p className="text-xs text-surface-400">{item.value}</p>
                    </div>
                    <div className={cn('h-2 w-2 rounded-full', item.on ? 'bg-emerald-500' : 'bg-surface-300')} />
                  </div>
                ))}
                <Button variant="outline" size="sm" className="mt-3 w-full" rightIcon={<ChevronRight className="h-4 w-4" />}>
                  Configure Auth
                </Button>
              </Card>

              {/* API Keys */}
              <Card variant="bordered">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                    <Key className="h-4 w-4 text-brand-600" /> API Keys
                  </h2>
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>New Key</Button>
                </div>
                {[
                  { name: 'svc-knowledge-ingest', scope: 'knowledge:write', created: 'Jan 12, 2026', lastUsed: '5 min ago' },
                  { name: 'svc-analytics-export', scope: 'analytics:read', created: 'Feb 1, 2026', lastUsed: '1 hr ago' },
                  { name: 'webhook-n8n', scope: 'workflows:trigger', created: 'Mar 5, 2026', lastUsed: '2 hr ago' },
                ].map((key) => (
                  <div key={key.name} className="flex items-start justify-between py-2.5 border-b border-surface-50 dark:border-surface-800 last:border-0">
                    <div>
                      <p className="text-sm font-mono font-medium text-surface-800 dark:text-surface-200">{key.name}</p>
                      <p className="text-xs text-surface-400">{key.scope} · Last used {key.lastUsed}</p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </Card>
            </div>

            {/* Audit log */}
            <Card variant="bordered">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-600" /> Audit Log
                </h2>
                <Button size="sm" variant="outline">Export</Button>
              </div>
              <div className="space-y-2">
                {auditLogs.map((log, i) => {
                  const sc = severityConfig[log.severity as keyof typeof severityConfig];
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                      <div className={cn('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full', sc.bg, sc.color)}>
                        <sc.icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-surface-700 dark:text-surface-300">
                          <span className="font-medium text-surface-900 dark:text-surface-100">{log.actor}</span>{' '}
                          {log.action}
                        </p>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-surface-400">
                          <Badge size="sm" variant="outline">{log.resource}</Badge>
                          {log.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── BILLING TAB ── */}
        {tab === 'Billing' && (
          <div className="space-y-4">
            <Card variant="bordered" className="bg-gradient-to-br from-indigo-600 to-violet-600 border-0 text-white">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100">Current Plan</p>
                  <h2 className="text-2xl font-bold">{billing.plan}</h2>
                  <p className="mt-1 text-sm text-indigo-200">{billing.amount} · Renews {billing.nextBilling}</p>
                </div>
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 self-start sm:self-auto" size="sm">
                  Upgrade to Enterprise
                </Button>
              </div>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Seat usage */}
              <Card variant="bordered">
                <h3 className="mb-3 font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <Users className="h-4 w-4 text-brand-600" /> Seat Usage
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-surface-900 dark:text-surface-100">{billing.seats.used}</span>
                  <span className="text-sm text-surface-400">/ {billing.seats.total} seats</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800">
                  <div className="h-2 rounded-full bg-brand-600 transition-all" style={{ width: `${(billing.seats.used / billing.seats.total) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-surface-400">{billing.seats.total - billing.seats.used} seats remaining</p>
              </Card>

              {/* Storage usage */}
              <Card variant="bordered">
                <h3 className="mb-3 font-semibold text-surface-900 dark:text-surface-100 flex items-center gap-2">
                  <Database className="h-4 w-4 text-brand-600" /> Storage
                </h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold text-surface-900 dark:text-surface-100">{billing.storage.used} GB</span>
                  <span className="text-sm text-surface-400">/ {billing.storage.total} GB</span>
                </div>
                <div className="h-2 rounded-full bg-surface-100 dark:bg-surface-800">
                  <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${(billing.storage.used / billing.storage.total) * 100}%` }} />
                </div>
                <p className="mt-2 text-xs text-surface-400">{billing.storage.total - billing.storage.used} GB remaining</p>
              </Card>
            </div>

            {/* Invoice history */}
            <Card variant="bordered">
              <h3 className="mb-4 font-semibold text-surface-900 dark:text-surface-100">Invoice History</h3>
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {[
                  { date: 'Mar 1, 2026', amount: '$960.00', status: 'paid' },
                  { date: 'Feb 1, 2026', amount: '$960.00', status: 'paid' },
                  { date: 'Jan 1, 2026', amount: '$800.00', status: 'paid' },
                ].map((inv) => (
                  <div key={inv.date} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-surface-400" />
                      <div>
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{inv.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-surface-900 dark:text-surface-100">{inv.amount}</span>
                      <Badge size="sm" variant="success">{inv.status}</Badge>
                      <Button size="sm" variant="ghost">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── SYSTEM TAB ── */}
        {tab === 'System' && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'API Version', value: 'v1.4.2', icon: Settings, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
                { label: 'Uptime', value: '99.97%', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
                { label: 'Region', value: 'us-east-1', icon: Globe, color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400' },
                { label: 'Deployment', value: 'EKS v1.29', icon: Server, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
              ].map((s) => (
                <Card key={s.label} variant="bordered" className="flex items-center gap-3">
                  <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', s.color)}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-surface-900 dark:text-surface-100">{s.value}</p>
                    <p className="text-xs text-surface-400">{s.label}</p>
                  </div>
                </Card>
              ))}
            </div>

            <Card variant="bordered">
              <h3 className="mb-4 font-semibold text-surface-900 dark:text-surface-100">Feature Flags</h3>
              <div className="space-y-3">
                {[
                  { flag: 'voice_assistant', label: 'Voice Assistant', enabled: true },
                  { flag: 'meeting_bot', label: 'Meeting Intelligence Bot', enabled: true },
                  { flag: 'ai_agents', label: 'AI Agents Framework', enabled: true },
                  { flag: 'workflow_builder', label: 'Workflow Builder', enabled: false },
                  { flag: 'knowledge_graph', label: 'Knowledge Graph Viz', enabled: false },
                ].map((f) => (
                  <div key={f.flag} className="flex items-center justify-between rounded-lg bg-surface-50 px-3 py-2.5 dark:bg-surface-800/50">
                    <div>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{f.label}</p>
                      <p className="text-xs font-mono text-surface-400">{f.flag}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge size="sm" variant={f.enabled ? 'success' : 'default'}>{f.enabled ? 'ON' : 'OFF'}</Badge>
                      <Button size="sm" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

      </div>
    </div>
  );
}
