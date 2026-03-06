import type { ParsedPage } from "@/lib/types";

export function generateMetaTagFixes(page: ParsedPage): string | null {
  const fixes: string[] = [];

  if (!page.title) {
    fixes.push(
      `<title>[Keyword-Rich Page Title — Under 60 Characters] | [Site Name]</title>`
    );
  }

  if (!page.metaDescription) {
    fixes.push(
      `<meta name="description" content="[Action-oriented description under 155 characters. Include primary keyword and value proposition.]" />`
    );
  }

  if (!page.canonical) {
    fixes.push(
      `<link rel="canonical" href="${page.canonical || "[Full Page URL]"}" />`
    );
  }

  const missingOg: string[] = [];
  if (!page.ogTags["og:title"])
    missingOg.push(`<meta property="og:title" content="${page.title || "[Title]"}" />`);
  if (!page.ogTags["og:description"])
    missingOg.push(
      `<meta property="og:description" content="${page.metaDescription || "[Description]"}" />`
    );
  if (!page.ogTags["og:image"])
    missingOg.push(
      `<meta property="og:image" content="[Image URL — 1200x630 recommended]" />`
    );
  if (!page.ogTags["og:url"])
    missingOg.push(
      `<meta property="og:url" content="${page.canonical || "[Page URL]"}" />`
    );
  if (!page.ogTags["og:type"])
    missingOg.push(`<meta property="og:type" content="website" />`);

  if (missingOg.length > 0) fixes.push(...missingOg);

  if (!page.twitterTags["twitter:card"]) {
    fixes.push(`<meta name="twitter:card" content="summary_large_image" />`);
    fixes.push(`<meta name="twitter:site" content="[Your @handle]" />`);
  }

  if (!page.robotsMeta || !page.robotsMeta.includes("max-snippet")) {
    fixes.push(
      `<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />`
    );
  }

  if (fixes.length === 0) return null;
  return fixes.join("\n");
}
