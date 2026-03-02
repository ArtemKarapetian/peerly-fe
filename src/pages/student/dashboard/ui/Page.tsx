import { useState } from "react";

import { LayoutDebugger } from "@/shared/ui/LayoutDebugger";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  DeadlinesList,
  ActionCards,
  RecentActivity,
  TodaySummary,
  NotificationsList,
} from "@/widgets/student-dashboard";

import {
  mockDeadlines,
  mockActionData,
  mockRecentItems,
  mockTodayData,
  mockNotifications,
} from "../model/mockData";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const hasCourses = true;

  if (!isLoading && !hasError && !hasCourses) {
    return (
      <AppShell title="Дашборд">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#d2e1f8] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">📚</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Вас ещё не добавили в курс
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5] mb-4">
              Попросите преподавателя выдать вам доступ к курсу, и здесь появятся ваши задания и
              дедлайны.
            </p>
            <button
              onClick={() => (window.location.hash = "/courses")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d2def8] hover:bg-[#c5d5f5] text-[#21214f] rounded-[8px] transition-colors text-[15px] font-medium"
            >
              Перейти к курсам
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (hasError) {
    return (
      <AppShell title="Дашборд">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-[#fff5f5] border-2 border-[#ffb8b8] rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-[#ffb8b8] rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">⚠️</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-[#21214f] mb-3 tracking-[-0.5px]">
              Ошибка загрузки
            </h2>
            <p className="text-[16px] text-[#767692] leading-[1.5] mb-4">
              Не удалось загрузить данные дашборда. Попробуйте обновить страницу.
            </p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                setTimeout(() => setIsLoading(false), 1000);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#21214f] hover:bg-[#3a3a6f] text-white rounded-[8px] transition-colors text-[15px] font-medium"
            >
              Повторить попытку
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (isLoading) {
    return (
      <AppShell title="Дашборд">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Дашборд</h1>

        <div className="task-layout">
          <div className="space-y-6">
            <div className="bg-[#f9f9f9] rounded-[20px] p-6 animate-pulse">
              <div className="h-6 bg-[#e6e8ee] rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-[#e6e8ee] rounded-[12px]"></div>
                ))}
              </div>
            </div>
            <div className="bg-[#f9f9f9] rounded-[20px] p-6 animate-pulse">
              <div className="h-6 bg-[#e6e8ee] rounded w-40 mb-4"></div>
              <div className="h-24 bg-[#e6e8ee] rounded-[12px]"></div>
            </div>
          </div>

          <div className="space-y-6 hide-below-desktop">
            <div className="bg-[#f9f9f9] rounded-[20px] p-6 animate-pulse">
              <div className="h-6 bg-[#e6e8ee] rounded w-32 mb-4"></div>
              <div className="space-y-2">
                <div className="h-12 bg-[#e6e8ee] rounded"></div>
                <div className="h-12 bg-[#e6e8ee] rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Дашборд">
      <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Дашборд</h1>

      <div className="task-layout">
        <div className="space-y-6">
          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Ближайшие дедлайны
            </h2>
            <DeadlinesList
              items={mockDeadlines}
              onTaskClick={(taskId) => {
                window.location.hash = `/task/${taskId}`;
              }}
            />
          </section>

          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Требуют действия
            </h2>
            <ActionCards
              data={mockActionData}
              onReviewsClick={() => {
                console.log("Navigate to reviews");
              }}
              onFeedbackClick={() => {
                console.log("Navigate to feedback");
              }}
            />
          </section>

          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Недавнее
            </h2>
            <RecentActivity
              items={mockRecentItems}
              onItemClick={(id, type) => {
                if (type === "course") {
                  window.location.hash = `/course/${id}`;
                } else {
                  window.location.hash = `/task/${id}`;
                }
              }}
            />
          </section>

          <div className="hide-on-desktop space-y-6">
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Сегодня
              </h2>
              <TodaySummary data={mockTodayData} />
            </section>

            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Уведомления
              </h2>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  console.log("Notification clicked:", id);
                }}
                onViewAllClick={() => {
                  console.log("View all notifications");
                }}
              />
            </section>
          </div>
        </div>

        <div className="space-y-6 hide-below-desktop">
          <div className="task-sidebar-sticky space-y-6">
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Сегодня
              </h2>
              <TodaySummary data={mockTodayData} />
            </section>

            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Уведомления
              </h2>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  console.log("Notification clicked:", id);
                }}
                onViewAllClick={() => {
                  console.log("View all notifications");
                }}
              />
            </section>
          </div>
        </div>
      </div>

      <LayoutDebugger />
    </AppShell>
  );
}
