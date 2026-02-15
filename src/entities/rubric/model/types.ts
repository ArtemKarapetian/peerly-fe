export interface DemoRubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
}

export interface DemoRubric {
  id: string;
  teacherId: string;
  name: string;
  description: string;
  criteria: DemoRubricCriterion[];
  isPublic: boolean;
}
