import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/hooks/use-theme";
import { useUserStore } from "@/stores/user-store";

describe("useTheme", () => {
  beforeEach(() => {
    useUserStore.getState().reset();
    document.documentElement.classList.remove("dark", "high-contrast");
  });

  it("applies dark class when preference is dark", () => {
    act(() => {
      useUserStore.getState().updatePreferences({ theme: "dark" });
    });
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("applies high-contrast class when preference is high-contrast", () => {
    act(() => {
      useUserStore.getState().updatePreferences({ theme: "high-contrast" });
    });
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains("high-contrast")).toBe(true);
  });

  it("removes dark class when preference is light", () => {
    document.documentElement.classList.add("dark");
    act(() => {
      useUserStore.getState().updatePreferences({ theme: "light" });
    });
    renderHook(() => useTheme());
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });
});
