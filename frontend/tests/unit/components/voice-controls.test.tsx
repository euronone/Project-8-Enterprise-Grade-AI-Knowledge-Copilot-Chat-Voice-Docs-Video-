import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceControls } from "@/components/voice/voice-controls";

describe("VoiceControls", () => {
  const mockStart = vi.fn();
  const mockStop = vi.fn();

  it("renders start button when not listening", () => {
    render(<VoiceControls isListening={false} onStart={mockStart} onStop={mockStop} />);
    expect(screen.getByRole("button", { name: /start listening/i })).toBeInTheDocument();
  });

  it("calls onStart when start button clicked", async () => {
    const user = userEvent.setup();
    render(<VoiceControls isListening={false} onStart={mockStart} onStop={mockStop} />);
    await user.click(screen.getByRole("button", { name: /start listening/i }));
    expect(mockStart).toHaveBeenCalled();
  });

  it("renders stop button when listening", () => {
    render(<VoiceControls isListening={true} onStart={mockStart} onStop={mockStop} />);
    expect(screen.getByRole("button", { name: /stop listening/i })).toBeInTheDocument();
  });
});
