import { BookOpen, Clock, CheckSquare, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";
import { StatCard } from "@/shared/ui/StatCard";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { DeadlinesList, ActionCards, NotificationsList } from "@/widgets/student-dashboard";

import { mockDeadlines, mockActionData, mockNotifications } from "../model/mockData";

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
  const hasActions = mockActionData.reviewsPending > 0 || mockActionData.newFeedback > 0;

  return (
    <AppShell title={t("student.dashboard.title")}>
      <PageHeader title={t("student.dashboard.title")} subtitle={todayLabel} />

      {/* Overview strip — 4 cols on tablet+, 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-2 tablet:grid-cols-4 mb-5">
        <StatCard
          label={t("student.dashboard.activeCourses")}
          value={3}
          icon={<BookOpen className="w-4 h-4" />}
          accent="var(--brand-primary)"
          compact
        />
        <StatCard
          label={t("student.dashboard.deadlinesToday")}
          value={mockDeadlines.filter((d) => d.isUrgent).length}
          icon={<Clock className="w-4 h-4" />}
          accent="var(--warning)"
          compact
        />
        <StatCard
          label={t("student.dashboard.needToReview")}
          value={mockActionData.reviewsPending}
          icon={<CheckSquare className="w-4 h-4" />}
          accent="var(--chart-4)"
          compact
        />
        <StatCard
          label={t("student.dashboard.newFeedback")}
          value={mockActionData.newFeedback}
          icon={<MessageSquare className="w-4 h-4" />}
          accent="var(--success)"
          compact
        />
      </div>

      {/* Two-column layout */}
      <div className="task-layout">
        {/* Left: single main focus block */}
        <div className="space-y-4">
          <SectionCard title={t("student.dashboard.toDo")} noPadding>
            {/* Action items pinned at top when present */}
            {hasActions && (
              <>
                <ActionCards
                  data={mockActionData}
                  onReviewsClick={() => {
                    window.location.hash = "/reviews";
                  }}
                  onFeedbackClick={() => {
                    window.location.hash = "/reviews/received";
                  }}
                />
                {/* Section break before deadlines */}
                {mockDeadlines.length > 0 && (
                  <div className="px-5 py-2 bg-[--surface-hover] border-y border-[--surface-border]">
                    <span className="text-[10px] font-semibold text-[--text-tertiary] uppercase tracking-[0.5px]">
                      {t("student.dashboard.upcoming")}
                    </span>
                  </div>
                )}
              </>
            )}
            <DeadlinesList
              items={mockDeadlines}
              onTaskClick={(taskId) => {
                window.location.hash = `/task/${taskId}`;
              }}
            />
          </SectionCard>

          {/* Mobile: notifications inline */}
          <div className="hide-on-desktop">
            <SectionCard title={t("student.dashboard.notifications")} noPadding>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  window.location.hash = `/inbox/${id}`;
                }}
                onViewAllClick={() => {
                  window.location.hash = "/inbox";
                }}
              />
            </SectionCard>
          </div>
        </div>

        {/* Right sidebar — desktop only, secondary info */}
        <div className="hide-below-desktop">
          <div className="task-sidebar-sticky">
            <SectionCard title={t("student.dashboard.notifications")} noPadding>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  window.location.hash = `/inbox/${id}`;
                }}
                onViewAllClick={() => {
                  window.location.hash = "/inbox";
                }}
              />
            </SectionCard>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
