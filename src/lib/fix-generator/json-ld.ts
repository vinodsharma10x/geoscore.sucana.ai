import type { ParsedPage, Industry } from "@/lib/types";

export function generateJsonLdFixes(
  page: ParsedPage,
  industry: Industry,
  existingTypes: string[]
): string | null {
  const fixes: string[] = [];

  // Organization (if missing)
  if (!existingTypes.includes("Organization")) {
    fixes.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "[Your Company Name]",
          url: new URL(page.canonical || "https://example.com").origin,
          logo: "[Logo URL]",
          sameAs: [
            "[Twitter URL]",
            "[LinkedIn URL]",
            "[Instagram URL]",
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: "[Contact Page URL]",
          },
        },
        null,
        2
      )
    );
  }

  // BreadcrumbList (if missing)
  if (!existingTypes.includes("BreadcrumbList")) {
    fixes.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: new URL(page.canonical || "https://example.com").origin,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "[Section Name]",
              item: "[Section URL]",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: page.title || "[Page Title]",
              item: page.canonical || "[Page URL]",
            },
          ],
        },
        null,
        2
      )
    );
  }

  // FAQPage (if FAQ content exists but no schema)
  if (
    page.faqSections.length > 0 &&
    !existingTypes.includes("FAQPage")
  ) {
    fixes.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: page.faqSections.slice(0, 10).map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        },
        null,
        2
      )
    );
  }

  // Industry-specific schemas
  if (industry === "publisher" && !existingTypes.includes("Article") && !existingTypes.includes("BlogPosting")) {
    fixes.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.title || "[Article Title]",
          description: page.metaDescription || "[Description]",
          image: page.ogTags["og:image"] || "[Image URL]",
          datePublished: "[YYYY-MM-DD]",
          dateModified: "[YYYY-MM-DD]",
          author: {
            "@type": "Person",
            name: "[Author Name]",
            jobTitle: "[Job Title]",
            url: "[Author Profile URL]",
            sameAs: ["[LinkedIn URL]"],
          },
          publisher: {
            "@type": "Organization",
            name: "[Publisher Name]",
            logo: { "@type": "ImageObject", url: "[Logo URL]" },
          },
          mainEntityOfPage: page.canonical || "[Page URL]",
        },
        null,
        2
      )
    );
  }

  if (industry === "saas" && !existingTypes.includes("SoftwareApplication")) {
    fixes.push(
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "[App Name]",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: page.canonical || "[URL]",
          description: page.metaDescription || "[Description]",
          featureList: "[Feature 1, Feature 2, Feature 3]",
          offers: {
            "@type": "AggregateOffer",
            lowPrice: "0",
            highPrice: "[Highest Tier Price]",
            priceCurrency: "USD",
            offerCount: "[Number of Tiers]",
          },
        },
        null,
        2
      )
    );
  }

  if (fixes.length === 0) return null;
  return fixes.join("\n\n");
}
