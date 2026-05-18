import { useQuery } from "@tanstack/react-query";

import { type GetSubmittedHomeworkResponse, http } from "@/shared/api";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { workRepo } from "@/entities/work";

export interface ReceivedReview {
  reviewId: string;
  mark: number;
  comment: string;
}

export interface TaskSubmissionReviews {
  taskId: string;
  taskTitle: string;
  courseId: string;
  courseName: string;
  status: "PUBLISHED" | "IN_REVIEW" | "PENDING";
  reviewsReceived: number;
  reviewsRequired: number;
  finalMark: number | null;
  reviews: ReceivedReview[];
}

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
            mark: r.mark,
            comment: r.comment,
          }));

          const status: TaskSubmissionReviews["status"] =
            detail.finalMark != null ? "PUBLISHED" : reviews.length > 0 ? "IN_REVIEW" : "PENDING";

          return {
            taskId: a.id,
            taskTitle: a.title,
            courseId: a.courseId,
            courseName: courseNameById.get(a.courseId) ?? "",
            status,
            reviewsReceived: reviews.length,
            reviewsRequired: a.reviewCount,
            finalMark: detail.finalMark,
            reviews,
          };
        }),
      );

      return items.filter((x): x is TaskSubmissionReviews => x !== null);
    },
  });
}
