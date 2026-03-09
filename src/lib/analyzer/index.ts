import type { AnalysisResult } from "@/lib/types";
import { fetchResources } from "./fetcher";
import { detectIndustry } from "./industry-detector";
import {
  calculateOverallScore,
  getRating,
} from "./score-calculator";
import { analyzeContentStructure } from "./modules/content-structure";
import { analyzeContentDepth } from "./modules/content-depth";
import { analyzeTechnicalDiscoverability } from "./modules/technical";
import { analyzeAiCrawlerAccess } from "./modules/ai-crawlers";
import { analyzeStructuredData } from "./modules/structured-data";
import { analyzeEEAT } from "./modules/eeat";
import { analyzeMetaTags } from "./modules/meta-tags";
import { analyzeNavigation } from "./modules/navigation";
import { analyzeGeographic } from "./modules/geographic";
import { analyzeVoiceAssistant } from "./modules/voice-assistant";
import { generateJsonLdFixes } from "../fix-generator/json-ld";
import { generateMetaTagFixes } from "../fix-generator/meta-tags";
import { generateRobotsTxtFixes } from "../fix-generator/robots-txt";
import { generateLlmsTxtContent } from "../fix-generator/llms-txt";

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  // Step 1: Fetch all resources
  const resources = await fetchResources(url);
  const { page, robotsTxt, llmsTxt, sitemapXml } = resources;

  // Step 2: Detect industry
  const industry = detectIndustry(page);

  // Step 3: Run all 10 scoring modules
  const categories = [
    analyzeContentStructure(page),
    analyzeContentDepth(page),
    analyzeTechnicalDiscoverability(page),
    analyzeAiCrawlerAccess(robotsTxt, llmsTxt),
    analyzeStructuredData(page, industry),
    analyzeEEAT(page),
    analyzeMetaTags(page),
    analyzeNavigation(page, sitemapXml),
    analyzeGeographic(page, industry),
    analyzeVoiceAssistant(page),
  ];

  // Recalculate weighted scores
  for (const cat of categories) {
    cat.weighted = (cat.score * cat.weight) / 100;
  }

  // Step 4: Calculate overall score
  const overallScore = calculateOverallScore(categories);
  const rating = getRating(overallScore);

  // Step 5: Generate fix code
  const schemaTypes = page.schemas.flatMap((s) => {
    const t = (s["@type"] as string) || "";
    if (Array.isArray(s["@graph"])) {
      return [
        t,
        ...(s["@graph"] as Record<string, unknown>[]).map(
          (g) => (g["@type"] as string) || ""
        ),
      ];
    }
    return [t];
  }).filter(Boolean);

  const generatedFixes = {
    jsonLd: generateJsonLdFixes(page, industry, schemaTypes),
    metaTags: generateMetaTagFixes(page),
    robotsTxt: generateRobotsTxtFixes(robotsTxt),
    llmsTxt: !llmsTxt ? generateLlmsTxtContent(page, url) : null,
    contentRecommendations: generateContentRecommendations(page),
  };

  // Extract unique internal links (max 50)
  const seen = new Set<string>();
  const internalLinks = page.links
    .filter((l) => {
      if (!l.isInternal || !l.href) return false;
      try {
        const abs = new URL(l.href, url).href;
        if (seen.has(abs)) return false;
        seen.add(abs);
        return true;
      } catch {
        return false;
      }
    })
    .slice(0, 50)
    .map((l) => ({
      href: new URL(l.href, url).href,
      text: l.text.trim() || new URL(l.href, url).pathname,
    }));

  return {
    url,
    pageTitle: page.title,
    industry,
    overallScore,
    rating,
    categories,
    generatedFixes,
    internalLinks,
    fetchedAt: new Date().toISOString(),
    metadata: {
      wordCount: page.wordCount,
      headingCount: page.headings.length,
      listCount: page.listCount,
      tableCount: page.tableCount,
      imageCount: page.images.length,
      faqCount: page.faqSections.length,
      schemaTypes,
      hasLlmsTxt: !!llmsTxt,
      hasRobotsTxt: !!robotsTxt,
      hasSitemap: !!sitemapXml,
    },
  };
}

function generateContentRecommendations(page: import("@/lib/types").ParsedPage): string[] {
  const recs: string[] = [];

  // H1 recommendation
  const h1s = page.headings.filter((h) => h.level === 1);
  if (h1s.length === 0) {
    recs.push("Add a keyword-rich H1 heading that describes the page content.");
  } else if (h1s[0].text.split(" ").length < 4) {
    recs.push(
      `Current H1 "${h1s[0].text}" is short. Consider making it more descriptive with relevant keywords.`
    );
  }

  // Image alt text
  const imagesWithoutAlt = page.images.filter((i) => !i.alt || i.alt.length < 5);
  if (imagesWithoutAlt.length > 0) {
    recs.push(
      `${imagesWithoutAlt.length} image(s) missing descriptive alt text. Add keyword-rich descriptions.`
    );
  }

  // FAQ suggestion
  if (page.faqSections.length === 0) {
    recs.push(
      "Add a FAQ section with 3-5 common questions. FAQ content is 2x more likely to be cited by LLMs."
    );
  }

  // Word count
  if (page.wordCount < 1500) {
    recs.push(
      `Content is ~${page.wordCount} words. Target 1500+ words for best citation probability (2x improvement).`
    );
  }

  // Statistics
  const bodyText = page.html.replace(/<[^>]+>/g, " ");
  const hasStats = /\d+%|\$[\d,]+|\d+x\s/i.test(bodyText);
  if (!hasStats) {
    recs.push(
      "Add specific statistics, percentages, or data points. Statistical data gives +22% citation likelihood."
    );
  }

  return recs;
}
