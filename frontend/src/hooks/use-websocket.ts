import { useEffect, useRef, useCallback } from "react";
import { getSocket, subscribeToRoom, unsubscribeFromRoom } from "@/lib/socket";
import type { Socket } from "socket.io-client";

export function useWebSocket(roomId?: string) {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		socketRef.current = getSocket();
		if (roomId) subscribeToRoom(roomId);
		return () => {
			if (roomId) unsubscribeFromRoom(roomId);
		};
	}, [roomId]);

	const on = useCallback(<T>(event: string, handler: (data: T) => void) => {
		socketRef.current?.on(event, handler);
		return () => { socketRef.current?.off(event, handler); };
	}, []);

	const emit = useCallback((event: string, data?: unknown) => {
		socketRef.current?.emit(event, data);
	}, []);

	return { socket: socketRef.current, on, emit };
}

