import { DemoReview } from "../model/types";

const demoReviews: DemoReview[] = [
  {
    id: "rv1",
    submissionId: "s1",
    reviewerId: "u1",
    scores: { c1: 28, c2: 18, c3: 25, c4: 15 },
    comment: "Хорошая работа, но можно улучшить документацию",
    submittedAt: new Date("2025-02-12"),
    status: "submitted",
  },
];

export const reviewRepo = {
  getAll: (): Promise<DemoReview[]> => Promise.resolve(demoReviews),
};
