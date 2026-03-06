import { NextRequest, NextResponse } from "next/server";
import { analyzeUrl } from "@/lib/analyzer";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Basic URL validation
    let normalizedUrl: string;
    try {
      const parsed = new URL(
        url.startsWith("http") ? url : `https://${url}`
      );
      normalizedUrl = parsed.href;
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const result = await analyzeUrl(normalizedUrl);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    const message =
      error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
