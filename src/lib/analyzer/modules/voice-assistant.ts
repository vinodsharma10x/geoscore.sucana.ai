import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeVoiceAssistant(page: ParsedPage): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  const allSchemas = page.schemas.flatMap((s) => {
    if (Array.isArray(s["@graph"]))
      return [s, ...(s["@graph"] as Record<string, unknown>[])];
    return [s];
  });

  // SpeakableSpecification
  const hasSpeakable = allSchemas.some(
    (s) =>
      s.speakable ||
      s["@type"] === "SpeakableSpecification"
  );

  if (hasSpeakable) {
    findings.push({
      type: "good",
      message:
        "SpeakableSpecification found. Content is marked for voice assistant extraction.",
    });
    score += 4;
  } else {
    findings.push({
      type: "info",
      message:
        "No SpeakableSpecification. Adding one helps voice assistants identify key content to read aloud.",
    });
    fixes.push({
      title: "Add SpeakableSpecification",
      priority: "nice-to-have",
      description:
        'Add speakable: { "@type": "SpeakableSpecification", "cssSelector": ["h1", "article h2", "article p:first-of-type"] } to target title, headings, and intro paragraph.',
    });
  }

  // FAQPage schema (also helps voice)
  const hasFaqSchema = allSchemas.some((s) => s["@type"] === "FAQPage");
  if (hasFaqSchema) {
    findings.push({
      type: "good",
      message:
        "FAQPage schema present. FAQ format maps directly to voice assistant Q&A patterns.",
    });
    score += 3;
  } else if (page.faqSections.length > 0) {
    findings.push({
      type: "warning",
      message:
        "FAQ content exists but no FAQPage schema. Add schema for voice assistant compatibility.",
    });
    score += 1;
  }

  // Content voice-friendliness
  // Short sentences, clear structure, Q&A format
  const h2Count = page.headings.filter((h) => h.level === 2).length;
  const hasQaFormat = page.headings.some(
    (h) => h.text.endsWith("?") || h.text.toLowerCase().includes("how")
  );

  if (hasQaFormat) {
    findings.push({
      type: "good",
      message: "Question-format headings detected. Good for voice queries.",
    });
    score += 2;
  }

  if (h2Count >= 3 && page.listCount >= 1) {
    score += 1;
  }

  // Give baseline for non-voice-critical pages
  if (score === 0) {
    score = 3;
    findings.push({
      type: "info",
      message:
        "Voice optimization is an emerging channel. Basic improvements are low-effort.",
    });
  }

  return {
    name: "Voice & Assistant",
    score: Math.min(score, 10),
    weight: 2,
    weighted: (Math.min(score, 10) * 2) / 100,
    findings,
    fixes,
  };
}
