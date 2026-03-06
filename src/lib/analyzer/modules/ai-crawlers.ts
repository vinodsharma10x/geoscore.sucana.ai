import type { CategoryResult } from "@/lib/types";

const AI_CRAWLERS = [
  { name: "GPTBot", company: "OpenAI" },
  { name: "OAI-SearchBot", company: "OpenAI" },
  { name: "ChatGPT-User", company: "OpenAI" },
  { name: "ClaudeBot", company: "Anthropic" },
  { name: "Claude-SearchBot", company: "Anthropic" },
  { name: "Claude-User", company: "Anthropic" },
  { name: "Google-Extended", company: "Google" },
  { name: "PerplexityBot", company: "Perplexity" },
  { name: "Perplexity-User", company: "Perplexity" },
  { name: "Applebot-Extended", company: "Apple" },
  { name: "Amazonbot", company: "Amazon" },
  { name: "CCBot", company: "Common Crawl" },
];

function parseRobotsTxt(
  robotsTxt: string
): Map<string, { allowed: string[]; disallowed: string[] }> {
  const rules = new Map<string, { allowed: string[]; disallowed: string[] }>();
  let currentAgent = "";

  for (const line of robotsTxt.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#") || !trimmed) continue;

    const [directive, ...valueParts] = trimmed.split(":");
    const value = valueParts.join(":").trim();
    const dir = directive.toLowerCase().trim();

    if (dir === "user-agent") {
      currentAgent = value;
      if (!rules.has(currentAgent)) {
        rules.set(currentAgent, { allowed: [], disallowed: [] });
      }
    } else if (dir === "allow" && currentAgent) {
      rules.get(currentAgent)!.allowed.push(value);
    } else if (dir === "disallow" && currentAgent) {
      rules.get(currentAgent)!.disallowed.push(value);
    }
  }

  return rules;
}

function isCrawlerAllowed(
  rules: Map<string, { allowed: string[]; disallowed: string[] }>,
  crawlerName: string
): "allowed" | "blocked" | "default" {
  // Check specific rules for this crawler
  const specific = rules.get(crawlerName);
  if (specific) {
    if (specific.disallowed.includes("/")) return "blocked";
    if (specific.allowed.includes("/")) return "allowed";
    if (specific.disallowed.length > 0 && specific.allowed.length === 0)
      return "blocked";
    return "allowed";
  }

  // Fall back to wildcard
  const wildcard = rules.get("*");
  if (wildcard) {
    if (wildcard.disallowed.includes("/")) return "blocked";
    return "default";
  }

  return "default";
}

export function analyzeAiCrawlerAccess(
  robotsTxt: string | null,
  llmsTxt: string | null
): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // robots.txt
  if (!robotsTxt) {
    findings.push({
      type: "warning",
      message: "No robots.txt found. AI crawlers are allowed by default, but explicit rules are better.",
    });
    score += 3;
  } else {
    const rules = parseRobotsTxt(robotsTxt);
    const explicitly = AI_CRAWLERS.filter(
      (c) => rules.has(c.name)
    );
    const blocked = AI_CRAWLERS.filter(
      (c) => isCrawlerAllowed(rules, c.name) === "blocked"
    );
    const allowed = AI_CRAWLERS.filter(
      (c) => isCrawlerAllowed(rules, c.name) === "allowed"
    );

    if (blocked.length > 0) {
      findings.push({
        type: "critical",
        message: `Blocked AI crawlers: ${blocked.map((c) => `${c.name} (${c.company})`).join(", ")}`,
      });
      fixes.push({
        title: "Unblock AI crawlers in robots.txt",
        priority: "critical",
        description: `These AI crawlers are blocked: ${blocked.map((c) => c.name).join(", ")}. Add explicit Allow rules.`,
      });
    }

    if (explicitly.length >= 4) {
      findings.push({
        type: "good",
        message: `${explicitly.length} AI crawlers explicitly configured in robots.txt.`,
      });
      score += 4;
    } else if (allowed.length > 0 || explicitly.length > 0) {
      findings.push({
        type: "info",
        message: `${explicitly.length} AI crawlers explicitly named. Consider adding rules for all major AI crawlers.`,
      });
      score += 3;
    }

    if (blocked.length === 0) {
      score += 2;
    }

    // Check for sitemap reference
    if (robotsTxt.toLowerCase().includes("sitemap:")) {
      findings.push({
        type: "good",
        message: "Sitemap referenced in robots.txt.",
      });
      score += 1;
    }
  }

  // llms.txt
  if (llmsTxt) {
    findings.push({
      type: "good",
      message: "llms.txt found. Provides AI crawlers with a structured site overview.",
    });
    score += 2;

    // Check if it follows spec (has H1)
    if (llmsTxt.startsWith("#")) {
      findings.push({
        type: "good",
        message: "llms.txt follows the spec (starts with H1 heading).",
      });
      score += 1;
    }
  } else {
    findings.push({
      type: "info",
      message:
        "No llms.txt found. While no proven citation impact, it's a low-effort best practice.",
    });
    fixes.push({
      title: "Add /llms.txt",
      priority: "nice-to-have",
      description:
        "Create a /llms.txt file following the llmstxt.org spec. Include company summary, key pages, and blog posts.",
    });
  }

  return {
    name: "AI Crawler Access",
    score: Math.min(score, 10),
    weight: 10,
    weighted: (Math.min(score, 10) * 10) / 100,
    findings,
    fixes,
  };
}
