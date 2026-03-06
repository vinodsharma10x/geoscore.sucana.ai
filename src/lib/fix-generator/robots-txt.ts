export function generateRobotsTxtFixes(
  existingRobotsTxt: string | null
): string | null {
  const AI_CRAWLERS = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "ClaudeBot",
    "Claude-SearchBot",
    "Claude-User",
    "Google-Extended",
    "PerplexityBot",
    "Perplexity-User",
    "Applebot-Extended",
    "Amazonbot",
    "CCBot",
  ];

  if (!existingRobotsTxt) {
    // Generate full robots.txt
    const lines = [
      "# AI Search Crawlers",
      ...AI_CRAWLERS.flatMap((crawler) => [
        `User-agent: ${crawler}`,
        "Allow: /",
        "",
      ]),
      "# Default",
      "User-agent: *",
      "Allow: /",
      "",
      "Sitemap: [YOUR_SITEMAP_URL]",
    ];
    return lines.join("\n");
  }

  // Check which crawlers are missing
  const missing = AI_CRAWLERS.filter(
    (crawler) =>
      !existingRobotsTxt.includes(`User-agent: ${crawler}`)
  );

  if (missing.length === 0) return null;

  const lines = [
    "# Add these AI crawler rules to your existing robots.txt:",
    "",
    ...missing.flatMap((crawler) => [
      `User-agent: ${crawler}`,
      "Allow: /",
      "",
    ]),
  ];

  return lines.join("\n");
}
