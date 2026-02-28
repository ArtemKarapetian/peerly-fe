export interface DemoCourse {
  id: string;
  name: string;
  title: string; // Display title
  code: string;
  teacherId: string;
  orgId: string;
  enrollmentCount: number;
  status: "active" | "archived";
  archived?: boolean; // Legacy field for compatibility
  assignmentIds?: string[]; // List of assignment IDs
  createdAt: Date;
}
export interface CreateCourseInput {
  title: string;
  code: string;
  instructorId: string;
  semester?: string;
  description?: string;
  archived?: boolean;
}
