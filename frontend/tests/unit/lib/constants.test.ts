import { describe, it, expect } from "vitest";
import {
  APP_NAME,
  APP_DESCRIPTION,
  ROUTES,
  AI_MODELS,
  SUPPORTED_FILE_TYPES,
  PAGINATION,
  QUERY_KEYS,
  KEYBOARD_SHORTCUTS,
  COLORS,
  MAX_FILE_SIZE,
  TOAST_DURATION,
} from "@/lib/constants";

describe("Constants", () => {
  it("APP_NAME is defined", () => {
    expect(APP_NAME).toBe("KnowledgeForge");
  });

  it("APP_DESCRIPTION is defined", () => {
    expect(APP_DESCRIPTION).toBe("Enterprise AI Knowledge Copilot");
  });

  it("ROUTES contains all expected paths", () => {
    expect(ROUTES.LOGIN).toBe("/login");
    expect(ROUTES.DASHBOARD).toBe("/home");
    expect(ROUTES.CHAT).toBe("/chat");
    expect(ROUTES.VOICE).toBe("/voice");
    expect(ROUTES.MEETINGS).toBe("/meetings");
    expect(ROUTES.KNOWLEDGE_BASE).toBe("/knowledge-base");
    expect(ROUTES.SEARCH).toBe("/search");
    expect(ROUTES.ADMIN).toBe("/admin");
  });

  it("AI_MODELS has expected entries", () => {
    expect(AI_MODELS.length).toBeGreaterThanOrEqual(2);
    const ids = AI_MODELS.map((m) => m.id);
    expect(ids).toContain("claude-sonnet-4-6");
    expect(ids).toContain("gpt-4o");
  });

  it("SUPPORTED_FILE_TYPES has document types", () => {
    expect(SUPPORTED_FILE_TYPES.documents).toContain(".pdf");
    expect(SUPPORTED_FILE_TYPES.documents).toContain(".docx");
  });

  it("SUPPORTED_FILE_TYPES has image types", () => {
    expect(SUPPORTED_FILE_TYPES.images).toContain(".jpg");
    expect(SUPPORTED_FILE_TYPES.images).toContain(".png");
  });

  it("PAGINATION has expected defaults", () => {
    expect(PAGINATION.DEFAULT_PAGE_SIZE).toBe(20);
    expect(PAGINATION.PAGE_SIZES).toContain(10);
    expect(PAGINATION.PAGE_SIZES).toContain(100);
  });

  it("QUERY_KEYS has expected keys", () => {
    expect(QUERY_KEYS.CONVERSATIONS).toBe("conversations");
    expect(QUERY_KEYS.MESSAGES).toBe("messages");
    expect(QUERY_KEYS.DOCUMENTS).toBe("documents");
  });

  it("KEYBOARD_SHORTCUTS are defined", () => {
    expect(KEYBOARD_SHORTCUTS.SEARCH).toBe("mod+k");
    expect(KEYBOARD_SHORTCUTS.NEW_CHAT).toBe("mod+n");
    expect(KEYBOARD_SHORTCUTS.TOGGLE_SIDEBAR).toBe("mod+b");
  });

  it("COLORS are defined", () => {
    expect(COLORS.BRAND_PRIMARY).toBe("#0ea5e9");
    expect(COLORS.ERROR).toBe("#ef4444");
  });

  it("MAX_FILE_SIZE is 500MB", () => {
    expect(MAX_FILE_SIZE).toBe(500 * 1024 * 1024);
  });

  it("TOAST_DURATION is 4000ms", () => {
    expect(TOAST_DURATION).toBe(4000);
  });
});
