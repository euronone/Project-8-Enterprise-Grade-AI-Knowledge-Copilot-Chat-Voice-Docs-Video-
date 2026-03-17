import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "@/stores/user-store";

describe("useUserStore", () => {
  beforeEach(() => {
    useUserStore.getState().reset();
  });

  it("has null user by default", () => {
    expect(useUserStore.getState().user).toBeNull();
  });

  it("has default preferences", () => {
    const prefs = useUserStore.getState().preferences;
    expect(prefs.theme).toBe("system");
    expect(prefs.language).toBe("en");
    expect(prefs.notifications.email).toBe(true);
    expect(prefs.sidebarCollapsed).toBe(false);
    expect(prefs.fontSize).toBe("md");
  });

  it("setUser updates user", () => {
    const user = { id: "u1", name: "John", email: "john@test.com" } as any;
    useUserStore.getState().setUser(user);
    expect(useUserStore.getState().user).toEqual(user);
  });

  it("setUser can clear user to null", () => {
    useUserStore.getState().setUser({ id: "u1" } as any);
    useUserStore.getState().setUser(null);
    expect(useUserStore.getState().user).toBeNull();
  });

  it("updatePreferences merges partial preferences", () => {
    useUserStore.getState().updatePreferences({ theme: "dark", fontSize: "lg" });
    const prefs = useUserStore.getState().preferences;
    expect(prefs.theme).toBe("dark");
    expect(prefs.fontSize).toBe("lg");
    expect(prefs.language).toBe("en"); // unchanged
  });

  it("reset restores default state", () => {
    useUserStore.getState().setUser({ id: "u1" } as any);
    useUserStore.getState().updatePreferences({ theme: "dark" });
    useUserStore.getState().reset();
    expect(useUserStore.getState().user).toBeNull();
    expect(useUserStore.getState().preferences.theme).toBe("system");
  });
});
