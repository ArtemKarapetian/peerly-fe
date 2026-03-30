export interface GradeEntry {
  id: string;
  courseId: string;
  courseName: string;
  taskId: string;
  taskTitle: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING" | "NOT_SUBMITTED";
  score: number | null;
  maxScore: number;
  isScoreLocked: boolean;
  updatedAt: string;
}

export const mockGrades: GradeEntry[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "1",
    taskTitle: "Задание 1: Landing Page",
    status: "PUBLISHED",
    score: 85,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-20T14:30:00",
  },
  {
    id: "2",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "2",
    taskTitle: "Задание 2: React компоненты",
    status: "IN_REVIEW",
    score: null,
    maxScore: 100,
    isScoreLocked: true,
    updatedAt: "2025-01-22T10:15:00",
  },
  {
    id: "3",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "4",
    taskTitle: "Задание 4: TypeScript проект",
    status: "PUBLISHED",
    score: 92,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-23T16:45:00",
  },
  {
    id: "4",
    courseId: "2",
    courseName: "UI/UX Дизайн",
    taskId: "3",
    taskTitle: "Задание 3: Прототипирование",
    status: "PENDING",
    score: null,
    maxScore: 100,
    isScoreLocked: true,
    updatedAt: "2025-01-18T09:00:00",
  },
  {
    id: "5",
    courseId: "2",
    courseName: "UI/UX Дизайн",
    taskId: "5",
    taskTitle: "Задание 5: Вайрфреймы",
    status: "PUBLISHED",
    score: 78,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-21T11:20:00",
  },
  {
    id: "6",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "6",
    taskTitle: "Задание 6: Backend API",
    status: "NOT_SUBMITTED",
    score: null,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-15T08:00:00",
  },
  {
    id: "7",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "7",
    taskTitle: "Задание 1: Сортировка",
    status: "PUBLISHED",
    score: 95,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-19T13:00:00",
  },
  {
    id: "8",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "8",
    taskTitle: "Задание 2: Графы",
    status: "PUBLISHED",
    score: 88,
    maxScore: 100,
    isScoreLocked: false,
    updatedAt: "2025-01-22T15:30:00",
  },
];

export const statusLabels: Record<string, string> = {
  PUBLISHED: "Опубликовано",
  IN_REVIEW: "На проверке",
  PENDING: "Ожидание",
  NOT_SUBMITTED: "Не сдано",
};

export const statusColors: Record<string, string> = {
  PUBLISHED: "bg-success-light text-success",
  IN_REVIEW: "bg-warning-light text-warning",
  PENDING: "bg-muted text-muted-foreground",
  NOT_SUBMITTED: "bg-error-light text-error",
};
