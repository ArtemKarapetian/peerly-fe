import { useQuery } from "@tanstack/react-query";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { rubricRepo } from "@/entities/rubric";
import { workRepo } from "@/entities/work";

import type { GradeEntry } from "@/widgets/gradebook";

type GradebookEntry = GradeEntry & { _courseId: string };

const FALLBACK_MAX_SCORE = 100;

export function useGradebookEntries() {
  return useQuery({
    queryKey: ["gradebook", "me"],
    queryFn: async (): Promise<GradebookEntry[]> => {
      const courses = await courseRepo.getForStudent();
      const courseNameById = new Map(courses.map((c) => [c.id, c.title]));

      const assignments = await assignmentRepo.getAll();
      const visible = assignments.filter(
        (a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted",
      );

      const rubricIds = Array.from(
        new Set(visible.map((a) => a.rubricId).filter((id): id is string => !!id)),
      );
      const rubricTotals = new Map<string, number>();
      await Promise.all(
        rubricIds.map(async (id) => {
          const detail = await rubricRepo.getById(id).catch(() => null);
          if (detail) {
            const total = detail.criteria.reduce((sum, c) => sum + c.maxScore, 0);
            if (total > 0) rubricTotals.set(id, total);
          }
        }),
      );

      const now = Date.now();

      return Promise.all(
        visible.map(async (a): Promise<GradebookEntry> => {
          const submission = await workRepo.getMineForHomework(a.id).catch(() => null);
          const isPastDeadline = a.dueDate.getTime() < now;

          const status = submission
            ? submission.finalMark != null
              ? "PUBLISHED"
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
            _courseId: a.courseId,
            courseName: courseNameById.get(a.courseId) ?? "",
            taskId: a.id,
            taskTitle: a.title,
            status,
            score: submission?.finalMark ?? null,
            maxScore,
            isScoreLocked: false,
            updatedAt: a.dueDate.toISOString(),
          } satisfies GradebookEntry;
        }),
      );
    },
  });
}
