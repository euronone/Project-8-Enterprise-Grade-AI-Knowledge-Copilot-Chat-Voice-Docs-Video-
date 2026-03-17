import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "@/components/ui/progress";

describe("Progress", () => {
  it("renders a progress bar", () => {
    const { container } = render(<Progress value={50} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("sets inner width based on value", () => {
    const { container } = render(<Progress value={75} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("75%");
  });

  it("clamps value to 0-100 range (low)", () => {
    const { container } = render(<Progress value={-10} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("0%");
  });

  it("clamps value to 0-100 range (high)", () => {
    const { container } = render(<Progress value={150} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("100%");
  });

  it("merges custom className", () => {
    const { container } = render(<Progress value={50} className="h-4" />);
    expect((container.firstChild as HTMLElement).className).toContain("h-4");
  });
});
