import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeContentDepth(page: ParsedPage): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // Word count
  if (page.wordCount >= 1500) {
    findings.push({
      type: "good",
      message: `Strong content depth: ~${page.wordCount} words. Pages with 1500+ words are 2x more likely to be cited.`,
    });
    score += 3;
  } else if (page.wordCount >= 800) {
    findings.push({
      type: "info",
      message: `Moderate content: ~${page.wordCount} words. Target 1500+ for best citation probability.`,
    });
    score += 2;
  } else if (page.wordCount >= 300) {
    findings.push({
      type: "warning",
      message: `Thin content: ~${page.wordCount} words. Pages under 800 words are rarely cited by LLMs.`,
    });
    score += 1;
  } else {
    findings.push({
      type: "critical",
      message: `Very thin content: ~${page.wordCount} words. Likely invisible to LLMs.`,
    });
    fixes.push({
      title: "Add substantially more content",
      priority: "critical",
      description:
        "Pages with 1500+ words are 2x more likely to be cited by LLMs. Add depth with explanations, data, examples, and FAQs.",
    });
  }

  // Check for statistics/numbers in content
  const bodyText = page.html.replace(/<[^>]+>/g, " ");
  const statPatterns = [
    /\d+%/g,
    /\$[\d,]+/g,
    /\d+x\s/gi,
    /\d+\.\d+/g,
    /\d{3,}/g,
  ];
  let statCount = 0;
  for (const pattern of statPatterns) {
    const matches = bodyText.match(pattern);
    if (matches) statCount += matches.length;
  }

  if (statCount >= 5) {
    findings.push({
      type: "good",
      message: `Found ~${statCount} statistics/data points. Statistical data gives +22% citation likelihood.`,
    });
    score += 2;
  } else if (statCount >= 2) {
    findings.push({
      type: "info",
      message: `Found ~${statCount} data points. Adding more statistics improves citability by 22%.`,
    });
    score += 1;
  } else {
    findings.push({
      type: "warning",
      message:
        "Few or no statistics found. Pages with specific data get +22% citation likelihood.",
    });
    fixes.push({
      title: "Add specific statistics and data points",
      priority: "medium",
      description:
        "Include percentages, dollar amounts, counts, and benchmarks. Statistical data gives +22% citation likelihood.",
    });
  }

  // Check for blockquotes / expert quotes
  const quoteCount = (bodyText.match(/<blockquote/gi) || []).length;
  const pullQuoteIndicators = (
    bodyText.match(/according to|says |said |notes |explains /gi) || []
  ).length;

  if (quoteCount >= 1 || pullQuoteIndicators >= 2) {
    findings.push({
      type: "good",
      message:
        "Expert quotes or citations detected. Direct quotes give +37% citation likelihood.",
    });
    score += 2;
  } else {
    fixes.push({
      title: "Add expert quotes or citations",
      priority: "medium",
      description:
        "Include 2-3 direct quotes from experts or authoritative sources. Quotes give +37% citation likelihood.",
    });
  }

  // Answer-first format check
  const firstH2Index = page.headings.findIndex((h) => h.level === 2);
  const hasEarlyContent = page.wordCount > 50;
  if (hasEarlyContent && firstH2Index >= 0) {
    findings.push({
      type: "info",
      message: "Content has structure with sections. Ensure key answers appear early (answer-first format).",
    });
    score += 1;
  }

  // Check for source citations
  const citationPatterns =
    /\[[\d]+\]|source:|according to|study|research|report/gi;
  const citationMatches = bodyText.match(citationPatterns);
  if (citationMatches && citationMatches.length >= 2) {
    findings.push({
      type: "good",
      message: "Source citations detected. Citing sources signals credibility to LLMs.",
    });
    score += 2;
  }

  return {
    name: "Content Depth & Citability",
    score: Math.min(score, 10),
    weight: 20,
    weighted: (Math.min(score, 10) * 20) / 100,
    findings,
    fixes,
  };
}
