"use client";

import { useClipboard } from "@/hooks/use-clipboard";
import { Button } from "@/components/ui";

export function CodeBlock({ code, language }: { code: string; language?: string }) {
  const { copied, copy } = useClipboard();

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="flex items-center justify-between bg-muted px-3 py-1.5 text-xs">
        <span>{language ?? "text"}</span>
        <Button variant="ghost" size="sm" onClick={() => void copy(code)}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="overflow-auto p-3 text-xs bg-card">
        <code>{code}</code>
      </pre>
    </div>
  );
}
