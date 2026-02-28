import { useState, useMemo, useCallback } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  Bell,
  Filter,
  CheckCheck,
  Clock,
  MessageSquare,
  FileCheck,
  AlertCircle,
  Award,
  ChevronDown,
} from "lucide-react";

type NotificationType =
  | "DEADLINE"
  | "REVIEW_ASSIGNED"
  | "REVIEW_RECEIVED"
  | "GRADE_PUBLISHED"
  | "COMMENT"
  | "TASK_UPDATED";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
}

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "REVIEW_ASSIGNED",
    title: "Новая рецензия для проверки",
    message: 'Вам назначена рецензия работы по заданию "React компоненты"',
    time: "2025-01-24T10:30:00",
    isRead: false,
    link: "#/reviews",
  },
  {
    id: "2",
    type: "DEADLINE",
    title: "Приближается дедлайн",
    message: 'До сдачи задания "TypeScript проект" осталось 2 дня',
    time: "2025-01-24T09:15:00",
    isRead: false,
    link: "#/task/4",
  },
  {
    id: "3",
    type: "GRADE_PUBLISHED",
    title: "Оценка опубликована",
    message: 'Преподаватель выставил оценку 92/100 за "TypeScript проект"',
    time: "2025-01-23T16:45:00",
    isRead: false,
    link: "#/task/4",
  },
  {
    id: "4",
    type: "REVIEW_RECEIVED",
    title: "Получена рецензия",
    message: 'Ваша работа "Landing Page" прошла peer review',
    time: "2025-01-23T14:20:00",
    isRead: true,
    link: "#/reviews/received",
  },
  {
    id: "5",
    type: "COMMENT",
    title: "Новый комментарий",
    message: 'Преподаватель оставил комментарий к заданию "Backend API"',
    time: "2025-01-23T11:30:00",
    isRead: true,
    link: "#/task/6",
  },
  {
    id: "6",
    type: "DEADLINE",
    title: "Дедлайн истекает сегодня",
    message: 'Последний день сдачи задания "Прототипирование"',
    time: "2025-01-23T08:00:00",
    isRead: false,
    link: "#/task/3",
  },
  {
    id: "7",
    type: "REVIEW_ASSIGNED",
    title: "Новая рецензия для проверки",
    message: 'Вам назначена рецензия работы по заданию "Вайрфреймы"',
    time: "2025-01-22T15:45:00",
    isRead: true,
    link: "#/reviews",
  },
  {
    id: "8",
    type: "TASK_UPDATED",
    title: "Задание обновлено",
    message: 'Преподаватель обновил требования к заданию "Графы"',
    time: "2025-01-22T13:10:00",
    isRead: true,
    link: "#/task/8",
  },
  {
    id: "9",
    type: "GRADE_PUBLISHED",
    title: "Оценка опубликована",
    message: 'Преподаватель выставил оценку 85/100 за "Landing Page"',
    time: "2025-01-20T14:30:00",
    isRead: true,
    link: "#/task/1",
  },
  {
    id: "10",
    type: "REVIEW_RECEIVED",
    title: "Получена рецензия",
    message: 'Ваша работа "Сортировка" прошла peer review',
    time: "2025-01-19T17:00:00",
    isRead: true,
    link: "#/reviews/received",
  },
];

type FilterType = "ALL" | "UNREAD" | "DEADLINES" | "REVIEWS";

const filterLabels: Record<FilterType, string> = {
  ALL: "Все",
  UNREAD: "Непрочитанные",
  DEADLINES: "Дедлайны",
  REVIEWS: "Рецензии",
};

export default function InboxPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      switch (selectedFilter) {
        case "UNREAD":
          return !notif.isRead;
        case "DEADLINES":
          return notif.type === "DEADLINE";
        case "REVIEWS":
          return notif.type === "REVIEW_ASSIGNED" || notif.type === "REVIEW_RECEIVED";
        case "ALL":
        default:
          return true;
      }
    });
  }, [notifications, selectedFilter]);

  // Count unread
  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
    );
    // Navigate
    window.location.hash = notification.link.replace("#", "");
  }, []);

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "DEADLINE":
        return <Clock className="w-5 h-5 text-[#e65100]" />;
      case "REVIEW_ASSIGNED":
        return <FileCheck className="w-5 h-5 text-[#3d6bc6]" />;
      case "REVIEW_RECEIVED":
        return <MessageSquare className="w-5 h-5 text-[#3d6bc6]" />;
      case "GRADE_PUBLISHED":
        return <Award className="w-5 h-5 text-[#2e7d32]" />;
      case "COMMENT":
        return <MessageSquare className="w-5 h-5 text-[#767692]" />;
      case "TASK_UPDATED":
        return <AlertCircle className="w-5 h-5 text-[#f57c00]" />;
      default:
        return <Bell className="w-5 h-5 text-[#767692]" />;
    }
  };

  const getNotificationBgColor = (type: NotificationType, isRead: boolean) => {
    if (isRead) return "bg-white";

    switch (type) {
      case "DEADLINE":
        return "bg-[#fff3e0]";
      case "REVIEW_ASSIGNED":
      case "REVIEW_RECEIVED":
        return "bg-[#f0f4ff]";
      case "GRADE_PUBLISHED":
        return "bg-[#e8f5e9]";
      default:
        return "bg-[#fafbfc]";
    }
  };

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays === 1) return "Вчера";
    if (diffDays < 7) return `${diffDays} дн назад`;

    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#fafbfc]">
        {/* Header */}
        <div className="bg-white border-b-2 border-[#e6e8ee]">
          <div className="max-w-[1400px] mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
                  Уведомления
                </h1>
                <p className="text-[15px] text-[#767692] leading-[1.5]">
                  {unreadCount > 0
                    ? `У вас ${unreadCount} ${unreadCount === 1 ? "непрочитанное уведомление" : "непрочитанных уведомлений"}`
                    : "Все уведомления прочитаны"}
                </p>
              </div>

              {/* Mark all as read button - Desktop */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="hidden tablet:flex items-center gap-2 px-4 py-2.5 bg-[#3d6bc6] hover:bg-[#2e5bb8] text-white rounded-[8px] text-[14px] font-medium transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  Прочитать все
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[14px] text-[#767692]">
                <Filter className="w-4 h-4" />
                <span className="hidden tablet:inline">Фильтр:</span>
              </div>

              {/* Desktop Tabs */}
              <div className="hidden tablet:flex items-center gap-2">
                {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                      selectedFilter === filter
                        ? "bg-[#3d6bc6] text-white"
                        : "bg-white text-[#21214f] hover:bg-[#f9f9f9] border-2 border-[#e6e8ee]"
                    }`}
                  >
                    {filterLabels[filter]}
                  </button>
                ))}
              </div>

              {/* Mobile Dropdown */}
              <div className="relative tablet:hidden flex-1">
                <button
                  onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex items-center justify-between gap-2 w-full px-4 py-2 bg-white border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f]"
                >
                  <span>{filterLabels[selectedFilter]}</span>
                  <ChevronDown className="w-4 h-4 text-[#767692]" />
                </button>

                {showFilterDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 overflow-hidden">
                    {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                      <button
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(filter);
                          setShowFilterDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                          selectedFilter === filter
                            ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                            : "text-[#21214f]"
                        }`}
                      >
                        {filterLabels[filter]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mark all as read - Mobile */}
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="tablet:hidden flex items-center justify-center w-10 h-10 bg-[#3d6bc6] hover:bg-[#2e5bb8] text-white rounded-[8px] transition-colors shrink-0"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[1400px] mx-auto px-4 tablet:px-6 desktop:px-8 py-6 desktop:py-8">
          {/* Notifications List */}
          {filteredNotifications.length > 0 ? (
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden divide-y-2 divide-[#e6e8ee]">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 desktop:p-5 cursor-pointer hover:bg-[#fafbfc] transition-colors ${getNotificationBgColor(
                    notification.type,
                    notification.isRead,
                  )}`}
                >
                  <div className="flex items-start gap-3 desktop:gap-4">
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 desktop:w-12 desktop:h-12 rounded-[12px] flex items-center justify-center shrink-0 ${
                        notification.isRead ? "bg-[#f9f9f9]" : "bg-white"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3
                          className={`text-[15px] desktop:text-[16px] font-medium ${
                            notification.isRead ? "text-[#767692]" : "text-[#21214f]"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-[#3d6bc6] rounded-full shrink-0 mt-1.5"></div>
                        )}
                      </div>
                      <p
                        className={`text-[14px] leading-[1.5] mb-2 ${
                          notification.isRead ? "text-[#a0a0b8]" : "text-[#767692]"
                        }`}
                      >
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[13px] text-[#a0a0b8]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatTime(notification.time)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9f9f9] rounded-full mb-4">
                <Bell className="w-8 h-8 text-[#767692]" />
              </div>
              <h3 className="text-[18px] font-medium text-[#21214f]">
                {selectedFilter === "ALL"
                  ? "Нет уведомлений"
                  : selectedFilter === "DEADLINES"
                    ? "Нет уведомлений о дедлайнах"
                    : selectedFilter === "REVIEWS"
                      ? "Нет уведомлений о рецензиях"
                      : "Нет уведомлений"}
              </h3>
              <p className="text-[14px] text-[#767692] mb-6">
                {selectedFilter === "ALL"
                  ? "Здесь будут отображаться все ваши уведомления"
                  : "Попробуйте выбрать другой фильтр"}
              </p>
              {selectedFilter !== "ALL" && (
                <button
                  onClick={() => setSelectedFilter("ALL")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#d2e1f8] hover:bg-[#c5d5f5] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors"
                >
                  Показать все
                </button>
              )}
            </div>
          )}

          {/* Info Card */}
          <div className="mt-6 bg-[#f0f4ff] border-2 border-[#d2e1f8] rounded-[16px] p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#3d6bc6] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-[14px] font-semibold">i</span>
              </div>
              <div>
                <h4 className="text-[15px] font-medium text-[#21214f] mb-1">Об уведомлениях</h4>
                <p className="text-[14px] text-[#767692] leading-[1.6]">
                  Здесь отображаются все важные события: дедлайны заданий, новые рецензии,
                  комментарии преподавателей и опубликованные оценки. Нажмите на уведомление, чтобы
                  перейти к связанной странице.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
