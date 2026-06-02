import { useQuery } from "@tanstack/react-query";

import { assignedReviewKeys } from "@/shared/api/queryKeys";

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

async function enrichAssignedReview(submissionId: string) {
  const sub = await reviewRepo.getAssignedSubmission(submissionId).catch(() => null);
  return sub?.submittedReviewId ?? null;
}

async function buildInboxForAssignment(
  a: Awaited<ReturnType<typeof assignmentRepo.getAll>>[number],
  courseNameById: Map<string, string>,
): Promise<InboxReview[]> {
  const assigned = await reviewRepo.listAssigned(a.id).catch(() => []);
  const { label, ts } = formatDeadline(a.reviewDeadline);

  const enriched = await Promise.all(
    assigned.map(async (r) => ({
      r,
      submittedReviewId: await enrichAssignedReview(r.submissionId),
    })),
  );

  return enriched.map(({ r, submittedReviewId }) => ({
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
  }));
}

export function useAssignedReviewsInbox() {
  return useQuery({
    queryKey: assignedReviewKeys.forMe(),
    queryFn: async (): Promise<InboxReview[]> => {
      const courses = await courseRepo.getForStudent().catch(() => []);
      const courseNameById = new Map(courses.map((c) => [c.id, c.name]));

      const assignments = await assignmentRepo.getAll().catch(() => []);
      const visible = assignments.filter((a) => a.backendStatus === "inReview");

      const lists = await Promise.all(
        visible.map((a) => buildInboxForAssignment(a, courseNameById)),
      );
      return lists.flat();
    },
  });
}
