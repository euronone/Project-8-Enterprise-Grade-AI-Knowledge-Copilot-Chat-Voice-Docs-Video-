import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-brand-950 via-surface-900 to-accent-950">
      {/* Background mesh */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand-600/20 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-accent-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-60 w-60 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      {/* Logo bar */}
      <header className="relative z-10 p-6">
        <Link className="inline-flex items-center gap-2.5" href="/">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">KnowledgeForge</span>
        </Link>
      </header>

      {/* Main content — centered card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 pb-12">
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl backdrop-blur-sm">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs text-white/30">
        © {new Date().getFullYear()} KnowledgeForge. All rights reserved.
      </footer>
    </div>
  );
}
