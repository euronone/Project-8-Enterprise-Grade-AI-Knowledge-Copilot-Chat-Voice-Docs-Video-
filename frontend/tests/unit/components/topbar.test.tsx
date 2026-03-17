import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Topbar } from "@/components/layout/topbar";
import { useUiStore } from "@/stores/ui-store";

describe("Topbar", () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: true, commandOpen: false, activeModal: null, toasts: [] });
  });

  it("renders the toggle sidebar button", () => {
    render(<Topbar />);
    expect(screen.getByLabelText("Toggle sidebar")).toBeInTheDocument();
  });

  it("renders the notifications button", () => {
    render(<Topbar />);
    expect(screen.getByLabelText("Notifications")).toBeInTheDocument();
  });

  it("toggles sidebar on button click", async () => {
    const user = userEvent.setup();
    render(<Topbar />);
    expect(useUiStore.getState().sidebarOpen).toBe(true);
    await user.click(screen.getByLabelText("Toggle sidebar"));
    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it("renders search placeholder text", () => {
    render(<Topbar />);
    expect(screen.getByText(/Search knowledge/)).toBeInTheDocument();
  });
});
