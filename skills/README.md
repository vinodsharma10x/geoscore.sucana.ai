# GEOScore Skills for Claude

Pre-built skills that bring GEOScore's analysis capabilities directly into Claude.

## Claude Code Skill

The Claude Code skill uses `WebFetch` to fetch and analyze pages directly — no API needed. It works offline and can access sites that block automated requests.

### Install

```bash
# Copy the skill to your Claude Code skills directory
cp -r skills/claude-code ~/.claude/skills/geo-audit
```

### Usage

```
/geo-audit https://example.com
```

The skill will:
1. Fetch the page, robots.txt, llms.txt, and sitemap.xml
2. Auto-detect industry
3. Score across 10 categories
4. Generate fix code
5. Save a markdown report file

## Claude Desktop Skill

The Desktop skill works through Claude's browsing capability.

### Install

1. ZIP the `claude-desktop` folder
2. In Claude Desktop, go to **Customize > Skills**
3. Upload the ZIP file

### Usage

Ask Claude: "Run a GEO audit on https://example.com"

## Skill vs MCP vs SaaS

| Feature | Skill | MCP | SaaS |
|---------|-------|-----|------|
| Needs internet | Yes (fetches pages) | Yes (calls API) | Yes |
| Works with bot-protected sites | Yes (WebFetch) | Depends on API | Proxy fallback |
| Structured output | Markdown | Structured JSON | Interactive UI |
| Shareable reports | Markdown file | No | URL link |
| Requires setup | Copy files | Config JSON | None |

For most users, the **SaaS** at [geoscore.sucana.ai](https://geoscore.sucana.ai) is the easiest option. Use the **skill** when you want deep integration with Claude workflows. Use the **MCP** when you want GEOScore as a composable tool.
