import type { CreateAssignmentInput, DemoAssignment } from "../model/types";

const demoAssignments: DemoAssignment[] = [
  {
    id: "a1",
    courseId: "c1",
    title: "Лендинг-страница",
    description: "Создать адаптивную лендинг-страницу",
    dueDate: new Date("2025-02-15"),
    reviewDeadline: new Date("2025-02-22"),
    reviewCount: 3,
    status: "published",
    backendStatus: "Published",
    rubricId: "r1",
  },
  {
    id: "a2",
    courseId: "c1",
    title: "REST API",
    description: "Разработать REST API для блога",
    dueDate: new Date("2025-03-01"),
    reviewDeadline: new Date("2025-03-08"),
    reviewCount: 2,
    status: "published",
    backendStatus: "Published",
    rubricId: "r2",
  },
  {
    id: "a3",
    courseId: "c1",
    title: "SPA на React",
    description: "Сделать SPA с маршрутизацией и state management",
    dueDate: new Date("2025-03-20"),
    reviewDeadline: new Date("2025-03-27"),
    reviewCount: 3,
    status: "published",
    backendStatus: "Published",
    rubricId: "r1",
  },
  {
    id: "a4",
    courseId: "c1",
    title: "Тесты и CI",
    description: "Покрыть проект тестами и настроить CI",
    dueDate: new Date("2025-04-05"),
    reviewDeadline: new Date("2025-04-12"),
    reviewCount: 2,
    status: "published",
    backendStatus: "Published",
    rubricId: "r2",
  },
  {
    id: "a5",
    courseId: "c1",
    title: "Финальный проект",
    description: "Командный финальный проект курса",
    dueDate: new Date("2025-05-10"),
    reviewDeadline: new Date("2025-05-17"),
    reviewCount: 3,
    status: "published",
    backendStatus: "Published",
    rubricId: "r1",
  },
];

export const assignmentRepo = {
  getAll: (): Promise<DemoAssignment[]> => Promise.resolve(demoAssignments),
  getByCourse: (courseId: string): Promise<DemoAssignment[]> =>
    Promise.resolve(demoAssignments.filter((a) => a.courseId === courseId)),
  getById: (homeworkId: string): Promise<DemoAssignment | undefined> =>
    Promise.resolve(demoAssignments.find((a) => a.id === homeworkId)),
  createForCourse: (_courseId: string, _input: CreateAssignmentInput) =>
    Promise.resolve({ homeworkId: `a${Date.now()}` }),
  createForGroup: (_groupId: string, _input: CreateAssignmentInput) =>
    Promise.resolve({ homeworkId: `a${Date.now()}` }),
  updateDraft: (_homeworkId: string, _input: CreateAssignmentInput) => Promise.resolve(),
  postponeDeadlines: (_homeworkId: string, _d: Date | string, _rd: Date | string) =>
    Promise.resolve(),
  publish: (_homeworkId: string) => Promise.resolve(),
  confirm: (_homeworkId: string) => Promise.resolve(),
  delete: (_homeworkId: string) => Promise.resolve(),
  archive: (assignmentId: string, archived: boolean): Promise<void> => {
    const assignment = demoAssignments.find((a) => a.id === assignmentId);
    if (assignment) {
      assignment.archived = archived;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_assignments_archived") || "{}";
        const archivedMap = JSON.parse(stored) as Record<string, boolean>;
        archivedMap[assignmentId] = archived;
        localStorage.setItem("demo_assignments_archived", JSON.stringify(archivedMap));
      }
    }
    return Promise.resolve();
  },
};
