import * as cheerio from "cheerio";
import type { ParsedPage } from "@/lib/types";

export function parseHtml(html: string, pageUrl: string): ParsedPage {
  const $ = cheerio.load(html);
  const baseUrl = new URL(pageUrl);

  // Title
  const title =
    $("title").first().text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    "";

  // Meta description
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  // Canonical
  const canonical = $('link[rel="canonical"]').attr("href") || null;

  // OG tags
  const ogTags: Record<string, string> = {};
  $('meta[property^="og:"]').each((_, el) => {
    const prop = $(el).attr("property");
    const content = $(el).attr("content");
    if (prop && content) ogTags[prop] = content;
  });

  // Twitter tags
  const twitterTags: Record<string, string> = {};
  $('meta[name^="twitter:"]').each((_, el) => {
    const name = $(el).attr("name");
    const content = $(el).attr("content");
    if (name && content) twitterTags[name] = content;
  });

  // Robots meta
  const robotsMeta =
    $('meta[name="robots"]').attr("content") ||
    $('meta[name="googlebot"]').attr("content") ||
    null;

  // JSON-LD schemas
  const schemas: Record<string, unknown>[] = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const data = JSON.parse($(el).html() || "");
      if (Array.isArray(data)) {
        schemas.push(...data);
      } else {
        schemas.push(data);
      }
    } catch {
      // Skip malformed JSON-LD
    }
  });

  // Headings
  const headings: ParsedPage["headings"] = [];
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const level = parseInt(el.tagName.charAt(1));
    const text = $(el).text().trim();
    const hasId = !!$(el).attr("id");
    if (text) headings.push({ level, text, hasId });
  });

  // Images
  const images: ParsedPage["images"] = [];
  $("img").each((_, el) => {
    const src = $(el).attr("src") || "";
    const alt = $(el).attr("alt") || "";
    if (src) images.push({ src, alt });
  });

  // Links
  const links: ParsedPage["links"] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    const text = $(el).text().trim();
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    let isInternal = false;
    try {
      const linkUrl = new URL(href, pageUrl);
      isInternal = linkUrl.hostname === baseUrl.hostname;
    } catch {
      isInternal = href.startsWith("/");
    }
    links.push({ href, text, isInternal });
  });

  // FAQ sections
  const faqSections: ParsedPage["faqSections"] = [];
  // Check for FAQ in headings
  $("h2, h3").each((_, el) => {
    const text = $(el).text().trim().toLowerCase();
    if (
      text.includes("faq") ||
      text.includes("frequently asked") ||
      text.includes("common questions")
    ) {
      // Try to extract Q&A from siblings
      let current = $(el).next();
      while (current.length) {
        const tag = current.prop("tagName")?.toLowerCase();
        if (tag === "h2" || tag === "h1") break;
        if (tag === "h3" || tag === "h4") {
          const question = current.text().trim();
          const answer = current.next("p").text().trim();
          if (question && answer) {
            faqSections.push({ question, answer });
          }
        }
        current = current.next();
      }
    }
  });

  // Also check for FAQ schema
  for (const schema of schemas) {
    if (
      (schema as Record<string, unknown>)["@type"] === "FAQPage" &&
      Array.isArray((schema as Record<string, unknown>).mainEntity)
    ) {
      for (const q of (schema as Record<string, unknown>)
        .mainEntity as Record<string, unknown>[]) {
        const question = (q.name as string) || "";
        const answer =
          ((q.acceptedAnswer as Record<string, unknown>)?.text as string) || "";
        if (question && answer) {
          faqSections.push({ question, answer });
        }
      }
    }
  }

  // Counts
  const listCount = $("ul, ol").length;
  const tableCount = $("table").length;

  // Word count (visible text only)
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length;

  // Server-rendered content check
  // If body has substantial text content, it's likely server-rendered
  const mainContentLength = $("main, article, [role='main'], .content, #content")
    .text()
    .trim().length;
  const hasServerRenderedContent = wordCount > 100 || mainContentLength > 200;

  return {
    html,
    title,
    metaDescription,
    canonical,
    ogTags,
    twitterTags,
    robotsMeta,
    schemas,
    headings,
    images,
    links,
    faqSections,
    listCount,
    tableCount,
    wordCount,
    hasServerRenderedContent,
  };
}
