# Schema Checklists by Industry

## Healthcare

### Page Type: Hospital/Clinic Profile
**Required schemas:** Hospital (or MedicalClinic), Organization (parent), BreadcrumbList
**Recommended:** FAQPage, SpeakableSpecification

**Hospital critical properties:**
- name, description, url, telephone, logo, image
- address (PostalAddress — street, city, state, zip, country)
- geo (GeoCoordinates — latitude, longitude)
- medicalSpecialty (use enum: Cardiovascular, Oncologic, Neurologic, etc.)
- openingHoursSpecification (per department, with dayOfWeek)
- isAcceptingNewPatients (Boolean)
- availableService (MedicalProcedure with name + url, not empty stubs)
- department (for sub-departments like ER, NICU)
- aggregateRating + review (if ratings exist)
- hasCredential, hasCertification, award
- parentOrganization (link to health system)
- areaServed (city/county/zip codes served)
- sameAs (Google Maps, social profiles)

### Page Type: Doctor/Physician Profile
**Required schemas:** Physician (or IndividualPhysician), Person, BreadcrumbList
**Recommended:** FAQPage (auto-generate: locations, specialty, accepting patients, insurance, education, rating)

**Physician critical properties:**
- name, description, url, image, telephone
- medicalSpecialty (enum value, not free text)
- usNPI (National Provider Identifier)
- isAcceptingNewPatients
- hospitalAffiliation / practicesAt
- hasCredential (board certifications with recognizedBy)
- alumniOf (medical school, residency, fellowship)
- aggregateRating (ratingValue, ratingCount)
- knowsAbout (clinical interests)
- availableService (specific procedures, not generic)
- address + geo for each practice location
- openingHoursSpecification per location
- sameAs (Healthgrades, Doximity, state medical board)
- worksFor, memberOf

### Page Type: Doctor/Location Finder (Listing)
**Required schemas:** CollectionPage + ItemList, WebPage, SearchAction
**Recommended:** FAQPage ("How many doctors?", "What specialties?")

**Critical:** Results MUST be server-rendered. JS-only listings are invisible to LLMs.

### MedicalSpecialty Enum (42 values)
Anesthesia, Cardiovascular, CommunityHealth, Dentistry, Dermatologic,
DietNutrition, Emergency, Endocrine, Gastroenterologic, Genetic,
Geriatric, Gynecologic, Hematologic, Infectious, LaboratoryScience,
Midwifery, Musculoskeletal, Neurologic, Nursing, Obstetric,
OccupationalTherapy, Oncologic, Optometric, Otolaryngologic,
Pathology, Pediatric, PharmacySpecialty, Physiotherapy, PlasticSurgery,
Podiatric, PrimaryCare, Psychiatric, PublicHealth, Pulmonary,
Radiography, Renal, RespiratoryTherapy, Rheumatologic, SpeechPathology,
Surgical, Toxicologic, Urologic

---

## E-Commerce

### Page Type: Product Page
**Required schemas:** Product + Offer, BreadcrumbList
**Recommended:** AggregateRating, Review, FAQPage, MerchantReturnPolicy

**Product critical properties:**
- name, description, image (multiple), sku, gtin/mpn
- brand (Brand or Organization)
- offers (Offer with: price, priceCurrency, availability, url)
- aggregateRating (ratingValue, reviewCount, bestRating)
- review (at least 1-3 with author, rating, body, date)
- hasMerchantReturnPolicy (returnPolicyCategory, merchantReturnDays, returnFees)
- shippingDetails (shippingRate, deliveryTime, shippingDestination)
- category, color, material, size, weight (where applicable)
- isVariantOf / hasVariant (for product variants)
- priceValidUntil, availability (InStock, OutOfStock, PreOrder)

### Page Type: Category/Collection Page
**Required schemas:** CollectionPage + ItemList, BreadcrumbList
**Recommended:** FAQPage about the category

### Page Type: Product Listing/Search
**Critical:** Server-render product cards. JS-only grids invisible to LLMs.

---

## SaaS / Software

### Page Type: Homepage / Product Page
**Required schemas:** SoftwareApplication, Organization, WebSite
**Recommended:** FAQPage, AggregateRating

**SoftwareApplication critical properties:**
- name, description, url, screenshot, logo
- applicationCategory ("BusinessApplication")
- operatingSystem ("Web" for SaaS)
- featureList (text list of features)
- offers (per pricing tier):
  - name ("Pro", "Enterprise")
  - price, priceCurrency
  - priceSpecification > UnitPriceSpecification (billingDuration: "P1M" or "P1Y")
- aggregateRating (from G2, Capterra, etc.)
- softwareVersion, releaseNotes

**Organization critical properties:**
- name, url, logo, description, foundingDate
- founder (Person with jobTitle, sameAs LinkedIn)
- sameAs (social profiles, G2, Capterra, Crunchbase)
- numberOfEmployees, award, slogan
- knowsAbout (expertise areas)

---

## Local Business

### Page Type: Business Location Page
**Required schemas:** Specific LocalBusiness subtype (Restaurant, Store, etc.), BreadcrumbList
**Recommended:** FAQPage, AggregateRating

**90+ LocalBusiness subtypes available.** Use the most specific:
- Restaurant (not FoodEstablishment)
- Dentist (not MedicalBusiness)
- AutoRepair (not AutomotiveBusiness)

**Critical properties:**
- name, description, url, telephone, image
- address (PostalAddress — complete)
- geo (GeoCoordinates — latitude, longitude) — CRITICAL for "near me" queries
- openingHoursSpecification (dayOfWeek array, opens, closes)
- specialOpeningHoursSpecification (holidays)
- aggregateRating, review
- priceRange ("$$", "$$$")
- paymentAccepted, currenciesAccepted
- areaServed (city, county, zip codes)
- hasMap (Google Maps URL)
- sameAs (Yelp, Google Business, social)
- menu (for restaurants), servesCuisine, acceptsReservations

### Multi-Location Pattern
- Parent Organization with subOrganization array
- Each location: unique LocalBusiness with parentOrganization back-reference
- Each location needs its own landing page with unique schema
- NEVER copy-paste identical schema across locations

---

## Publisher / Media

### Page Type: Article / Blog Post
**Required schemas:** Article or BlogPosting, Person (author), BreadcrumbList
**Recommended:** FAQPage (if FAQ section exists), SpeakableSpecification

**Article critical properties:**
- headline, description, image, datePublished, dateModified
- author (Person — name, jobTitle, sameAs, worksFor, hasCredential)
- publisher (Organization with name + logo)
- articleBody, articleSection, wordCount, keywords
- mainEntityOfPage, inLanguage
- speakable (cssSelector targeting title, subheadings, first paragraph)

### Page Type: Blog Index / Category Page
**Required schemas:** CollectionPage + ItemList, WebPage
**Recommended:** FAQPage about the topic

---

## Universal (Every Site)

### Every page should have:
- **WebSite** schema (on homepage): name, url, SearchAction, publisher
- **Organization** schema (on homepage): name, url, logo, sameAs, contactPoint
- **BreadcrumbList** schema: itemListElement with position, name, item URL
- **Canonical URL** in meta tags
- **OG tags**: og:title, og:description, og:image, og:url, og:type

### Every content page should have:
- **WebPage** or specific subtype: datePublished, dateModified, mainEntity
- **FAQPage** if FAQ content exists on page

### Properties that help LLMs most:
- @id (persistent URI for entity linking across pages)
- sameAs (external profile links — Wikipedia, Wikidata, social, directories)
- knowsAbout (expertise topics)
- mainEntityOfPage (what the page is about)
- speakable (content for voice/AI summarization)
- dateModified (freshness signal)
