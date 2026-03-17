export const lightTheme = {
	name: "light",
	colors: {
		background: "#ffffff",
		foreground: "#0f172a",
		card: "#ffffff",
		cardForeground: "#0f172a",
		primary: "#0ea5e9",
		primaryForeground: "#ffffff",
		secondary: "#f1f5f9",
		secondaryForeground: "#0f172a",
		muted: "#f8fafc",
		mutedForeground: "#64748b",
		border: "#e2e8f0",
		success: "#22c55e",
		warning: "#f59e0b",
		danger: "#ef4444",
		info: "#3b82f6",
	},
	shadows: {
		sm: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
		md: "0 4px 12px rgb(15 23 42 / 0.08)",
		lg: "0 12px 24px rgb(15 23 42 / 0.12)",
	},
} as const;

export type LightTheme = typeof lightTheme;

