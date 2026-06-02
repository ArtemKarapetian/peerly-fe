import { useQuery } from "@tanstack/react-query";

import { gradebookKeys } from "@/shared/api/queryKeys";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { loadRubricTotals } from "@/entities/rubric";
import { workRepo } from "@/entities/work";

import type { GradeEntry } from "@/widgets/gradebook";

const FALLBACK_MAX_SCORE = 100;

export function useGradebookEntries() {
  return useQuery({
    queryKey: gradebookKeys.forMe(),
    queryFn: async (): Promise<GradeEntry[]> => {
      const courses = await courseRepo.getForStudent();
      const courseNameById = new Map(courses.map((c) => [c.id, c.name]));

      const assignments = await assignmentRepo.getAll();
      const visible = assignments.filter(
        (a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted",
      );

      const rubricTotals = await loadRubricTotals(
        visible.map((a) => a.rubricId).filter((id): id is string => !!id),
      );

      const now = Date.now();

      return Promise.all(
        visible.map(async (a): Promise<GradeEntry> => {
          const submission = await workRepo.getMineForHomework(a.id).catch(() => null);
          const isPastDeadline = a.dueDate.getTime() < now;

          const isClosedHomework = ["finished", "confirmed", "confirmation"].includes(
            String(a.backendStatus).toLowerCase(),
          );
          const status = submission
            ? submission.finalMark != null
              ? "PUBLISHED"
              : isClosedHomework
                ? "UNGRADED"
                : "IN_REVIEW"
            : isPastDeadline
              ? "OVERDUE"
              : "NOT_STARTED";

          const maxScore = a.rubricId
            ? (rubricTotals.get(a.rubricId) ?? FALLBACK_MAX_SCORE)
            : FALLBACK_MAX_SCORE;

          return {
            id: a.id,
            courseId: a.courseId,
            courseName: courseNameById.get(a.courseId) ?? "",
            taskId: a.id,
            taskTitle: a.title,
            status,
            score: submission?.finalMark ?? null,
            maxScore,
            isScoreLocked: false,
            updatedAt: a.dueDate.toISOString(),
          } satisfies GradeEntry;
        }),
      );
    },
  });
}
