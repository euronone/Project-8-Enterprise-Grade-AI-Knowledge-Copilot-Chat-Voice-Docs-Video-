import { io, type Socket } from "socket.io-client";
import { WS_URL } from "./constants";

let socket: Socket | null = null;

export function getSocket(token?: string): Socket {
  if (!socket || !socket.connected) {
    socket = io(WS_URL, {
      auth: token ? { token } : undefined,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function subscribeToRoom(roomId: string) {
  getSocket()?.emit("join_room", { roomId });
}

export function unsubscribeFromRoom(roomId: string) {
  getSocket()?.emit("leave_room", { roomId });
}
