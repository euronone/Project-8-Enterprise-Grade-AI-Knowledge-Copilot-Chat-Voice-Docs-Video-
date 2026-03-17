import { describe, it, expect, vi } from "vitest";
import { captureException, captureMessage } from "@/lib/error-tracking";

describe("captureException", () => {
  it("does not throw on Error instances", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => captureException(new Error("test error"), { userId: "123" })).not.toThrow();
    spy.mockRestore();
  });

  it("does not throw on unknown error types", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => captureException("string error")).not.toThrow();
    spy.mockRestore();
  });
});

describe("captureMessage", () => {
  it("does not throw with info level", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(() => captureMessage("Test message", "info")).not.toThrow();
    spy.mockRestore();
  });

  it("does not throw with warning level", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    expect(() => captureMessage("Warning msg", "warning")).not.toThrow();
    spy.mockRestore();
  });
});
