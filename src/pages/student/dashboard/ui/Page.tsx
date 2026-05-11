import { BookOpen, Clock } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "@/shared/ui/PageHeader";
import { StatCard } from "@/shared/ui/StatCard";

import { useAssignments } from "@/entities/assignment";
import { useCourses } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
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
  const [now] = useState(() => Date.now());
  const isLoading = coursesLoading || assignmentsLoading;

  const courseNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of courses ?? []) map.set(c.id, c.title);
    return map;
  }, [courses]);

  const deadlines: DeadlineItem[] = useMemo(() => {
    return (assignments ?? [])
      .filter((a) => a.backendStatus !== "draft" && a.backendStatus !== "deleted")
      .map((a) => {
        const due = a.dueDate.getTime();
        return {
          id: a.id,
          courseId: a.courseId,
          courseName: courseNameById.get(a.courseId) ?? "",
          taskId: a.id,
          taskTitle: a.title,
          dueDate: a.dueDate.toISOString(),
          status: "NOT_STARTED" as const,
          isUrgent: due > now && due - now < 7 * ONE_DAY_MS,
        };
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [assignments, courseNameById, now]);

  const urgentCount = deadlines.filter((d) => d.isUrgent).length;
  const activeCoursesCount = (courses ?? []).filter((c) => c.status === "active").length;

  return (
    <AppShell title={t("student.dashboard.title")}>
      <PageHeader title={t("student.dashboard.title")} subtitle={todayLabel} />

      <div className="grid grid-cols-2 gap-2 mb-5">
        <StatCard
          label={t("student.dashboard.activeCourses")}
          value={isLoading ? "—" : activeCoursesCount}
          icon={<BookOpen className="w-4 h-4" />}
          accent="var(--brand-primary)"
          compact
        />
        <StatCard
          label={t("student.dashboard.deadlinesWeek")}
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
    </AppShell>
  );
}
