import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Type here" />);
    const input = screen.getByPlaceholderText("Type here");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });

  it("respects type prop", () => {
    render(<Input type="email" data-testid="email" />);
    expect(screen.getByTestId("email")).toHaveAttribute("type", "email");
  });

  it("applies custom className", () => {
    render(<Input className="w-64" data-testid="inp" />);
    expect(screen.getByTestId("inp").className).toContain("w-64");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled data-testid="inp" />);
    expect(screen.getByTestId("inp")).toBeDisabled();
  });

  it("forwards data attributes", () => {
    render(<Input data-testid="custom" />);
    expect(screen.getByTestId("custom")).toBeInTheDocument();
  });
});
