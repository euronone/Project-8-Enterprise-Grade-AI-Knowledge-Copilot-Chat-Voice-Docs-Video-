import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "@/hooks/use-clipboard";

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe("useClipboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with copied as false", () => {
    const { result } = renderHook(() => useClipboard());
    expect(result.current.copied).toBe(false);
  });

  it("sets copied to true after calling copy", async () => {
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy("hello");
    });
    expect(result.current.copied).toBe(true);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello");
  });

  it("resets copied after timeout", async () => {
    const { result } = renderHook(() => useClipboard());
    await act(async () => {
      await result.current.copy("test");
    });
    expect(result.current.copied).toBe(true);
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(result.current.copied).toBe(false);
  });
});
