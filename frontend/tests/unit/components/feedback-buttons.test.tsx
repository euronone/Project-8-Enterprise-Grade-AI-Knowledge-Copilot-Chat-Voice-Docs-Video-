import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FeedbackButtons } from "@/components/chat/feedback-buttons";

vi.mock("@/lib/api-client", () => ({
  apiClient: { post: vi.fn().mockResolvedValue({}) },
}));

describe("FeedbackButtons", () => {
  it("renders two icon buttons", () => {
    render(<FeedbackButtons messageId="msg-1" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
  });

  it("clicking first button (thumbs up) changes variant", async () => {
    const user = userEvent.setup();
    render(<FeedbackButtons messageId="msg-1" />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[0]);
    expect(buttons[0].className).toContain("secondary");
  });

  it("clicking second button (thumbs down) changes variant", async () => {
    const user = userEvent.setup();
    render(<FeedbackButtons messageId="msg-1" />);
    const buttons = screen.getAllByRole("button");
    await user.click(buttons[1]);
    expect(buttons[1].className).toContain("secondary");
  });
});
