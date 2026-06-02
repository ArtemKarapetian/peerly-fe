export interface UICriterionScore {
  criterionId: string;
  score: number | null;
  comment: string;
}

export const MIN_OVERALL_COMMENT_LENGTH = 30;
