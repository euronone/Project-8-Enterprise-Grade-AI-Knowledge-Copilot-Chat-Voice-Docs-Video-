import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "@/components/chat/chat-input";

describe("ChatInput", () => {
  const mockSend = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders a textarea", () => {
    render(<ChatInput onSend={mockSend} />);
    expect(screen.getByPlaceholderText(/ask about/i)).toBeInTheDocument();
  });

  it("renders a send button", () => {
    render(<ChatInput onSend={mockSend} />);
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockSend} />);
    const textarea = screen.getByPlaceholderText(/ask about/i);
    await user.type(textarea, "Hello");
    expect(textarea).toHaveValue("Hello");
  });

  it("calls onSend and clears input on send button click", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockSend} />);
    const textarea = screen.getByPlaceholderText(/ask about/i);
    await user.type(textarea, "Hello world");
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(mockSend).toHaveBeenCalledWith("Hello world");
    expect(textarea).toHaveValue("");
  });

  it("does not send empty messages", () => {
    render(<ChatInput onSend={mockSend} />);
    const sendBtn = screen.getByRole("button", { name: /send/i });
    expect(sendBtn).toBeDisabled();
  });

  it("disables send button when disabled prop is true", () => {
    render(<ChatInput onSend={mockSend} disabled />);
    expect(screen.getByRole("button", { name: /send/i })).toBeDisabled();
  });
});
