import type { Industry, ParsedPage } from "@/lib/types";

export function detectIndustry(page: ParsedPage): Industry {
  const types = page.schemas.flatMap((s) => {
    const items = [s];
    if (Array.isArray(s["@graph"]))
      items.push(...(s["@graph"] as Record<string, unknown>[]));
    return items.map((i) => (i["@type"] as string) || "");
  });

  const text = (page.title + " " + page.metaDescription).toLowerCase();
  const bodyText = page.html.replace(/<[^>]+>/g, " ").toLowerCase();

  // Healthcare signals
  const healthcareSchemas = [
    "Hospital",
    "Physician",
    "MedicalClinic",
    "MedicalOrganization",
    "MedicalWebPage",
    "MedicalBusiness",
    "MedicalCondition",
    "MedicalProcedure",
  ];
  if (healthcareSchemas.some((t) => types.includes(t))) return "healthcare";
  const healthcareKeywords = [
    "hospital",
    "doctor",
    "physician",
    "medical",
    "clinic",
    "patient",
    "healthcare",
    "health care",
    "surgery",
    "diagnosis",
    "treatment",
    "cardiology",
    "orthopedic",
    "pediatric",
  ];
  if (healthcareKeywords.filter((k) => text.includes(k)).length >= 2)
    return "healthcare";

  // E-commerce signals
  const ecommerceSchemas = ["Product", "Offer", "AggregateOffer", "ShoppingCenter"];
  if (ecommerceSchemas.some((t) => types.includes(t))) return "ecommerce";
  const ecommerceKeywords = [
    "add to cart",
    "buy now",
    "shop",
    "price",
    "product",
    "checkout",
    "shipping",
    "$",
    "in stock",
    "out of stock",
  ];
  if (ecommerceKeywords.filter((k) => bodyText.includes(k)).length >= 3)
    return "ecommerce";

  // SaaS signals
  const saasSchemas = ["SoftwareApplication", "WebApplication", "MobileApplication"];
  if (saasSchemas.some((t) => types.includes(t))) return "saas";
  const saasKeywords = [
    "saas",
    "software",
    "platform",
    "dashboard",
    "pricing",
    "free trial",
    "sign up",
    "api",
    "integration",
    "workflow",
    "automate",
  ];
  if (saasKeywords.filter((k) => text.includes(k)).length >= 2) return "saas";

  // Local business signals
  const localSchemas = [
    "LocalBusiness",
    "Restaurant",
    "Store",
    "Hotel",
    "FoodEstablishment",
    "AutoRepair",
    "Dentist",
    "LegalService",
    "RealEstateAgent",
  ];
  if (localSchemas.some((t) => types.includes(t))) return "local-business";
  const localKeywords = [
    "directions",
    "open hours",
    "visit us",
    "our location",
    "map",
    "reservations",
    "book a table",
    "walk-in",
  ];
  if (localKeywords.filter((k) => bodyText.includes(k)).length >= 2)
    return "local-business";

  // Publisher signals
  const publisherSchemas = ["Article", "BlogPosting", "NewsArticle"];
  if (publisherSchemas.some((t) => types.includes(t))) return "publisher";
  const publisherKeywords = [
    "blog",
    "article",
    "author",
    "published",
    "editorial",
    "news",
    "opinion",
    "guide",
    "how to",
    "read more",
  ];
  if (publisherKeywords.filter((k) => text.includes(k)).length >= 2)
    return "publisher";

  return "general";
}
