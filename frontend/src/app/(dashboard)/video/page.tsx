'use client';

import { useEffect, useRef, useState } from 'react';

import {
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Mic,
  MicOff,
  Phone,
  Play,
  Plus,
  Users,
  Video,
  VideoOff,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

interface Meeting {
  id: string;
  title: string;
  status: string;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration_minutes: number | null;
  participants: string[];
  recap: Record<string, unknown>;
  action_items: { id: string; description: string; assignee: string; status: string }[];
  created_at: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = localStorage.getItem('accessToken');
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Meeting Room ──────────────────────────────────────────────────────────────
function MeetingRoom({ meeting, onEnd }: { meeting: Meeting; onEnd: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // Ref so onend closure always reads the LATEST mic state
  const micOnRef = useRef(true);
  const [elapsed, setElapsed] = useState(0);
  const [camStatus, setCamStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  // Keep micOnRef in sync with micOn state
  useEffect(() => { micOnRef.current = micOn; }, [micOn]);

  // Start camera + mic on mount
  useEffect(() => {
    let mounted = true;

    const startMedia = async () => {
      let mediaStream: MediaStream | null = null;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch {
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
          if (mounted) setCamStatus('error');
        } catch {
          if (mounted) setCamStatus('error');
        }
      }

      if (mediaStream && mounted) {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(() => {});
        }
        const hasVideo = mediaStream.getVideoTracks().length > 0;
        setCamStatus(hasVideo ? 'ok' : 'error');
      }
    };

    startMedia();

    // Web Speech API — onend uses micOnRef so it always checks the CURRENT mic state
    const SpeechRecognition =
      window.SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition: typeof window.SpeechRecognition }).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = 'en-US';
      rec.onresult = (e) => {
        const text = Array.from(e.results)
          .slice(e.resultIndex)
          .map((r) => r[0].transcript)
          .join(' ');
        if (text.trim()) setTranscript((prev) => [...prev, text.trim()]);
      };
      rec.onerror = () => {};
      rec.onend = () => {
        // Only auto-restart if mic is currently ON and component is still mounted
        if (mounted && recognitionRef.current && micOnRef.current) {
          try { recognitionRef.current.start(); } catch { /* already started */ }
        }
      };
      try { rec.start(); } catch { /* not supported */ }
      recognitionRef.current = rec;
    }

    const timer = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => {
      mounted = false;
      clearInterval(timer);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  // Toggle mic: mute audio track AND pause/resume SpeechRecognition
  useEffect(() => {
    stream?.getAudioTracks().forEach((t) => { t.enabled = micOn; });
    if (!recognitionRef.current) return;
    if (micOn) {
      try { recognitionRef.current.start(); } catch { /* already running */ }
    } else {
      try { recognitionRef.current.stop(); } catch { /* already stopped */ }
    }
  }, [micOn, stream]);

  // Toggle camera: enable/disable video track
  useEffect(() => {
    stream?.getVideoTracks().forEach((t) => { t.enabled = camOn; });
  }, [camOn, stream]);

  const handleEnd = async () => {
    stream?.getTracks().forEach((t) => t.stop());
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    onEnd();
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${pad(Math.floor(elapsed / 3600))}:${pad(Math.floor((elapsed % 3600) / 60))}:${pad(elapsed % 60)}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950 text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <div>
          <h2 className="font-semibold">{meeting.title}</h2>
          <p className="text-sm text-gray-400 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse inline-block" />
            Live · {timeStr}
          </p>
        </div>
        <Badge variant="danger" size="sm">Recording</Badge>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video */}
        <div className="flex flex-1 items-center justify-center bg-gray-950 p-4">
          <div className="relative aspect-video w-full max-w-3xl rounded-2xl overflow-hidden bg-gray-800">
            {/* Always render video element so ref is available */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className={cn(
                'h-full w-full object-cover transition-opacity',
                (camStatus !== 'ok' || !camOn) && 'opacity-0 absolute inset-0'
              )}
            />

            {/* Overlays */}
            {camStatus === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-600 border-t-indigo-400" />
                <p className="text-sm">Starting camera…</p>
              </div>
            )}
            {camStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                <VideoOff className="h-10 w-10" />
                <p className="text-sm text-center px-4">
                  Camera unavailable.<br />
                  <span className="text-xs text-gray-500">Allow camera in browser settings and reload.</span>
                </p>
              </div>
            )}
            {camStatus === 'ok' && !camOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <VideoOff className="h-12 w-12 text-gray-500" />
              </div>
            )}

            <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2 py-1 text-xs z-10">You</div>
          </div>
        </div>

        {/* Live Transcript */}
        <div className="w-72 flex flex-col border-l border-gray-800 bg-gray-900">
          <div className="px-4 py-3 border-b border-gray-800 text-sm font-medium text-gray-300 flex items-center gap-2">
            <Mic className="h-3.5 w-3.5 text-indigo-400" />
            Live Transcript
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {transcript.length === 0 ? (
              <p className="text-xs text-gray-500">Speak — transcript appears here in real time.</p>
            ) : (
              transcript.map((line, i) => (
                <p key={i} className="text-xs text-gray-300 leading-relaxed border-l-2 border-indigo-500 pl-2">{line}</p>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-5 bg-gray-900 border-t border-gray-800">
        <button
          onClick={() => setMicOn(!micOn)}
          title={micOn ? 'Mute mic' : 'Unmute mic'}
          className={cn('flex h-12 w-12 items-center justify-center rounded-full transition-colors',
            micOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700')}
        >
          {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
          className={cn('flex h-12 w-12 items-center justify-center rounded-full transition-colors',
            camOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700')}
        >
          {camOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </button>
        <button
          onClick={handleEnd}
          title="End meeting"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 hover:bg-red-700 transition-colors"
        >
          <Phone className="h-5 w-5 rotate-[135deg]" />
        </button>
      </div>
    </div>
  );
}

// ── Schedule Modal ─────────────────────────────────────────────────────────────
function ScheduleModal({ onClose, onCreated }: { onClose: () => void; onCreated: (m: Meeting) => void }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) { setError('Title is required'); return; }
    setLoading(true);
    try {
      const res = await apiFetch('/meetings', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          scheduledAt: date ? new Date(date).toISOString() : null,
          durationMinutes: parseInt(duration),
        }),
      });
      if (res.ok) {
        const m = await res.json();
        onCreated(m);
      } else {
        setError('Failed to create meeting. Please try again.');
      }
    } catch {
      setError('Network error. Is the backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <Card variant="bordered" className="w-full max-w-md bg-white dark:bg-surface-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Schedule Meeting</h2>
          <button onClick={onClose}><X className="h-5 w-5 text-surface-400" /></button>
        </div>
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sprint Planning"
              className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Scheduled At (optional)</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-surface-700 dark:text-surface-300">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100"
            >
              {['15', '30', '45', '60', '90', '120'].map((d) => (
                <option key={d} value={d}>{d} minutes</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={handleSubmit} disabled={!title.trim() || loading}>
            {loading ? 'Creating…' : 'Create Meeting'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function VideoPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMeeting, setActiveMeeting] = useState<Meeting | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const loadMeetings = async (t: 'upcoming' | 'past') => {
    setLoading(true);
    try {
      const res = await apiFetch(`/meetings?tab=${t}`);
      if (res.ok) setMeetings(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadMeetings(tab); }, [tab]);

  const startInstant = async () => {
    const res = await apiFetch('/meetings', {
      method: 'POST',
      body: JSON.stringify({ title: 'Instant Meeting', scheduledAt: null, durationMinutes: 60 }),
    });
    if (res.ok) {
      const m = await res.json();
      setActiveMeeting(m);
    }
  };

  const handleMeetingEnd = () => {
    setActiveMeeting(null);
    loadMeetings(tab);
  };

  return (
    <>
      {activeMeeting && <MeetingRoom meeting={activeMeeting} onEnd={handleMeetingEnd} />}
      {showSchedule && (
        <ScheduleModal
          onClose={() => setShowSchedule(false)}
          onCreated={(m) => { setMeetings((prev) => [m, ...prev]); setShowSchedule(false); }}
        />
      )}

      <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">
        {/* Header */}
        <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Meeting Intelligence</h1>
              <p className="mt-0.5 text-sm text-surface-500">
                AI-powered meetings with live transcription, recaps, and action item extraction.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" leftIcon={<Calendar className="h-4 w-4" />} onClick={() => setShowSchedule(true)}>
                Schedule
              </Button>
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setShowSchedule(true)}>
                New Meeting
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 space-y-6">

          {/* Start Instant */}
          <Card variant="bordered" className="bg-gradient-to-br from-indigo-600 to-violet-600 border-0 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Start an Instant Meeting</h2>
                <p className="mt-1 text-sm text-indigo-100">
                  Your browser handles camera + mic. Live speech transcription starts automatically.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setMicOn(!micOn)}
                  className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    micOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600')}
                >
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setCamOn(!camOn)}
                  className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                    camOn ? 'bg-white/20 hover:bg-white/30' : 'bg-red-500 hover:bg-red-600')}
                >
                  {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </button>
                <Button className="bg-white text-indigo-700 hover:bg-indigo-50" size="sm" onClick={startInstant}>
                  Start Now
                </Button>
              </div>
            </div>
          </Card>

          {/* Meetings list */}
          <Card variant="bordered">
            <div className="mb-4 flex rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden text-sm w-fit">
              {(['upcoming', 'past'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={cn('px-4 py-2 capitalize font-medium transition-colors',
                    tab === t ? 'bg-brand-600 text-white' : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-surface-800')}
                >
                  {t}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800" />)}
              </div>
            ) : meetings.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Video className="h-10 w-10 text-surface-300" />
                <p className="text-sm text-surface-500">
                  {tab === 'upcoming' ? 'No upcoming meetings. Start one now or schedule it.' : 'No past meetings yet. End a meeting to see it here.'}
                </p>
                <Button size="sm" onClick={startInstant} leftIcon={<Play className="h-4 w-4" />}>
                  Start Instant Meeting
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-surface-100 dark:divide-surface-800">
                {meetings.map((m) => (
                  <div key={m.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600">
                        <Video className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-surface-900 dark:text-surface-100 text-sm">{m.title}</p>
                        <div className="flex items-center gap-2 text-xs text-surface-400 mt-0.5">
                          <Clock className="h-3 w-3" />
                          {tab === 'upcoming' ? formatDate(m.scheduled_at ?? m.created_at) : formatDate(m.ended_at ?? m.created_at)}
                          {m.duration_minutes && <span>· {m.duration_minutes} min</span>}
                          {(m.participants?.length ?? 0) > 0 && (
                            <><Users className="h-3 w-3 ml-1" />{m.participants.length}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {tab === 'upcoming' ? (
                        <>
                          <Badge size="sm" variant="outline">{m.status}</Badge>
                          <Button size="sm" leftIcon={<Play className="h-3.5 w-3.5" />} onClick={() => setActiveMeeting(m)}>
                            Join
                          </Button>
                        </>
                      ) : (
                        <>
                          {(m.action_items?.length ?? 0) > 0 && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <CheckSquare className="h-3 w-3" />{m.action_items.length} actions
                            </span>
                          )}
                          <Button size="sm" variant="outline" leftIcon={<FileText className="h-3.5 w-3.5" />}>
                            Recap
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total Meetings', value: meetings.length.toString(), icon: Video, color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400' },
              { label: 'Upcoming', value: meetings.filter((m) => m.status === 'scheduled').length.toString(), icon: Calendar, color: 'bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400' },
              { label: 'Action Items', value: meetings.reduce((s, m) => s + (m.action_items?.length ?? 0), 0).toString(), icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' },
              { label: 'With Recap', value: meetings.filter((m) => m.recap && Object.keys(m.recap).length > 0).length.toString(), icon: FileText, color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400' },
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
    </>
  );
}
