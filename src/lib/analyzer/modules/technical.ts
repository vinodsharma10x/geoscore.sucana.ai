import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeTechnicalDiscoverability(
  page: ParsedPage
): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // Server-rendered content
  if (page.hasServerRenderedContent) {
    findings.push({
      type: "good",
      message: "Content appears to be server-rendered (visible in initial HTML).",
    });
    score += 3;
  } else {
    findings.push({
      type: "critical",
      message:
        "Content may be JavaScript-dependent. LLM crawlers don't execute JS — content could be invisible.",
    });
    fixes.push({
      title: "Server-render critical content",
      priority: "critical",
      description:
        "LLM crawlers (GPTBot, ClaudeBot, PerplexityBot) don't execute JavaScript. Use SSR or SSG to ensure content is in the initial HTML response.",
    });
  }

  // Semantic HTML
  const hasMain = page.html.includes("<main");
  const hasArticle = page.html.includes("<article");
  const hasNav = page.html.includes("<nav");
  const hasSection = page.html.includes("<section");
  const semanticCount = [hasMain, hasArticle, hasNav, hasSection].filter(
    Boolean
  ).length;

  if (semanticCount >= 3) {
    findings.push({
      type: "good",
      message: `Good semantic HTML: uses ${[hasMain && "main", hasArticle && "article", hasNav && "nav", hasSection && "section"].filter(Boolean).join(", ")} elements.`,
    });
    score += 2;
  } else if (semanticCount >= 1) {
    findings.push({
      type: "info",
      message: `Some semantic HTML found. Consider using more semantic elements (main, article, section, nav).`,
    });
    score += 1;
  } else {
    findings.push({
      type: "warning",
      message: "No semantic HTML elements found (main, article, section, nav).",
    });
    fixes.push({
      title: "Use semantic HTML elements",
      priority: "medium",
      description:
        "Wrap main content in <main> and <article> tags. Use <section> for content groups. This helps LLMs understand page structure.",
    });
  }

  // Clean URL check
  const url = new URL(page.canonical || "https://example.com");
  const hasCleanUrl =
    !url.search.includes("&") || url.search.split("&").length < 4;
  if (hasCleanUrl) {
    findings.push({
      type: "good",
      message: "Clean URL structure.",
    });
    score += 2;
  } else {
    findings.push({
      type: "warning",
      message: "URL has many query parameters. Clean URLs are easier for LLMs to reference.",
    });
  }

  // Check for AJAX/dynamic loading indicators
  const ajaxIndicators = [
    "views/ajax",
    "wp-json",
    "api/search",
    "loadMore",
    "infinite-scroll",
    "data-ajax",
  ];
  const hasAjaxPatterns = ajaxIndicators.some((p) =>
    page.html.toLowerCase().includes(p)
  );
  if (hasAjaxPatterns) {
    findings.push({
      type: "warning",
      message:
        "AJAX/dynamic loading patterns detected. Content loaded via AJAX is invisible to LLM crawlers.",
    });
    score = Math.max(score - 1, 0);
  }

  // Check for noscript fallback
  const hasNoscript = page.html.includes("<noscript");
  if (hasNoscript) {
    findings.push({
      type: "info",
      message: "Noscript fallback detected. Good for non-JS crawlers.",
    });
    score += 1;
  }

  // HTTPS check
  if (page.canonical?.startsWith("https://")) {
    score += 1;
  }

  // Language attribute
  if (page.html.includes('lang="')) {
    findings.push({
      type: "good",
      message: "HTML lang attribute present.",
    });
    score += 1;
  }

  return {
    name: "Technical Discoverability",
    score: Math.min(score, 10),
    weight: 15,
    weighted: (Math.min(score, 10) * 15) / 100,
    findings,
    fixes,
  };
}
