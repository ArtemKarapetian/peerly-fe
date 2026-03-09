/**
 * reviewStore - Mock state management for reviews
 *
 * Features:
 * - Store all reviews with status (not_started / draft / submitted)
 * - Update review status and data
 * - Persist in memory (would be replaced with API calls)
 */
import { Review } from "@/entities/review/model/store.ts";

// Mock initial data
const INITIAL_REVIEWS: Review[] = [
  {
    id: "r1",
    taskTitle: "Задание 1: Создание лендинга",
    courseName: "Веб-разработка",
    courseId: "1",
    taskId: "1",
    studentName: "Студент #1",
    isAnonymous: true,
    reviewDeadline: "28 января 2026, 23:59",
    reviewDeadlineTimestamp: new Date("2026-01-28T23:59:00").getTime(),
    status: "not_started",
  },
  {
    id: "r2",
    taskTitle: "Задание 2: Backend API",
    courseName: "Веб-разработка",
    courseId: "1",
    taskId: "2",
    studentName: "Студент #2",
    isAnonymous: true,
    reviewDeadline: "29 января 2026, 23:59",
    reviewDeadlineTimestamp: new Date("2026-01-29T23:59:00").getTime(),
    status: "not_started",
  },
  {
    id: "r3",
    taskTitle: "Лабораторная 3: Алгоритмы сортировки",
    courseName: "Алгоритмы",
    courseId: "2",
    taskId: "3",
    studentName: "Анна Иванова",
    isAnonymous: false,
    reviewDeadline: "30 января 2026, 23:59",
    reviewDeadlineTimestamp: new Date("2026-01-30T23:59:00").getTime(),
    status: "not_started",
  },
  {
    id: "r4",
    taskTitle: "Эссе: История России",
    courseName: "История",
    courseId: "3",
    taskId: "4",
    studentName: "Студент #3",
    isAnonymous: true,
    reviewDeadline: "2 февраля 2026, 23:59",
    reviewDeadlineTimestamp: new Date("2026-02-02T23:59:00").getTime(),
    status: "not_started",
  },
];

// In-memory store
let reviews: Review[] = [...INITIAL_REVIEWS];

// Store interface
export const useReviewStore = () => {
  return {
    // Get all reviews
    reviews: reviews,

    // Get review by ID
    getReview: (id: string): Review | undefined => {
      return reviews.find((r) => r.id === id);
    },

    // Update review status
    updateReviewStatus: (id: string, status: "not_started" | "draft" | "submitted") => {
      reviews = reviews.map((r) => (r.id === id ? { ...r, status } : r));
      return Promise.resolve();
    },

    // Save draft
    saveDraft: (
      id: string,
      scores: Record<string, { score: number | null; comment: string }>,
      overallComment: string,
    ) => {
      reviews = reviews.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "draft" as const,
              scores,
              overallComment,
            }
          : r,
      );
      return Promise.resolve();
    },

    // Submit review
    submitReview: (
      id: string,
      scores: Record<string, { score: number | null; comment: string }>,
      overallComment: string,
    ) => {
      reviews = reviews.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "submitted" as const,
              scores,
              overallComment,
              submittedAt: new Date().toISOString(),
            }
          : r,
      );
      return Promise.resolve();
    },

    // Get reviews by task
    getReviewsByTask: (taskId: string): Review[] => {
      return reviews.filter((r) => r.taskId === taskId);
    },

    // Get first not started review for a task
    getFirstNotStartedForTask: (taskId: string): Review | undefined => {
      return reviews.find((r) => r.taskId === taskId && r.status === "not_started");
    },
  };
};
