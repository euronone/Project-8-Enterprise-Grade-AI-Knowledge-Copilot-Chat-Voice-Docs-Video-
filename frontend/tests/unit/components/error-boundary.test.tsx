import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@/components/shared/error-boundary";

describe("ErrorBoundary", () => {
  // Suppress console.error for error boundary tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args: unknown[]) => {
      if (typeof args[0] === "string" && args[0].includes("Error boundary caught")) return;
      originalError(...args);
    };
  });
  afterAll(() => {
    console.error = originalError;
  });

  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders error UI when child throws", () => {
    function Bomb(): JSX.Element {
      throw new Error("Boom!");
    }

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows a retry button in error state", () => {
    function Bomb(): JSX.Element {
      throw new Error("Boom!");
    }

    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByRole("button", { name: /retry|try again/i })).toBeInTheDocument();
  });
});
