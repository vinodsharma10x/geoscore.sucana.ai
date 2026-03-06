"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import Report from "./report-view";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section className="py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Is your site visible to{" "}
          <span className="text-purple-600">AI search?</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          GEOScore analyzes your website for LLM discoverability across
          ChatGPT, Claude, Gemini, and Perplexity. Get a score out of 100 with
          actionable fixes.
        </p>

        {/* URL Input */}
        <form
          onSubmit={handleAnalyze}
          className="mx-auto mt-8 flex max-w-xl gap-3"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter a URL (e.g. example.com)"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-zinc-700 dark:bg-zinc-900"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-lg bg-purple-600 px-6 py-3 text-base font-medium text-white shadow-sm transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>

        {loading && (
          <div className="mt-8">
            <div className="inline-flex items-center gap-3 rounded-lg bg-purple-50 px-5 py-3 text-sm text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Fetching and analyzing page... This may take 10-15 seconds.
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto mt-6 max-w-xl rounded-lg bg-red-50 px-5 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}
      </section>

      {/* Results */}
      {result && <Report result={result} />}

      {/* How it works - only show when no result */}
      {!result && (
        <section className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "10 Scoring Categories",
              desc: "Content structure, depth, technical SEO, AI crawlers, structured data, E-E-A-T, meta tags, navigation, geographic, and voice.",
            },
            {
              title: "Research-Backed Scoring",
              desc: "Based on studies of 300K+ domains. Statistics give +22% citation likelihood, FAQ sections 2x, 1500+ words 2x.",
            },
            {
              title: "Copy-Paste Fixes",
              desc: "Get ready-to-use JSON-LD schemas, meta tags, robots.txt rules, and llms.txt content for your site.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
