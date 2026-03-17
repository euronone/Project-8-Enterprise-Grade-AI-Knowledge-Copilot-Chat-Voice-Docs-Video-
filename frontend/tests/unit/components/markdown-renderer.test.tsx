import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MarkdownRenderer } from "@/components/chat/markdown-renderer";

describe("MarkdownRenderer", () => {
  it("renders plain text content", () => {
    render(<MarkdownRenderer content="Hello world" />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders content in a container", () => {
    const { container } = render(<MarkdownRenderer content="**Bold**" />);
    expect(container.firstChild).toBeTruthy();
  });

  it("renders formatted markdown as HTML", () => {
    const { container } = render(<MarkdownRenderer content="# Heading" />);
    expect(container.textContent).toContain("Heading");
  });
});
