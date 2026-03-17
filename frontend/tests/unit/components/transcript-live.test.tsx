import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TranscriptLive } from "@/components/voice/transcript-live";

describe("TranscriptLive", () => {
  it("renders transcript text", () => {
    render(<TranscriptLive transcript="Hello world" interim="" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders interim transcript", () => {
    render(<TranscriptLive transcript="Hello" interim=" typing..." />);
    expect(screen.getByText(/typing/)).toBeInTheDocument();
  });

  it("shows default text when transcript is empty", () => {
    render(<TranscriptLive transcript="" interim="" />);
    expect(screen.getByText(/start speaking/i)).toBeInTheDocument();
  });
});
