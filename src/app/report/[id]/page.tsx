import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { AnalysisResult } from "@/lib/types";
import ReportClient from "./report-client";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("runs")
    .select("result_json")
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const result = data.result_json as AnalysisResult;

  return <ReportClient result={result} id={id} />;
}
