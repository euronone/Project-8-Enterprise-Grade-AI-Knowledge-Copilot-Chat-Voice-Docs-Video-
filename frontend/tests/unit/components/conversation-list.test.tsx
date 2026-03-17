import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConversationList } from "@/components/chat/conversation-list";

describe("ConversationList", () => {
  const conversations = [
    { id: "1", title: "First conversation", updatedAt: "2024-01-01T00:00:00Z" },
    { id: "2", title: "Second conversation", updatedAt: "2024-01-02T00:00:00Z" },
  ];

  const mockSelect = vi.fn();

  it("renders conversation items", () => {
    render(<ConversationList conversations={conversations} activeId={null} onSelect={mockSelect} />);
    expect(screen.getByText("First conversation")).toBeInTheDocument();
    expect(screen.getByText("Second conversation")).toBeInTheDocument();
  });

  it("calls onSelect when clicking a conversation", async () => {
    const user = userEvent.setup();
    render(<ConversationList conversations={conversations} activeId={null} onSelect={mockSelect} />);
    await user.click(screen.getByText("First conversation"));
    expect(mockSelect).toHaveBeenCalledWith("1");
  });

  it("highlights the active conversation", () => {
    const { container } = render(<ConversationList conversations={conversations} activeId="1" onSelect={mockSelect} />);
    const buttons = container.querySelectorAll("button");
    const activeBtn = Array.from(buttons).find((b) => b.textContent?.includes("First"));
    expect(activeBtn?.className).toContain("bg-primary");
  });

  it("renders empty div when no conversations", () => {
    const { container } = render(<ConversationList conversations={[]} activeId={null} onSelect={mockSelect} />);
    expect(container.querySelectorAll("button")).toHaveLength(0);
  });
});
