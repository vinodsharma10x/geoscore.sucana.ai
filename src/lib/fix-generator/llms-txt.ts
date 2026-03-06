import type { ParsedPage } from "@/lib/types";

export function generateLlmsTxtContent(
  page: ParsedPage,
  url: string
): string {
  const baseUrl = new URL(url).origin;
  const title = page.title || "[Site Name]";
  const description = page.metaDescription || "[Site description]";

  const lines = [
    `# ${title.split("|")[0].trim()}`,
    "",
    `> ${description}`,
    "",
    `${title.split("|")[0].trim()} is [brief description of what your site/company does].`,
    "",
    "## Main Pages",
    "",
    `- [Home](${baseUrl}): Main website`,
    `- [About](${baseUrl}/about): About us`,
    `- [Blog](${baseUrl}/blog): Latest articles and insights`,
    "",
    "## Key Resources",
    "",
    `- [Sitemap](${baseUrl}/sitemap.xml): Full site map`,
    `- [RSS Feed](${baseUrl}/feed.xml): Blog feed`,
    "",
    "## Contact",
    "",
    "- Website: " + baseUrl,
    "- Twitter: [Your Twitter URL]",
    "- LinkedIn: [Your LinkedIn URL]",
  ];

  return lines.join("\n");
}
