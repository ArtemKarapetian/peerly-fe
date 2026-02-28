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
  taskType: "text" | "code" | "project";
  criteria: RubricCriterionData[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  teacherId: string;
}
