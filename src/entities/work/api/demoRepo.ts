import { DemoSubmission } from "../model/types";

const demoSubmissions: DemoSubmission[] = [
  {
    id: "s1",
    assignmentId: "a1",
    studentId: "u1",
    content: "Сдал лендинг с использованием React",
    files: ["landing.zip", "screenshots.pdf"],
    submittedAt: new Date("2025-02-10"),
    status: "reviewed",
  },
];

export const workRepo = {
  getAll: (): Promise<DemoSubmission[]> => Promise.resolve(demoSubmissions),
};
