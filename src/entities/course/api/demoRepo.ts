import { CreateCourseInput, DemoCourse } from "../model/types";

const demoCourses: DemoCourse[] = [
  {
    id: "c1",
    name: "Веб-разработка",
    title: "Веб-разработка",
    code: "CS301",
    teacherId: "u2",
    enrollmentCount: 45,
    homeworkCount: 8,
    status: "active",
    backendStatus: "InProgress",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "c2",
    name: "Базы данных",
    title: "Базы данных",
    code: "CS302",
    teacherId: "u2",
    enrollmentCount: 38,
    homeworkCount: 6,
    status: "active",
    backendStatus: "InProgress",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "c3",
    name: "Алгоритмы",
    title: "Алгоритмы",
    code: "CS201",
    teacherId: "u2",
    enrollmentCount: 52,
    homeworkCount: 12,
    status: "active",
    backendStatus: "InProgress",
    createdAt: new Date("2023-09-01"),
  },
];

export const courseRepo = {
  getAll: (): Promise<DemoCourse[]> => Promise.resolve(demoCourses),
  getById: (id: string): Promise<DemoCourse | undefined> =>
    Promise.resolve(demoCourses.find((c) => c.id === id)),
  getForTeacher: (): Promise<DemoCourse[]> => Promise.resolve(demoCourses),
  getForStudent: (): Promise<DemoCourse[]> => Promise.resolve(demoCourses),
  archive: (courseId: string, archived: boolean): Promise<void> => {
    const course = demoCourses.find((c) => c.id === courseId);
    if (course) {
      course.status = archived ? "archived" : "active";
      course.backendStatus = archived ? "Canceled" : "InProgress";
      course.archived = archived;
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_courses_archived") || "{}";
        const archivedMap = JSON.parse(stored) as Record<string, boolean>;
        archivedMap[courseId] = archived;
        localStorage.setItem("demo_courses_archived", JSON.stringify(archivedMap));
      }
    }
    return Promise.resolve();
  },
  create: (input: CreateCourseInput): Promise<DemoCourse> => {
    const newCourse: DemoCourse = {
      id: `c${Date.now()}`,
      name: input.title,
      title: input.title,
      code: input.code ?? "",
      teacherId: input.instructorId ?? "",
      enrollmentCount: 0,
      homeworkCount: 0,
      status: input.archived ? "archived" : "active",
      backendStatus: input.archived ? "Canceled" : "Draft",
      archived: input.archived ?? false,
      createdAt: new Date(),
    };
    demoCourses.push(newCourse);
    return Promise.resolve(newCourse);
  },
  delete: (courseId: string): Promise<void> => {
    const idx = demoCourses.findIndex((c) => c.id === courseId);
    if (idx !== -1) demoCourses.splice(idx, 1);
    return Promise.resolve();
  },
};
