import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WaveformVisualizer } from "@/components/voice/waveform-visualizer";

describe("WaveformVisualizer", () => {
  it("renders 24 visualization bars", () => {
    const { container } = render(<WaveformVisualizer active={true} />);
    const bars = container.querySelectorAll("span");
    expect(bars.length).toBe(24);
  });

  it("renders within a container", () => {
    const { container } = render(<WaveformVisualizer active={false} />);
    expect(container.firstChild).toBeTruthy();
  });
});
