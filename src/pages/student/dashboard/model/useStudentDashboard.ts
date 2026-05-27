import { useQueries } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { useAssignments } from "@/entities/assignment";
import { useCourses } from "@/entities/course";
import { workRepo } from "@/entities/work";

import { useAssignedReviewsInbox } from "@/widgets/reviews-inbox";
import type { DeadlineItem } from "@/widgets/student-dashboard";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

interface ReviewToDo {
  id: string;
  courseName: string;
  taskTitle: string;
  reviewDeadline: string;
  reviewDeadlineTimestamp: number;
  isSoon: boolean;
}

export interface StudentDashboardData {
  isLoading: boolean;
  reviewsLoading: boolean;
  activeCoursesCount: number;
  urgentCount: number;
  deadlines: DeadlineItem[];
  reviewsToDo: ReviewToDo[];
  now: number;
}

export function useStudentDashboard(): StudentDashboardData {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
  const { data: reviewsInbox, isLoading: reviewsLoading } = useAssignedReviewsInbox();
  const [now] = useState(() => Date.now());
  const isLoading = coursesLoading || assignmentsLoading;

  const courseNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of courses ?? []) map.set(c.id, c.title);
    return map;
  }, [courses]);

  const visibleAssignments = useMemo(
    () =>
      (assignments ?? []).filter(
        (a) =>
          a.backendStatus !== "draft" &&
          a.backendStatus !== "deleted" &&
          a.backendStatus !== "finished" &&
          a.backendStatus !== "confirmed" &&
          a.dueDate.getTime() > now,
      ),
    [assignments, now],
  );

  const submissionQueries = useQueries({
    queries: visibleAssignments.map((a) => ({
      queryKey: ["submissions", "mine-id", a.id] as const,
      queryFn: () => workRepo.getMineSubmissionId(a.id),
    })),
  });

  const hasSubmissionById = useMemo(() => {
    const map = new Map<string, boolean>();
    visibleAssignments.forEach((a, idx) => {
      map.set(a.id, !!submissionQueries[idx]?.data);
    });
    return map;
  }, [visibleAssignments, submissionQueries]);

  const deadlines: DeadlineItem[] = useMemo(() => {
    return visibleAssignments
      .map((a) => {
        const due = a.dueDate.getTime();
        return {
          id: a.id,
          courseId: a.courseId,
          courseName: courseNameById.get(a.courseId) ?? "",
          taskId: a.id,
          taskTitle: a.title,
          dueDate: a.dueDate.toISOString(),
          status: hasSubmissionById.get(a.id) ? ("SUBMITTED" as const) : ("NOT_STARTED" as const),
          isUrgent: due > now && due - now < 7 * ONE_DAY_MS,
        };
      })
      .sort((a, b) => {
        const aSubmitted = a.status === "SUBMITTED" ? 1 : 0;
        const bSubmitted = b.status === "SUBMITTED" ? 1 : 0;
        if (aSubmitted !== bSubmitted) return aSubmitted - bSubmitted;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  }, [visibleAssignments, courseNameById, hasSubmissionById, now]);

  const reviewsToDo: ReviewToDo[] = useMemo(() => {
    return (reviewsInbox ?? [])
      .filter((r) => r.status === "not_started" && r.reviewDeadlineTimestamp > now)
      .sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp)
      .map((r) => ({
        id: r.id,
        courseName: r.courseName,
        taskTitle: r.taskTitle,
        reviewDeadline: r.reviewDeadline,
        reviewDeadlineTimestamp: r.reviewDeadlineTimestamp,
        isSoon: r.reviewDeadlineTimestamp - now < 2 * ONE_DAY_MS,
      }));
  }, [reviewsInbox, now]);

  return {
    isLoading,
    reviewsLoading,
    activeCoursesCount: (courses ?? []).filter((c) => c.status === "active").length,
    urgentCount: deadlines.filter((d) => d.isUrgent).length,
    deadlines,
    reviewsToDo,
    now,
  };
}
