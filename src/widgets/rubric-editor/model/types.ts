export interface RubricEditorCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  commentRequired: boolean;
  position: number;
}

export interface RubricEditorData {
  id: string;
  teacherId: string;
  name: string;
  criteria: RubricEditorCriterion[];
}
