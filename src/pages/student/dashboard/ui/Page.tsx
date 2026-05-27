import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { PageHeader } from "@/shared/ui/PageHeader";
import { StatCard } from "@/shared/ui/StatCard";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { DeadlinesList } from "@/widgets/student-dashboard";

import { useStudentDashboard } from "../model/useStudentDashboard";

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
        <h2 className="text-15 font-semibold text-[--text-primary] tracking-[-0.2px]">{title}</h2>
      </div>
      <div className={noPadding ? "" : "px-5 py-4"}>{children}</div>
    </section>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isLoading, reviewsLoading, activeCoursesCount, urgentCount, deadlines, reviewsToDo } =
    useStudentDashboard();

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
          <p className="px-5 py-6 text-sm text-text-tertiary">{t("common.loading")}</p>
        ) : (
          <DeadlinesList
            items={deadlines}
            onTaskClick={(courseId, taskId) => {
              void navigate(ROUTES.task(courseId, taskId));
            }}
          />
        )}
      </SectionCard>

      <div className="mt-5">
        <SectionCard title={t("student.dashboard.toReview")} noPadding>
          {reviewsLoading ? (
            <p className="px-5 py-6 text-sm text-text-tertiary">{t("common.loading")}</p>
          ) : reviewsToDo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-5">
              <div className="w-10 h-10 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[--text-tertiary]" />
              </div>
              <p className="text-sm font-medium text-[--text-primary] mb-0.5">
                {t("student.dashboard.noReviews")}
              </p>
              <p className="text-13 text-[--text-secondary]">
                {t("student.dashboard.noReviewsDesc")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[--surface-border]">
              {reviewsToDo.map((review) => (
                <button
                  key={review.id}
                  onClick={() => void navigate(ROUTES.review(review.id))}
                  className={`w-full text-left py-3.5 pr-5 hover:bg-surface-hover transition-colors duration-150 group ${
                    review.isSoon ? "pl-[17px] border-l-[3px] border-[--warning]" : "pl-5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-2xs text-[--text-tertiary] mb-0.5">{review.courseName}</p>
                      <p className="text-sm font-semibold text-[--text-primary] truncate leading-snug mb-2">
                        {review.taskTitle}
                      </p>
                      <div
                        className={`flex items-center gap-1 text-xs font-medium ${
                          review.isSoon ? "text-[--warning]" : "text-[--text-tertiary]"
                        }`}
                      >
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{review.reviewDeadline}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
