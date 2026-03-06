import type { CategoryResult, ParsedPage } from "@/lib/types";

export function analyzeEEAT(page: ParsedPage): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  const allSchemas = page.schemas.flatMap((s) => {
    if (Array.isArray(s["@graph"]))
      return [s, ...(s["@graph"] as Record<string, unknown>[])];
    return [s];
  });

  // Author check
  const personSchemas = allSchemas.filter((s) => s["@type"] === "Person");
  const articleSchemas = allSchemas.filter((s) =>
    ["Article", "BlogPosting", "NewsArticle"].includes(s["@type"] as string)
  );

  let hasPersonAuthor = false;
  for (const article of articleSchemas) {
    const author = article.author as Record<string, unknown> | undefined;
    if (author?.["@type"] === "Person") {
      hasPersonAuthor = true;
      findings.push({
        type: "good",
        message: `Author identified as Person: "${author.name}"`,
      });
      score += 2;

      // Check author depth
      if (author.jobTitle) {
        findings.push({ type: "good", message: `Author has jobTitle: "${author.jobTitle}"` });
        score += 1;
      }
      if (author.sameAs) {
        findings.push({ type: "good", message: "Author has external profile links (sameAs)." });
        score += 1;
      }
      if (author.worksFor || author.affiliation) {
        score += 0.5;
      }
      if (author.hasCredential || author.alumniOf) {
        findings.push({ type: "good", message: "Author has credentials or education listed." });
        score += 1;
      }
      break;
    } else if (author?.["@type"] === "Organization") {
      findings.push({
        type: "warning",
        message:
          "Author is an Organization, not a Person. Person authors score higher for E-E-A-T.",
      });
      score += 1;
    }
  }

  if (!hasPersonAuthor && personSchemas.length > 0) {
    findings.push({
      type: "info",
      message: "Person schema found but not linked as article author.",
    });
    score += 1;
  }

  if (!hasPersonAuthor && articleSchemas.length > 0) {
    fixes.push({
      title: "Use Person type for article author",
      priority: "medium",
      description:
        "Change author from Organization to Person with name, jobTitle, sameAs (LinkedIn), and hasCredential properties.",
    });
  }

  // Publisher check
  const hasPublisher = articleSchemas.some(
    (s) => (s.publisher as Record<string, unknown>)?.name
  );
  if (hasPublisher) {
    findings.push({ type: "good", message: "Publisher organization identified." });
    score += 1;
  }

  // Organization with sameAs (social proof)
  const orgSchemas = allSchemas.filter(
    (s) => s["@type"] === "Organization"
  );
  for (const org of orgSchemas) {
    const sameAs = org.sameAs;
    if (Array.isArray(sameAs) && sameAs.length >= 2) {
      findings.push({
        type: "good",
        message: `Organization linked to ${sameAs.length} external profiles.`,
      });
      score += 1;
      break;
    }
  }

  // Trust pages check
  const trustPages = page.links.filter(
    (l) =>
      l.isInternal &&
      (l.href.includes("privacy") ||
        l.href.includes("terms") ||
        l.href.includes("about") ||
        l.href.includes("contact"))
  );
  if (trustPages.length >= 2) {
    findings.push({
      type: "good",
      message: `Trust pages linked: ${trustPages.map((l) => l.text || l.href).join(", ")}`,
    });
    score += 1;
  } else {
    fixes.push({
      title: "Link to trust pages",
      priority: "nice-to-have",
      description:
        "Add links to Privacy Policy, Terms of Service, About, and Contact pages. These signal trustworthiness.",
    });
  }

  // Awards / certifications in visible text
  const bodyText = page.html.replace(/<[^>]+>/g, " ").toLowerCase();
  const trustSignals = [
    "award",
    "certified",
    "accredited",
    "board-certified",
    "years of experience",
    "founded in",
  ];
  const foundSignals = trustSignals.filter((s) => bodyText.includes(s));
  if (foundSignals.length >= 1) {
    findings.push({
      type: "good",
      message: `Trust signals found in content: ${foundSignals.join(", ")}`,
    });
    score += 1;
  }

  return {
    name: "E-E-A-T Signals",
    score: Math.min(Math.round(score), 10),
    weight: 8,
    weighted: (Math.min(Math.round(score), 10) * 8) / 100,
    findings,
    fixes,
  };
}
