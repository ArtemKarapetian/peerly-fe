import type { DemoReview } from "../model/types";

import type { AssignedReviewEntry, SubmissionToReview } from "./httpRepo";

// Distribution scheme (assignment a1, "Лендинг-страница", reviewCount=3):
//   s1 (Иван)    → u10 ✓, u11 ✓, u12 ✓     completed
//   s2 (Анна)    → u11 ✓, u13 ⋯, u14 ○     in-progress
//   s3 (Никита)  → u12 ✓, u14 ✓, u15 ⋯     in-progress
//   s4 (Елена)   → u13 ○, u15 ○, u16 ○     not-started
//   s5 (Дмитрий) → u14 ✓, u16 ⋯, u1 ○      in-progress
//   s6 (Ольга)   → u15 ✓, u1 ✓, u10 ✓      completed
// Distribution for assignment a2, "REST API", reviewCount=2:
//   s7 (Павел)   → u11 ⋯, u13 ○            in-progress
//   s8 (София)   → u12 ○, u14 ○            not-started

const demoReviews: DemoReview[] = [
  // ── s1 (completed) ──────────────────────────────────────────────
  {
    id: "rv1",
    submissionId: "s1",
    reviewerId: "u10",
    scores: { c1: 4, c2: 5, c3: 4, c4: 4 },
    comment: "Хорошая работа, но можно улучшить документацию",
    submittedAt: new Date("2025-02-12"),
    status: "submitted",
  },
  {
    id: "rv2",
    submissionId: "s1",
    reviewerId: "u11",
    scores: { c1: 5, c2: 4, c3: 5, c4: 3 },
    comment: "Чистый код, отличная адаптивность",
    submittedAt: new Date("2025-02-13"),
    status: "submitted",
  },
  {
    id: "rv3",
    submissionId: "s1",
    reviewerId: "u12",
    scores: { c1: 4, c2: 4, c3: 4, c4: 5 },
    comment: "README очень подробный — респект",
    submittedAt: new Date("2025-02-14"),
    status: "submitted",
  },

  // ── s2 (in-progress) ────────────────────────────────────────────
  {
    id: "rv4",
    submissionId: "s2",
    reviewerId: "u11",
    scores: { c1: 5, c2: 5, c3: 4, c4: 4 },
    comment: "Анимации не отвлекают, всё в тему",
    submittedAt: new Date("2025-02-15"),
    status: "submitted",
  },
  {
    id: "rv5",
    submissionId: "s2",
    reviewerId: "u13",
    scores: { c1: 4 },
    comment: "Дочитываю, оставлю развёрнутый отзыв позже",
    status: "draft",
  },
  {
    id: "rv6",
    submissionId: "s2",
    reviewerId: "u14",
    scores: {},
    comment: "",
    status: "pending",
  },

  // ── s3 (in-progress) ────────────────────────────────────────────
  {
    id: "rv7",
    submissionId: "s3",
    reviewerId: "u12",
    scores: { c1: 5, c2: 5, c3: 4, c4: 4 },
    comment: "Dark mode реализован аккуратно, переключение без рывков",
    submittedAt: new Date("2025-02-15"),
    status: "submitted",
  },
  {
    id: "rv8",
    submissionId: "s3",
    reviewerId: "u14",
    scores: { c1: 4, c2: 4, c3: 5, c4: 3 },
    comment: "Хорошая структура, но README местами неполный",
    submittedAt: new Date("2025-02-16"),
    status: "submitted",
  },
  {
    id: "rv9",
    submissionId: "s3",
    reviewerId: "u15",
    scores: { c1: 3, c2: 4 },
    comment: "Черновик отзыва",
    status: "draft",
  },

  // ── s4 (not-started) ────────────────────────────────────────────
  {
    id: "rv10",
    submissionId: "s4",
    reviewerId: "u13",
    scores: {},
    comment: "",
    status: "pending",
  },
  {
    id: "rv11",
    submissionId: "s4",
    reviewerId: "u15",
    scores: {},
    comment: "",
    status: "pending",
  },
  {
    id: "rv12",
    submissionId: "s4",
    reviewerId: "u16",
    scores: {},
    comment: "",
    status: "pending",
  },

  // ── s5 (in-progress) ────────────────────────────────────────────
  {
    id: "rv13",
    submissionId: "s5",
    reviewerId: "u14",
    scores: { c1: 4, c2: 5, c3: 4, c4: 3 },
    comment: "Минимализм работает, но не хватает hover-состояний",
    submittedAt: new Date("2025-02-15"),
    status: "submitted",
  },
  {
    id: "rv14",
    submissionId: "s5",
    reviewerId: "u16",
    scores: { c1: 4 },
    comment: "Возьму ещё пару дней",
    status: "draft",
  },
  {
    id: "rv15",
    submissionId: "s5",
    reviewerId: "u1",
    scores: {},
    comment: "",
    status: "pending",
  },

  // ── s6 (completed) ──────────────────────────────────────────────
  {
    id: "rv16",
    submissionId: "s6",
    reviewerId: "u15",
    scores: { c1: 5, c2: 5, c3: 5, c4: 5 },
    comment: "CMS-подключение и админка — впечатляет",
    submittedAt: new Date("2025-02-15"),
    status: "submitted",
  },
  {
    id: "rv17",
    submissionId: "s6",
    reviewerId: "u1",
    scores: { c1: 5, c2: 4, c3: 5, c4: 4 },
    comment: "Качественно реализовано, поддерживаю максимум по функциональности",
    submittedAt: new Date("2025-02-16"),
    status: "submitted",
  },
  {
    id: "rv18",
    submissionId: "s6",
    reviewerId: "u10",
    scores: { c1: 5, c2: 5, c3: 4, c4: 5 },
    comment: "Документация — лучшая из тех, что видела на курсе",
    submittedAt: new Date("2025-02-16"),
    status: "submitted",
  },

  // ── s7 (in-progress, assignment a2) ─────────────────────────────
  {
    id: "rv19",
    submissionId: "s7",
    reviewerId: "u11",
    scores: { overall: 80 },
    comment: "Покрытие тестами есть, но миграции стоит выделить отдельно",
    status: "draft",
  },
  {
    id: "rv20",
    submissionId: "s7",
    reviewerId: "u13",
    scores: {},
    comment: "",
    status: "pending",
  },

  // ── s8 (not-started, assignment a2) ─────────────────────────────
  {
    id: "rv21",
    submissionId: "s8",
    reviewerId: "u12",
    scores: {},
    comment: "",
    status: "pending",
  },
  {
    id: "rv22",
    submissionId: "s8",
    reviewerId: "u14",
    scores: {},
    comment: "",
    status: "pending",
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
