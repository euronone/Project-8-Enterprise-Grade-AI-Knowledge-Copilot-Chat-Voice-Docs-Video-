import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

describe("useKeyboardShortcuts", () => {
  const addListenerSpy = vi.spyOn(document, "addEventListener");
  const removeListenerSpy = vi.spyOn(document, "removeEventListener");

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("registers keydown event listener", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts([{ keys: "mod+k", handler, enabled: true }])
    );
    expect(addListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("cleans up listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() =>
      useKeyboardShortcuts([{ keys: "mod+k", handler, enabled: true }])
    );
    unmount();
    expect(removeListenerSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  it("calls handler on matching key combo", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts([{ keys: "mod+k", handler, enabled: true }])
    );
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
    document.dispatchEvent(event);
    expect(handler).toHaveBeenCalled();
  });

  it("does not call handler when disabled", () => {
    const handler = vi.fn();
    renderHook(() =>
      useKeyboardShortcuts([{ keys: "mod+k", handler, enabled: false }])
    );
    const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true });
    document.dispatchEvent(event);
    expect(handler).not.toHaveBeenCalled();
  });
});
