import { useState } from "react";
import { AppShell } from "@/app/components/AppShell";
import { LayoutDebugger } from "@/app/components/LayoutDebugger";
import {
  DeadlinesList,
  ActionCards,
  RecentActivity,
  TodaySummary,
  NotificationsList,
} from "@/app/components/dashboard";
import type {
  DeadlineItem,
  ActionCardData,
  RecentItem,
  TodaySummaryData,
  Notification,
} from "@/app/components/dashboard";

/**
 * DashboardPage - Студенческий дашборд "что делать дальше"
 *
 * Layout:
 * Desktop (≥1200px): 2 columns (Main + Right Rail sticky)
 * Tablet/Mobile: Single column, right rail becomes collapsible
 *
 * Main column:
 * - Ближайшие дедлайны (5-8 items)
 * - Требуют действия (action cards)
 * - Недавнее (recent activity)
 *
 * Right rail (sticky):
 * - Сегодня (summary)
 * - Уведомления (latest 3)
 */

// Mock data
const mockDeadlines: DeadlineItem[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "1",
    taskTitle: "Задание 1: Создание лендинга",
    dueDate: "31 января, 23:59",
    status: "NOT_STARTED",
    isUrgent: true,
  },
  {
    id: "2",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "2",
    taskTitle: "Задание 2: Прототипирование",
    dueDate: "1 февраля, 18:00",
    status: "DRAFT",
    isUrgent: true,
  },
  {
    id: "3",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "3",
    taskTitle: "Задание 3: React компоненты",
    dueDate: "3 февраля, 23:59",
    status: "NEED_YOUR_REVIEW",
  },
  {
    id: "4",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "4",
    taskTitle: "Задание 1: Сортировки",
    dueDate: "5 февраля, 20:00",
    status: "SUBMITTED",
  },
  {
    id: "5",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "5",
    taskTitle: "Задание 3: UI Kit",
    dueDate: "7 февраля, 23:59",
    status: "IN_REVIEW",
  },
];

const mockActionData: ActionCardData = {
  reviewsPending: 2,
  newFeedback: 1,
};

const mockRecentItems: RecentItem[] = [
  {
    id: "1",
    type: "task",
    title: "Задание 1: Создание лендинга",
    subtitle: "Веб-разработка",
    timestamp: "2 часа назад",
  },
  {
    id: "2",
    type: "course",
    title: "Дизайн интерфейсов",
    subtitle: "Иванова А.П.",
    timestamp: "5 часов назад",
    coverColor: "#b7bdff",
  },
  {
    id: "3",
    type: "task",
    title: "Задание 3: React компоненты",
    subtitle: "Веб-разработка",
    timestamp: "вчера",
  },
];

const mockTodayData: TodaySummaryData = {
  reviewsPending: 2,
  tasksToday: 3,
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "feedback",
    title: 'Новый отзыв на задание "Создание лендинга"',
    time: "10 минут назад",
    isRead: false,
  },
  {
    id: "2",
    type: "reminder",
    title: 'Дедлайн "Прототипирование" через 24 часа',
    time: "2 часа назад",
    isRead: false,
  },
  {
    id: "3",
    type: "grade",
    title: 'Оценка выставлена за "Сортировки"',
    time: "5 часов назад",
    isRead: true,
  },
  {
    id: "4",
    type: "info",
    title: "Добавлены новые материалы к курсу",
    time: "вчера",
    isRead: true,
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Mock data - will be replaced with real API calls
  const hasCourses = true; // Toggle to test empty state

  // Empty state
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

  // Error state
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
                // Simulate reload
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

  // Loading state
  if (isLoading) {
    return (
      <AppShell title="Дашборд">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Дашборд</h1>

        {/* Loading skeletons */}
        <div className="task-layout">
          {/* Main column skeleton */}
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

          {/* Right rail skeleton - только на desktop */}
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

  // Main content
  return (
    <AppShell title="Дашборд">
      <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">Дашборд</h1>

      {/* 2-column layout: Main + Right Rail (sticky) */}
      <div className="task-layout">
        {/* Main column */}
        <div className="space-y-6">
          {/* Section 1: Ближайшие дедлайны */}
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

          {/* Section 2: Требуют действия */}
          <section className="bg-[#f9f9f9] rounded-[20px] p-6">
            <h2 className="text-[20px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
              Требуют действия
            </h2>
            <ActionCards
              data={mockActionData}
              onReviewsClick={() => {
                // TODO: Navigate to reviews list
                console.log("Navigate to reviews");
              }}
              onFeedbackClick={() => {
                // TODO: Navigate to feedback list
                console.log("Navigate to feedback");
              }}
            />
          </section>

          {/* Section 3: Недавнее */}
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

          {/* Mobile/Tablet: Right rail content at the bottom */}
          <div className="hide-on-desktop space-y-6">
            {/* Сегодня summary */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Сегодня
              </h2>
              <TodaySummary data={mockTodayData} />
            </section>

            {/* Уведомления */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Уведомления
              </h2>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  // TODO: Navigate to notification detail
                  console.log("Notification clicked:", id);
                }}
                onViewAllClick={() => {
                  // TODO: Navigate to all notifications
                  console.log("View all notifications");
                }}
              />
            </section>
          </div>
        </div>

        {/* Right rail (sticky) - desktop only */}
        <div className="space-y-6 hide-below-desktop">
          <div className="task-sidebar-sticky space-y-6">
            {/* Сегодня summary */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Сегодня
              </h2>
              <TodaySummary data={mockTodayData} />
            </section>

            {/* Уведомления */}
            <section className="bg-[#f9f9f9] rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-[#21214f] mb-4 tracking-[-0.5px]">
                Уведомления
              </h2>
              <NotificationsList
                items={mockNotifications}
                onNotificationClick={(id) => {
                  // TODO: Navigate to notification detail
                  console.log("Notification clicked:", id);
                }}
                onViewAllClick={() => {
                  // TODO: Navigate to all notifications
                  console.log("View all notifications");
                }}
              />
            </section>
          </div>
        </div>
      </div>

      {/* Layout Debugger */}
      <LayoutDebugger />
    </AppShell>
  );
}
