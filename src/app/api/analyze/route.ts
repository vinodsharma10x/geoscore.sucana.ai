import { NextRequest, NextResponse } from "next/server";
import { analyzeUrl } from "@/lib/analyzer";
import { supabase } from "@/lib/supabase";
import { randomUUID } from "crypto";

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
