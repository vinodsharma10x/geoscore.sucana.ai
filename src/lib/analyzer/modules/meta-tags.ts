import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeMetaTags(page: ParsedPage): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // Title
  if (page.title) {
    if (page.title.length <= 60) {
      findings.push({
        type: "good",
        message: `Title: "${page.title}" (${page.title.length} chars — good length)`,
      });
      score += 2;
    } else {
      findings.push({
        type: "warning",
        message: `Title is ${page.title.length} chars. Keep under 60 for best display.`,
      });
      score += 1;
    }
  } else {
    findings.push({ type: "critical", message: "No page title found." });
    fixes.push({
      title: "Add a page title",
      priority: "critical",
      description: "Add a unique, keyword-rich <title> tag under 60 characters.",
    });
  }

  // Description
  if (page.metaDescription) {
    if (page.metaDescription.length <= 155) {
      findings.push({
        type: "good",
        message: `Meta description present (${page.metaDescription.length} chars).`,
      });
      score += 2;
    } else {
      findings.push({
        type: "warning",
        message: `Meta description is ${page.metaDescription.length} chars. Keep under 155.`,
      });
      score += 1;
    }
  } else {
    findings.push({ type: "critical", message: "No meta description found." });
    fixes.push({
      title: "Add meta description",
      priority: "critical",
      description:
        "Add a compelling meta description under 155 characters. LLMs use this as a context signal.",
    });
  }

  // Canonical
  if (page.canonical) {
    findings.push({ type: "good", message: "Canonical URL set." });
    score += 1;
  } else {
    findings.push({ type: "warning", message: "No canonical URL set." });
    fixes.push({
      title: "Add canonical URL",
      priority: "medium",
      description:
        'Add <link rel="canonical" href="..."> to prevent duplicate content issues.',
    });
  }

  // OG tags
  const ogKeys = Object.keys(page.ogTags);
  const requiredOg = ["og:title", "og:description", "og:image", "og:url"];
  const missingOg = requiredOg.filter((k) => !ogKeys.includes(k));
  if (missingOg.length === 0) {
    findings.push({
      type: "good",
      message: "All OpenGraph tags present (title, description, image, url).",
    });
    score += 2;
  } else if (ogKeys.length > 0) {
    findings.push({
      type: "warning",
      message: `Missing OG tags: ${missingOg.join(", ")}`,
    });
    score += 1;
  } else {
    findings.push({ type: "critical", message: "No OpenGraph tags found." });
    fixes.push({
      title: "Add OpenGraph tags",
      priority: "medium",
      description:
        "Add og:title, og:description, og:image, og:url, and og:type meta tags for social sharing and AI context.",
    });
  }

  // Twitter card
  if (page.twitterTags["twitter:card"]) {
    findings.push({ type: "good", message: "Twitter card meta present." });
    score += 1;
  }

  // Robots meta - check for max-snippet
  if (page.robotsMeta) {
    if (page.robotsMeta.includes("max-snippet:-1")) {
      findings.push({
        type: "good",
        message: "max-snippet:-1 set — allows unlimited text snippets for AI.",
      });
      score += 1;
    }
    if (page.robotsMeta.includes("noindex")) {
      findings.push({
        type: "critical",
        message: "Page is set to noindex! It will not be indexed by search engines or AI.",
      });
      score = Math.max(score - 5, 0);
    }
  } else {
    findings.push({
      type: "info",
      message:
        "No robots meta tag. Consider adding max-snippet:-1, max-image-preview:large for AI visibility.",
    });
    fixes.push({
      title: "Add robots meta with unlimited snippets",
      priority: "nice-to-have",
      description:
        'Add <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large"> to allow maximum AI extraction.',
    });
  }

  return {
    name: "Meta Tags & OG",
    score: Math.min(score, 10),
    weight: 5,
    weighted: (Math.min(score, 10) * 5) / 100,
    findings,
    fixes,
  };
}
