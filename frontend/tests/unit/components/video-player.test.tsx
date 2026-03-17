import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VideoPlayer } from "@/components/video/video-player";

describe("VideoPlayer", () => {
  it("renders the video player container", () => {
    const { container } = render(<VideoPlayer />);
    expect(container.firstChild).toBeTruthy();
  });

  it("displays 'Video Player' heading", () => {
    render(<VideoPlayer />);
    expect(screen.getByText("Video Player")).toBeInTheDocument();
  });
});
