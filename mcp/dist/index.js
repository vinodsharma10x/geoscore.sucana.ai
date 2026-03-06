#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
const API_URL = process.env.GEOSCORE_API_URL || "https://geoscore.sucana.ai";
const server = new McpServer({
    name: "geoscore",
    version: "1.0.0",
});
server.tool("analyze_url", "Analyze a webpage for AI search visibility (GEO — Generative Engine Optimization). Returns a score out of 100 across 10 categories with actionable fixes for ChatGPT, Claude, Gemini, and Perplexity discoverability.", {
    url: z.string().describe("The URL to analyze (e.g. https://example.com)"),
}, async ({ url }) => {
    try {
        const response = await fetch(`${API_URL}/api/analyze`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return {
                content: [
                    {
                        type: "text",
                        text: `Error: ${error.error || `HTTP ${response.status}`}`,
                    },
                ],
            };
        }
        const result = await response.json();
        // Format a readable summary
        const categories = result.categories
            .sort((a, b) => b.weight - a.weight)
            .map((c) => `  ${c.name}: ${c.score}/10 (weight: ${c.weight}%) — ${c.findings.filter((f) => f.type === "critical" || f.type === "warning").length} issues`)
            .join("\n");
        const fixes = [];
        if (result.generatedFixes.jsonLd)
            fixes.push(`### JSON-LD Structured Data\n\`\`\`json\n${result.generatedFixes.jsonLd}\n\`\`\``);
        if (result.generatedFixes.metaTags)
            fixes.push(`### Meta Tags\n\`\`\`html\n${result.generatedFixes.metaTags}\n\`\`\``);
        if (result.generatedFixes.robotsTxt)
            fixes.push(`### robots.txt\n\`\`\`\n${result.generatedFixes.robotsTxt}\n\`\`\``);
        if (result.generatedFixes.llmsTxt)
            fixes.push(`### llms.txt\n\`\`\`\n${result.generatedFixes.llmsTxt}\n\`\`\``);
        const recs = result.generatedFixes.contentRecommendations
            .map((r) => `- ${r}`)
            .join("\n");
        const reportUrl = result.id
            ? `${API_URL}/report/${result.id}`
            : "N/A";
        const summary = `# GEOScore Report: ${result.pageTitle || result.url}

**URL:** ${result.url}
**GEO Score: ${Math.round(result.overallScore)}/100** (${result.rating.replace("-", " ")})
**Industry:** ${result.industry}
**Report:** ${reportUrl}

## Quick Stats
- Words: ${result.metadata.wordCount.toLocaleString()}
- Headings: ${result.metadata.headingCount}
- Schemas: ${result.metadata.schemaTypes.join(", ") || "None"}
- robots.txt: ${result.metadata.hasRobotsTxt ? "Found" : "Missing"}
- llms.txt: ${result.metadata.hasLlmsTxt ? "Found" : "Missing"}
- Sitemap: ${result.metadata.hasSitemap ? "Found" : "Missing"}

## Category Scores
${categories}

${recs ? `## Content Recommendations\n${recs}` : ""}

${fixes.length > 0 ? `## Generated Fix Code\n\n${fixes.join("\n\n")}` : ""}

---
*Analyzed at ${result.fetchedAt} by [GEOScore](https://geoscore.sucana.ai)*`;
        return {
            content: [{ type: "text", text: summary }],
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to analyze URL: ${error instanceof Error ? error.message : "Unknown error"}`,
                },
            ],
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("GEOScore MCP server running on stdio");
}
main().catch(console.error);
