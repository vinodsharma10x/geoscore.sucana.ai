import { ProxyAgent } from "undici";

const WEBSHARE_PASSWORD = process.env.WEBSHARE_PASSWORD;
const PROXY_HOST = "p.webshare.io";
const PROXY_PORT = 80;

const WEBSHARE_PROXIES = [
  "fsbqduvk-1",
  "fsbqduvk-2",
  "fsbqduvk-3",
  "fsbqduvk-4",
  "fsbqduvk-5",
  "fsbqduvk-6",
  "fsbqduvk-7",
  "fsbqduvk-8",
  "fsbqduvk-9",
  "fsbqduvk-10",
];

const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
];

let currentProxyIndex = 0;

function getProxyAgent(): ProxyAgent | undefined {
  if (!WEBSHARE_PASSWORD) return undefined;
  const username = WEBSHARE_PROXIES[currentProxyIndex % WEBSHARE_PROXIES.length];
  const proxyUrl = `http://${username}:${WEBSHARE_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`;
  return new ProxyAgent(proxyUrl);
}

function rotateProxy() {
  currentProxyIndex = (currentProxyIndex + 1) % WEBSHARE_PROXIES.length;
}

export function randomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

export async function fetchWithProxy(
  url: string,
  maxRetries = 3
): Promise<string | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const proxyAgent = getProxyAgent();
      const fetchOptions: RequestInit & { dispatcher?: ProxyAgent } = {
        headers: {
          "User-Agent": randomUserAgent(),
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Cache-Control": "no-cache",
          "Sec-Fetch-Dest": "document",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "none",
          "Sec-Fetch-User": "?1",
          "Upgrade-Insecure-Requests": "1",
        },
        redirect: "follow",
      };

      if (proxyAgent) {
        fetchOptions.dispatcher = proxyAgent;
      }

      const response = await fetch(url, fetchOptions);

      if (response.status === 429 || response.status === 403) {
        rotateProxy();
        if (attempt < maxRetries) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        return null;
      }

      if (!response.ok) return null;

      rotateProxy();
      return await response.text();
    } catch {
      rotateProxy();
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 1000));
        continue;
      }
      return null;
    }
  }
  return null;
}
