import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/search/search-bar";

describe("SearchBar", () => {
  const mockChange = vi.fn();

  it("renders the search input", () => {
    render(<SearchBar value="" onChange={mockChange} />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={mockChange} />);
    const input = screen.getByPlaceholderText(/search/i);
    await user.type(input, "a");
    expect(mockChange).toHaveBeenCalled();
  });

  it("renders the search icon", () => {
    const { container } = render(<SearchBar value="" onChange={mockChange} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});
