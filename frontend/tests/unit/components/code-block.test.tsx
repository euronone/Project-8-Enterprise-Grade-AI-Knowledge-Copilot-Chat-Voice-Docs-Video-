import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "@/components/chat/code-block";

describe("CodeBlock", () => {
  it("renders the code content", () => {
    render(<CodeBlock code="console.log('hello')" language="javascript" />);
    expect(screen.getByText("console.log('hello')")).toBeInTheDocument();
  });

  it("renders the language label", () => {
    render(<CodeBlock code="print('hi')" language="python" />);
    expect(screen.getByText("python")).toBeInTheDocument();
  });

  it("renders a copy button", () => {
    render(<CodeBlock code="code" language="ts" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("shows 'Copied' after clicking copy button", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" language="ts" />);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copied/i })).toBeInTheDocument();
    });
  });
});
