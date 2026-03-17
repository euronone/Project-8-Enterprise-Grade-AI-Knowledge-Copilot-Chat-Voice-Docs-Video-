const FLAGS: Record<string, boolean> = {
  voice: process.env.NEXT_PUBLIC_FEATURE_VOICE !== "false",
  video: process.env.NEXT_PUBLIC_FEATURE_VIDEO !== "false",
  meetings: process.env.NEXT_PUBLIC_FEATURE_MEETINGS !== "false",
  analytics: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS !== "false",
  agents: process.env.NEXT_PUBLIC_FEATURE_AGENTS !== "false",
  workflows: process.env.NEXT_PUBLIC_FEATURE_WORKFLOWS !== "false",
  billing: process.env.NEXT_PUBLIC_FEATURE_BILLING !== "false",
};

export function isFeatureEnabled(flag: string): boolean {
  return FLAGS[flag] ?? false;
}
