import type { CategoryResult, ParsedPage, Industry } from "@/lib/types";

export function analyzeGeographic(
  page: ParsedPage,
  industry: Industry
): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  // Adjust weight for local businesses
  const weight = industry === "local-business" || industry === "healthcare" ? 10 : 2;

  const allSchemas = page.schemas.flatMap((s) => {
    if (Array.isArray(s["@graph"]))
      return [s, ...(s["@graph"] as Record<string, unknown>[])];
    return [s];
  });

  // Check for GeoCoordinates
  const hasGeo = allSchemas.some(
    (s) =>
      s["@type"] === "GeoCoordinates" ||
      (s.geo && (s.geo as Record<string, unknown>)["@type"] === "GeoCoordinates")
  );

  if (hasGeo) {
    findings.push({
      type: "good",
      message: "GeoCoordinates (latitude/longitude) present in schema.",
    });
    score += 3;
  } else if (industry === "local-business" || industry === "healthcare") {
    findings.push({
      type: "critical",
      message:
        'No GeoCoordinates found. Critical for "near me" queries in AI search.',
    });
    fixes.push({
      title: "Add GeoCoordinates to schema",
      priority: "critical",
      description:
        'Add geo: { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... } to your location schema. Essential for proximity-based AI queries.',
    });
  }

  // Check for PostalAddress
  const hasAddress = allSchemas.some(
    (s) =>
      s["@type"] === "PostalAddress" ||
      (s.address &&
        (s.address as Record<string, unknown>)["@type"] === "PostalAddress")
  );

  if (hasAddress) {
    findings.push({
      type: "good",
      message: "PostalAddress found in schema.",
    });
    score += 2;
  } else if (industry === "local-business" || industry === "healthcare") {
    findings.push({
      type: "warning",
      message: "No PostalAddress in schema.",
    });
    fixes.push({
      title: "Add full PostalAddress to schema",
      priority: "critical",
      description:
        "Include streetAddress, addressLocality, addressRegion, postalCode, addressCountry.",
    });
  }

  // Check for areaServed
  const hasAreaServed = allSchemas.some((s) => s.areaServed);
  if (hasAreaServed) {
    findings.push({
      type: "good",
      message: "areaServed defined in schema.",
    });
    score += 2;
  } else if (industry === "local-business" || industry === "healthcare") {
    fixes.push({
      title: "Add areaServed property",
      priority: "medium",
      description:
        "Define the geographic area served (city, county, zip codes). Helps AI answer location-specific queries.",
    });
  }

  // Check for hasMap
  const hasMap = allSchemas.some((s) => s.hasMap);
  if (hasMap) {
    score += 1;
  }

  // For non-local pages, give a baseline score
  if (
    industry !== "local-business" &&
    industry !== "healthcare" &&
    score === 0
  ) {
    score = 5; // Not applicable, neutral score
    findings.push({
      type: "info",
      message: "Geographic data not critical for this page type.",
    });
  }

  // openingHoursSpecification
  const hasHours = allSchemas.some(
    (s) => s.openingHoursSpecification || s.openingHours
  );
  if (hasHours) {
    findings.push({
      type: "good",
      message: "Opening hours found in schema.",
    });
    score += 2;
  } else if (industry === "local-business" || industry === "healthcare") {
    fixes.push({
      title: "Add openingHoursSpecification",
      priority: "medium",
      description:
        "Use openingHoursSpecification with dayOfWeek arrays instead of openingHours string. More precise for AI queries.",
    });
  }

  return {
    name: "Geographic",
    score: Math.min(score, 10),
    weight,
    weighted: (Math.min(score, 10) * weight) / 100,
    findings,
    fixes,
  };
}
