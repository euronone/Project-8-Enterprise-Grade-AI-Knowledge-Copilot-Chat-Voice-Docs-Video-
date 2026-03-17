"use client";

import { useState } from "react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui";
import { apiClient } from "@/lib/api-client";

export function FeedbackButtons({ messageId }: { messageId: string }) {
  const [value, setValue] = useState<"thumbs_up" | "thumbs_down" | null>(null);

  const submit = async (rating: "thumbs_up" | "thumbs_down") => {
    setValue(rating);
    try {
      await apiClient.post(`/chat/messages/${messageId}/feedback`, { rating });
    } catch {
      // optimistic UI only
    }
  };

  return (
    <div className="mt-3 flex items-center gap-1">
      <Button
        variant={value === "thumbs_up" ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => submit("thumbs_up")}
      >
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button
        variant={value === "thumbs_down" ? "secondary" : "ghost"}
        size="icon"
        className="h-8 w-8"
        onClick={() => submit("thumbs_down")}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
}
