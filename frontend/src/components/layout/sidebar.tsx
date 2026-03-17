"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import {
  BookOpen,
  BarChart3,
  Bot,
  Home,
  MessageSquare,
  Search,
  Settings,
  Users,
  Video,
  Volume2,
  Workflow,
} from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/voice", label: "Voice", icon: Volume2 },
  { href: "/meetings", label: "Meetings", icon: Users },
  { href: "/knowledge-base", label: "Knowledge", icon: BookOpen },
  { href: "/video", label: "Video", icon: Video },
  { href: "/search", label: "Search", icon: Search },
  { href: "/workflows", label: "Workflows", icon: Workflow },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin", label: "Admin", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen } = useUiStore();
  const collapsed = !sidebarOpen;

  return (
    <aside className={cn("sidebar", collapsed && "collapsed")}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo" />
        <span className="sidebar-title">KnowledgeForge</span>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              title={item.label}
              className={cn(
                "sidebar-nav-item",
                active && "active"
              )}
            >
              <Icon className="sidebar-nav-icon" />
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

