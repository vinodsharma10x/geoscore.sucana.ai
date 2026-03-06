# GEOScore — AI Search Visibility Analyzer

GEOScore analyzes how well your website is optimized for AI search engines like ChatGPT, Claude, Gemini, and Perplexity. Enter any URL and get a score out of 100 with actionable fixes.

**Live:** [geoscore.sucana.ai](https://geoscore.sucana.ai)

## What it does

- Scans any webpage across **10 weighted categories**
- Auto-detects industry (healthcare, e-commerce, SaaS, local business, publisher)
- Generates **copy-paste fix code** (JSON-LD, meta tags, robots.txt, llms.txt)
- Saves every analysis with a **shareable report URL**
- **Download** results as Markdown

## Scoring Categories

| Category | Weight | What it checks |
|----------|--------|---------------|
| Content Structure | 25% | Headings, lists, tables, FAQ sections |
| Content Depth | 20% | Word count, statistics, quotes, citations |
| Technical Setup | 15% | SSR, semantic HTML, clean URLs |
| AI Crawler Access | 10% | robots.txt rules for GPTBot, ClaudeBot, etc. |
| Structured Data | 10% | JSON-LD schemas, industry-specific markup |
| Trust Signals (E-E-A-T) | 8% | Author bios, credentials, publisher info |
| Meta Tags | 5% | Title, description, OG, Twitter cards |
| Navigation & Sitemap | 3% | Breadcrumbs, internal links, sitemap.xml |
| Geographic Signals | 2% | Address, service area, hours (local biz) |
| Voice & Assistant | 2% | Speakable content, Q&A format |

Scoring is research-backed: statistics give +22% citation likelihood, FAQ sections 2x, 1500+ words 2x, original research found in 67% of top-cited pages.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **HTML Parsing:** Cheerio
- **Database:** Supabase (Postgres)
- **Proxy:** Webshare rotating proxies (fallback for bot-protected sites)
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project (free tier works)

### Setup

```bash
# Clone
git clone https://github.com/vinodsharma10x/geoscore.sucana.ai.git
cd geoscore.sucana.ai

# Install dependencies
pnpm install

# Create env file
cp .env.example .env.local
# Edit .env.local with your keys

# Create database table
# Run supabase-schema.sql in your Supabase SQL Editor

# Start dev server
pnpm dev
```

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
WEBSHARE_PASSWORD=your_webshare_password  # Optional, for proxy fallback
```

## Architecture

```
src/
├── app/
│   ├── api/analyze/route.ts    # POST endpoint — runs analysis, saves to DB
│   ├── report/[id]/            # Shareable report page (loads from Supabase)
│   ├── report-view.tsx         # Report UI (score donut, categories, code blocks)
│   ├── page.tsx                # Homepage with URL input
│   └── layout.tsx              # Root layout
├── lib/
│   ├── analyzer/
│   │   ├── fetcher.ts          # Parallel fetch of page + robots + llms + sitemap
│   │   ├── parser.ts           # Cheerio HTML parser
│   │   ├── industry-detector.ts
│   │   ├── score-calculator.ts
│   │   ├── index.ts            # Main orchestrator
│   │   └── modules/            # 10 scoring modules
│   ├── fix-generator/          # JSON-LD, meta tags, robots.txt, llms.txt generators
│   ├── proxy.ts                # Webshare rotating proxy (fallback on 403)
│   ├── supabase.ts             # Supabase client
│   └── types.ts                # TypeScript types
└── supabase-schema.sql         # Database schema
```

### How fetching works

1. Direct `fetch()` with browser-like headers (fast, works for most sites)
2. If the site returns 403 (bot protection), retries through Webshare rotating proxy with IP rotation
3. Sites with aggressive bot protection (Akamai, Cloudflare enterprise) may still block requests

### Security

- **SSRF protection:** Private/internal IP ranges are blocked (127.x, 10.x, 192.168.x, etc.)
- **Rate limiting:** 10 requests per IP per hour
- **Input validation:** URL format, protocol (HTTP/HTTPS only), hostname checks
- **No secret leaks:** Proxy password is env-only, Supabase uses public anon key
- **Supabase RLS:** Public read/insert only, no update/delete

## Claude Skills & MCP

GEOScore is available in three forms:

| | SaaS | Claude Skill | MCP Server |
|---|---|---|---|
| **Best for** | Anyone with a browser | Claude Code / Desktop power users | Developers building AI workflows |
| **Setup** | None | Copy files | Config JSON |
| **Details** | [geoscore.sucana.ai](https://geoscore.sucana.ai) | [skills/README.md](skills/README.md) | [mcp/README.md](mcp/README.md) |

### Quick start — MCP

```bash
cd mcp && npm install && npm run build
claude mcp add geoscore node /path/to/mcp/dist/index.js
```

### Quick start — Claude Code Skill

```bash
cp -r skills/claude-code ~/.claude/skills/geo-audit
# Then use: /geo-audit https://example.com
```

## Contributing

Pull requests welcome. For major changes, open an issue first.

## License

[MIT](LICENSE)

## Built by

[Sucana AI](https://www.sucana.ai) — AI-powered digital agency
