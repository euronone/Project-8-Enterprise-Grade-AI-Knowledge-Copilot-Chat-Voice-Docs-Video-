'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { ChevronDown, PanelRight, PanelRightClose, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

import { Button } from '@/components/ui/Button';
import { useMessages, useStreamingMessage } from '@/hooks/useChat';
import * as knowledgeApi from '@/lib/api/knowledge';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/stores/chatStore';
import type { AIModel, MessageAttachment, SourceCitation } from '@/types';

import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';
import { SourceCitationPanel } from './SourceCitationPanel';

const MODELS: Array<{ id: AIModel; name: string; provider: string }> = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
];

interface ChatInterfaceProps {
  conversationId: string;
  initialMessage?: string;
}

export function ChatInterface({ conversationId, initialMessage }: ChatInterfaceProps) {
  const { messages, selectedModel, setModel } = useChatStore();
  const { sendMessage, abort } = useStreamingMessage();
  const { isLoading: messagesLoading } = useMessages(conversationId);
  const [showSources, setShowSources] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const initialSentRef = useRef(false);

  // Lifted attachment state — shared between full-panel dropzone and MessageInput
  const [attachments, setAttachments] = useState<File[]>([]);
  const blobUrlsRef = useRef<string[]>([]);

  // Cleanup blob URLs when component unmounts
  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)); };
  }, []);

  const addFiles = useCallback((files: File[]) => {
    setAttachments((prev) => [...prev, ...files].slice(0, 10));
  }, []);

  const removeFile = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Full-panel drop zone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: addFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    },
  });

  const conversationMessages = messages[conversationId] ?? [];

  useEffect(() => {
    if (initialMessage && !initialSentRef.current && !messagesLoading) {
      initialSentRef.current = true;
      void sendMessage({ conversationId, content: initialMessage, model: selectedModel });
    }
  }, [initialMessage, messagesLoading, conversationId, selectedModel, sendMessage]);

  const allSources = useMemo(() => {
    const seen = new Set<string>();
    const sources: SourceCitation[] = [];
    for (const msg of conversationMessages) {
      for (const s of msg.sources) {
        if (!seen.has(s.id)) {
          seen.add(s.id);
          sources.push(s);
        }
      }
    }
    return sources;
  }, [conversationMessages]);

  const handleSend = useCallback(
    async (content: string) => {
      const files = attachments;
      setAttachments([]);

      let images: string[] | undefined;
      const imageFiles = files.filter((f) => f.type.startsWith('image/'));
      const docFiles   = files.filter((f) => !f.type.startsWith('image/'));

      // Convert images to base64 for vision
      if (imageFiles.length > 0) {
        images = await Promise.all(
          imageFiles.map(
            (file) =>
              new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
              })
          )
        );
      }

      // Upload non-image docs to knowledge base
      if (docFiles.length > 0) {
        const uploadToast = toast.loading(`Uploading ${docFiles.length} file(s)...`);
        try {
          await knowledgeApi.uploadDocuments(docFiles, {});
          toast.success(`${docFiles.length} file(s) added to Knowledge base`, { id: uploadToast });
        } catch {
          toast.error('File upload failed. Sending message without attachments.', { id: uploadToast });
        }
      }

      // Create MessageAttachment records with blob URLs for download
      const messageAttachments: MessageAttachment[] = files.map((file) => {
        const url = URL.createObjectURL(file);
        blobUrlsRef.current.push(url);
        return {
          id: `attach-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type || 'application/octet-stream',
          size: file.size,
          url,
        };
      });

      void sendMessage({
        conversationId,
        content,
        model: selectedModel,
        images,
        messageAttachments,
      });
    },
    [attachments, conversationId, selectedModel, sendMessage]
  );

  const selectedModelInfo = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0]!;

  return (
    <div
      {...getRootProps()}
      className="relative flex h-full flex-col outline-none"
    >
      {/* Hidden dropzone input */}
      <input {...getInputProps()} />

      {/* Full-panel drag overlay */}
      {isDragActive && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-brand-400 bg-brand-50/90 dark:bg-brand-950/90">
          <Upload className="h-12 w-12 text-brand-500" />
          <p className="text-lg font-semibold text-brand-700 dark:text-brand-300">Drop files anywhere</p>
          <p className="text-sm text-brand-500">PDFs, DOCX, XLSX, images and more</p>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-surface-100 px-4 py-2 dark:border-surface-800">
        {/* Model selector */}
        <div className="relative">
          <button
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-700',
              'border border-surface-200 bg-white hover:bg-surface-50',
              'dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300 dark:hover:bg-surface-800',
              'transition-colors'
            )}
            onClick={() => setModelDropdownOpen((v) => !v)}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {selectedModelInfo.name}
            <ChevronDown className="h-3.5 w-3.5 text-surface-400" />
          </button>

          {modelDropdownOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setModelDropdownOpen(false)} />
              <div className="absolute top-full left-0 z-20 mt-1 w-56 rounded-xl border border-surface-100 bg-white py-1 shadow-lg dark:border-surface-700 dark:bg-surface-900">
                {MODELS.map((model) => (
                  <button
                    key={model.id}
                    className={cn(
                      'flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors',
                      model.id === selectedModel
                        ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
                        : 'text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-800'
                    )}
                    onClick={() => { setModel(model.id); setModelDropdownOpen(false); }}
                  >
                    <div className="min-w-0 flex-1 text-left">
                      <div className="font-medium">{model.name}</div>
                      <div className="text-xs text-surface-400">{model.provider}</div>
                    </div>
                    {model.id === selectedModel && <span className="text-brand-500">✓</span>}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right actions */}
        <Button
          aria-label={showSources ? 'Hide sources' : 'Show sources'}
          size="icon-sm"
          variant={showSources ? 'primary' : 'ghost'}
          onClick={() => setShowSources((v) => !v)}
        >
          {showSources ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
        </Button>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <MessageList messages={conversationMessages} isLoading={messagesLoading} />
          <MessageInput
            attachments={attachments}
            onAbort={abort}
            onAddFiles={addFiles}
            onRemoveFile={removeFile}
            onSend={handleSend}
          />
        </div>

        {showSources && allSources.length > 0 && (
          <div className="w-80 shrink-0 overflow-y-auto">
            <SourceCitationPanel sources={allSources} />
          </div>
        )}
      </div>
    </div>
  );
}
