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
    <aside
      className={cn(
        "hidden md:flex md:flex-col border-r bg-card transition-all duration-200",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="h-14 border-b px-4 flex items-center">
        <div className="h-8 w-8 rounded bg-primary" />
        {!collapsed && <span className="ml-3 font-semibold">KnowledgeForge</span>}
      </div>
      <nav className="p-2 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

