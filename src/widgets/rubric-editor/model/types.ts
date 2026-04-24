export interface RubricCriterionData {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  weight?: number;
  required: boolean;
  commentRequired?: boolean;
  minCommentLength?: number;
}

export interface RubricData {
  id: string;
  name: string;
  description: string;
  criteria: RubricCriterionData[];
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
}
