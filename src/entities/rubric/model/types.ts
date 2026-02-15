export interface Criterion {
  id: string;
  name: string;
  description?: string;
  maxScore: number;
  required: boolean;
  commentRequired?: boolean;
  minCommentLength?: number;
}

export interface RubricSectionData {
  id: string;
  name: string;
  description?: string;
  criteria: Criterion[];
}
