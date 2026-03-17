import { create } from "zustand";
import type { SearchQuery, SearchFilters } from "@/types/search";

interface SearchState {
  query: string;
  filters: SearchFilters;
  mode: "hybrid" | "semantic" | "fulltext";
  isSearching: boolean;
  suggestions: string[];

  setQuery: (q: string) => void;
  setFilters: (filters: SearchFilters) => void;
  setMode: (mode: "hybrid" | "semantic" | "fulltext") => void;
  setSearching: (v: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
  reset: () => void;
  toSearchQuery: () => SearchQuery;
}

export const useSearchStore = create<SearchState>((set, get) => ({
  query: "",
  filters: {},
  mode: "hybrid",
  isSearching: false,
  suggestions: [],

  setQuery: (query) => set({ query }),
  setFilters: (filters) => set({ filters }),
  setMode: (mode) => set({ mode }),
  setSearching: (isSearching) => set({ isSearching }),
  setSuggestions: (suggestions) => set({ suggestions }),
  reset: () => set({ query: "", filters: {}, mode: "hybrid", suggestions: [] }),
  toSearchQuery: () => {
    const { query, filters, mode } = get();
    return { q: query, filters, mode };
  },
}));
