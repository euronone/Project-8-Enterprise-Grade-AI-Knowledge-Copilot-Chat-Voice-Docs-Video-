import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageHeader } from "@/components/shared/page-header";

describe("PageHeader", () => {
  it("renders the title", () => {
    render(<PageHeader title="Dashboard" />);
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<PageHeader title="Dashboard" description="Overview of your workspace" />);
    expect(screen.getByText("Overview of your workspace")).toBeInTheDocument();
  });

  it("renders action children when provided", () => {
    render(
      <PageHeader title="Documents" actions={<button>Upload</button>} />
    );
    expect(screen.getByRole("button", { name: "Upload" })).toBeInTheDocument();
  });

  it("does not render description element when not provided", () => {
    render(<PageHeader title="Test" />);
    const desc = screen.queryByText("Overview");
    expect(desc).toBeNull();
  });
});
