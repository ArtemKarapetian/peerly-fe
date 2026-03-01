import type { Task } from "@/features/assignment/list";

export const mockTasks: Task[] = [
  { id: "1", title: "Landing Page", deadline: "Дедлайн: 31 января", status: "NOT_STARTED" },
  { id: "2", title: "React компоненты", deadline: "Дедлайн: 7 февраля", status: "GRADING" },
  { id: "3", title: "Прототипирование", deadline: "Дедлайн: 14 февраля", status: "SUBMITTED" },
  { id: "4", title: "TypeScript проект", deadline: "Дедлайн: 21 февраля", status: "PEER_REVIEW" },
  {
    id: "5",
    title: "Backend API",
    deadline: "Дедлайн: 28 февраля",
    status: "TEACHER_REVIEW",
  },
  { id: "6", title: "Графы", deadline: "Дедлайн: 7 марта", status: "GRADED" },
];
