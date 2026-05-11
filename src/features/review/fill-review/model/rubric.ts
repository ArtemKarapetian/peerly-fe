export interface RubricCriterion {
  id: string;
  title: string;
}

export interface CriterionScore {
  criterionId: string;
  score: number | null;
  comment: string;
}

export const MIN_OVERALL_COMMENT_LENGTH = 30;

const FALLBACK_CRITERION: RubricCriterion = { id: "overall", title: "Общая оценка" };

export function parseRubricFromChecklist(checklist: string): RubricCriterion[] {
  const items = checklist
    .split("\n")
    .map((line) => line.replace(/^[\s•\-*\d.)]+/, "").trim())
    .filter((line) => line.length > 0);

  if (items.length === 0) return [FALLBACK_CRITERION];
  return items.map((title) => ({ id: title, title }));
}

export function emptyScoresFor(criteria: RubricCriterion[]): CriterionScore[] {
  return criteria.map((c) => ({ criterionId: c.id, score: null, comment: "" }));
}

export function aggregateMark(scores: CriterionScore[]): number {
  const filled = scores.filter((s) => s.score !== null).map((s) => s.score!);
  if (filled.length === 0) return 0;
  const avg = filled.reduce((sum, n) => sum + n, 0) / filled.length;
  return Math.max(1, Math.min(5, Math.round(avg)));
}
