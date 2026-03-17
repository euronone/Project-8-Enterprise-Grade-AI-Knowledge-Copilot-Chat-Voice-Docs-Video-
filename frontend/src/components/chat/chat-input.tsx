"use client";

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button, Textarea } from "@/components/ui";

export function ChatInput({ onSend, disabled }: { onSend: (text: string) => Promise<void> | void; disabled?: boolean }) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const text = value.trim();
    if (!text || disabled) return;
    setValue("");
    await onSend(text);
  };

  return (
    <div className="rounded-[14px] border border-[#374151] bg-[#1F2937] p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Ask about your company knowledge, docs, meetings, or code..."
        className="min-h-[90px] border-0 p-0 focus-visible:ring-0 bg-[#1F2937] text-[#F9FAFB] placeholder-[#6B7280]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
          }
        }}
      />
      <div className="mt-2 flex items-center justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Attach file">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Button onClick={() => void submit()} disabled={disabled || !value.trim()}>
          <Send className="mr-2 h-4 w-4" />
          Send
        </Button>
      </div>
    </div>
  );
}
