import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-white text-gray-900">
        <header className="bg-white">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-gray-900">
                GEO<span className="text-purple-500">Score</span>
              </span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-semibold text-gray-500 transition-colors hover:text-purple-600"
              >
                Analyze
              </Link>
              <a
                href="https://github.com/vinodsharma10x/geoscore.sucana.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-500 transition-colors hover:text-purple-600"
              >
                GitHub
              </a>
              <a
                href="https://www.sucana.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-gray-500 transition-colors hover:text-purple-600"
              >
                Sucana
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 sm:px-6">{children}</main>

        <footer className="mt-24 border-t border-gray-200 bg-gray-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 sm:px-6">
            <span className="text-sm font-bold text-gray-400">
              GEO<span className="text-purple-400">Score</span>
            </span>
            <div className="flex items-center gap-x-6">
              <a
                href="https://www.sucana.ai"
                className="text-xs text-gray-400 transition-colors hover:text-gray-600 sm:text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Built by Sucana AI
              </a>
              <a
                href="https://github.com/vinodsharma10x/geoscore.sucana.ai"
                className="text-xs text-gray-400 transition-colors hover:text-gray-600 sm:text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Source (MIT)
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
