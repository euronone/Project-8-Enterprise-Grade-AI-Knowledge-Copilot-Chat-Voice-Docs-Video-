import Link from "next/link";
import { Button } from "@/components/ui";

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(124,58,237,0.12),transparent_50%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-20">
        <p className="inline-flex w-fit rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground">
          Enterprise AI Knowledge Copilot
        </p>
        <h1 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-tight md:text-6xl">
          One AI brain for chat, voice, meetings, documents, and video.
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          KnowledgeForge unifies enterprise knowledge and delivers instant, cited, context-aware answers across every team and workflow.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login">
            <Button size="lg">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline">
              Create workspace
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
