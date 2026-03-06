import type { CategoryResult, Rating } from "@/lib/types";

export function calculateOverallScore(categories: CategoryResult[]): number {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const weightedSum = categories.reduce(
    (sum, c) => sum + (c.score * c.weight) / 10,
    0
  );
  return Math.round((weightedSum / totalWeight) * 100);
}

export function getRating(score: number): Rating {
  if (score >= 85) return "excellent";
  if (score >= 65) return "good";
  if (score >= 40) return "needs-work";
  return "poor";
}

export function getRatingLabel(rating: Rating): string {
  switch (rating) {
    case "excellent":
      return "Excellent — LLMs consistently find and cite this content";
    case "good":
      return "Good — Solid foundation, specific improvements will boost visibility";
    case "needs-work":
      return "Needs Work — Significant gaps in AI discoverability";
    case "poor":
      return "Poor — Largely invisible to AI search engines";
  }
}

export function getRatingColor(rating: Rating): string {
  switch (rating) {
    case "excellent":
      return "#22c55e";
    case "good":
      return "#3b82f6";
    case "needs-work":
      return "#f59e0b";
    case "poor":
      return "#ef4444";
  }
}
