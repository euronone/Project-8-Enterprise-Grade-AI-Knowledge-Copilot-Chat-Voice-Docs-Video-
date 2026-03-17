import { useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/stores/chat-store";
import { apiClient, streamChat } from "@/lib/api-client";
import { QUERY_KEYS } from "@/lib/constants";
import type { Conversation, Message } from "@/types/chat";
import { generateId } from "@/lib/utils";

export function useConversations() {
	const { setConversations } = useChatStore();
	return useQuery({
		queryKey: [QUERY_KEYS.CONVERSATIONS],
		queryFn: async () => {
			const data = await apiClient.get<{ items: Conversation[] }>("/chat/conversations");
			setConversations(data.items);
			return data.items;
		},
	});
}

export function useMessages(conversationId: string) {
	const { setMessages } = useChatStore();
	return useQuery({
		queryKey: [QUERY_KEYS.MESSAGES, conversationId],
		queryFn: async () => {
			const data = await apiClient.get<{ items: Message[] }>(
				`/chat/conversations/${conversationId}/messages`
			);
			setMessages(conversationId, data.items);
			return data.items;
		},
		enabled: !!conversationId,
	});
}

export function useSendMessage(conversationId: string) {
	const store = useChatStore();
	const abortRef = useRef<AbortController | null>(null);

	return useCallback(
		async (content: string, model?: string) => {
			const userMsg: Message = {
				id: generateId(),
				conversationId,
				role: "user",
				content,
				createdAt: new Date().toISOString(),
			};
			store.appendMessage(conversationId, userMsg);

			const assistantId = generateId();
			const assistantMsg: Message = {
				id: assistantId,
				conversationId,
				role: "assistant",
				content: "",
				createdAt: new Date().toISOString(),
				isStreaming: true,
			};
			store.appendMessage(conversationId, assistantMsg);
			store.setStreamingMessageId(assistantId);

			abortRef.current = new AbortController();

			await streamChat(
				`/chat/conversations/${conversationId}/messages`,
				{ content, model },
				(token) => store.appendStreamingToken(conversationId, assistantId, token),
				() => {
					store.updateMessage(conversationId, assistantId, { isStreaming: false });
					store.setStreamingMessageId(null);
				},
				(err) => {
					store.updateMessage(conversationId, assistantId, {
						isStreaming: false,
						content: `Error: ${err}`,
					});
					store.setStreamingMessageId(null);
				},
				abortRef.current.signal
			);
		},
		[conversationId, store]
	);
}

export function useCreateConversation() {
	const qc = useQueryClient();
	const { addConversation } = useChatStore();
	return useMutation({
		mutationFn: (data: { model?: string; title?: string }) =>
			apiClient.post<Conversation>("/chat/conversations", data),
		onSuccess: (conv) => {
			addConversation(conv);
			qc.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
		},
	});
}

