"use client";

import { Bell, Search, SidebarIcon, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";
import { useUiStore } from "@/stores/ui-store";

export function Topbar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="topbar">
      {/* Left Section - Sidebar Toggle & Search */}
      <div className="topbar-left">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="topbar-toggle"
          aria-label="Toggle sidebar"
          title="Toggle sidebar"
        >
          <SidebarIcon className="topbar-icon" />
        </button>

        {/* Search Bar */}
        <div className="topbar-search-wrapper">
          <Search className="topbar-search-icon" />
          <input
            type="text"
            className="topbar-search-input"
            placeholder="Search knowledge, docs, chats..."
            aria-label="Search"
          />
        </div>
      </div>

      {/* Right Section - Organization, Notifications & User Profile */}
      <div className="topbar-right">
        {/* Organization Switcher */}
        <button
          className="topbar-org-switcher"
          title="Switch organization"
          aria-label="Switch organization"
        >
          <Building2 className="topbar-org-icon" />
          <span className="topbar-org-label">Acme Corp</span>
          <ChevronDown className="topbar-org-chevron" />
        </button>

        {/* Notifications Button */}
        <button
          className="topbar-action-btn relative"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="topbar-icon" />
          {/* Unread badge example - conditional rendering in real implementation */}
          <span className="topbar-badge" />
        </button>

        {/* User Profile Menu */}
        <button
          className="topbar-user-menu"
          title="User menu"
          aria-label="User menu"
        >
          {/* User Avatar */}
          <div className="topbar-avatar">JD</div>

          {/* User Info (hidden on mobile) */}
          <div className="topbar-user-info">
            <span className="topbar-user-name">John Doe</span>
            <span className="topbar-user-role">Admin</span>
          </div>

          {/* Dropdown Chevron */}
          <ChevronDown className="topbar-user-chevron" />
        </button>
      </div>
    </header>
  );
}

