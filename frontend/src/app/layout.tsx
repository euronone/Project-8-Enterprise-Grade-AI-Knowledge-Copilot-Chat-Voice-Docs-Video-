import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { QueryProvider } from '@/components/providers/QueryProvider';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'KnowledgeForge — AI Copilot for Your Organization',
    template: '%s | KnowledgeForge',
  },
  description:
    'KnowledgeForge is an enterprise AI copilot that connects to your documents, meetings, and tools to deliver instant, cited answers.',
  keywords: ['AI', 'knowledge base', 'enterprise', 'copilot', 'document search'],
  authors: [{ name: 'KnowledgeForge Team' }],
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
  },
  openGraph: {
    type: 'website',
    title: 'KnowledgeForge AI Copilot',
    description: 'Enterprise AI copilot powered by your knowledge.',
    siteName: 'KnowledgeForge',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#312e81' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body>
        <AuthProvider>
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#0f172a',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                  fontSize: '14px',
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                },
              }}
            />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
