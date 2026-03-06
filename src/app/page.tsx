"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import Report from "./report-view";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<
    (AnalysisResult & { id?: string }) | null
  >(null);

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
      <section className="relative py-24 sm:py-32 text-center">
        {/* Subtle purple glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-[400px] w-[600px] bg-purple-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative">
          <p className="text-sm font-semibold tracking-widest text-purple-500 uppercase">
            AI Search Visibility Analyzer
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
            Is your site visible to{" "}
            <span className="text-purple-500">AI search?</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            GEOScore analyzes your website for LLM discoverability across
            ChatGPT, Claude, Gemini, and Perplexity. Get a score out of 100 with
            actionable fixes.
          </p>

          {/* URL Input — pill-shaped like Sucana's email form */}
          <form
            onSubmit={handleAnalyze}
            className="mx-auto mt-10 flex w-full max-w-md items-center overflow-hidden rounded-full border border-gray-200 bg-white shadow-lg"
          >
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter a URL (e.g. example.com)"
              className="flex-1 bg-transparent px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="mr-1.5 rounded-full bg-purple-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-600 disabled:opacity-60"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </form>

          {loading && (
            <div className="mt-8">
              <div className="inline-flex items-center gap-3 rounded-full bg-purple-50 px-5 py-3 text-sm text-purple-600">
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
            <div className="mx-auto mt-6 max-w-md rounded-2xl bg-red-50 px-5 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Results */}
      {result && <Report result={result} id={result.id} />}

      {/* Below-the-fold content — only when no result */}
      {!result && (
        <>
          {/* How it works */}
          <section className="py-16 sm:py-24">
            <p className="text-center text-sm font-semibold tracking-widest text-purple-500 uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Three steps. No signup. Free.
            </h2>

            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              {[
                {
                  step: "01",
                  icon: (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.813a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" />
                    </svg>
                  ),
                  title: "Paste your URL",
                  desc: "Enter any webpage — your homepage, a blog post, a product page, or a location page.",
                },
                {
                  step: "02",
                  icon: (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  ),
                  title: "We scan 10 areas",
                  desc: "Our engine checks your content, structure, technical setup, and more — the same things AI models look at when deciding what to cite.",
                },
                {
                  step: "03",
                  icon: (
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  ),
                  title: "Get your score + fixes",
                  desc: "See exactly what's working, what's missing, and get copy-paste code to fix it. Download the report or share it with your team.",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
                    {item.icon}
                  </div>
                  <span className="mt-5 text-xs font-semibold tracking-widest text-purple-500 uppercase">
                    Step {item.step}
                  </span>
                  <h3 className="mt-2 text-lg font-bold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Why it matters */}
          <section className="py-16 sm:py-24">
            <p className="text-center text-sm font-semibold tracking-widest text-purple-500 uppercase">
              Why it matters
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              AI is the new front page
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
              When someone asks ChatGPT, Claude, or Gemini a question about your
              industry, does your brand show up in the answer? If not, you&apos;re
              invisible to a fast-growing channel.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {[
                {
                  stat: "40%",
                  label: "of Gen Z prefers AI over Google",
                  desc: "Younger audiences are asking AI assistants instead of searching Google. If your site isn't optimized for AI, you're missing this audience entirely.",
                },
                {
                  stat: "2x",
                  label: "more citations with FAQ sections",
                  desc: "Pages with clear question-and-answer sections are twice as likely to be cited by AI models. They match how people ask questions.",
                },
                {
                  stat: "+22%",
                  label: "citation boost from statistics",
                  desc: "AI models love specific numbers. Pages with data points, percentages, and statistics are significantly more likely to be referenced.",
                },
                {
                  stat: "67%",
                  label: "of top-cited pages have original research",
                  desc: "Unique data, surveys, or insights that can't be found elsewhere make AI models far more likely to cite you as a source.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="text-3xl font-extrabold text-purple-500">{item.stat}</div>
                  <div className="mt-1 font-semibold text-gray-900">{item.label}</div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* What we check */}
          <section className="rounded-2xl bg-gray-50 px-4 py-16 sm:px-8 sm:py-24">
            <p className="text-center text-sm font-semibold tracking-widest text-purple-500 uppercase">
              Our scoring framework
            </p>
            <h2 className="mt-3 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              What we check
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-gray-500">
              GEOScore evaluates 10 areas that determine whether AI models can find,
              understand, and cite your content.
            </p>

            <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2">
              {[
                {
                  name: "Content Structure",
                  weight: 25,
                  plain: "Are your headings clear? Do you use lists and tables? Can an AI quickly scan and understand your page?",
                },
                {
                  name: "Content Depth",
                  weight: 20,
                  plain: "Is there enough substance? Do you include stats, quotes, and detailed answers that AI models want to cite?",
                },
                {
                  name: "Technical Setup",
                  weight: 15,
                  plain: "Can AI crawlers actually access your content? Or is it hidden behind JavaScript that bots can't run?",
                },
                {
                  name: "AI Crawler Access",
                  weight: 10,
                  plain: "Does your robots.txt welcome AI bots like GPTBot and ClaudeBot? Many sites accidentally block them.",
                },
                {
                  name: "Structured Data",
                  weight: 10,
                  plain: "Do you have schema markup that helps AI understand what your page is about — your business, products, or articles?",
                },
                {
                  name: "Trust Signals (E-E-A-T)",
                  weight: 8,
                  plain: "Can AI tell who wrote this content? Are there author bios, credentials, and links to trusted profiles?",
                },
                {
                  name: "Meta Tags",
                  weight: 5,
                  plain: "Do you have proper titles, descriptions, and social sharing tags that summarize your page correctly?",
                },
                {
                  name: "Navigation & Sitemap",
                  weight: 3,
                  plain: "Can AI follow breadcrumbs and links to understand how your page fits into your whole site?",
                },
                {
                  name: "Geographic Signals",
                  weight: 2,
                  plain: "For local businesses: can AI find your address, service area, and hours when someone asks 'near me' questions?",
                },
                {
                  name: "Voice & Assistant Ready",
                  weight: 2,
                  plain: "Is your content formatted so voice assistants like Siri and Alexa can read it aloud as a clear answer?",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-lg hover:border-purple-200"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-500">
                    {item.weight}%
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">
                      {item.plain}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="relative py-24 text-center">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[300px] w-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Ready to check your site?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-gray-500">
                It takes 15 seconds. No signup, no email, no credit card.
                Just paste your URL above and see how you score.
              </p>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="mt-8 rounded-full bg-purple-500 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-purple-600"
              >
                Analyze my site
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
