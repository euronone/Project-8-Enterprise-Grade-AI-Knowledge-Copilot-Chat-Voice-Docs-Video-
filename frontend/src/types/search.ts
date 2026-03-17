import type { ID, Timestamp } from "./common";

export interface SearchQuery {
  q: string;
  filters?: SearchFilters;
  mode: "hybrid" | "semantic" | "fulltext";
  page?: number;
  pageSize?: number;
}

export interface SearchFilters {
  types?: string[];
  collectionIds?: string[];
  sources?: string[];
  dateFrom?: string;
  dateTo?: string;
  authors?: string[];
  tags?: string[];
  languages?: string[];
}

export interface SearchResult {
  id: ID;
  documentId: ID;
  title: string;
  snippet: string;
  score: number;
  highlights: string[];
  type: string;
  source: string;
  url?: string;
  author?: string;
  createdAt: Timestamp;
  tags: string[];
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  took: number;
  facets: SearchFacets;
}

export interface SearchFacets {
  types: FacetBucket[];
  sources: FacetBucket[];
  authors: FacetBucket[];
  tags: FacetBucket[];
}

export interface FacetBucket {
  value: string;
  count: number;
  label: string;
}

export interface SearchSuggestion {
  text: string;
  type: "query" | "document" | "collection";
  score: number;
}

export interface SavedSearch {
  id: ID;
  name: string;
  query: SearchQuery;
  alertEnabled: boolean;
  alertFrequency?: "immediate" | "daily" | "weekly";
  userId: ID;
  createdAt: Timestamp;
}

export interface SearchAnalytics {
  topQueries: Array<{ query: string; count: number; avgRank: number }>;
  zeroResultQueries: Array<{ query: string; count: number }>;
  searchVolume: Array<{ date: string; count: number }>;
  clickThroughRate: number;
  avgResponseTime: number;
}
