export interface GradeEntry {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  status: string;
  score: number | null;
  maxScore: number;
  isScoreLocked: boolean;
  updatedAt: string;
}
