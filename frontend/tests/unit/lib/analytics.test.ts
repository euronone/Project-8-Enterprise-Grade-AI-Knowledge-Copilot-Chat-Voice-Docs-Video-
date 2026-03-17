import { describe, it, expect, vi } from "vitest";
import { trackEvent, Events } from "@/lib/analytics";

describe("trackEvent", () => {
  it("does not throw when called", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
    expect(() => trackEvent({ name: "test_event", properties: { page: "home" } })).not.toThrow();
    spy.mockRestore();
  });

  it("does not throw without properties", () => {
    const spy = vi.spyOn(console, "debug").mockImplementation(() => {});
    expect(() => trackEvent({ name: "safe_event" })).not.toThrow();
    spy.mockRestore();
  });
});

describe("Events", () => {
  it("has expected event names", () => {
    expect(Events.CHAT_SENT).toBe("chat_message_sent");
    expect(Events.VOICE_STARTED).toBe("voice_session_started");
    expect(Events.DOCUMENT_UPLOADED).toBe("document_uploaded");
    expect(Events.SEARCH_PERFORMED).toBe("search_performed");
    expect(Events.LOGIN).toBe("user_login");
    expect(Events.LOGOUT).toBe("user_logout");
    expect(Events.ERROR_OCCURRED).toBe("error_occurred");
  });
});
