"use client";

import { useState } from "react";
import type { AnalysisResult, CategoryResult, Finding } from "@/lib/types";

function ScoreDonut({ score, rating }: { score: number; rating: string }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "text-green-500"
      : score >= 60
        ? "text-yellow-500"
        : score >= 40
          ? "text-orange-500"
          : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-36 w-36">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-zinc-200 dark:text-zinc-800"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={color}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold">{Math.round(score)}</span>
        </div>
      </div>
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium capitalize dark:bg-zinc-800">
        {rating.replace("-", " ")}
      </span>
    </div>
  );
}

function FindingBadge({ type }: { type: Finding["type"] }) {
  const styles = {
    good: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    warning:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    critical: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  };
  const labels = {
    good: "Pass",
    warning: "Warning",
    critical: "Critical",
    info: "Info",
  };

  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-xs font-medium ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function CategoryCard({
  category,
  index,
}: {
  category: CategoryResult;
  index: number;
}) {
  const [open, setOpen] = useState(index < 3);
  const barColor =
    category.score >= 8
      ? "bg-green-500"
      : category.score >= 5
        ? "bg-yellow-500"
        : category.score >= 3
          ? "bg-orange-500"
          : "bg-red-500";

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium">{category.name}</span>
            <span className="text-xs text-zinc-500">
              Weight: {category.weight}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-20 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full ${barColor}`}
                style={{ width: `${(category.score / 10) * 100}%` }}
              />
            </div>
            <span className="w-10 text-right text-sm font-semibold">
              {category.score}/10
            </span>
          </div>
          <svg
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {open && (
        <div className="border-t border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800">
          {/* Findings */}
          <ul className="space-y-2">
            {category.findings.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <FindingBadge type={f.type} />
                <span className="text-zinc-700 dark:text-zinc-300">
                  {f.message}
                </span>
              </li>
            ))}
          </ul>

          {/* Fixes */}
          {category.fixes.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                Recommended Fixes
              </h4>
              <ul className="space-y-2">
                {category.fixes.map((fix, i) => (
                  <li
                    key={i}
                    className="rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs font-medium ${
                          fix.priority === "critical"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : fix.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"
                              : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                        }`}
                      >
                        {fix.priority}
                      </span>
                      <span className="font-medium">{fix.title}</span>
                    </div>
                    <p className="mt-1 text-zinc-600 dark:text-zinc-400">
                      {fix.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeBlock({
  title,
  code,
  language,
}: {
  title: string;
  code: string;
  language: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="rounded px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Report({ result }: { result: AnalysisResult }) {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-zinc-200 bg-white p-8 sm:flex-row sm:items-start dark:border-zinc-800 dark:bg-zinc-900">
        <ScoreDonut score={result.overallScore} rating={result.rating} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">{result.pageTitle || result.url}</h2>
          <p className="mt-1 text-sm text-zinc-500 break-all">{result.url}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              {result.industry}
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {result.metadata.wordCount.toLocaleString()} words
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {result.metadata.headingCount} headings
            </span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {result.metadata.schemaTypes.length} schemas
            </span>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-zinc-500 sm:justify-start">
            <span>
              robots.txt:{" "}
              <strong className={result.metadata.hasRobotsTxt ? "text-green-600" : "text-red-500"}>
                {result.metadata.hasRobotsTxt ? "Found" : "Missing"}
              </strong>
            </span>
            <span>
              llms.txt:{" "}
              <strong className={result.metadata.hasLlmsTxt ? "text-green-600" : "text-red-500"}>
                {result.metadata.hasLlmsTxt ? "Found" : "Missing"}
              </strong>
            </span>
            <span>
              Sitemap:{" "}
              <strong className={result.metadata.hasSitemap ? "text-green-600" : "text-red-500"}>
                {result.metadata.hasSitemap ? "Found" : "Missing"}
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Category Breakdown</h2>
        <div className="space-y-3">
          {result.categories
            .sort((a, b) => b.weight - a.weight)
            .map((cat, i) => (
              <CategoryCard key={cat.name} category={cat} index={i} />
            ))}
        </div>
      </div>

      {/* Content Recommendations */}
      {result.generatedFixes.contentRecommendations.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold">Content Recommendations</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <ul className="space-y-3">
              {result.generatedFixes.contentRecommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 text-purple-600">&#8226;</span>
                  <span className="text-zinc-700 dark:text-zinc-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Generated Fix Code */}
      <div>
        <h2 className="mb-4 text-xl font-bold">Generated Fix Code</h2>
        <div className="space-y-4">
          {result.generatedFixes.jsonLd && (
            <CodeBlock
              title="JSON-LD Structured Data"
              code={result.generatedFixes.jsonLd}
              language="json"
            />
          )}
          {result.generatedFixes.metaTags && (
            <CodeBlock
              title="Meta Tags"
              code={result.generatedFixes.metaTags}
              language="html"
            />
          )}
          {result.generatedFixes.robotsTxt && (
            <CodeBlock
              title="robots.txt Rules"
              code={result.generatedFixes.robotsTxt}
              language="text"
            />
          )}
          {result.generatedFixes.llmsTxt && (
            <CodeBlock
              title="llms.txt"
              code={result.generatedFixes.llmsTxt}
              language="text"
            />
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="text-center text-xs text-zinc-400">
        Analyzed at {new Date(result.fetchedAt).toLocaleString()} | Powered by{" "}
        <a
          href="https://www.sucana.ai"
          className="text-purple-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sucana AI
        </a>
      </div>
    </section>
  );
}
