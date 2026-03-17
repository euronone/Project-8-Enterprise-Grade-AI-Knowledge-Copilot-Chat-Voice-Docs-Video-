import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";

type Theme = "light" | "dark" | "high-contrast" | "system";

export function useTheme() {
  const { preferences, updatePreferences } = useUserStore();
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark" | "high-contrast">("light");

  useEffect(() => {
    const root = document.documentElement;
    const theme = preferences.theme;

    let applied: "light" | "dark" | "high-contrast";

    if (theme === "system") {
      applied = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      applied = theme;
    }

    root.classList.remove("dark", "high-contrast");
    if (applied === "dark") root.classList.add("dark");
    if (applied === "high-contrast") root.classList.add("dark", "high-contrast");

    setResolvedTheme(applied);
  }, [preferences.theme]);

  const setTheme = (theme: Theme) => updatePreferences({ theme });

  return { theme: preferences.theme, resolvedTheme, setTheme };
}
