import { useEffect, useCallback } from "react";

type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutDef {
  keys: string; // e.g. "mod+k", "escape", "mod+shift+n"
  handler: KeyHandler;
  enabled?: boolean;
}

function matchesShortcut(event: KeyboardEvent, keys: string): boolean {
  const parts = keys.toLowerCase().split("+");
  const modKeys = {
    mod: event.metaKey || event.ctrlKey,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
  };

  for (const part of parts) {
    if (part === "mod" && !modKeys.mod) return false;
    if (part === "ctrl" && !modKeys.ctrl) return false;
    if (part === "alt" && !modKeys.alt) return false;
    if (part === "shift" && !modKeys.shift) return false;
    if (!["mod", "ctrl", "alt", "shift"].includes(part)) {
      if (event.key.toLowerCase() !== part) return false;
    }
  }
  return true;
}

export function useKeyboardShortcuts(shortcuts: ShortcutDef[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        if (shortcut.enabled === false) continue;
        if (matchesShortcut(event, shortcut.keys)) {
          event.preventDefault();
          shortcut.handler(event);
          break;
        }
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
