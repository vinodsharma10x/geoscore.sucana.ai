import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GEOScore - AI Search Visibility Analyzer",
  description:
    "Analyze how well your website is optimized for AI search engines like ChatGPT, Claude, Gemini, and Perplexity. Get an instant LLM discoverability score with actionable fixes.",
  openGraph: {
    title: "GEOScore - AI Search Visibility Analyzer",
    description:
      "Analyze how well your website is optimized for AI search engines. Get an instant LLM discoverability score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100`}
      >
        <header className="border-b border-zinc-200 dark:border-zinc-800">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-purple-600">
                GEOScore
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
                Analyze
              </Link>
              <a
                href="https://github.com/vinodsharma10x/geoscore.sucana.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                GitHub
              </a>
              <a
                href="https://www.sucana.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                Sucana
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
          <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-zinc-500">
            <p>
              Built by{" "}
              <a
                href="https://www.sucana.ai"
                className="text-purple-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sucana AI
              </a>
              {" "} | Open source under MIT License
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
