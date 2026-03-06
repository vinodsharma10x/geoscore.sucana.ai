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
    <div className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Report: {result.pageTitle || result.url}
        </h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-400">
          ID: {id}
        </span>
      </div>
      <Report result={result} id={id} />
    </div>
  );
}
