'use client';

import { useEffect, useRef, useState } from 'react';

import { useSession } from 'next-auth/react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import {
  Check,
  Copy,
  Download,
  File,
  FileSpreadsheet,
  FileText,
  Globe,
  ImageIcon,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';

import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import type { Message, MessageAttachment } from '@/types';

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentIcon({ type, name }: { type: string; name: string }) {
  if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4 shrink-0 text-purple-400" />;
  if (type === 'application/pdf') return <FileText className="h-4 w-4 shrink-0 text-red-400" />;
  if (name.endsWith('.xlsx') || name.endsWith('.csv')) return <FileSpreadsheet className="h-4 w-4 shrink-0 text-emerald-400" />;
  if (name.endsWith('.docx') || name.endsWith('.doc')) return <FileText className="h-4 w-4 shrink-0 text-blue-400" />;
  return <File className="h-4 w-4 shrink-0 text-surface-400" />;
}

function FileTab({ att }: { att: MessageAttachment }) {
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = att.url;
    a.download = att.name;
    a.click();
  };
  return (
    <div className="flex items-center gap-2 rounded-lg border border-surface-200 bg-white px-3 py-2 text-xs shadow-sm dark:border-surface-700 dark:bg-surface-900">
      <AttachmentIcon type={att.type} name={att.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate max-w-[120px] font-medium text-surface-800 dark:text-surface-200">{att.name}</p>
        <p className="text-[10px] text-surface-400">{formatBytes(att.size)}</p>
      </div>
      <button
        type="button"
        title="Download"
        onClick={handleDownload}
        className="ml-1 rounded-md p-1 text-surface-400 hover:bg-surface-100 hover:text-brand-600 dark:hover:bg-surface-800 dark:hover:text-brand-400 transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy code"
      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-surface-400 transition-colors hover:bg-surface-700 hover:text-surface-200"
    >
      {copied ? (
        <><Check className="h-3.5 w-3.5 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
      ) : (
        <><Copy className="h-3.5 w-3.5" /><span>Copy</span></>
      )}
    </button>
  );
}

// ── MessageList ───────────────────────────────────────────────────────────────

export function MessageList({ messages, isLoading }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand">
          <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Start a conversation
          </h3>
          <p className="mt-1 text-sm text-surface-500">
            Ask anything — I&apos;ll search your knowledge base or the web and answer with citations.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            'Summarize last quarter reports',
            'What is our refund policy?',
            'Find onboarding docs',
            'Latest AI news today',
          ].map((prompt) => (
            <button
              key={prompt}
              className="rounded-full border border-surface-200 bg-surface-50 px-3 py-1.5 text-sm text-surface-600 hover:bg-surface-100 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-300 dark:hover:bg-surface-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

// ── MessageBubble ─────────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const { data: session } = useSession();
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-3 animate-fade-in', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <Avatar
        name={isUser ? (session?.user?.name ?? 'User') : 'AI'}
        size="sm"
        src={isUser ? (session?.user?.image ?? undefined) : undefined}
      />

      <div className={cn('flex max-w-[78%] flex-col gap-1.5', isUser ? 'items-end' : 'items-start')}>
        {/* Attachment tabs — shown above user message bubble */}
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-end">
            {message.attachments.map((att) => (
              <FileTab key={att.id} att={att} />
            ))}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            isUser
              ? 'rounded-tr-sm bg-brand-600 text-white'
              : 'rounded-tl-sm bg-surface-100 text-surface-900 dark:bg-surface-800 dark:text-surface-100 w-full'
          )}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-chat">
              <ReactMarkdown
                rehypePlugins={[rehypeHighlight]}
                remarkPlugins={[remarkGfm]}
                components={{
                  // Code blocks — pre wraps the highlighted code
                  pre({ children, ...props }) {
                    // Extract raw text from children for copy button
                    const codeEl = (children as React.ReactElement);
                    const rawText =
                      typeof codeEl?.props?.children === 'string'
                        ? codeEl.props.children
                        : '';
                    const lang =
                      (codeEl?.props?.className ?? '').replace('language-', '').split(' ')[0] ?? '';
                    return (
                      <div className="my-3 overflow-hidden rounded-lg border border-surface-200 dark:border-surface-700">
                        <div className="flex items-center justify-between bg-surface-800 px-4 py-2">
                          <span className="text-xs font-mono text-surface-400 uppercase tracking-wide">
                            {lang || 'code'}
                          </span>
                          <CopyButton text={rawText} />
                        </div>
                        <pre
                          className="overflow-x-auto bg-surface-900 p-4 text-xs leading-relaxed"
                          {...props}
                        >
                          {children}
                        </pre>
                      </div>
                    );
                  },
                  // Inline code
                  code({ className, children, ...props }) {
                    const isBlock = className?.includes('language-');
                    if (isBlock) return <code className={className} {...props}>{children}</code>;
                    return (
                      <code
                        className="rounded bg-surface-200 px-1.5 py-0.5 text-xs font-mono text-surface-800 dark:bg-surface-700 dark:text-surface-200"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  // Tables
                  table({ children, ...props }) {
                    return (
                      <div className="my-3 overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700">
                        <table className="min-w-full divide-y divide-surface-200 text-sm dark:divide-surface-700" {...props}>
                          {children}
                        </table>
                      </div>
                    );
                  },
                  thead({ children, ...props }) {
                    return (
                      <thead className="bg-surface-50 dark:bg-surface-800" {...props}>
                        {children}
                      </thead>
                    );
                  },
                  th({ children, ...props }) {
                    return (
                      <th
                        className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-surface-600 dark:text-surface-400"
                        {...props}
                      >
                        {children}
                      </th>
                    );
                  },
                  td({ children, ...props }) {
                    return (
                      <td
                        className="border-t border-surface-100 px-4 py-2 text-surface-800 dark:border-surface-700 dark:text-surface-200"
                        {...props}
                      >
                        {children}
                      </td>
                    );
                  },
                  // Blockquotes
                  blockquote({ children, ...props }) {
                    return (
                      <blockquote
                        className="my-3 border-l-4 border-brand-400 bg-brand-50 py-2 pl-4 pr-3 text-sm italic text-surface-700 dark:bg-brand-950/30 dark:text-surface-300"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    );
                  },
                  // Headings
                  h1({ children, ...props }) {
                    return <h1 className="mt-4 mb-2 text-xl font-bold text-surface-900 dark:text-surface-100" {...props}>{children}</h1>;
                  },
                  h2({ children, ...props }) {
                    return <h2 className="mt-3 mb-2 text-lg font-semibold text-surface-900 dark:text-surface-100" {...props}>{children}</h2>;
                  },
                  h3({ children, ...props }) {
                    return <h3 className="mt-3 mb-1 text-base font-semibold text-surface-800 dark:text-surface-200" {...props}>{children}</h3>;
                  },
                  // Lists
                  ul({ children, ...props }) {
                    return <ul className="my-2 ml-5 list-disc space-y-1 text-surface-800 dark:text-surface-200" {...props}>{children}</ul>;
                  },
                  ol({ children, ...props }) {
                    return <ol className="my-2 ml-5 list-decimal space-y-1 text-surface-800 dark:text-surface-200" {...props}>{children}</ol>;
                  },
                  li({ children, ...props }) {
                    return <li className="leading-relaxed" {...props}>{children}</li>;
                  },
                  // Paragraphs
                  p({ children, ...props }) {
                    return <p className="mb-2 leading-relaxed last:mb-0" {...props}>{children}</p>;
                  },
                  // Links
                  a({ href, children, ...props }) {
                    return (
                      <a
                        href={href}
                        className="text-brand-600 underline hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  // Horizontal rule
                  hr({ ...props }) {
                    return <hr className="my-4 border-surface-200 dark:border-surface-700" {...props} />;
                  },
                  // Strong / Em
                  strong({ children, ...props }) {
                    return <strong className="font-semibold text-surface-900 dark:text-surface-100" {...props}>{children}</strong>;
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
              {message.isStreaming && (
                <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-brand-500" />
              )}
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {message.sources.slice(0, 5).map((source) => {
              const isWeb = source.sourceType === 'web';
              return (
                <a
                  key={source.id}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs hover:opacity-80 transition-opacity',
                    isWeb
                      ? 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'border-surface-200 bg-white text-surface-600 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-400'
                  )}
                  href={source.url ?? '#'}
                  rel="noopener noreferrer"
                  target={source.url ? '_blank' : '_self'}
                  title={source.chunkText}
                >
                  {isWeb ? <Globe className="h-3 w-3 shrink-0" /> : <FileText className="h-3 w-3 shrink-0" />}
                  <span className="truncate max-w-[120px]">{source.documentName}</span>
                  <Badge size="sm" variant="default">
                    {Math.round(source.relevanceScore * 100)}%
                  </Badge>
                </a>
              );
            })}
            {message.sources.length > 5 && (
              <span className="rounded-md border border-surface-200 px-2 py-1 text-xs text-surface-400 dark:border-surface-700">
                +{message.sources.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Feedback */}
        {!isUser && !message.isStreaming && (
          <div className="mt-0.5 flex items-center gap-1">
            <button className="rounded-md p-1 text-surface-300 transition-colors hover:bg-emerald-50 hover:text-emerald-500 dark:hover:bg-emerald-950">
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button className="rounded-md p-1 text-surface-300 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950">
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            {message.processingTimeMs && (
              <span className="ml-1 text-[10px] text-surface-300">{message.processingTimeMs}ms</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
