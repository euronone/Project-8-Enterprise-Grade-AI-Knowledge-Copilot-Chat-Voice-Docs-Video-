import { describe, it, expect, beforeEach } from "vitest";
import { useSearchStore } from "@/stores/search-store";

describe("useSearchStore", () => {
  beforeEach(() => {
    useSearchStore.getState().reset();
  });

  it("has correct initial state", () => {
    const state = useSearchStore.getState();
    expect(state.query).toBe("");
    expect(state.filters).toEqual({});
    expect(state.mode).toBe("hybrid");
    expect(state.isSearching).toBe(false);
    expect(state.suggestions).toEqual([]);
  });

  it("setQuery updates query", () => {
    useSearchStore.getState().setQuery("test query");
    expect(useSearchStore.getState().query).toBe("test query");
  });

  it("setFilters updates filters", () => {
    useSearchStore.getState().setFilters({ type: "document", source: "wiki" } as any);
    expect(useSearchStore.getState().filters).toEqual({ type: "document", source: "wiki" });
  });

  it("setMode updates search mode", () => {
    useSearchStore.getState().setMode("semantic");
    expect(useSearchStore.getState().mode).toBe("semantic");
  });

  it("setSearching toggles searching state", () => {
    useSearchStore.getState().setSearching(true);
    expect(useSearchStore.getState().isSearching).toBe(true);
  });

  it("setSuggestions updates suggestions", () => {
    useSearchStore.getState().setSuggestions(["suggestion1", "suggestion2"]);
    expect(useSearchStore.getState().suggestions).toEqual(["suggestion1", "suggestion2"]);
  });

  it("toSearchQuery returns structured search query", () => {
    useSearchStore.getState().setQuery("hello");
    useSearchStore.getState().setMode("fulltext");
    const result = useSearchStore.getState().toSearchQuery();
    expect(result).toEqual({ q: "hello", filters: {}, mode: "fulltext" });
  });

  it("reset restores initial state", () => {
    useSearchStore.getState().setQuery("something");
    useSearchStore.getState().setMode("semantic");
    useSearchStore.getState().setSuggestions(["a", "b"]);
    useSearchStore.getState().reset();
    expect(useSearchStore.getState().query).toBe("");
    expect(useSearchStore.getState().mode).toBe("hybrid");
    expect(useSearchStore.getState().suggestions).toEqual([]);
  });
});
