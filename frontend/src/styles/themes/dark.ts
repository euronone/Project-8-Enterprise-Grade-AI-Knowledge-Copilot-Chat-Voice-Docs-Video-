export const darkTheme = {
	name: "dark",
	colors: {
		background: "#090f1e",
		foreground: "#f8fafc",
		card: "#111827",
		cardForeground: "#f8fafc",
		primary: "#0ea5e9",
		primaryForeground: "#ffffff",
		secondary: "#1f2937",
		secondaryForeground: "#f8fafc",
		muted: "#111827",
		mutedForeground: "#9ca3af",
		border: "#1f2937",
		success: "#22c55e",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#60a5fa",
	},
	shadows: {
		sm: "0 1px 2px 0 rgb(2 6 23 / 0.4)",
		md: "0 4px 12px rgb(2 6 23 / 0.45)",
		lg: "0 12px 24px rgb(2 6 23 / 0.55)",
	},
} as const;

export type DarkTheme = typeof darkTheme;

