import { useQuery } from "@tanstack/react-query";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { workRepo } from "@/entities/work";

import type { GradeEntry } from "@/widgets/gradebook";

type GradebookEntry = GradeEntry & { _courseId: string };

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

      const entries = await Promise.all(
        visible.map(async (a) => {
          const submission = await workRepo.getMineForHomework(a.id).catch(() => null);
          const status = !submission
            ? "NOT_SUBMITTED"
            : submission.finalMark != null
              ? "PUBLISHED"
              : "IN_REVIEW";

          return {
            id: a.id,
            courseId: a.courseId,
            _courseId: a.courseId,
            courseName: courseNameById.get(a.courseId) ?? "",
            taskId: a.id,
            taskTitle: a.title,
            status,
            score: submission?.finalMark ?? null,
            maxScore: 100,
            isScoreLocked: false,
            updatedAt: a.dueDate.toISOString(),
          } satisfies GradebookEntry;
        }),
      );

      return entries;
    },
  });
}
