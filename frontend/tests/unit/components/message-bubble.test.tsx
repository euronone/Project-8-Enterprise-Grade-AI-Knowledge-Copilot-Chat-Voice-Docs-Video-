import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MessageBubble } from "@/components/chat/message-bubble";

describe("MessageBubble", () => {
  const userMsg = {
    id: "1",
    role: "user" as const,
    content: "Hello, how are you?",
    createdAt: new Date().toISOString(),
  };

  const assistantMsg = {
    id: "2",
    role: "assistant" as const,
    content: "I am doing well, thank you!",
    createdAt: new Date().toISOString(),
  };

  it("renders user message content", () => {
    render(<MessageBubble message={userMsg} />);
    expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
  });

  it("renders assistant message content", () => {
    render(<MessageBubble message={assistantMsg} />);
    expect(screen.getByText("I am doing well, thank you!")).toBeInTheDocument();
  });

  it("applies different alignment for user vs assistant", () => {
    const { rerender, container } = render(<MessageBubble message={userMsg} />);
    const userWrapper = container.firstChild as HTMLElement;
    expect(userWrapper.className).toContain("justify-end");

    rerender(<MessageBubble message={assistantMsg} />);
    const assistantWrapper = container.firstChild as HTMLElement;
    expect(assistantWrapper.className).not.toContain("justify-end");
  });
});
