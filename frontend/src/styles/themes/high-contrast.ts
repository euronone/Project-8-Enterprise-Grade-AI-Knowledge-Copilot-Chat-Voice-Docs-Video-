export const highContrastTheme = {
	name: "high-contrast",
	colors: {
		background: "#000000",
		foreground: "#ffffff",
		card: "#080808",
		cardForeground: "#ffffff",
		primary: "#ffff00",
		primaryForeground: "#000000",
		secondary: "#1a1a1a",
		secondaryForeground: "#ffffff",
		muted: "#111111",
		mutedForeground: "#dddddd",
		border: "#9ca3af",
		success: "#00ff7f",
		warning: "#ffd60a",
		danger: "#ff4d4f",
		info: "#5ac8fa",
	},
	shadows: {
		sm: "0 0 0 1px #ffffff",
		md: "0 0 0 2px #ffffff",
		lg: "0 0 0 3px #ffffff",
	},
} as const;

export type HighContrastTheme = typeof highContrastTheme;

