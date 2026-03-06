import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeContentStructure(page: ParsedPage): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // H1 check
  const h1s = page.headings.filter((h) => h.level === 1);
  if (h1s.length === 1) {
    findings.push({ type: "good", message: `H1 present: "${h1s[0].text}"` });
    score += 2;
  } else if (h1s.length === 0) {
    findings.push({ type: "critical", message: "No H1 heading found" });
    fixes.push({
      title: "Add a keyword-rich H1 heading",
      priority: "critical",
      description:
        "Every page needs exactly one H1 that describes the page content with relevant keywords.",
    });
  } else {
    findings.push({
      type: "warning",
      message: `Multiple H1s found (${h1s.length}). Should have exactly one.`,
    });
  }

  // Heading hierarchy
  const h2s = page.headings.filter((h) => h.level === 2);
  const h3s = page.headings.filter((h) => h.level === 3);
  if (h2s.length >= 3) {
    findings.push({
      type: "good",
      message: `Good heading structure: ${h2s.length} H2s, ${h3s.length} H3s`,
    });
    score += 2;
  } else if (h2s.length >= 1) {
    findings.push({
      type: "warning",
      message: `Only ${h2s.length} H2 heading(s). More sections improve structure.`,
    });
    score += 1;
  } else {
    findings.push({ type: "critical", message: "No H2 headings found" });
    fixes.push({
      title: "Add H2 section headings",
      priority: "critical",
      description:
        "Break content into sections with H2 headings. LLMs use heading hierarchy to understand page structure.",
    });
  }

  // Heading IDs (anchor links)
  const headingsWithIds = page.headings.filter((h) => h.hasId);
  if (headingsWithIds.length > 0) {
    findings.push({
      type: "good",
      message: `${headingsWithIds.length} headings have anchor IDs for deep linking`,
    });
    score += 1;
  } else if (page.headings.length > 3) {
    findings.push({
      type: "warning",
      message: "No heading IDs found. Add IDs for deep linking and table of contents.",
    });
  }

  // Lists
  if (page.listCount >= 3) {
    findings.push({
      type: "good",
      message: `${page.listCount} lists found. Structured lists get 3x more LLM citations.`,
    });
    score += 2;
  } else if (page.listCount >= 1) {
    findings.push({
      type: "info",
      message: `${page.listCount} list(s) found. More structured lists improve citability.`,
    });
    score += 1;
  } else {
    findings.push({
      type: "warning",
      message: "No lists found. Structured lists get 3x more LLM citations.",
    });
    fixes.push({
      title: "Add structured lists",
      priority: "medium",
      description:
        "Use <ul> or <ol> for features, steps, benefits. Structured lists are 3x more likely to be cited by LLMs.",
    });
  }

  // Tables
  if (page.tableCount >= 1) {
    findings.push({
      type: "good",
      message: `${page.tableCount} table(s) found. Comparison tables improve citability.`,
    });
    score += 1;
  }

  // FAQ sections
  if (page.faqSections.length >= 3) {
    findings.push({
      type: "good",
      message: `FAQ section found with ${page.faqSections.length} Q&As. FAQ content is 2x more likely to be cited.`,
    });
    score += 2;
  } else if (page.faqSections.length >= 1) {
    findings.push({
      type: "info",
      message: `${page.faqSections.length} FAQ(s) found. Adding more improves citation likelihood.`,
    });
    score += 1;
  } else {
    fixes.push({
      title: "Add a FAQ section",
      priority: "medium",
      description:
        "Pages with FAQ sections are 2x more likely to be cited by LLMs. Add 3-5 common questions about your content.",
    });
  }

  return {
    name: "Content Structure",
    score: Math.min(score, 10),
    weight: 25,
    weighted: (Math.min(score, 10) * 25) / 100,
    findings,
    fixes,
  };
}
