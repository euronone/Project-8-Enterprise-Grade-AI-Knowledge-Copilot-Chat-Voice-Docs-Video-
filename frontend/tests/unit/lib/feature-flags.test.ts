import { describe, it, expect, vi, beforeEach } from "vitest";
import { isFeatureEnabled } from "@/lib/feature-flags";

describe("isFeatureEnabled", () => {
  it("returns true for known flags (default enabled)", () => {
    expect(isFeatureEnabled("voice")).toBe(true);
    expect(isFeatureEnabled("video")).toBe(true);
    expect(isFeatureEnabled("meetings")).toBe(true);
    expect(isFeatureEnabled("analytics")).toBe(true);
    expect(isFeatureEnabled("agents")).toBe(true);
    expect(isFeatureEnabled("workflows")).toBe(true);
    expect(isFeatureEnabled("billing")).toBe(true);
  });

  it("returns false for unknown flags", () => {
    expect(isFeatureEnabled("nonexistent")).toBe(false);
    expect(isFeatureEnabled("random_flag")).toBe(false);
  });
});
