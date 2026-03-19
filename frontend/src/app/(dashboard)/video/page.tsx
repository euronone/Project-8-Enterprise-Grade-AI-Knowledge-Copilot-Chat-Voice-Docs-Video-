'use client';

import { useState } from 'react';

import {
  Calendar,
  CheckSquare,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  Mic,
  MicOff,
  Play,
  Plus,
  Search,
  Users,
  Video,
  VideoOff,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const upcomingMeetings = [
  { id: '1', title: 'Product Roadmap Q2 Review', time: 'Today, 2:00 PM', duration: '60 min', participants: 8, platform: 'internal' },
  { id: '2', title: 'Engineering All-Hands', time: 'Today, 4:30 PM', duration: '45 min', participants: 24, platform: 'zoom' },
  { id: '3', title: 'Customer Success Sync', time: 'Tomorrow, 10:00 AM', duration: '30 min', participants: 5, platform: 'teams' },
  { id: '4', title: 'Design Review — Dashboard v2', time: 'Tomorrow, 1:00 PM', duration: '90 min', participants: 6, platform: 'internal' },
];

const pastMeetings = [
  { id: '5', title: 'Sprint Planning — Sprint 42', time: 'Mar 18, 2026', duration: '62 min', participants: 10, recap: true, actionItems: 7 },
  { id: '6', title: 'Investor Update Call', time: 'Mar 17, 2026', duration: '45 min', participants: 4, recap: true, actionItems: 3 },
  { id: '7', title: 'Sales Pipeline Review', time: 'Mar 16, 2026', duration: '38 min', participants: 7, recap: true, actionItems: 5 },
  { id: '8', title: 'Infrastructure Planning', time: 'Mar 15, 2026', duration: '55 min', participants: 5, recap: true, actionItems: 9 },
];

const platformLabel: Record<string, string> = {
  internal: 'KnowledgeForge',
  zoom: 'Zoom',
  teams: 'Microsoft Teams',
  meet: 'Google Meet',
};

const platformColor: Record<string, string> = {
  internal: 'bg-indigo-500',
  zoom: 'bg-blue-500',
  teams: 'bg-violet-500',
  meet: 'bg-emerald-500',
};

export default function VideoPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">

      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Meeting Intelligence</h1>
            <p className="mt-0.5 text-sm text-surface-500">
              AI-powered meeting rooms with real-time transcription, recaps, and action item extraction.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" leftIcon={<Calendar className="h-4 w-4" />}>
              Schedule
            </Button>
            <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              New Meeting
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">

        {/* Quick join / start */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card variant="bordered" className="sm:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-600 border-0 text-white">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-semibold">Start an Instant Meeting</h2>
                <p className="mt-1 text-sm text-indigo-100">
                  Launch a WebRTC room now — AI transcription and recap enabled automatically.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors', micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600')}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors', camOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600')}
                >
                  {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50 flex-1 sm:flex-none" size="sm">
                  Start Now
                </Button>
              </div>
            </div>
          </Card>

          <Card variant="bordered">
            <h3 className="mb-3 text-sm font-semibold text-surface-700 dark:text-surface-300">Join by Code</h3>
            <input
              type="text"
              placeholder="Enter meeting code..."
              className="w-full rounded-lg border border-surface-200 bg-surface-50 px-3 py-2 text-sm text-surface-900 placeholder:text-surface-400 focus:border-brand-500 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
            />
            <Button variant="outline" className="mt-2 w-full" size="sm">
              Join Meeting
            </Button>
            <div className="mt-3 space-y-1.5">
              {['Zoom', 'Google Meet', 'Teams'].map((p) => (
                <button key={p} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-surface-500 hover:bg-surface-50 hover:text-surface-700 dark:hover:bg-surface-800">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Connect {p} calendar
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Meetings list */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden text-sm">
              {(['upcoming', 'past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn(
                    'px-4 py-2 capitalize font-medium transition-colors',
                    tab === t
                      ? 'bg-brand-600 text-white'
                      : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-surface-400" />
              <input
                placeholder="Search meetings..."
                className="rounded-lg border border-surface-200 bg-surface-50 pl-8 pr-3 py-1.5 text-sm placeholder:text-surface-400 focus:outline-none dark:border-surface-700 dark:bg-surface-800"
              />
            </div>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {tab === 'upcoming'
              ? upcomingMeetings.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn('h-9 w-9 shrink-0 flex items-center justify-center rounded-xl text-white text-xs font-bold', platformColor[m.platform] ?? 'bg-indigo-500')}>
                        <Video className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-surface-900 dark:text-surface-100 text-sm">{m.title}</p>
                        <div className="flex items-center gap-2 text-xs text-surface-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {m.time} · {m.duration}
                          <Users className="h-3 w-3 ml-1" />
                          {m.participants}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge size="sm" variant="outline">{platformLabel[m.platform]}</Badge>
                      <Button size="sm" leftIcon={<Play className="h-3.5 w-3.5" />}>Join</Button>
                    </div>
                  </div>
                ))
              : pastMeetings.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800 text-surface-400">
                        <Video className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-surface-900 dark:text-surface-100 text-sm">{m.title}</p>
                        <div className="flex items-center gap-3 text-xs text-surface-400 mt-0.5">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{m.time} · {m.duration}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{m.participants}</span>
                          {m.actionItems > 0 && (
                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                              <CheckSquare className="h-3 w-3" />{m.actionItems} actions
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                        Recap
                      </Button>
                      <Button size="sm" variant="ghost" rightIcon={<ChevronRight className="h-3.5 w-3.5" />}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
        </Card>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Meetings This Month', value: '47', icon: Video, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
            { label: 'Hours Transcribed', value: '62 hrs', icon: Mic, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
            { label: 'Action Items Created', value: '138', icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
            { label: 'Avg Meeting Duration', value: '41 min', icon: Clock, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
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
    </div>
  );
}
