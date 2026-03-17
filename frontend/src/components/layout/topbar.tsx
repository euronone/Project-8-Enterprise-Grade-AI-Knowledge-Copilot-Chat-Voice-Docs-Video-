"use client";

import { Bell, Search, SidebarIcon } from "lucide-react";
import { Button } from "@/components/ui";
import { useUiStore } from "@/stores/ui-store";

export function Topbar() {
  const { toggleSidebar } = useUiStore();

  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <SidebarIcon className="h-4 w-4" />
        </Button>
        <div className="hidden md:flex items-center gap-2 rounded-md border px-3 h-9 text-sm text-muted-foreground min-w-[260px]">
          <Search className="h-4 w-4" />
          <span>Search knowledge, docs, chats...</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}

