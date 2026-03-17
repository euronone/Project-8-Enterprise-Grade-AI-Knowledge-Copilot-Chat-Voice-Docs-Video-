import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationStore } from "@/stores/notification-store";

describe("useNotificationStore", () => {
  beforeEach(() => {
    useNotificationStore.setState({ items: [], unreadCount: 0 });
  });

  const makeNotification = (id: string, isRead = false) => ({
    id,
    type: "info" as const,
    title: `Notification ${id}`,
    isRead,
    createdAt: new Date().toISOString(),
  });

  it("has correct initial state", () => {
    const state = useNotificationStore.getState();
    expect(state.items).toEqual([]);
    expect(state.unreadCount).toBe(0);
  });

  it("setItems populates items and calculates unread count", () => {
    useNotificationStore.getState().setItems([
      makeNotification("1", false),
      makeNotification("2", true),
      makeNotification("3", false),
    ]);
    expect(useNotificationStore.getState().items).toHaveLength(3);
    expect(useNotificationStore.getState().unreadCount).toBe(2);
  });

  it("addItem prepends item and increments unread", () => {
    useNotificationStore.getState().setItems([makeNotification("1", false)]);
    useNotificationStore.getState().addItem(makeNotification("2", false));
    expect(useNotificationStore.getState().items).toHaveLength(2);
    expect(useNotificationStore.getState().items[0].id).toBe("2");
    expect(useNotificationStore.getState().unreadCount).toBe(2);
  });

  it("addItem does not increment unread for read items", () => {
    useNotificationStore.getState().addItem(makeNotification("1", true));
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("markRead marks a specific item as read", () => {
    useNotificationStore.getState().setItems([
      makeNotification("1", false),
      makeNotification("2", false),
    ]);
    useNotificationStore.getState().markRead("1");
    const item = useNotificationStore.getState().items.find((i) => i.id === "1");
    expect(item?.isRead).toBe(true);
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });

  it("markAllRead marks all items as read", () => {
    useNotificationStore.getState().setItems([
      makeNotification("1", false),
      makeNotification("2", false),
    ]);
    useNotificationStore.getState().markAllRead();
    expect(useNotificationStore.getState().unreadCount).toBe(0);
    expect(useNotificationStore.getState().items.every((i) => i.isRead)).toBe(true);
  });

  it("remove removes an item by id", () => {
    useNotificationStore.getState().setItems([
      makeNotification("1", false),
      makeNotification("2", true),
    ]);
    useNotificationStore.getState().remove("1");
    expect(useNotificationStore.getState().items).toHaveLength(1);
    expect(useNotificationStore.getState().unreadCount).toBe(0);
  });

  it("remove does not decrement unread for already read items", () => {
    useNotificationStore.getState().setItems([
      makeNotification("1", false),
      makeNotification("2", true),
    ]);
    useNotificationStore.getState().remove("2");
    expect(useNotificationStore.getState().unreadCount).toBe(1);
  });
});
