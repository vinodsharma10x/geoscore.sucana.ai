"use client";

import Report from "@/app/report-view";
import type { AnalysisResult } from "@/lib/types";

export default function ReportClient({
  result,
  id,
}: {
  result: AnalysisResult;
  id: string;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Report: {result.pageTitle || result.url}</h1>
        <span className="rounded bg-zinc-100 px-2 py-1 text-xs text-zinc-500 dark:bg-zinc-800">
          ID: {id}
        </span>
      </div>
      <Report result={result} />
    </div>
  );
}
