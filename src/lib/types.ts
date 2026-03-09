export interface AnalysisRequest {
  url: string;
}

export interface Finding {
  type: "good" | "warning" | "critical" | "info";
  message: string;
}

export interface Fix {
  title: string;
  priority: "critical" | "medium" | "nice-to-have";
  description: string;
  code?: string;
  codeLanguage?: "json" | "html" | "text";
}

export interface CategoryResult {
  name: string;
  score: number; // 0-10
  weight: number; // percentage (0-100)
  weighted: number; // score * weight / 100
  findings: Finding[];
  fixes: Fix[];
}

export type Industry =
  | "healthcare"
  | "ecommerce"
  | "saas"
  | "local-business"
  | "publisher"
  | "general";

export type Rating = "excellent" | "good" | "needs-work" | "poor";

export interface AnalysisResult {
  url: string;
  pageTitle: string;
  industry: Industry;
  overallScore: number; // 0-100
  rating: Rating;
  categories: CategoryResult[];
  generatedFixes: {
    jsonLd: string | null;
    metaTags: string | null;
    robotsTxt: string | null;
    llmsTxt: string | null;
    contentRecommendations: string[];
  };
  internalLinks: { href: string; text: string }[];
  fetchedAt: string; // ISO date
  metadata: {
    wordCount: number;
    headingCount: number;
    listCount: number;
    tableCount: number;
    imageCount: number;
    faqCount: number;
    schemaTypes: string[];
    hasLlmsTxt: boolean;
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
  };
}

export interface ParsedPage {
  html: string;
  title: string;
  metaDescription: string;
  canonical: string | null;
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  robotsMeta: string | null;
  schemas: Record<string, unknown>[];
  headings: { level: number; text: string; hasId: boolean }[];
  images: { src: string; alt: string }[];
  links: { href: string; text: string; isInternal: boolean }[];
  faqSections: { question: string; answer: string }[];
  listCount: number;
  tableCount: number;
  wordCount: number;
  hasServerRenderedContent: boolean;
}

export interface FetchedResources {
  page: ParsedPage;
  robotsTxt: string | null;
  llmsTxt: string | null;
  sitemapXml: string | null;
}
