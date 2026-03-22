'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  AlertCircle,
  CheckCircle,
  Clock,
  Film,
  Loader2,
  MessageSquare,
  Trash2,
  Upload,
  Video,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8010';

interface VideoDoc {
  id: string;
  name: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  status: string;
  wordCount: number | null;
  createdAt: string;
  updatedAt: string;
}

async function apiFetch(path: string, options?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : '';
  return fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options?.headers ?? {}),
    },
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'indexed') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <CheckCircle className="h-3.5 w-3.5" /> Ready
      </span>
    );
  }
  if (status === 'processing') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Transcribing…
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5" /> Failed
    </span>
  );
}

// ── Upload zone ────────────────────────────────────────────────────────────────
function UploadZone({ onUploaded }: { onUploaded: (doc: VideoDoc) => void }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(`Uploading ${file.name}…`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/knowledge/videos/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail ?? 'Upload failed');
        return;
      }

      setProgress('');
      onUploaded(data as VideoDoc);
    } catch {
      setError('Network error. Is the backend running?');
    } finally {
      setUploading(false);
    }
  }, [onUploaded]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <Card variant="bordered" className="bg-white dark:bg-surface-900">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors cursor-pointer',
          dragging
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
            : 'border-surface-200 hover:border-brand-400 dark:border-surface-700',
          uploading && 'pointer-events-none opacity-60',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm,audio/mpeg,audio/wav,audio/mp4,audio/ogg,.mp4,.mov,.avi,.mkv,.webm,.mp3,.wav,.m4a,.ogg"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {uploading ? (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
            <p className="text-sm text-surface-600 dark:text-surface-400">{progress}</p>
            <p className="text-xs text-surface-400">Transcribing with OpenAI Whisper — this may take a minute…</p>
          </>
        ) : (
          <>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100 dark:bg-brand-950">
              <Upload className="h-7 w-7 text-brand-600" />
            </div>
            <div className="text-center">
              <p className="font-medium text-surface-800 dark:text-surface-200">
                Drop a video or audio file here
              </p>
              <p className="mt-1 text-sm text-surface-500">
                MP4, MOV, AVI, MKV, WebM, MP3, WAV, M4A · Max 100 MB
              </p>
            </div>
            <Button size="sm" variant="outline">Browse files</Button>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
    </Card>
  );
}

// ── Video card ─────────────────────────────────────────────────────────────────
function VideoCard({ doc, onDelete, onChat }: { doc: VideoDoc; onDelete: (id: string) => void; onChat: (doc: VideoDoc) => void }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${doc.name}"? This will also remove it from the knowledge base.`)) return;
    setDeleting(true);
    try {
      await apiFetch(`/knowledge/documents/${doc.id}`, { method: 'DELETE' });
      onDelete(doc.id);
    } catch {
      alert('Delete failed');
    }
    setDeleting(false);
  };

  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600">
        <Film className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-surface-900 dark:text-surface-100 text-sm">{doc.name}</p>
        <div className="mt-0.5 flex items-center gap-3 text-xs text-surface-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(doc.createdAt)}
          </span>
          <span>{formatBytes(doc.fileSize)}</span>
          {doc.wordCount && <span>{doc.wordCount.toLocaleString()} words transcribed</span>}
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <StatusBadge status={doc.status} />

        {doc.status === 'indexed' && (
          <Button
            size="sm"
            leftIcon={<MessageSquare className="h-3.5 w-3.5" />}
            onClick={() => onChat(doc)}
          >
            Chat
          </Button>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-surface-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 transition-colors"
          title="Delete video"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function VideoLibraryPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoDoc[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVideos = async () => {
    try {
      const res = await apiFetch('/knowledge/documents?documentType=video&pageSize=50');
      if (res.ok) {
        const data = await res.json();
        setVideos(data.items ?? []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { loadVideos(); }, []);

  const handleUploaded = (doc: VideoDoc) => {
    setVideos((prev) => [doc, ...prev]);
  };

  const handleDelete = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleChat = async (doc: VideoDoc) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/conversations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: `Chat: ${doc.name}` }),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/chat/${conv.id}`);
      }
    } catch {
      router.push('/chat');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-50 dark:bg-surface-950">
      {/* Header */}
      <div className="border-b border-surface-100 bg-white px-6 py-5 dark:border-surface-800 dark:bg-surface-950">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-surface-100">Video Library</h1>
          <p className="mt-0.5 text-sm text-surface-500">
            Upload videos or audio files — they get transcribed and added to your knowledge base so you can chat with them.
          </p>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">

        {/* How it works */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { step: '1', title: 'Upload', desc: 'Drop any video or audio file (max 100 MB)' },
            { step: '2', title: 'Transcribe', desc: 'OpenAI Whisper converts speech to text automatically' },
            { step: '3', title: 'Chat', desc: 'Ask questions about the video content in the chat' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 rounded-xl border border-surface-100 bg-white px-4 py-3 dark:border-surface-800 dark:bg-surface-900">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700 dark:bg-brand-950 dark:text-brand-400">
                {s.step}
              </span>
              <div>
                <p className="font-medium text-surface-800 dark:text-surface-200 text-sm">{s.title}</p>
                <p className="text-xs text-surface-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Upload zone */}
        <UploadZone onUploaded={handleUploaded} />

        {/* Video list */}
        <Card variant="bordered">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100">
              Your Videos
              {videos.length > 0 && (
                <span className="ml-2 text-sm font-normal text-surface-400">({videos.length})</span>
              )}
            </h2>
            <button
              onClick={loadVideos}
              className="text-xs text-surface-400 hover:text-brand-600 transition-colors"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-100 dark:bg-surface-800" />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Video className="h-10 w-10 text-surface-300" />
              <p className="text-sm text-surface-500">
                No videos yet. Upload one above to get started.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-surface-100 dark:divide-surface-800">
              {videos.map((v) => (
                <VideoCard key={v.id} doc={v} onDelete={handleDelete} onChat={handleChat} />
              ))}
            </div>
          )}
        </Card>

        {/* Tip */}
        <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300">
          <MessageSquare className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Tip:</strong> Once a video is transcribed, you can also ask about it in any chat conversation — just mention the video by name and the AI will find the relevant parts.
          </span>
        </div>

      </div>
    </div>
  );
}
