import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatRelative,
  formatDateTime,
  formatDuration,
  formatDurationMs,
  formatNumber,
  formatCompact,
  formatCurrency,
  formatPercentage,
  formatTokenCount,
} from "@/lib/formatters";

describe("formatDate", () => {
  it("formats ISO date to default format", () => {
    const result = formatDate("2024-03-15T10:30:00Z");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });

  it("formats with custom format string", () => {
    const result = formatDate("2024-01-01T00:00:00Z", "yyyy-MM-dd");
    expect(result).toBe("2024-01-01");
  });

  it("returns original string on invalid date", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("formatRelative", () => {
  it("returns a relative time string", () => {
    const recent = new Date(Date.now() - 60_000).toISOString();
    expect(formatRelative(recent)).toContain("ago");
  });

  it("returns original on invalid date", () => {
    expect(formatRelative("bad")).toBe("bad");
  });
});

describe("formatDateTime", () => {
  it("formats date and time", () => {
    const result = formatDateTime("2024-06-15T14:30:00Z");
    expect(result).toContain("Jun");
    expect(result).toContain("15");
    expect(result).toContain("2024");
  });
});

describe("formatDuration", () => {
  it("formats seconds to m:ss", () => {
    expect(formatDuration(90)).toBe("1:30");
  });

  it("formats hours to h:mm:ss", () => {
    expect(formatDuration(3661)).toBe("1:01:01");
  });

  it("formats zero seconds", () => {
    expect(formatDuration(0)).toBe("0:00");
  });
});

describe("formatDurationMs", () => {
  it("converts ms to formatted duration", () => {
    expect(formatDurationMs(90000)).toBe("1:30");
  });
});

describe("formatNumber", () => {
  it("formats number with no decimals by default", () => {
    expect(formatNumber(1234)).toBe("1,234");
  });

  it("formats with specified decimals", () => {
    expect(formatNumber(1234.567, 2)).toBe("1,234.57");
  });
});

describe("formatCompact", () => {
  it("formats large numbers with compact notation", () => {
    const result = formatCompact(1500000);
    expect(result).toMatch(/1\.5M|1,500K/);
  });

  it("formats small numbers normally", () => {
    expect(formatCompact(42)).toBe("42");
  });
});

describe("formatCurrency", () => {
  it("formats USD by default", () => {
    const result = formatCurrency(99.99);
    expect(result).toContain("$");
    expect(result).toContain("99.99");
  });

  it("formats other currencies", () => {
    const result = formatCurrency(50, "EUR");
    expect(result).toContain("€");
  });
});

describe("formatPercentage", () => {
  it("formats decimal as percentage", () => {
    expect(formatPercentage(0.856)).toBe("85.6%");
  });

  it("formats with specified decimals", () => {
    expect(formatPercentage(0.5, 0)).toBe("50%");
  });
});

describe("formatTokenCount", () => {
  it("formats millions", () => {
    expect(formatTokenCount(1_500_000)).toBe("1.5M tokens");
  });

  it("formats thousands", () => {
    expect(formatTokenCount(4_500)).toBe("4.5K tokens");
  });

  it("formats small numbers", () => {
    expect(formatTokenCount(100)).toBe("100 tokens");
  });
});
