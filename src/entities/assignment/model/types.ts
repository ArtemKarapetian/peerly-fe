export interface DemoAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  reviewCount: number;
  status: "draft" | "published" | "closed";
  rubricId?: string;
}
