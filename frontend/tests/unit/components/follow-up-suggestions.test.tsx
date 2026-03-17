import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FollowUpSuggestions } from "@/components/chat/follow-up-suggestions";

describe("FollowUpSuggestions", () => {
  const suggestions = ["Tell me more", "Show examples", "Explain differently"];
  const mockSelect = vi.fn();

  it("renders all suggestion buttons", () => {
    render(<FollowUpSuggestions suggestions={suggestions} onSelect={mockSelect} />);
    expect(screen.getByText("Tell me more")).toBeInTheDocument();
    expect(screen.getByText("Show examples")).toBeInTheDocument();
    expect(screen.getByText("Explain differently")).toBeInTheDocument();
  });

  it("calls onSelect with suggestion text", async () => {
    const user = userEvent.setup();
    render(<FollowUpSuggestions suggestions={suggestions} onSelect={mockSelect} />);
    await user.click(screen.getByText("Tell me more"));
    expect(mockSelect).toHaveBeenCalledWith("Tell me more");
  });

  it("renders nothing when suggestions are empty", () => {
    const { container } = render(<FollowUpSuggestions suggestions={[]} onSelect={mockSelect} />);
    expect(container.firstChild).toBeNull();
  });
});
