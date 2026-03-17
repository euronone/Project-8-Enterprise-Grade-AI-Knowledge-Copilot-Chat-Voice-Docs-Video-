import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "@/components/ui/textarea";

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Enter message" />);
    expect(screen.getByPlaceholderText("Enter message")).toBeInTheDocument();
  });

  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Textarea placeholder="Type" />);
    const ta = screen.getByPlaceholderText("Type");
    await user.type(ta, "hello world");
    expect(ta).toHaveValue("hello world");
  });

  it("applies custom className", () => {
    render(<Textarea className="h-40" data-testid="ta" />);
    expect(screen.getByTestId("ta").className).toContain("h-40");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Textarea disabled data-testid="ta" />);
    expect(screen.getByTestId("ta")).toBeDisabled();
  });
});
