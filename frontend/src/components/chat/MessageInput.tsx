'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  ArrowUp,
  File,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  Mic,
  Paperclip,
  Square,
  X,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';

interface MessageInputProps {
  onSend: (content: string) => void;
  onAddFiles?: (files: File[]) => void;
  onRemoveFile?: (index: number) => void;
  attachments?: File[];
  disabled?: boolean;
  placeholder?: string;
  onAbort?: () => void;
}

const SLASH_COMMANDS = [
  { command: '/summarize', description: 'Summarize the selected content' },
  { command: '/translate', description: 'Translate to another language' },
  { command: '/compare', description: 'Compare two documents or concepts' },
  { command: '/explain', description: 'Explain a concept in simple terms' },
  { command: '/draft', description: 'Draft a document or email' },
];

const ACCEPT_TYPES = '.pdf,.docx,.doc,.txt,.md,.csv,.json,.xlsx,.pptx,.png,.jpg,.jpeg,.gif,.webp';

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4 shrink-0 text-purple-400" />;
  if (file.type === 'application/pdf') return <FileText className="h-4 w-4 shrink-0 text-red-400" />;
  if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) return <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-400" />;
  if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) return <FileText className="h-4 w-4 shrink-0 text-blue-400" />;
  return <File className="h-4 w-4 shrink-0 text-surface-400" />;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MessageInput({
  onSend,
  onAddFiles,
  onRemoveFile,
  attachments = [],
  disabled,
  placeholder,
  onAbort,
}: MessageInputProps) {
  const { streaming } = useChatStore();
  const [value, setValue] = useState('');
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  type SpeechRecognitionCtor = new () => {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onstart: (() => void) | null;
    onresult: ((e: { resultIndex: number; results: { isFinal: boolean; 0: { transcript: string } }[] }) => void) | null;
    onend: (() => void) | null;
    onerror: (() => void) | null;
    start: () => void;
    stop: () => void;
  };

  const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
    if (typeof window === 'undefined') return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
  };

  useEffect(() => {
    setVoiceSupported(!!getSpeechRecognition());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition || isListening) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let baseText = '';
    recognition.onstart = () => { baseText = value.trimEnd(); };
    recognition.onresult = (event: { resultIndex: number; results: Array<{ isFinal: boolean; 0: { transcript: string } }> }) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result) continue;
        const t = result[0].transcript;
        if (result.isFinal) final += t;
        else interim += t;
      }
      const spoken = final || interim;
      setValue(baseText ? `${baseText} ${spoken}` : spoken);
      const ta = textareaRef.current;
      if (ta) { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`; }
    };
    recognition.onend = () => { setIsListening(false); recognitionRef.current = null; textareaRef.current?.focus(); };
    recognition.onerror = () => { setIsListening(false); recognitionRef.current = null; };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, value]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const isStreaming = streaming.isStreaming;
  const canSend = (value.trim().length > 0 || attachments.length > 0) && !disabled;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setValue(val);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`; }
    const lastWord = val.split(/\s/).pop() ?? '';
    if (lastWord.startsWith('/') && lastWord.length > 0) {
      setSlashFilter(lastWord.slice(1));
      setShowSlashCommands(true);
    } else {
      setShowSlashCommands(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    if (e.key === 'Escape') setShowSlashCommands(false);
  };

  const handleSend = useCallback(() => {
    if (!canSend || isStreaming) return;
    onSend(value.trim());
    setValue('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowSlashCommands(false);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [canSend, isStreaming, onSend, value]);

  const applySlashCommand = (cmd: string) => {
    const parts = value.split(/\s/);
    parts[parts.length - 1] = `${cmd} `;
    setValue(parts.join(' '));
    setShowSlashCommands(false);
    textareaRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) onAddFiles?.(Array.from(files));
    e.target.value = '';
  };

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItems = items.filter((item) => item.type.startsWith('image/'));
    if (imageItems.length === 0) return;
    e.preventDefault();
    const newFiles: File[] = [];
    imageItems.forEach((item) => {
      const blob = item.getAsFile();
      if (!blob) return;
      const ext = item.type.split('/')[1] ?? 'png';
      newFiles.push(new File([blob], `screenshot-${Date.now()}.${ext}`, { type: item.type }));
    });
    if (newFiles.length > 0) onAddFiles?.(newFiles);
  }, [onAddFiles]);

  const filteredCommands = SLASH_COMMANDS.filter(
    (c) => !slashFilter || c.command.slice(1).startsWith(slashFilter)
  );

  return (
    <div className="border-t border-surface-100 bg-white p-4 dark:border-surface-800 dark:bg-surface-950">

      {/* Attachment tabs */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, i) => {
            const isImage = file.type.startsWith('image/');
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            return (
              <div
                key={i}
                className={cn(
                  'group relative flex items-center gap-2 rounded-lg border bg-white px-3 py-2',
                  'border-surface-200 shadow-sm dark:border-surface-700 dark:bg-surface-900',
                  'min-w-[140px] max-w-[200px]'
                )}
              >
                {isImage && previewUrl ? (
                  <img
                    src={previewUrl}
                    alt={file.name}
                    className="h-8 w-8 rounded object-cover shrink-0"
                    onLoad={() => URL.revokeObjectURL(previewUrl)}
                  />
                ) : (
                  getFileIcon(file)
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-surface-800 dark:text-surface-200">
                    {file.name}
                  </p>
                  <p className="text-[10px] text-surface-400">{formatBytes(file.size)}</p>
                </div>
                <button
                  type="button"
                  title="Remove"
                  className="ml-1 rounded-full p-0.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800"
                  onClick={() => onRemoveFile?.(i)}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
          <div className="flex items-center self-center text-xs text-surface-400 pl-1">
            {attachments.length}/10 files
          </div>
        </div>
      )}

      {/* Input row */}
      <div className="flex items-end gap-2">
        {/* File attach button */}
        <div className="shrink-0">
          <input
            ref={fileInputRef}
            accept={ACCEPT_TYPES}
            className="sr-only"
            id="chat-file-input"
            multiple
            type="file"
            onChange={handleFileChange}
          />
          <label
            htmlFor="chat-file-input"
            className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300"
            title="Attach file (up to 10)"
          >
            <Paperclip className="h-5 w-5" />
          </label>
        </div>

        {/* Voice input */}
        {voiceSupported && (
          <div className="shrink-0">
            <button
              type="button"
              title="Hold to speak"
              onMouseDown={startListening}
              onMouseUp={stopListening}
              onMouseLeave={stopListening}
              onTouchStart={(e) => { e.preventDefault(); startListening(); }}
              onTouchEnd={stopListening}
              className={cn(
                'flex items-center justify-center rounded-md p-1.5 transition-colors select-none',
                isListening
                  ? 'animate-pulse bg-red-100 text-red-500 dark:bg-red-950'
                  : 'text-surface-400 hover:bg-surface-100 hover:text-surface-600 dark:hover:bg-surface-800 dark:hover:text-surface-300'
              )}
            >
              <Mic className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Textarea area */}
        <div
          className={cn(
            'relative flex flex-1 items-end gap-2 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3',
            'dark:border-surface-700 dark:bg-surface-900 transition-colors'
          )}
        >
          {/* Slash commands */}
          {showSlashCommands && filteredCommands.length > 0 && (
            <div className="absolute bottom-full left-4 mb-2 w-72 rounded-lg border border-surface-200 bg-white shadow-lg dark:border-surface-700 dark:bg-surface-900">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.command}
                  className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-surface-50 dark:hover:bg-surface-800"
                  type="button"
                  onClick={() => applySlashCommand(cmd.command)}
                >
                  <code className="mt-0.5 text-sm font-medium text-brand-600 dark:text-brand-400">
                    {cmd.command}
                  </code>
                  <span className="text-xs text-surface-500">{cmd.description}</span>
                </button>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="flex-1 resize-none bg-transparent text-sm text-surface-900 placeholder-surface-400 focus:outline-none dark:text-surface-100"
            disabled={disabled}
            placeholder={placeholder ?? 'Ask anything… (Shift+Enter for new line, drag files or paste images)'}
            rows={1}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
          />

          {isStreaming ? (
            <Button aria-label="Stop generation" size="icon-sm" variant="danger" onClick={onAbort}>
              <Square className="h-4 w-4 fill-current" />
            </Button>
          ) : (
            <Button
              aria-label="Send message"
              disabled={!canSend}
              size="icon-sm"
              variant={canSend ? 'primary' : 'secondary'}
              onClick={handleSend}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <p className="mt-2 text-center text-[10px] text-surface-300 dark:text-surface-600">
        KnowledgeForge AI may make mistakes. Check important info.
      </p>
    </div>
  );
}
