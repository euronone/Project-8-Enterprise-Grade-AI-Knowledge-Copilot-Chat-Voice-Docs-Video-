'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar, Clock, Plus, Users, Video } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabPanel } from '@/components/ui/Tabs';
import * as meetingsApi from '@/lib/api/meetings';
import type { Meeting } from '@/types';

const TABS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

export default function MeetingsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data, isLoading } = useQuery({
    queryKey: ['meetings', activeTab],
    queryFn: () =>
      meetingsApi.listMeetings({ upcoming: activeTab === 'upcoming', pageSize: 20 }),
  });

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Meetings
            </h1>
            <p className="mt-1 text-sm text-surface-500">
              AI-powered meeting summaries, transcripts, and action items.
            </p>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>New Meeting</Button>
        </div>
      </div>

      <div className="flex-1 p-6">
        <Tabs
          activeTab={activeTab}
          tabs={TABS}
          variant="underline"
          onTabChange={setActiveTab}
        >
          <TabPanel className="pt-6" id="upcoming">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <MeetingsList meetings={data?.items ?? []} />
            )}
          </TabPanel>
          <TabPanel className="pt-6" id="past">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : (
              <MeetingsList meetings={data?.items ?? []} showRecap />
            )}
          </TabPanel>
        </Tabs>
      </div>
    </div>
  );
}

function MeetingsList({ meetings, showRecap = false }: { meetings: Meeting[]; showRecap?: boolean }) {
  if (meetings.length === 0) {
    return (
      <div className="py-16 text-center">
        <Video className="mx-auto h-12 w-12 text-surface-200 dark:text-surface-700" />
        <p className="mt-4 text-surface-400">No meetings found</p>
      </div>
    );
  }

  const statusVariant: Record<
    string,
    'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'outline'
  > = {
    scheduled: 'info',
    in_progress: 'success',
    ended: 'default',
    cancelled: 'danger',
  };

  return (
    <div className="space-y-3">
      {meetings.map((meeting) => (
        <Card key={meeting.id} className="hover:shadow-card-hover transition-shadow" variant="bordered">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950">
                <Video className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-semibold text-surface-900 dark:text-surface-100">
                    {meeting.title}
                  </h3>
                  <Badge size="sm" variant={statusVariant[meeting.status] ?? 'default'}>
                    {meeting.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {format(new Date(meeting.scheduledAt), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {format(new Date(meeting.scheduledAt), 'h:mm a')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {meeting.participants.length} participants
                  </span>
                  {meeting.isRecorded && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-600 dark:bg-red-950 dark:text-red-400">
                      ● Recording
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {showRecap && (
                <Link href={`/meetings/${meeting.id}`}>
                  <Button size="sm" variant="secondary">
                    View recap
                  </Button>
                </Link>
              )}
              {meeting.status === 'scheduled' && (
                <Link href={`/meetings/${meeting.id}`}>
                  <Button size="sm">Join</Button>
                </Link>
              )}
              {meeting.status === 'in_progress' && (
                <Link href={`/meetings/${meeting.id}`}>
                  <Button size="sm">Join now</Button>
                </Link>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
