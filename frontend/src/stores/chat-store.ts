import { create } from "zustand";
import type { Conversation, Message } from "@/types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  streamingMessageId: string | null;
  isLoading: boolean;
  error: string | null;

  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  removeConversation: (id: string) => void;
  setActiveConversation: (id: string | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  appendMessage: (conversationId: string, message: Message) => void;
  updateMessage: (conversationId: string, messageId: string, update: Partial<Message>) => void;
  appendStreamingToken: (conversationId: string, messageId: string, token: string) => void;
  setStreamingMessageId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getActiveMessages: () => Message[];
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: {},
  streamingMessageId: null,
  isLoading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((s) => ({ conversations: [conversation, ...s.conversations] })),
  removeConversation: (id) =>
    set((s) => ({ conversations: s.conversations.filter((c) => c.id !== id) })),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (conversationId, messages) =>
    set((s) => ({ messages: { ...s.messages, [conversationId]: messages } })),
  appendMessage: (conversationId, message) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: [...(s.messages[conversationId] ?? []), message],
      },
    })),
  updateMessage: (conversationId, messageId, update) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: (s.messages[conversationId] ?? []).map((m) =>
          m.id === messageId ? { ...m, ...update } : m
        ),
      },
    })),
  appendStreamingToken: (conversationId, messageId, token) =>
    set((s) => ({
      messages: {
        ...s.messages,
        [conversationId]: (s.messages[conversationId] ?? []).map((m) =>
          m.id === messageId ? { ...m, content: m.content + token } : m
        ),
      },
    })),
  setStreamingMessageId: (id) => set({ streamingMessageId: id }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  getActiveMessages: () => {
    const { activeConversationId, messages } = get();
    return activeConversationId ? (messages[activeConversationId] ?? []) : [];
  },
}));

