"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchBar } from "@/components/search/search-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enterprise Search"
        description="Hybrid semantic and full-text retrieval across documents, chats, meetings, and videos."
      />
      <SearchBar value={query} onChange={setQuery} />
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {query ? `Showing ranked results for: ${query}` : "Enter a query to search your enterprise knowledge graph."}
        </CardContent>
      </Card>
    </div>
  );
}
