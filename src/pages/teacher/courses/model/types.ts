export type CourseStatus = "draft" | "active" | "archived";
export type StatusFilter = "all" | CourseStatus;

export interface CourseRow {
  id: string;
  name: string;
  status: CourseStatus;
}
