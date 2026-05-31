export interface RubricSummary {
  id: string;
  teacherId: string;
  name: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string | null;
  maxScore: number;
  commentRequired: boolean;
  position: number;
}

export interface RubricDetail {
  rubric: RubricSummary;
  criteria: RubricCriterion[];
}

export interface RubricCriterionInput {
  name: string;
  description?: string;
  maxScore: number;
  commentRequired: boolean;
  position: number;
}

export interface RubricInput {
  name: string;
  criteria: RubricCriterionInput[];
}
