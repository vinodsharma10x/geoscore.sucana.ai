# GEO Audit Reference Guide

## Scoring Rubric

### 1. Content Structure (25%)
- **9-10:** Clear keyword-rich H1. Logical H2/H3 hierarchy. Server-rendered heading IDs. Multiple lists and tables. FAQ section. Modular extractable sections.
- **7-8:** Good headings. Some lists/tables. Well-organized. Missing FAQ or anchor IDs.
- **5-6:** Basic headings, flat hierarchy. Few lists. Some wall-of-text.
- **3-4:** Minimal headings. No lists or tables.
- **0-2:** No heading structure. Pure paragraphs or mostly images/video.

### 2. Content Depth & Citability (20%)
- **9-10:** 1500+ words. Specific statistics/data. Expert quotes. Original research. Answer-first format. Cites sources.
- **7-8:** 1000+ words. Some statistics. Good depth. Mostly answer-first.
- **5-6:** 500-1000 words. Generic content, no specific data.
- **3-4:** Under 500 words. Thin, no statistics.
- **0-2:** Minimal text. Mostly navigation/UI.

### 3. Technical Discoverability (15%)
- **9-10:** All content server-rendered. Clean semantic HTML. Fast load. Clean URLs.
- **7-8:** Most content SSR. Minor JS-dependent sections.
- **5-6:** Mix of SSR and client-rendered.
- **3-4:** Significant JS-only content (AJAX-loaded results).
- **0-2:** Empty without JavaScript. SPA with no SSR.

### 4. AI Crawler Access (10%)
- **9-10:** robots.txt explicitly allows all major AI crawlers by name. llms.txt exists and follows spec. llms-full.txt exists.
- **7-8:** Default allow all. llms.txt exists.
- **5-6:** Default allow. No llms.txt.
- **3-4:** Blocks some AI crawlers.
- **0-2:** Blocks most AI crawlers. Or no robots.txt.

### 5. Structured Data (10%)
- **9-10:** Complete JSON-LD for page type. All critical properties. Industry-specific schemas. @id for entity linking.
- **7-8:** JSON-LD present, correct type. Most critical properties.
- **5-6:** Basic JSON-LD (Organization only). Missing page-specific schemas.
- **3-4:** Minimal or incorrect JSON-LD.
- **0-2:** No JSON-LD.

### 6. E-E-A-T Signals (8%)
- **9-10:** Author as Person with name, jobTitle, credentials, LinkedIn, worksFor. Publisher with logo. Privacy/Terms pages. Awards.
- **7-8:** Author identified. Some credentials. Publisher present.
- **5-6:** Author name only. Basic publisher.
- **3-4:** No clear author. Organization-only.
- **0-2:** Anonymous content.

### 7. Meta Tags & OG (5%)
- **9-10:** Unique title (<60 chars). Description (<155 chars). Canonical. All OG tags. Twitter card. max-snippet:-1.
- **7-8:** Good title/description. Mostly complete OG. Canonical set.
- **5-6:** Basic title/description. Missing some OG.
- **3-4:** Generic title. No or poor description.
- **0-2:** Missing title or description. No OG.

### 8. Navigation (3%)
- **9-10:** BreadcrumbList schema (3+ levels). Strong internal links. Related content. Table of contents. In sitemap with lastmod.
- **7-8:** Breadcrumbs present. Good internal links. In sitemap.
- **5-6:** Some internal links. In sitemap. No breadcrumbs.
- **3-4:** Weak linking. May not be in sitemap.
- **0-2:** Orphan page. No breadcrumbs. Not in sitemap.

### 9. Geographic (2% — increase to 10% for local business)
- **9-10:** GeoCoordinates (lat/lng). Full PostalAddress. areaServed. hasMap.
- **7-8:** Address in schema. No coordinates.
- **5-6:** Address visible but not in schema.
- **3-4:** Partial address. No structured data.
- **0-2:** No geographic info (give 5/10 baseline for non-local pages).

### 10. Voice & Assistant (2%)
- **9-10:** SpeakableSpecification targeting title + key content. FAQPage schema.
- **7-8:** FAQPage schema. No speakable but voice-friendly content.
- **5-6:** FAQ content exists but no schema.
- **3-4:** No FAQ. No speakable.
- **0-2:** No voice optimization (give 3/10 baseline).

---

## Schema Checklists by Industry

### Healthcare

**Hospital page must have:** Hospital schema (name, address, geo, medicalSpecialty enum, openingHoursSpecification, isAcceptingNewPatients, availableService with names, department, aggregateRating, parentOrganization, areaServed, sameAs), Organization parent, BreadcrumbList, FAQPage.

**Doctor profile must have:** Physician schema (medicalSpecialty enum, usNPI, isAcceptingNewPatients, hospitalAffiliation, hasCredential with board certs, alumniOf, aggregateRating, knowsAbout, address+geo per location, sameAs to Healthgrades/Doximity), Person, BreadcrumbList, FAQPage (locations, specialty, accepting patients, insurance, education, rating).

**Doctor/Location finder must have:** CollectionPage + ItemList, SearchAction, FAQPage. Results MUST be server-rendered.

**MedicalSpecialty enum (42 values):** Anesthesia, Cardiovascular, CommunityHealth, Dentistry, Dermatologic, DietNutrition, Emergency, Endocrine, Gastroenterologic, Genetic, Geriatric, Gynecologic, Hematologic, Infectious, LaboratoryScience, Midwifery, Musculoskeletal, Neurologic, Nursing, Obstetric, OccupationalTherapy, Oncologic, Optometric, Otolaryngologic, Pathology, Pediatric, PharmacySpecialty, Physiotherapy, PlasticSurgery, Podiatric, PrimaryCare, Psychiatric, PublicHealth, Pulmonary, Radiography, Renal, RespiratoryTherapy, Rheumatologic, SpeechPathology, Surgical, Toxicologic, Urologic.

### E-Commerce

**Product page must have:** Product (name, description, image, sku, gtin/mpn, brand, offers with price+currency+availability, aggregateRating, review, hasMerchantReturnPolicy, shippingDetails), BreadcrumbList, FAQPage.

**Category page must have:** CollectionPage + ItemList, BreadcrumbList. Products MUST be server-rendered.

### SaaS / Software

**Homepage must have:** SoftwareApplication (applicationCategory, operatingSystem, featureList, offers per tier with UnitPriceSpecification, aggregateRating), Organization (founders as Person with LinkedIn, foundingDate, sameAs to G2/Capterra/Crunchbase), WebSite with SearchAction, FAQPage.

### Local Business

**Location page must have:** Specific LocalBusiness subtype (Restaurant not FoodEstablishment, Dentist not MedicalBusiness), address + geo (lat/lng), openingHoursSpecification with dayOfWeek, aggregateRating, priceRange, sameAs (Yelp, Google Business), BreadcrumbList. Each location needs UNIQUE schema — never copy-paste.

### Publisher / Media

**Article must have:** BlogPosting or Article (headline, author as Person with jobTitle+sameAs+worksFor, datePublished, dateModified, publisher with logo, articleBody, keywords, speakable), BreadcrumbList, FAQPage if FAQ section exists.

### Universal (Every Site)

Every site needs: Organization + WebSite (with SearchAction) on homepage. BreadcrumbList on every page. Canonical URLs. OG tags. FAQPage wherever FAQ content exists.

Properties that help LLMs most: @id (entity linking), sameAs (external profiles), knowsAbout (expertise), mainEntityOfPage, speakable, dateModified.

---

## AI Crawler User Agents

### Must Allow
| User Agent | Company | Purpose |
|------------|---------|---------|
| GPTBot | OpenAI | Training (block to opt out) |
| OAI-SearchBot | OpenAI | ChatGPT search index (no training) |
| ChatGPT-User | OpenAI | Real-time URL fetch |
| ClaudeBot | Anthropic | Training (block to opt out) |
| Claude-SearchBot | Anthropic | Search index |
| Claude-User | Anthropic | Real-time fetch |
| Google-Extended | Google | Gemini/AI training |
| PerplexityBot | Perplexity | Search index |
| Perplexity-User | Perplexity | Real-time RAG |
| Applebot-Extended | Apple | Apple Intelligence |

### Should Allow
Amazonbot, CCBot, Bytespider, DeepSeekBot, DuckAssistBot, meta-externalagent, GoogleAgent-Mariner, Gemini-Deep-Research.

### Key Nuances
- Blocking ClaudeBot does NOT block Claude-User or Claude-SearchBot
- Perplexity requires both PerplexityBot AND BingPreview allowed
- Google-Extended only affects Gemini, not Google Search

---

## Citation Research

| Factor | Impact |
|--------|--------|
| Statistical data | +22% citation likelihood |
| Direct quotes | +37% citation likelihood |
| Original research | 67% of top 1000 cited pages |
| FAQ schema | 2x more likely cited |
| 1500+ words | 2x citation probability |
| G2/Trustpilot profiles | 3x ChatGPT citation |
| Lists + tables | 3x more likely cited |

**Key insight:** Only 11% of domains are cited by BOTH ChatGPT and Perplexity. Each LLM has distinct citation patterns.

**llms.txt:** No proven citation correlation (SE Ranking, 300K domains). Still recommended as low-effort best practice.

**JSON-LD:** LLMs don't parse it as machine-readable data (SearchVIU study). Helps indirectly via Google/Bing knowledge graphs.
