import { describe, it, expect, beforeEach, vi } from "vitest";
import { useUiStore } from "@/stores/ui-store";

describe("useUiStore", () => {
  beforeEach(() => {
    useUiStore.setState({
      sidebarOpen: true,
      commandOpen: false,
      activeModal: null,
      toasts: [],
    });
  });

  it("sidebar starts open", () => {
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });

  it("toggleSidebar flips value", () => {
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });

  it("setSidebarOpen sets explicitly", () => {
    useUiStore.getState().setSidebarOpen(false);
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it("setCommandOpen controls command palette", () => {
    useUiStore.getState().setCommandOpen(true);
    expect(useUiStore.getState().commandOpen).toBe(true);
  });

  it("openModal / closeModal manage active modal", () => {
    useUiStore.getState().openModal("settings");
    expect(useUiStore.getState().activeModal).toBe("settings");

    useUiStore.getState().closeModal();
    expect(useUiStore.getState().activeModal).toBeNull();
  });

  it("addToast adds a toast with auto-generated id", () => {
    vi.useFakeTimers();
    useUiStore.getState().addToast({ type: "success", title: "Saved" });
    const toasts = useUiStore.getState().toasts;
    expect(toasts).toHaveLength(1);
    expect(toasts[0].type).toBe("success");
    expect(toasts[0].title).toBe("Saved");
    expect(toasts[0].id).toBeTruthy();
    vi.useRealTimers();
  });

  it("removeToast removes by id", () => {
    vi.useFakeTimers();
    useUiStore.getState().addToast({ type: "info", title: "A", duration: 0 });
    useUiStore.getState().addToast({ type: "error", title: "B", duration: 0 });
    const [first] = useUiStore.getState().toasts;
    useUiStore.getState().removeToast(first.id);
    expect(useUiStore.getState().toasts).toHaveLength(1);
    expect(useUiStore.getState().toasts[0].title).toBe("B");
    vi.useRealTimers();
  });

  it("toast auto-removes after duration", () => {
    vi.useFakeTimers();
    useUiStore.getState().addToast({ type: "info", title: "Temp", duration: 1000 });
    expect(useUiStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(useUiStore.getState().toasts).toHaveLength(0);
    vi.useRealTimers();
  });
});
