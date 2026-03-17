"use client";

import { Button } from "@/components/ui";

export function FollowUpSuggestions({
  suggestions,
  onSelect,
}: {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}) {
  if (!suggestions.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <Button key={suggestion} variant="outline" size="sm" onClick={() => onSelect(suggestion)}>
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
