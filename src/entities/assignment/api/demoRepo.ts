import { DemoAssignment } from "../model/types";

const demoAssignments: DemoAssignment[] = [
  {
    id: "a1",
    courseId: "c1",
    title: "Лендинг-страница",
    description: "Создать адаптивную лендинг-страницу",
    dueDate: new Date("2025-02-15"),
    reviewCount: 3,
    status: "published",
    rubricId: "r1",
  },
  {
    id: "a2",
    courseId: "c1",
    title: "REST API",
    description: "Разработать REST API для блога",
    dueDate: new Date("2025-03-01"),
    reviewCount: 2,
    status: "published",
  },
];

export const assignmentRepo = {
  getAll: (): DemoAssignment[] => demoAssignments,
  getByCourse: (courseId: string): DemoAssignment[] =>
    demoAssignments.filter((a) => a.courseId === courseId),
  archive: (assignmentId: string, archived: boolean): void => {
    const assignment = demoAssignments.find((a) => a.id === assignmentId);
    if (assignment) {
      (assignment as DemoAssignment & { archived?: boolean }).archived = archived;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_assignments_archived") || "{}";
        const archivedMap = JSON.parse(stored);
        archivedMap[assignmentId] = archived;
        localStorage.setItem("demo_assignments_archived", JSON.stringify(archivedMap));
      }
    }
  },
};
