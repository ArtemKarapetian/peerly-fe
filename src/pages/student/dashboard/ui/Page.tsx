import { useQueries } from "@tanstack/react-query";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/shared/ui/PageHeader";
import { StatCard } from "@/shared/ui/StatCard";

import { useAssignments } from "@/entities/assignment";
import { useCourses } from "@/entities/course";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { useAssignedReviewsInbox } from "@/widgets/reviews-inbox";
import { DeadlinesList } from "@/widgets/student-dashboard";
import type { DeadlineItem } from "@/widgets/student-dashboard";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

const todayRaw = new Date().toLocaleDateString(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});
const todayLabel = todayRaw.charAt(0).toUpperCase() + todayRaw.slice(1);

function SectionCard({
  title,
  children,
  noPadding = false,
}: {
  title: string;
  children: React.ReactNode;
  noPadding?: boolean;
}) {
  return (
    <section className="bg-card border border-[--surface-border] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-sm)]">
      <div className="px-5 py-3.5 border-b border-[--surface-border]">
        <h2 className="text-[15px] font-semibold text-[--text-primary] tracking-[-0.2px]">
          {title}
        </h2>
      </div>
      <div className={noPadding ? "" : "px-5 py-4"}>{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const reviewsToDo = useMemo(() => {
    return (reviewsInbox ?? [])
      .filter((r) => r.status === "not_started" && r.reviewDeadlineTimestamp > now)
      .sort((a, b) => a.reviewDeadlineTimestamp - b.reviewDeadlineTimestamp);
  }, [reviewsInbox, now]);

  const urgentCount = deadlines.filter((d) => d.isUrgent).length;
  const activeCoursesCount = (courses ?? []).filter((c) => c.status === "active").length;

  return (
    <AppShell title={t("student.dashboard.title")}>
      <PageHeader title={t("student.dashboard.title")} subtitle={todayLabel} />

      <div className="grid grid-cols-2 gap-2 mb-5">
        <StatCard
          label={t("student.dashboard.activeCourses", { count: activeCoursesCount })}
          value={isLoading ? "—" : activeCoursesCount}
          icon={<BookOpen className="w-4 h-4" />}
          accent="var(--brand-primary)"
          compact
        />
        <StatCard
          label={t("student.dashboard.deadlinesWeek", { count: urgentCount })}
          value={isLoading ? "—" : urgentCount}
          icon={<Clock className="w-4 h-4" />}
          accent="var(--warning)"
          compact
        />
      </div>

      <SectionCard title={t("student.dashboard.toDo")} noPadding>
        {isLoading ? (
          <p className="px-5 py-6 text-[14px] text-text-tertiary">{t("common.loading")}</p>
        ) : (
          <DeadlinesList
            items={deadlines}
            onTaskClick={(courseId, taskId) => {
              void navigate(`/student/courses/${courseId}/tasks/${taskId}`);
            }}
          />
        )}
      </SectionCard>

      <div className="mt-5">
        <SectionCard title={t("student.dashboard.toReview")} noPadding>
          {reviewsLoading ? (
            <p className="px-5 py-6 text-[14px] text-text-tertiary">{t("common.loading")}</p>
          ) : reviewsToDo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-5">
              <div className="w-10 h-10 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[--text-tertiary]" />
              </div>
              <p className="text-[14px] font-medium text-[--text-primary] mb-0.5">
                {t("student.dashboard.noReviews")}
              </p>
              <p className="text-[13px] text-[--text-secondary]">
                {t("student.dashboard.noReviewsDesc")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[--surface-border]">
              {reviewsToDo.map((review) => {
                const isSoon = review.reviewDeadlineTimestamp - now < 2 * ONE_DAY_MS;
                return (
                  <button
                    key={review.id}
                    onClick={() => void navigate(`/student/reviews/${review.id}`)}
                    className={`w-full text-left py-3.5 pr-5 hover:bg-surface-hover transition-colors duration-150 group ${
                      isSoon ? "pl-[17px] border-l-[3px] border-[--warning]" : "pl-5"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[--text-tertiary] mb-0.5">
                          {review.courseName}
                        </p>
                        <p className="text-[14px] font-semibold text-[--text-primary] truncate leading-snug mb-2">
                          {review.taskTitle}
                        </p>
                        <div
                          className={`flex items-center gap-1 text-[12px] font-medium ${
                            isSoon ? "text-[--warning]" : "text-[--text-tertiary]"
                          }`}
                        >
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{review.reviewDeadline}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150 shrink-0" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
