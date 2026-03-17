export function captureException(error: unknown, context?: Record<string, unknown>) {
  const sentry = (typeof window !== "undefined"
    ? (window as unknown as Record<string, unknown>).Sentry
    : null) as { captureException: (e: unknown, extras?: unknown) => void } | null;

  if (sentry) {
    sentry.captureException(error, { extra: context });
  }
  if (process.env.NODE_ENV === "development") {
    console.error("[Error]", error, context);
  }
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (process.env.NODE_ENV === "development") {
    console.log(`[${level.toUpperCase()}]`, message);
  }
}
