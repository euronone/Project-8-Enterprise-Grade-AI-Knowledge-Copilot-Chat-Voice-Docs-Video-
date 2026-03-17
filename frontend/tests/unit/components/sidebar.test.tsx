import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

let mockPathname = "/home";

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

import { Sidebar } from "@/components/layout/sidebar";
import { useUiStore } from "@/stores/ui-store";

describe("Sidebar", () => {
  beforeEach(() => {
    mockPathname = "/home";
    useUiStore.setState({ sidebarOpen: true });
  });

  it("renders all navigation items", () => {
    render(<Sidebar />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Chat")).toBeInTheDocument();
    expect(screen.getByText("Voice")).toBeInTheDocument();
    expect(screen.getByText("Meetings")).toBeInTheDocument();
    expect(screen.getByText("Knowledge")).toBeInTheDocument();
    expect(screen.getByText("Video")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText("Agents")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
  });

  it("renders navigation links with correct hrefs", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/home");
    expect(hrefs).toContain("/chat");
    expect(hrefs).toContain("/admin");
  });

  it("shows brand title when expanded", () => {
    render(<Sidebar />);
    expect(screen.getByText("KnowledgeForge")).toBeInTheDocument();
  });

  it("hides labels when collapsed", () => {
    useUiStore.setState({ sidebarOpen: false });
    render(<Sidebar />);
    expect(screen.queryByText("Home")).not.toBeInTheDocument();
    expect(screen.queryByText("KnowledgeForge")).not.toBeInTheDocument();
  });

  it("highlights active route", () => {
    mockPathname = "/chat";
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    const chatLink = links.find((l) => l.getAttribute("href") === "/chat");
    expect(chatLink?.className).toContain("bg-primary");
  });

  it("renders 11 navigation items", () => {
    render(<Sidebar />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(11);
  });
});
