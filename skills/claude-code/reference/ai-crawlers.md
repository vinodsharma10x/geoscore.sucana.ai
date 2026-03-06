# Complete AI Crawler User Agents

## robots.txt Template (Allow All AI Crawlers)

```
# OpenAI
User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Anthropic
User-agent: ClaudeBot
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# Google AI
User-agent: Google-Extended
Allow: /

User-agent: GoogleAgent-Mariner
Allow: /

User-agent: Gemini-Deep-Research
Allow: /

# Perplexity
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# Apple
User-agent: Applebot-Extended
Allow: /

# Amazon
User-agent: Amazonbot
Allow: /

# Meta
User-agent: meta-externalagent
Allow: /

# Common Crawl (used by many AI companies)
User-agent: CCBot
Allow: /

# ByteDance / TikTok
User-agent: Bytespider
Allow: /

# Others
User-agent: cohere-ai
Allow: /

User-agent: DeepSeekBot
Allow: /

User-agent: DuckAssistBot
Allow: /

# Default
User-agent: *
Allow: /

Sitemap: https://DOMAIN/sitemap.xml
```

## Full Reference Table

| User Agent | Company | Purpose | Recommended |
|------------|---------|---------|-------------|
| GPTBot | OpenAI | Training data collection | Allow (or block to opt out of training) |
| OAI-SearchBot | OpenAI | ChatGPT search index (no training) | Allow |
| ChatGPT-User | OpenAI | Real-time URL fetch during queries | Allow |
| ClaudeBot | Anthropic | Training data | Allow (or block to opt out) |
| Claude-SearchBot | Anthropic | Search index (NOT blocked by ClaudeBot rules) | Allow |
| Claude-User | Anthropic | Real-time fetch (NOT blocked by ClaudeBot rules) | Allow |
| Google-Extended | Google | Gemini/Bard/Vertex AI training | Allow |
| Google-CloudVertexBot | Google | Cloud Vertex AI | Allow |
| Google-NotebookLM | Google | NotebookLM product | Allow |
| GoogleAgent-Mariner | Google | AI agent that navigates websites | Allow |
| Gemini-Deep-Research | Google | Deep Research feature | Allow |
| GoogleOther | Google | Other Google AI products | Allow |
| PerplexityBot | Perplexity | Index building for search | Allow |
| Perplexity-User | Perplexity | Real-time RAG during queries | Allow |
| Applebot | Apple | Apple Search / Siri | Allow |
| Applebot-Extended | Apple | Apple Intelligence features | Allow |
| Amazonbot | Amazon | Alexa / Amazon AI | Allow |
| FacebookBot | Meta | General Meta AI | Allow |
| meta-externalagent | Meta | Meta AI training | Allow (or block to opt out) |
| Bytespider | ByteDance | TikTok LLM training | Optional |
| CCBot | Common Crawl | Open dataset (used by many AI) | Allow |
| cohere-ai | Cohere | AI training | Optional |
| cohere-training-data-crawler | Cohere | Training data | Optional |
| DeepSeekBot | DeepSeek | DeepSeek model training | Optional |
| DuckAssistBot | DuckDuckGo | DuckDuckGo AI features | Allow |
| Diffbot | Diffbot | AI web extraction | Optional |

## Key Nuances

- Blocking `ClaudeBot` does NOT block `Claude-User` or `Claude-SearchBot` (separate bots)
- Perplexity requires BOTH `PerplexityBot` AND `BingPreview` to be allowed
- Perplexity has been documented using stealth crawling (rotating IPs, spoofing UA)
- `Google-Extended` only controls Gemini training — does NOT affect Google Search indexing
- Reference list maintained at: github.com/ai-robots-txt/ai.robots.txt
