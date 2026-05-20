import { useQuery } from "@tanstack/react-query";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { reviewRepo } from "@/entities/review";

export interface InboxReview {
  id: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  taskId: string;
  reviewDeadline: string;
  reviewDeadlineTimestamp: number;
  status: "not_started" | "submitted";
  submittedReviewId: string | null;
  isAnonymous: boolean;
}

function formatDeadline(d: Date | undefined): { label: string; ts: number } {
  if (!d) return { label: "", ts: 0 };
  const ts = d.getTime();
  const label = d.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return { label, ts };
}

export function useAssignedReviewsInbox() {
  return useQuery({
    queryKey: ["assigned-reviews", "me"],
    queryFn: async (): Promise<InboxReview[]> => {
      const courses = await courseRepo.getForStudent().catch(() => []);
      const courseNameById = new Map(courses.map((c) => [c.id, c.title]));

      const assignments = await assignmentRepo.getAll().catch(() => []);
      const visible = assignments.filter(
        (a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted",
      );

      const lists = await Promise.all(
        visible.map(async (a) => {
          const assigned = await reviewRepo.listAssigned(a.id).catch(() => []);
          const { label, ts } = formatDeadline(a.reviewDeadline);

          const enriched = await Promise.all(
            assigned.map(async (r) => {
              const sub = await reviewRepo.getAssignedSubmission(r.submissionId).catch(() => null);
              return { r, submittedReviewId: sub?.submittedReviewId ?? null };
            }),
          );

          return enriched.map(
            ({ r, submittedReviewId }) =>
              ({
                id: r.submissionId,
                taskTitle: a.title,
                courseName: courseNameById.get(a.courseId) ?? "",
                courseId: a.courseId,
                taskId: a.id,
                reviewDeadline: label,
                reviewDeadlineTimestamp: ts,
                status: submittedReviewId ? "submitted" : "not_started",
                submittedReviewId,
                isAnonymous: true,
              }) satisfies InboxReview,
          );
        }),
      );

      return lists.flat();
    },
  });
}
