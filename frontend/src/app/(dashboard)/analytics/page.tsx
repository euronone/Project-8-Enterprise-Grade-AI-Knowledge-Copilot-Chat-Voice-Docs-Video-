'use client';

import { useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Brain,
  MessageSquare,
  ThumbsUp,
  Users,
  Zap,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { MetricsGrid, type MetricCard } from '@/components/analytics/MetricsGrid';
import { UsageChart } from '@/components/analytics/UsageChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import * as analyticsApi from '@/lib/api/analytics';

const DATE_RANGES = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
];

const PIE_COLORS = ['#4f46e5', '#7c3aed', '#2563eb', '#0891b2', '#059669'];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('usage');

  const endDate = new Date().toISOString();
  const startDate = new Date(
    Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000
  ).toISOString();

  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['analytics-dashboard', dateRange],
    queryFn: () => analyticsApi.getDashboard({ startDate, endDate }),
    staleTime: 5 * 60_000,
  });

  const usageMetrics: MetricCard[] = dashboard
    ? [
        {
          label: 'Total Queries',
          value: dashboard.usage.totalQueries,
          change: dashboard.usage.queriesChange,
          icon: <MessageSquare className="h-5 w-5" />,
        },
        {
          label: 'Active Users',
          value: dashboard.usage.activeUsers,
          change: dashboard.usage.activeUsersChange,
          icon: <Users className="h-5 w-5" />,
        },
        {
          label: 'Docs Indexed',
          value: dashboard.usage.documentsIndexed,
          change: dashboard.usage.documentsChange,
          icon: <Brain className="h-5 w-5" />,
        },
        {
          label: 'Avg Response',
          value: `${dashboard.usage.avgResponseTimeMs}ms`,
          change: -dashboard.usage.responseTimeChange,
          icon: <Zap className="h-5 w-5" />,
          description: 'lower is better',
        },
      ]
    : [];

  const aiMetrics: MetricCard[] = dashboard
    ? [
        {
          label: 'Success Rate',
          value: `${(dashboard.aiPerformance.successRate * 100).toFixed(1)}%`,
          icon: <ThumbsUp className="h-5 w-5" />,
        },
        {
          label: 'P95 Latency',
          value: `${dashboard.aiPerformance.latencyP95Ms}ms`,
          icon: <Zap className="h-5 w-5" />,
        },
        {
          label: 'Positive Feedback',
          value: `${(dashboard.aiPerformance.feedbackPositiveRate * 100).toFixed(1)}%`,
          icon: <ThumbsUp className="h-5 w-5" />,
        },
        {
          label: 'Avg Sources / Answer',
          value: dashboard.aiPerformance.avgSourcesPerAnswer.toFixed(1),
          icon: <BarChart3 className="h-5 w-5" />,
        },
      ]
    : [];

  const TABS = [
    { id: 'usage', label: 'Usage', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'ai', label: 'AI Performance', icon: <Brain className="h-4 w-4" /> },
    { id: 'knowledge', label: 'Knowledge', icon: <MessageSquare className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              Track usage, AI performance, and knowledge intelligence.
            </p>
          </div>
          {/* Date range selector */}
          <div className="flex rounded-lg border border-surface-200 p-0.5 dark:border-surface-700">
            {DATE_RANGES.map((r) => (
              <button
                key={r.id}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  dateRange === r.id
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-600 hover:text-surface-900 dark:text-surface-400 dark:hover:text-surface-100'
                }`}
                onClick={() => setDateRange(r.id)}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : !dashboard ? (
          <div className="py-12 text-center text-surface-400">No analytics data available</div>
        ) : (
          <Tabs
            activeTab={activeTab}
            tabs={TABS}
            variant="underline"
            onTabChange={setActiveTab}
          >
            {/* Usage tab */}
            <TabPanel className="space-y-6 pt-6" id="usage">
              <MetricsGrid metrics={usageMetrics} />

              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2" variant="bordered">
                  <CardHeader>
                    <CardTitle>Query Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UsageChart
                      data={dashboard.usage.queryVolume}
                      height={220}
                      label="Queries"
                    />
                  </CardContent>
                </Card>

                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Model Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer height={220} width="100%">
                      <PieChart>
                        <Pie
                          cx="50%"
                          cy="50%"
                          data={dashboard.usage.topModels}
                          dataKey="queryCount"
                          innerRadius={60}
                          nameKey="model"
                          outerRadius={90}
                        >
                          {dashboard.usage.topModels.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v: number) => v.toLocaleString()}
                          contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                        />
                        <Legend
                          formatter={(value: string) => (
                            <span style={{ fontSize: '11px' }}>{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Peak Usage Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer height={160} width="100%">
                    <BarChart
                      data={dashboard.usage.peakHours.map((h) => ({
                        hour: `${h.hour}:00`,
                        queries: h.count,
                      }))}
                      margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        axisLine={false}
                        dataKey="hour"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickLine={false}
                      />
                      <YAxis
                        axisLine={false}
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                      <Bar dataKey="queries" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabPanel>

            {/* AI Performance tab */}
            <TabPanel className="space-y-6 pt-6" id="ai">
              <MetricsGrid metrics={aiMetrics} />

              <div className="grid gap-6 lg:grid-cols-2">
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Response Latency Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UsageChart
                      color="#7c3aed"
                      data={dashboard.aiPerformance.latencyTrend}
                      height={220}
                      label="Latency (ms)"
                    />
                  </CardContent>
                </Card>
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>Feedback Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UsageChart
                      color="#059669"
                      data={dashboard.aiPerformance.feedbackTrend}
                      height={220}
                      label="Positive Feedback %"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabPanel>

            {/* Knowledge tab */}
            <TabPanel className="space-y-6 pt-6" id="knowledge">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: 'Total Documents', value: dashboard.knowledge.totalDocuments },
                  { label: 'Indexed', value: dashboard.knowledge.indexedDocuments },
                  { label: 'Pending', value: dashboard.knowledge.pendingDocuments },
                  { label: 'Failed', value: dashboard.knowledge.failedDocuments },
                ].map((m) => (
                  <Card key={m.label} variant="bordered">
                    <p className="text-xs font-medium uppercase tracking-wider text-surface-400">
                      {m.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-surface-900 dark:text-surface-100">
                      {m.value.toLocaleString()}
                    </p>
                  </Card>
                ))}
              </div>

              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Indexing Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <UsageChart
                    color="#0891b2"
                    data={dashboard.knowledge.indexingTrend}
                    height={220}
                    label="Documents Indexed"
                  />
                </CardContent>
              </Card>
            </TabPanel>
          </Tabs>
        )}
      </div>
    </div>
  );
}
