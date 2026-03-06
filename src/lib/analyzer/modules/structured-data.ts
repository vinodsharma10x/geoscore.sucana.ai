import type { CategoryResult, ParsedPage, Industry } from "@/lib/types";

const INDUSTRY_SCHEMAS: Record<Industry, string[]> = {
  healthcare: [
    "Hospital",
    "Physician",
    "MedicalClinic",
    "MedicalOrganization",
    "MedicalWebPage",
  ],
  ecommerce: ["Product", "Offer", "AggregateOffer", "MerchantReturnPolicy"],
  saas: ["SoftwareApplication", "WebApplication"],
  "local-business": [
    "LocalBusiness",
    "Restaurant",
    "Store",
    "Hotel",
    "FoodEstablishment",
  ],
  publisher: ["Article", "BlogPosting", "NewsArticle"],
  general: [],
};

const UNIVERSAL_SCHEMAS = [
  "Organization",
  "WebSite",
  "WebPage",
  "BreadcrumbList",
  "FAQPage",
];

function getSchemaTypes(
  schemas: Record<string, unknown>[]
): string[] {
  const types: string[] = [];
  for (const schema of schemas) {
    const type = schema["@type"];
    if (typeof type === "string") types.push(type);
    if (Array.isArray(type)) types.push(...type.map(String));
    // Check @graph
    if (Array.isArray(schema["@graph"])) {
      for (const item of schema["@graph"] as Record<string, unknown>[]) {
        const t = item["@type"];
        if (typeof t === "string") types.push(t);
        if (Array.isArray(t)) types.push(...t.map(String));
      }
    }
  }
  return [...new Set(types)];
}

function checkSchemaCompleteness(
  schemas: Record<string, unknown>[],
  targetType: string
): { found: boolean; missingProps: string[] } {
  const CRITICAL_PROPS: Record<string, string[]> = {
    Organization: ["name", "url", "logo", "sameAs"],
    Hospital: [
      "name",
      "address",
      "telephone",
      "medicalSpecialty",
      "geo",
    ],
    Physician: [
      "name",
      "medicalSpecialty",
      "address",
      "aggregateRating",
    ],
    Product: ["name", "offers", "image", "description"],
    Offer: ["price", "priceCurrency", "availability"],
    SoftwareApplication: [
      "name",
      "applicationCategory",
      "offers",
      "operatingSystem",
    ],
    Article: ["headline", "author", "datePublished", "image"],
    BlogPosting: ["headline", "author", "datePublished", "image"],
    LocalBusiness: ["name", "address", "telephone", "geo"],
    FAQPage: ["mainEntity"],
    BreadcrumbList: ["itemListElement"],
    WebSite: ["name", "url"],
  };

  const requiredProps = CRITICAL_PROPS[targetType] || [];
  const allSchemas = schemas.flatMap((s) => {
    if (Array.isArray(s["@graph"]))
      return [s, ...(s["@graph"] as Record<string, unknown>[])];
    return [s];
  });

  const matchingSchema = allSchemas.find((s) => {
    const t = s["@type"];
    return t === targetType || (Array.isArray(t) && t.includes(targetType));
  });

  if (!matchingSchema) return { found: false, missingProps: requiredProps };

  const missingProps = requiredProps.filter((prop) => {
    const val = matchingSchema[prop];
    return val === undefined || val === null || val === "";
  });

  return { found: true, missingProps };
}

export function analyzeStructuredData(
  page: ParsedPage,
  industry: Industry
): CategoryResult {
  const findings: CategoryResult["findings"] = [];
  const fixes: CategoryResult["fixes"] = [];
  let score = 0;

  const types = getSchemaTypes(page.schemas);

  if (types.length === 0) {
    findings.push({
      type: "critical",
      message: "No JSON-LD structured data found.",
    });
    fixes.push({
      title: "Add JSON-LD structured data",
      priority: "critical",
      description:
        "Add at minimum Organization + WebSite schemas. While LLMs don't parse JSON-LD directly, it helps via Google/Bing knowledge graphs.",
    });
    return {
      name: "Structured Data",
      score: 0,
      weight: 10,
      weighted: 0,
      findings,
      fixes,
    };
  }

  findings.push({
    type: "good",
    message: `JSON-LD schemas found: ${types.join(", ")}`,
  });
  score += 2;

  // Check universal schemas
  for (const type of UNIVERSAL_SCHEMAS) {
    const result = checkSchemaCompleteness(page.schemas, type);
    if (result.found) {
      if (result.missingProps.length === 0) {
        score += 0.5;
      } else {
        findings.push({
          type: "warning",
          message: `${type} schema missing properties: ${result.missingProps.join(", ")}`,
        });
      }
    }
  }

  // Check BreadcrumbList specifically
  if (!types.includes("BreadcrumbList")) {
    fixes.push({
      title: "Add BreadcrumbList schema",
      priority: "medium",
      description:
        "Add BreadcrumbList JSON-LD to show page hierarchy (e.g., Home > Section > Page).",
    });
  } else {
    score += 1;
  }

  // Check FAQPage
  if (page.faqSections.length > 0 && !types.includes("FAQPage")) {
    findings.push({
      type: "warning",
      message: "FAQ content exists on page but no FAQPage schema found.",
    });
    fixes.push({
      title: "Add FAQPage schema for existing FAQ content",
      priority: "medium",
      description:
        "FAQ content detected on page. Add FAQPage JSON-LD schema. Pages with FAQ schema are 2x more likely to be cited.",
    });
  } else if (types.includes("FAQPage")) {
    findings.push({
      type: "good",
      message: "FAQPage schema present. FAQ content is 2x more likely to be cited.",
    });
    score += 2;
  }

  // Check industry-specific schemas
  const industrySchemas = INDUSTRY_SCHEMAS[industry];
  const hasIndustrySchema = industrySchemas.some((s) => types.includes(s));
  if (hasIndustrySchema) {
    findings.push({
      type: "good",
      message: `Industry-specific schema (${industry}) detected.`,
    });
    score += 2;

    // Check completeness of industry schemas
    for (const type of industrySchemas) {
      const result = checkSchemaCompleteness(page.schemas, type);
      if (result.found && result.missingProps.length > 0) {
        findings.push({
          type: "warning",
          message: `${type} schema missing: ${result.missingProps.join(", ")}`,
        });
        fixes.push({
          title: `Complete ${type} schema`,
          priority: "medium",
          description: `Add missing properties: ${result.missingProps.join(", ")}`,
        });
      }
    }
  } else if (industry !== "general") {
    findings.push({
      type: "warning",
      message: `No ${industry}-specific schema found. Expected: ${industrySchemas.join(" or ")}.`,
    });
    fixes.push({
      title: `Add ${industry}-specific schema`,
      priority: "critical",
      description: `This appears to be a ${industry} page. Add ${industrySchemas[0]} schema with industry-specific properties.`,
    });
  }

  // Check for @id usage (entity linking)
  const hasId = page.schemas.some(
    (s) => s["@id"] || (Array.isArray(s["@graph"]) && (s["@graph"] as Record<string, unknown>[]).some((g) => g["@id"]))
  );
  if (hasId) {
    findings.push({
      type: "good",
      message: "@id property used for entity linking across schemas.",
    });
    score += 1;
  }

  return {
    name: "Structured Data",
    score: Math.min(Math.round(score), 10),
    weight: 10,
    weighted: (Math.min(Math.round(score), 10) * 10) / 100,
    findings,
    fixes,
  };
}
