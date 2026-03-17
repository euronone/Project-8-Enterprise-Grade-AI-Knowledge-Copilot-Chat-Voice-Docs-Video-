import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UploadZone } from "@/components/knowledge/upload-zone";

describe("UploadZone", () => {
  const mockSelect = vi.fn();

  it("renders the upload zone container", () => {
    render(<UploadZone onSelect={mockSelect} />);
    expect(screen.getByText(/drag|drop|upload|browse/i)).toBeInTheDocument();
  });

  it("renders a file input", () => {
    const { container } = render(<UploadZone onSelect={mockSelect} />);
    const fileInput = container.querySelector("input[type='file']");
    expect(fileInput).toBeInTheDocument();
  });

  it("accepts file uploads", async () => {
    const { container } = render(<UploadZone onSelect={mockSelect} />);
    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["content"], "test.pdf", { type: "application/pdf" });
    await userEvent.upload(fileInput, file);
    expect(mockSelect).toHaveBeenCalled();
  });
});
