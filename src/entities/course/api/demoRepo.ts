import { CreateCourseInput, DemoCourse } from "../model/types";

const demoCourses: DemoCourse[] = [
  { id: "c1", name: "Веб-разработка", title: "Веб-разработка", code: "CS301", teacherId: "u2", orgId: "org1", enrollmentCount: 45, status: "active", createdAt: new Date("2024-01-10") },
  { id: "c2", name: "Базы данных", title: "Базы данных", code: "CS302", teacherId: "u2", orgId: "org1", enrollmentCount: 38, status: "active", createdAt: new Date("2024-01-12") },
  { id: "c3", name: "Алгоритмы", title: "Алгоритмы", code: "CS201", teacherId: "u2", orgId: "org1", enrollmentCount: 52, status: "active", createdAt: new Date("2023-09-01") },
];

export const courseRepo = {
  getAll: (): DemoCourse[] => demoCourses,
  getById: (id: string): DemoCourse | undefined => demoCourses.find((c) => c.id === id),
  archive: (courseId: string, archived: boolean): void => {
    const course = demoCourses.find((c) => c.id === courseId);
    if (course) {
      course.status = archived ? "archived" : "active";
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_courses_archived") || "{}";
        const archivedMap = JSON.parse(stored);
        archivedMap[courseId] = archived;
        localStorage.setItem("demo_courses_archived", JSON.stringify(archivedMap));
      }
    }
  },
  create: (input: CreateCourseInput): DemoCourse => {
    const newCourse: DemoCourse = {
      id: `c${Date.now()}`,
      name: input.title,
      title: input.title,
      code: input.code,
      teacherId: input.instructorId,
      orgId: "org1",
      enrollmentCount: 0,
      status: input.archived ? "archived" : "active",
      archived: input.archived ?? false,
      createdAt: new Date(),
    };
    demoCourses.push(newCourse);
    return newCourse;
  },
};
