import type { Metadata } from 'next';
import Link from 'next/link';

import { Bot, ChevronRight, Code2, FileCheck, Headphones, LineChart, Search, UserPlus, Wrench } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = { title: 'AI Agents' };

interface AgentDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  capabilities: string[];
  status: 'available' | 'beta' | 'coming_soon';
  color: string;
  route?: string;
}

const AGENTS: AgentDefinition[] = [
  {
    id: 'research',
    name: 'Research Agent',
    description:
      'Conducts deep research across your knowledge base and the web, producing structured reports with citations.',
    icon: <Search className="h-6 w-6" />,
    category: 'Productivity',
    capabilities: ['Multi-source research', 'Structured reports', 'Web search', 'Citations'],
    status: 'available',
    color: 'bg-blue-500',
    route: '/agents/research',
  },
  {
    id: 'writing',
    name: 'Writing Assistant',
    description:
      'Drafts emails, proposals, documentation, and other long-form content tailored to your style.',
    icon: <FileCheck className="h-6 w-6" />,
    category: 'Productivity',
    capabilities: ['Email drafts', 'Long-form content', 'Style matching', 'Proofreading'],
    status: 'available',
    color: 'bg-violet-500',
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    description:
      'Analyzes spreadsheets and databases, generates visualizations and executive summaries.',
    icon: <LineChart className="h-6 w-6" />,
    category: 'Analytics',
    capabilities: ['CSV analysis', 'Chart generation', 'SQL queries', 'Trend detection'],
    status: 'available',
    color: 'bg-emerald-500',
  },
  {
    id: 'support',
    name: 'Customer Support Agent',
    description:
      'Handles tier-1 support inquiries by searching FAQs and documentation, escalating when needed.',
    icon: <Headphones className="h-6 w-6" />,
    category: 'Customer Success',
    capabilities: ['FAQ lookup', 'Ticket triage', 'Escalation', 'Multilingual'],
    status: 'available',
    color: 'bg-cyan-500',
  },
  {
    id: 'onboarding',
    name: 'Onboarding Assistant',
    description:
      'Guides new employees through onboarding tasks, answering HR questions and sharing policies.',
    icon: <UserPlus className="h-6 w-6" />,
    category: 'HR',
    capabilities: ['Policy answers', 'Task checklists', 'Role-based guidance', 'Integrations'],
    status: 'available',
    color: 'bg-amber-500',
  },
  {
    id: 'compliance',
    name: 'Compliance Checker',
    description:
      'Reviews documents and workflows for regulatory compliance, flagging issues with citations.',
    icon: <FileCheck className="h-6 w-6" />,
    category: 'Legal & Risk',
    capabilities: ['GDPR', 'SOC 2', 'HIPAA', 'Risk scoring'],
    status: 'beta',
    color: 'bg-rose-500',
  },
  {
    id: 'code-review',
    name: 'Code Review Agent',
    description:
      'Automatically reviews pull requests, suggests improvements, and checks against coding standards.',
    icon: <Code2 className="h-6 w-6" />,
    category: 'Engineering',
    capabilities: ['PR reviews', 'Security scan', 'Style guide', 'Test suggestions'],
    status: 'beta',
    color: 'bg-indigo-500',
  },
  {
    id: 'custom',
    name: 'Build Custom Agent',
    description:
      'Create a custom AI agent tailored to your specific workflow using our no-code builder.',
    icon: <Wrench className="h-6 w-6" />,
    category: 'Platform',
    capabilities: ['Custom prompts', 'Tool integrations', 'Scheduled runs', 'Webhooks'],
    status: 'coming_soon',
    color: 'bg-surface-400',
  },
];

const statusVariant: Record<
  string,
  'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'outline'
> = {
  available: 'success',
  beta: 'warning',
  coming_soon: 'default',
};

const statusLabel: Record<string, string> = {
  available: 'Available',
  beta: 'Beta',
  coming_soon: 'Coming soon',
};

export default function AgentsPage() {
  const categories = [...new Set(AGENTS.map((a) => a.category))];

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              AI Agents
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              Autonomous AI agents that work on your behalf — searching, writing, analyzing, and more.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-surface-400" />
            <span className="text-sm text-surface-500">
              {AGENTS.filter((a) => a.status === 'available').length} agents available
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        {categories.map((category) => {
          const categoryAgents = AGENTS.filter((a) => a.category === category);
          return (
            <div key={category}>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-surface-400">
                {category}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {categoryAgents.map((agent) => (
                  <Card
                    key={agent.id}
                    className={`group flex flex-col gap-4 transition-all ${
                      agent.status !== 'coming_soon'
                        ? 'cursor-pointer hover:shadow-card-hover'
                        : 'opacity-60'
                    }`}
                    variant="bordered"
                  >
                    {/* Icon + status */}
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${agent.color}`}
                      >
                        {agent.icon}
                      </div>
                      <Badge size="sm" variant={statusVariant[agent.status]}>
                        {statusLabel[agent.status]}
                      </Badge>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                        {agent.name}
                      </h3>
                      <p className="mt-1 text-sm text-surface-500 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap) => (
                        <Badge key={cap} size="sm" variant="outline">
                          {cap}
                        </Badge>
                      ))}
                    </div>

                    {/* Action */}
                    {agent.status !== 'coming_soon' && (
                      agent.route ? (
                        <Link href={agent.route}>
                          <Button
                            className="w-full group-hover:bg-brand-700"
                            rightIcon={<ChevronRight className="h-4 w-4" />}
                            size="sm"
                          >
                            {agent.status === 'beta' ? 'Try beta' : 'Launch agent'}
                          </Button>
                        </Link>
                      ) : (
                        <Button
                          className="w-full"
                          disabled
                          rightIcon={<ChevronRight className="h-4 w-4" />}
                          size="sm"
                          variant="secondary"
                        >
                          Coming soon
                        </Button>
                      )
                    )}
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
