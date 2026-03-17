import { create } from "zustand";

interface NotificationItem {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  body?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  setItems: (items: NotificationItem[]) => void;
  addItem: (item: NotificationItem) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  items: [],
  unreadCount: 0,
  setItems: (items) =>
    set({ items, unreadCount: items.filter((i) => !i.isRead).length }),
  addItem: (item) =>
    set((s) => ({
      items: [item, ...s.items],
      unreadCount: s.unreadCount + (item.isRead ? 0 : 1),
    })),
  markRead: (id) =>
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, isRead: true } : i)),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),
  markAllRead: () =>
    set((s) => ({ items: s.items.map((i) => ({ ...i, isRead: true })), unreadCount: 0 })),
  remove: (id) =>
    set((s) => {
      const item = s.items.find((i) => i.id === id);
      return {
        items: s.items.filter((i) => i.id !== id),
        unreadCount: s.unreadCount - (item && !item.isRead ? 1 : 0),
      };
    }),
}));
