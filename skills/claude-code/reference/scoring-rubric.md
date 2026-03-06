# GEO Scoring Rubric — Detailed Criteria

## 1. Content Structure (25%)

| Score | Criteria |
|-------|----------|
| 9-10 | Clear H1 with keywords. H2/H3 hierarchy matches content outline. Server-rendered heading IDs for deep linking. Multiple lists and/or tables. FAQ section present. Content organized in modular, extractable sections. |
| 7-8 | Good heading hierarchy. Some lists/tables. Content is well-organized but missing FAQ or deep-linking anchors. |
| 5-6 | Basic headings exist but hierarchy is flat or inconsistent. Few lists. Content is wall-of-text in places. |
| 3-4 | Minimal headings. No lists or tables. Content is unstructured. |
| 0-2 | No meaningful heading structure. Pure paragraph text or mostly images/video with no text. |

**What to check:**
- H1 present and keyword-rich?
- H2/H3 hierarchy logical and complete?
- Heading IDs for anchor linking (server-rendered, not JS)?
- Lists (ul/ol) used for steps, features, benefits?
- Tables used for comparisons, data, specifications?
- FAQ section with Q&A format?
- Content in modular sections an LLM can extract independently?

## 2. Content Depth & Citability (20%)

| Score | Criteria |
|-------|----------|
| 9-10 | 1500+ words. Contains specific statistics/data points. Direct quotes from experts. Original research or first-hand data. Answer-first format (key info in first paragraph). Cites sources. |
| 7-8 | 1000+ words. Some statistics. Good depth. Mostly answer-first. |
| 5-6 | 500-1000 words. Generic content without specific data. Adequate depth but not citable. |
| 3-4 | Under 500 words. Thin content. No statistics or unique data. |
| 0-2 | Minimal text content. Mostly navigation/UI elements. Nothing an LLM would cite. |

**What to check:**
- Approximate word count (visible text)?
- Specific numbers, statistics, percentages?
- Direct quotes or expert opinions?
- Original research, case studies, first-hand data?
- Answer-first format (conclusion before explanation)?
- Sources cited or referenced?
- Comparison tables with specific data?

## 3. Technical Discoverability (15%)

| Score | Criteria |
|-------|----------|
| 9-10 | All content server-rendered (visible in HTML source). Clean semantic HTML. Fast load. Clean URL structure. No content behind login/paywall. |
| 7-8 | Most content server-rendered. Minor JS-dependent sections. Good URL structure. |
| 5-6 | Mix of SSR and client-rendered. Some important content loads via JS. |
| 3-4 | Significant content is JS-only (AJAX-loaded results, dynamic rendering). |
| 0-2 | Page is essentially empty without JavaScript. All content dynamically loaded. SPA with no SSR. |

**What to check:**
- Is main content in the initial HTML response?
- Does filtering/search require JS (AJAX views)?
- Are listing results server-rendered or JS-loaded?
- Clean, readable URLs (not query string soup)?
- Content accessible without login?
- Semantic HTML (article, section, nav, main)?

## 4. AI Crawler Access (10%)

| Score | Criteria |
|-------|----------|
| 9-10 | robots.txt explicitly allows all major AI crawlers by name (GPTBot, OAI-SearchBot, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended). llms.txt exists and follows spec. llms-full.txt exists. |
| 7-8 | robots.txt allows all crawlers (User-agent: * Allow: /) but doesn't name AI crawlers explicitly. llms.txt exists. |
| 5-6 | robots.txt doesn't block AI crawlers (default allow). No llms.txt. |
| 3-4 | robots.txt blocks some AI crawlers (e.g., blocks GPTBot but allows others). |
| 0-2 | robots.txt blocks most/all AI crawlers. Or robots.txt is missing entirely. |

**What to check:**
- robots.txt rules for: GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended, Amazonbot, CCBot, Bytespider
- /llms.txt exists? Follows spec (H1, blockquote, file lists)?
- /llms-full.txt exists?
- /.well-known/llm-index.json exists? (LLM-LD standard)

## 5. Structured Data (10%)

| Score | Criteria |
|-------|----------|
| 9-10 | Complete JSON-LD for page type. All critical properties filled (not empty stubs). Industry-specific schemas used. @id for entity linking. Matches visible content (no hidden-only data). |
| 7-8 | JSON-LD present with correct type. Most critical properties. Minor gaps. |
| 5-6 | Basic JSON-LD (e.g., Organization only). Missing page-specific schemas. |
| 3-4 | Minimal or incorrect JSON-LD. Wrong types. Empty properties. |
| 0-2 | No JSON-LD structured data at all. |

**Industry-specific expectations:**
- Healthcare: Hospital/Physician + medicalSpecialty + geo + openingHoursSpecification + aggregateRating
- E-commerce: Product + Offer (price, availability) + AggregateRating + MerchantReturnPolicy
- SaaS: SoftwareApplication + Organization + Offer tiers
- Local Business: Specific subtype + geo + openingHoursSpecification + areaServed
- Publisher: Article/BlogPosting + Person author + publisher + FAQPage
- All: BreadcrumbList, FAQPage (if FAQ content exists), WebSite with SearchAction

## 6. E-E-A-T Signals (8%)

| Score | Criteria |
|-------|----------|
| 9-10 | Author as Person (not Organization) with name, jobTitle, credentials, LinkedIn/social links, worksFor. Publisher with logo. Founding date. Privacy/Terms pages exist. Awards/certifications mentioned. |
| 7-8 | Author identified. Some credentials. Publisher present. Trust pages exist. |
| 5-6 | Author name only (no credentials or links). Basic publisher info. |
| 3-4 | No clear author. Organization-only attribution. No trust pages. |
| 0-2 | Anonymous content. No author, no publisher, no trust signals. |

**What to check:**
- Author type: Person (good) vs Organization (weak) vs none (bad)?
- Author has: jobTitle, hasCredential, alumniOf, sameAs, knowsAbout?
- Publisher identified with logo?
- Privacy policy, Terms of Service pages linked?
- Awards, certifications, years of experience mentioned?
- External profile links (LinkedIn, industry directories)?

## 7. Meta Tags & OG (5%)

| Score | Criteria |
|-------|----------|
| 9-10 | Unique title (<60 chars, keyword-rich). Description (<155 chars, action-oriented). Canonical URL. All OG tags (title, description, image, url, type). Twitter card (summary_large_image). Robots: index, follow. max-snippet:-1. |
| 7-8 | Title and description present and good. OG tags mostly complete. Canonical set. |
| 5-6 | Basic title and description. Missing some OG tags or canonical. |
| 3-4 | Generic/duplicate title. No description or poor description. Minimal OG. |
| 0-2 | Missing title or description. No OG tags. No canonical. |

## 8. Navigation (3%)

| Score | Criteria |
|-------|----------|
| 9-10 | BreadcrumbList schema (3+ levels). Strong internal linking. Related content links. Table of contents. Page in sitemap with lastmod. |
| 7-8 | Breadcrumbs present (HTML or schema). Good internal links. In sitemap. |
| 5-6 | Some internal links. In sitemap. No breadcrumbs. |
| 3-4 | Weak internal linking. May not be in sitemap. |
| 0-2 | Orphan page. No breadcrumbs. Not in sitemap. No internal links. |

## 9. Geographic (2%)

**Note: Weight should increase to 10% for local business pages.**

| Score | Criteria |
|-------|----------|
| 9-10 | GeoCoordinates (lat/lng). Full PostalAddress. areaServed defined. hasMap link. Multiple location handling (if applicable). |
| 7-8 | Address in schema. Missing geo coordinates. |
| 5-6 | Address visible on page but not in schema. |
| 3-4 | Partial address info. No structured location data. |
| 0-2 | No geographic information (acceptable for non-local pages — give 5/10 baseline). |

## 10. Voice & Assistant (2%)

| Score | Criteria |
|-------|----------|
| 9-10 | SpeakableSpecification with cssSelector targeting title + key content. FAQPage schema for Q&A content. Content structured for voice extraction. |
| 7-8 | FAQPage schema present. No speakable but content is voice-friendly. |
| 5-6 | FAQ content exists on page but no FAQPage schema. |
| 3-4 | No FAQ content. No speakable. Content not voice-friendly. |
| 0-2 | No voice optimization at all (give 3/10 baseline for non-voice sites). |
