import type { DemoSubmission } from "../model/types";

const demoSubmissions: DemoSubmission[] = [
  {
    id: "s1",
    assignmentId: "a1",
    studentId: "u1",
    studentName: "Иван Петров",
    content: "Готовая работа",
    files: [],
    submittedAt: new Date("2025-02-10"),
    status: "submitted",
    studentMark: null,
    teacherMark: null,
  },
];

export const workRepo = {
  getAll: (): Promise<DemoSubmission[]> => Promise.resolve(demoSubmissions),
  listForHomework: (homeworkId: string): Promise<DemoSubmission[]> =>
    Promise.resolve(demoSubmissions.filter((s) => s.assignmentId === homeworkId)),
  getMineForHomework: (_homeworkId: string): Promise<DemoSubmission | null> =>
    Promise.resolve(null),
  getById: (submissionId: string): Promise<DemoSubmission | null> =>
    Promise.resolve(demoSubmissions.find((s) => s.id === submissionId) ?? null),
  create: (_homeworkId: string, _comment: string) =>
    Promise.resolve({ submissionId: `s${Date.now()}` }),
  update: (_submissionId: string, _comment: string) => Promise.resolve(),
  delete: (_submissionId: string) => Promise.resolve(),
  correctMark: (_submissionId: string, _mark: number) => Promise.resolve(),
};
