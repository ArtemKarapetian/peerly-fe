import type { RubricCriterion } from "@/entities/rubric";

export interface UICriterionScore {
  criterionId: string;
  score: number | null;
  comment: string;
}

export const MIN_OVERALL_COMMENT_LENGTH = 30;

export function emptyScoresFor(criteria: RubricCriterion[]): UICriterionScore[] {
  return criteria.map((c) => ({ criterionId: c.id, score: null, comment: "" }));
}

export function allCriteriaScored(scores: UICriterionScore[]): boolean {
  return scores.length > 0 && scores.every((s) => s.score !== null);
}
