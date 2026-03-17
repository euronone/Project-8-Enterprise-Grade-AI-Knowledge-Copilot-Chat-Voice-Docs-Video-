import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/layout/footer";

describe("Footer", () => {
  it("renders the product name", () => {
    render(<Footer />);
    expect(screen.getByText("KnowledgeForge AI Copilot")).toBeInTheDocument();
  });

  it("renders the edition text", () => {
    render(<Footer />);
    expect(screen.getByText("Enterprise Edition")).toBeInTheDocument();
  });

  it("renders a footer element", () => {
    const { container } = render(<Footer />);
    expect(container.querySelector("footer")).toBeInTheDocument();
  });
});
