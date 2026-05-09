import { useQuery } from "@tanstack/react-query";

import { type GetSubmittedHomeworkResponse, http } from "@/shared/api";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { workRepo } from "@/entities/work";

export interface ReceivedReview {
  reviewId: string;
  reviewerName: string | null;
  isAnonymous: boolean;
  submittedAt: string;
  overallComment: string;
  criteria: { name: string; score: number; maxScore: number; comment?: string }[];
}

export interface TaskSubmissionReviews {
  taskId: string;
  taskTitle: string;
  courseId: string;
  courseName: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING";
  reviewsReceived: number;
  reviewsRequired: number;
  currentScore?: number;
  maxScore?: number;
  allowAppeal: boolean;
  reviews: ReceivedReview[];
}

const MARK_MAX = 10;

export function useReceivedReviews() {
  return useQuery({
    queryKey: ["received-reviews", "me"],
    queryFn: async (): Promise<TaskSubmissionReviews[]> => {
      const courses = await courseRepo.getForStudent();
      const courseNameById = new Map(courses.map((c) => [c.id, c.title]));

      const assignments = await assignmentRepo.getAll();
      const visible = assignments.filter(
        (a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted",
      );

      const items = await Promise.all(
        visible.map(async (a): Promise<TaskSubmissionReviews | null> => {
          const submission = await workRepo.getMineForHomework(a.id).catch(() => null);
          if (!submission) return null;

          const detail = await http
            .get<GetSubmittedHomeworkResponse>(`/submissions/${submission.id}`)
            .catch(() => null);
          if (!detail) return null;

          const reviews: ReceivedReview[] = detail.submittedReviews.map((r) => ({
            reviewId: String(r.id),
            reviewerName: null,
            isAnonymous: true,
            submittedAt: "",
            overallComment: r.comment,
            criteria: [
              {
                name: "",
                score: r.mark,
                maxScore: MARK_MAX,
              },
            ],
          }));

          const status: TaskSubmissionReviews["status"] =
            detail.finalMark != null ? "PUBLISHED" : reviews.length > 0 ? "IN_REVIEW" : "PENDING";

          const result: TaskSubmissionReviews = {
            taskId: a.id,
            taskTitle: a.title,
            courseId: a.courseId,
            courseName: courseNameById.get(a.courseId) ?? "",
            status,
            reviewsReceived: reviews.length,
            reviewsRequired: a.reviewCount || reviews.length,
            allowAppeal: false,
            reviews,
          };
          if (detail.finalMark != null) {
            result.currentScore = detail.finalMark;
            result.maxScore = MARK_MAX;
          }
          return result;
        }),
      );

      return items.filter((x): x is TaskSubmissionReviews => x !== null);
    },
  });
}
