/** Backend response types for homeworks (snake_case) */

export interface ApiHomework {
  homework_id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  review_count: number;
  status: "draft" | "published" | "closed";
  rubric_id?: string;
}

export interface ApiCreateHomeworkPayload {
  title: string;
  description: string;
  due_date: string;
  review_count: number;
  rubric_id?: string;
}
