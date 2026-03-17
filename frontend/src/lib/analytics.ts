type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export function trackEvent({ name, properties }: AnalyticsEvent) {
  if (typeof window === "undefined") return;
  // PostHog / Segment integration point
  if ((window as unknown as Record<string, unknown>).posthog) {
    ((window as unknown as Record<string, unknown>).posthog as { capture: (name: string, props?: unknown) => void}).capture(name, properties);
  }
  if (process.env.NODE_ENV === "development") {
    console.debug("[Analytics]", name, properties);
  }
}

export const Events = {
  CHAT_SENT: "chat_message_sent",
  VOICE_STARTED: "voice_session_started",
  DOCUMENT_UPLOADED: "document_uploaded",
  SEARCH_PERFORMED: "search_performed",
  FEATURE_USED: "feature_used",
  ERROR_OCCURRED: "error_occurred",
  LOGIN: "user_login",
  LOGOUT: "user_logout",
} as const;
