import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "@/hooks/use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns default value when no stored value exists", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("default");
  });

  it("returns stored value when it exists", () => {
    localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "default"));
    expect(result.current[0]).toBe("stored");
  });

  it("updates stored value on setValue", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    act(() => {
      result.current[1]("updated");
    });
    expect(result.current[0]).toBe("updated");
    expect(JSON.parse(localStorage.getItem("test-key")!)).toBe("updated");
  });

  it("handles object values", () => {
    const { result } = renderHook(() => useLocalStorage("obj-key", { a: 1 }));
    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });
    expect(result.current[0]).toEqual({ a: 2, b: 3 });
  });

  it("handles invalid JSON in localStorage gracefully", () => {
    localStorage.setItem("broken", "not-json");
    const { result } = renderHook(() => useLocalStorage("broken", "fallback"));
    expect(result.current[0]).toBe("fallback");
  });
});
