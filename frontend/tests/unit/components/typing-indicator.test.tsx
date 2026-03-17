import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TypingIndicator } from "@/components/chat/typing-indicator";

describe("TypingIndicator", () => {
  it("renders the typing indicator", () => {
    render(<TypingIndicator />);
    const el = screen.getByTestId ? screen.queryByTestId("typing-indicator") : null;
    // The component renders animated dots
    const { container } = render(<TypingIndicator />);
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBeGreaterThanOrEqual(3);
  });

  it("renders within a styled container", () => {
    const { container } = render(<TypingIndicator />);
    expect(container.firstChild).toBeTruthy();
  });
});
