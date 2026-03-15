import { BookOpen, Clock, CheckSquare, MessageSquare } from "lucide-react";

import { PageHeader } from "@/shared/ui/PageHeader";
import { StatCard } from "@/shared/ui/StatCard";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { DeadlinesList, ActionCards, NotificationsList } from "@/widgets/student-dashboard";

import { mockDeadlines, mockActionData, mockNotifications } from "../model/mockData";

const todayRaw = new Date().toLocaleDateString("ru-RU", {
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
    <section className="bg-white border border-[--surface-border] rounded-[var(--radius-xl)] overflow-hidden shadow-[var(--shadow-sm)]">
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
  const hasActions = mockActionData.reviewsPending > 0 || mockActionData.newFeedback > 0;

  return (
    <AppShell title="Главная">
      <PageHeader title="Главная" subtitle={todayLabel} />

      {/* Overview strip — 4 cols on tablet+, 2x2 on mobile */}
      <div className="grid grid-cols-2 gap-2 tablet:grid-cols-4 mb-5">
        <StatCard
          label="Активных курсов"
          value={3}
          icon={<BookOpen className="w-4 h-4" />}
          accent="#2563eb"
          compact
        />
        <StatCard
          label="Дедлайнов сегодня"
          value={mockDeadlines.filter((d) => d.isUrgent).length}
          icon={<Clock className="w-4 h-4" />}
          accent="#d97706"
          compact
        />
        <StatCard
          label="Нужно проверить"
          value={mockActionData.reviewsPending}
          icon={<CheckSquare className="w-4 h-4" />}
          accent="#7c3aed"
          compact
        />
        <StatCard
          label="Новых отзывов"
          value={mockActionData.newFeedback}
          icon={<MessageSquare className="w-4 h-4" />}
          accent="#059669"
          compact
        />
      </div>

      {/* Two-column layout */}
      <div className="task-layout">
        {/* Left: single main focus block */}
        <div className="space-y-4">
          <SectionCard title="К выполнению" noPadding>
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
                      Предстоящие
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
            <SectionCard title="Уведомления" noPadding>
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
            <SectionCard title="Уведомления" noPadding>
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
