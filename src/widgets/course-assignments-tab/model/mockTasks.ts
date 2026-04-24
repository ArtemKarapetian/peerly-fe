import type { Task } from "@/features/assignment/list";

// Deadlines stored as ISO date strings — formatted/localized by the consumer.
export const mockTasks: Task[] = [
  { id: "1", title: "Landing Page", deadline: "2026-01-31", status: "NOT_STARTED" },
  { id: "2", title: "React компоненты", deadline: "2026-02-07", status: "GRADING" },
  { id: "3", title: "Прототипирование", deadline: "2026-02-14", status: "SUBMITTED" },
  { id: "4", title: "TypeScript проект", deadline: "2026-02-21", status: "PEER_REVIEW" },
  { id: "5", title: "Backend API", deadline: "2026-02-28", status: "TEACHER_REVIEW" },
  { id: "6", title: "Графы", deadline: "2026-03-07", status: "GRADED" },
];
