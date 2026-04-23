import type { DemoReview } from "../model/types";

import type { AssignedReviewEntry, SubmissionToReview } from "./httpRepo";

const demoReviews: DemoReview[] = [
  {
    id: "rv1",
    submissionId: "s1",
    reviewerId: "u1",
    scores: { overall: 85 },
    comment: "Хорошая работа, но можно улучшить документацию",
    submittedAt: new Date("2025-02-12"),
    status: "submitted",
  },
];

export const reviewRepo = {
  getAll: (): Promise<DemoReview[]> => Promise.resolve(demoReviews),
  listAssigned: (_homeworkId: string): Promise<AssignedReviewEntry[]> => Promise.resolve([]),
  getAssignedSubmission: (submissionId: string): Promise<SubmissionToReview> =>
    Promise.resolve({
      id: submissionId,
      comment: "Демо-работа",
      files: [],
      studentId: "u1",
      studentName: "Иван Петров",
    }),
  create: (_submissionId: string, _mark: number, _comment: string) =>
    Promise.resolve({ reviewId: `rv${Date.now()}` }),
  getById: (id: string): Promise<DemoReview | null> =>
    Promise.resolve(demoReviews.find((r) => r.id === id) ?? null),
  update: (_reviewId: string, _mark: number, _comment: string) => Promise.resolve(),
  delete: (_reviewId: string) => Promise.resolve(),
};
