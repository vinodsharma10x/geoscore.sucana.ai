# GEOScore MCP Server

An MCP (Model Context Protocol) server that exposes GEOScore as a tool for Claude Desktop, Claude Code, Cursor, and any MCP-compatible client.

## Tool

### `analyze_url`

Analyze a webpage for AI search visibility. Returns a score out of 100 across 10 categories with actionable fixes.

**Input:**
- `url` (string) — The URL to analyze

**Output:** Formatted markdown report with scores, findings, and copy-paste fix code.

## Setup

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "geoscore": {
      "command": "node",
      "args": ["/path/to/geoscore.sucana.ai/mcp/dist/index.js"]
    }
  }
}
```

### Claude Code

```bash
claude mcp add geoscore node /path/to/geoscore.sucana.ai/mcp/dist/index.js
```

### Build from source

```bash
cd mcp
npm install
npm run build
```

## Configuration

By default, the MCP server calls the hosted GEOScore API at `https://geoscore.sucana.ai`. To use a local instance:

```json
{
  "mcpServers": {
    "geoscore": {
      "command": "node",
      "args": ["/path/to/mcp/dist/index.js"],
      "env": {
        "GEOSCORE_API_URL": "http://localhost:3000"
      }
    }
  }
}
```

## How it works

The MCP server is a thin client that calls the GEOScore API. This means:
- Zero code duplication with the main analysis engine
- Always uses the latest scoring logic
- Works with both hosted and local instances
