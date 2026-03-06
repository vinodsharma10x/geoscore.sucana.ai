import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeNavigation(
  page: ParsedPage,
  sitemapXml: string | null
): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // BreadcrumbList schema
  const types = page.schemas.flatMap((s) => {
    const items = [s];
    if (Array.isArray(s["@graph"]))
      items.push(...(s["@graph"] as Record<string, unknown>[]));
    return items;
  });
  const hasBreadcrumb = types.some((s) => s["@type"] === "BreadcrumbList");

  if (hasBreadcrumb) {
    findings.push({
      type: "good",
      message: "BreadcrumbList schema present.",
    });
    score += 3;

    // Check depth
    const breadcrumb = types.find((s) => s["@type"] === "BreadcrumbList");
    const items = breadcrumb?.itemListElement;
    if (Array.isArray(items) && items.length >= 3) {
      findings.push({
        type: "good",
        message: `Breadcrumb depth: ${items.length} levels (good).`,
      });
      score += 1;
    } else if (Array.isArray(items)) {
      findings.push({
        type: "warning",
        message: `Breadcrumb only ${items.length} level(s). 3+ levels provide better hierarchy context.`,
      });
    }
  } else {
    findings.push({
      type: "warning",
      message: "No BreadcrumbList schema found.",
    });
    fixes.push({
      title: "Add BreadcrumbList schema",
      priority: "medium",
      description:
        "Add BreadcrumbList JSON-LD with 3+ levels (e.g., Home > Section > Page). Helps LLMs understand site hierarchy.",
    });
  }

  // Internal links
  const internalLinks = page.links.filter((l) => l.isInternal);
  if (internalLinks.length >= 10) {
    findings.push({
      type: "good",
      message: `${internalLinks.length} internal links found. Good for crawl distribution.`,
    });
    score += 2;
  } else if (internalLinks.length >= 3) {
    findings.push({
      type: "info",
      message: `${internalLinks.length} internal links. More internal linking helps crawlability.`,
    });
    score += 1;
  } else {
    findings.push({
      type: "warning",
      message: `Only ${internalLinks.length} internal link(s). Page may be poorly connected.`,
    });
    fixes.push({
      title: "Add more internal links",
      priority: "medium",
      description:
        "Link to related content, categories, and key pages. Internal links distribute authority and help crawlers discover content.",
    });
  }

  // Sitemap inclusion
  if (sitemapXml) {
    const pageUrl = page.canonical || "";
    const pageInSitemap = pageUrl && sitemapXml.includes(pageUrl);
    if (pageInSitemap) {
      findings.push({
        type: "good",
        message: "Page found in sitemap.xml.",
      });
      score += 2;
    } else {
      findings.push({
        type: "warning",
        message: "Page not found in sitemap.xml (or sitemap is paginated).",
      });
    }

    // Check for lastmod
    if (sitemapXml.includes("<lastmod>")) {
      findings.push({
        type: "good",
        message: "Sitemap includes lastmod dates (freshness signal).",
      });
      score += 1;
    }
  } else {
    findings.push({
      type: "warning",
      message: "No sitemap.xml found.",
    });
    fixes.push({
      title: "Add sitemap.xml",
      priority: "medium",
      description:
        "Create a sitemap.xml listing all important pages with lastmod dates and priority values.",
    });
  }

  // Table of contents check
  const hasToc =
    page.html.toLowerCase().includes("table-of-contents") ||
    page.html.toLowerCase().includes("toc") ||
    page.links.some(
      (l) => l.href.startsWith("#") && page.headings.some((h) => h.hasId)
    );
  if (hasToc) {
    findings.push({
      type: "good",
      message: "Table of contents or anchor navigation detected.",
    });
    score += 1;
  }

  return {
    name: "Navigation",
    score: Math.min(score, 10),
    weight: 3,
    weighted: (Math.min(score, 10) * 3) / 100,
    findings,
    fixes,
  };
}
