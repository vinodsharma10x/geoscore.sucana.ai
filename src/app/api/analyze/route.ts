import { NextRequest, NextResponse } from "next/server";
import { analyzeUrl } from "@/lib/analyzer";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

export const maxDuration = 30;

// Rate limiting: simple in-memory store (per serverless instance)
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // requests per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// SSRF protection: block private/internal IPs
function isPrivateHost(hostname: string): boolean {
  const privatePatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[01])\./,
    /^192\.168\./,
    /^169\.254\./,
    /^0\.0\.0\.0$/,
    /^\[?::1\]?$/,
    /^\[?fe80:/i,
    /^\[?fc00:/i,
    /^\[?fd/i,
  ];
  return privatePatterns.some((p) => p.test(hostname));
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // URL validation
    let normalizedUrl: string;
    try {
      const parsed = new URL(
        url.startsWith("http") ? url : `https://${url}`
      );

      // SSRF protection
      if (isPrivateHost(parsed.hostname)) {
        return NextResponse.json(
          { error: "Private/internal URLs are not allowed." },
          { status: 400 }
        );
      }

      // Only allow http/https
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return NextResponse.json(
          { error: "Only HTTP and HTTPS URLs are supported." },
          { status: 400 }
        );
      }

      normalizedUrl = parsed.href;
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const result = await analyzeUrl(normalizedUrl);

    // Save to Supabase
    const id = randomUUID().replace(/-/g, "").slice(0, 12);
    const { error: dbError } = await supabase.from("runs").insert({
      id,
      url: result.url,
      page_title: result.pageTitle,
      industry: result.industry,
      overall_score: result.overallScore,
      rating: result.rating,
      result_json: result,
    });

    if (dbError) {
      console.error("Failed to save run:", dbError);
    }

    return NextResponse.json({ ...result, id });
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
