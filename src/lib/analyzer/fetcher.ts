import type { FetchedResources, ParsedPage } from "@/lib/types";
import { parseHtml } from "./parser";

const FETCH_TIMEOUT = 15000;

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const BROWSER_HEADERS = {
  "User-Agent": BROWSER_UA,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

interface FetchResult {
  body: string | null;
  status?: number;
}

async function fetchWithTimeout(
  url: string,
  timeout = FETCH_TIMEOUT
): Promise<FetchResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return { body: null, status: res.status };
    const body = await res.text();
    return { body, status: res.status };
  } catch {
    return { body: null };
  }
}

async function fetchWithPlaywright(url: string): Promise<string | null> {
  let browser;
  try {
    const { chromium } = await import("playwright");
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: BROWSER_UA,
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
    // Wait a bit for any JS-based content to render
    await page.waitForTimeout(2000);
    const html = await page.content();
    return html;
  } catch {
    return null;
  } finally {
    if (browser) await browser.close();
  }
}

function getBaseUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.protocol}//${parsed.host}`;
}

export async function fetchResources(url: string): Promise<FetchedResources> {
  const baseUrl = getBaseUrl(url);

  // Fetch all resources in parallel — page, robots, llms, sitemap
  const [pageResult, robotsResult, llmsResult, sitemapResult] =
    await Promise.all([
      fetchWithTimeout(url, 20000),
      fetchWithTimeout(`${baseUrl}/robots.txt`),
      fetchWithTimeout(`${baseUrl}/llms.txt`),
      fetchWithTimeout(`${baseUrl}/sitemap.xml`),
    ]);

  let pageHtml = pageResult.body;

  // If fetch failed with 403, retry with Playwright (headless browser)
  if (!pageHtml && pageResult.status === 403) {
    pageHtml = await fetchWithPlaywright(url);
  }

  if (!pageHtml) {
    if (pageResult.status === 403) {
      throw new Error(
        `Access denied (403) for ${url}. This site uses bot protection that blocked both fetch and headless browser requests.`
      );
    }
    if (pageResult.status === 404) {
      throw new Error(
        `Page not found (404) for ${url}. Check the URL and try again.`
      );
    }
    if (pageResult.status) {
      throw new Error(`Failed to fetch ${url} (HTTP ${pageResult.status}).`);
    }
    throw new Error(
      `Failed to fetch ${url}. The site may be unreachable, or the request timed out.`
    );
  }

  const page: ParsedPage = parseHtml(pageHtml, url);

  return {
    page,
    robotsTxt: robotsResult.body,
    llmsTxt: llmsResult.body,
    sitemapXml: sitemapResult.body,
  };
}
