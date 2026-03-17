import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CitationCard } from "@/components/chat/citation-card";
import type { Citation } from "@/types/chat";

describe("CitationCard", () => {
  const citation: Citation = {
    id: "1",
    documentId: "doc-1",
    documentTitle: "Test Document",
    documentType: "pdf",
    chunk: "This is a relevant snippet from the document.",
    score: 0.95,
    url: "/documents/123",
  };

  it("renders the citation title", () => {
    render(<CitationCard citation={citation} />);
    expect(screen.getByText("Test Document")).toBeInTheDocument();
  });

  it("renders the snippet text", () => {
    render(<CitationCard citation={citation} />);
    expect(screen.getByText(/relevant snippet/)).toBeInTheDocument();
  });

  it("renders a link element", () => {
    render(<CitationCard citation={citation} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/documents/123");
  });

  it("renders the score badge", () => {
    render(<CitationCard citation={citation} />);
    expect(screen.getByText("95%")).toBeInTheDocument();
  });
});
