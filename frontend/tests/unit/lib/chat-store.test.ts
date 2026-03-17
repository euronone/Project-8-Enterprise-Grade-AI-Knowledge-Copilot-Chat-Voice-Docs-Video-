import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "@/stores/chat-store";
import type { Conversation, Message } from "@/types/chat";

const makeConversation = (id: string): Conversation => ({
  id,
  title: `Conversation ${id}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  model: "claude-sonnet-4-6",
  messageCount: 0,
  organizationId: "org-1",
  userId: "user-1",
  isPinned: false,
  tags: [],
  isShared: false,
});

const makeMessage = (id: string, content: string, role: "user" | "assistant" = "user"): Message => ({
  id,
  conversationId: "conv-1",
  role,
  content,
  createdAt: new Date().toISOString(),
  citations: [],
});

describe("useChatStore", () => {
  beforeEach(() => {
    useChatStore.setState({
      conversations: [],
      activeConversationId: null,
      messages: {},
      streamingMessageId: null,
      isLoading: false,
      error: null,
    });
  });

  it("starts with empty state", () => {
    const state = useChatStore.getState();
    expect(state.conversations).toEqual([]);
    expect(state.activeConversationId).toBeNull();
    expect(state.messages).toEqual({});
  });

  it("setConversations replaces all conversations", () => {
    const convs = [makeConversation("1"), makeConversation("2")];
    useChatStore.getState().setConversations(convs);
    expect(useChatStore.getState().conversations).toHaveLength(2);
  });

  it("addConversation prepends to list", () => {
    useChatStore.getState().setConversations([makeConversation("old")]);
    useChatStore.getState().addConversation(makeConversation("new"));
    const convs = useChatStore.getState().conversations;
    expect(convs[0].id).toBe("new");
    expect(convs[1].id).toBe("old");
  });

  it("removeConversation removes by id", () => {
    useChatStore.getState().setConversations([makeConversation("1"), makeConversation("2")]);
    useChatStore.getState().removeConversation("1");
    expect(useChatStore.getState().conversations).toHaveLength(1);
    expect(useChatStore.getState().conversations[0].id).toBe("2");
  });

  it("setActiveConversation updates active id", () => {
    useChatStore.getState().setActiveConversation("conv-1");
    expect(useChatStore.getState().activeConversationId).toBe("conv-1");
  });

  it("setMessages stores messages for a conversation", () => {
    const msgs = [makeMessage("m1", "Hello"), makeMessage("m2", "World")];
    useChatStore.getState().setMessages("conv-1", msgs);
    expect(useChatStore.getState().messages["conv-1"]).toHaveLength(2);
  });

  it("appendMessage adds to existing conversation messages", () => {
    useChatStore.getState().setMessages("conv-1", [makeMessage("m1", "First")]);
    useChatStore.getState().appendMessage("conv-1", makeMessage("m2", "Second"));
    expect(useChatStore.getState().messages["conv-1"]).toHaveLength(2);
  });

  it("appendMessage creates array for new conversation", () => {
    useChatStore.getState().appendMessage("new-conv", makeMessage("m1", "Hello"));
    expect(useChatStore.getState().messages["new-conv"]).toHaveLength(1);
  });

  it("updateMessage merges partial updates", () => {
    useChatStore.getState().setMessages("conv-1", [makeMessage("m1", "Draft")]);
    useChatStore.getState().updateMessage("conv-1", "m1", { content: "Final" });
    expect(useChatStore.getState().messages["conv-1"][0].content).toBe("Final");
  });

  it("appendStreamingToken appends to message content", () => {
    useChatStore.getState().setMessages("conv-1", [makeMessage("m1", "Hello", "assistant")]);
    useChatStore.getState().appendStreamingToken("conv-1", "m1", " world");
    expect(useChatStore.getState().messages["conv-1"][0].content).toBe("Hello world");
  });

  it("appendStreamingToken accumulates multiple tokens", () => {
    useChatStore.getState().setMessages("conv-1", [makeMessage("m1", "", "assistant")]);
    useChatStore.getState().appendStreamingToken("conv-1", "m1", "He");
    useChatStore.getState().appendStreamingToken("conv-1", "m1", "llo");
    useChatStore.getState().appendStreamingToken("conv-1", "m1", " World");
    expect(useChatStore.getState().messages["conv-1"][0].content).toBe("Hello World");
  });

  it("getActiveMessages returns messages for active conversation", () => {
    useChatStore.getState().setMessages("conv-1", [makeMessage("m1", "Test")]);
    useChatStore.getState().setActiveConversation("conv-1");
    expect(useChatStore.getState().getActiveMessages()).toHaveLength(1);
  });

  it("getActiveMessages returns empty when no active conversation", () => {
    expect(useChatStore.getState().getActiveMessages()).toEqual([]);
  });

  it("setLoading / setError update flags", () => {
    useChatStore.getState().setLoading(true);
    expect(useChatStore.getState().isLoading).toBe(true);

    useChatStore.getState().setError("Network error");
    expect(useChatStore.getState().error).toBe("Network error");

    useChatStore.getState().setError(null);
    expect(useChatStore.getState().error).toBeNull();
  });

  it("setStreamingMessageId tracks active stream", () => {
    useChatStore.getState().setStreamingMessageId("m1");
    expect(useChatStore.getState().streamingMessageId).toBe("m1");
    useChatStore.getState().setStreamingMessageId(null);
    expect(useChatStore.getState().streamingMessageId).toBeNull();
  });
});
