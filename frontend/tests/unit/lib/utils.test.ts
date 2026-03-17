import { describe, it, expect } from "vitest";
import {
  cn,
  formatBytes,
  truncate,
  slugify,
  generateId,
  capitalize,
  groupBy,
  isValidUrl,
  getInitials,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-4", "py-2")).toBe("px-4 py-2");
  });
  it("deduplicates tailwind utilities", () => {
    expect(cn("px-4", "px-2")).toBe("px-2");
  });
  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "extra")).toBe("base extra");
  });
});

describe("formatBytes", () => {
  it("returns '0 B' for zero", () => {
    expect(formatBytes(0)).toBe("0 B");
  });
  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1 KB");
  });
  it("formats megabytes with decimals", () => {
    expect(formatBytes(1_500_000, 1)).toBe("1.4 MB");
  });
  it("formats gigabytes", () => {
    expect(formatBytes(1_073_741_824)).toBe("1 GB");
  });
});

describe("truncate", () => {
  it("returns short strings unchanged", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });
  it("truncates with ellipsis", () => {
    expect(truncate("hello world this is long", 10)).toBe("hello w...");
  });
  it("handles exact length", () => {
    expect(truncate("exact", 5)).toBe("exact");
  });
});

describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });
  it("removes special characters", () => {
    expect(slugify("Test! @Page#")).toBe("test-page");
  });
  it("trims leading/trailing dashes", () => {
    expect(slugify("--hello--")).toBe("hello");
  });
});

describe("generateId", () => {
  it("returns a non-empty string", () => {
    expect(generateId().length).toBeGreaterThan(0);
  });
  it("generates unique ids", () => {
    const ids = new Set(Array.from({ length: 100 }, generateId));
    expect(ids.size).toBe(100);
  });
});

describe("capitalize", () => {
  it("capitalizes first letter", () => {
    expect(capitalize("hello")).toBe("Hello");
  });
  it("lowercases rest", () => {
    expect(capitalize("WORLD")).toBe("World");
  });
});

describe("groupBy", () => {
  it("groups items by key", () => {
    const data = [
      { type: "a", val: 1 },
      { type: "b", val: 2 },
      { type: "a", val: 3 },
    ];
    const result = groupBy(data, "type");
    expect(result["a"]).toHaveLength(2);
    expect(result["b"]).toHaveLength(1);
  });
});

describe("isValidUrl", () => {
  it("validates http urls", () => {
    expect(isValidUrl("https://example.com")).toBe(true);
  });
  it("rejects invalid strings", () => {
    expect(isValidUrl("not a url")).toBe(false);
  });
});

describe("getInitials", () => {
  it("extracts two initials", () => {
    expect(getInitials("John Doe")).toBe("JD");
  });
  it("handles single name", () => {
    expect(getInitials("Admin")).toBe("A");
  });
  it("caps at two characters", () => {
    expect(getInitials("John Michael Doe")).toBe("JM");
  });
});
