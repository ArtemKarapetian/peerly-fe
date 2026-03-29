import { Bell, Clock, MessageSquare, FileCheck, AlertCircle, Award } from "lucide-react";
import { useTranslation } from "react-i18next";

export type NotificationType =
  | "DEADLINE"
  | "REVIEW_ASSIGNED"
  | "REVIEW_RECEIVED"
  | "GRADE_PUBLISHED"
  | "COMMENT"
  | "TASK_UPDATED";

export type FilterType = "ALL" | "UNREAD" | "DEADLINES" | "REVIEWS";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
}

interface NotificationListProps {
  notifications: Notification[];
  selectedFilter: FilterType;
  onNotificationClick: (notification: Notification) => void;
  onResetFilter: () => void;
}

function getNotificationIcon(type: NotificationType) {
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
}

function getNotificationBgColor(type: NotificationType, isRead: boolean) {
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
}

function formatTime(timeStr: string, t: (key: string) => string) {
  const date = new Date(timeStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return t("widget.notificationList.justNow");
  if (diffMins < 60) return `${diffMins} ${t("widget.notificationList.minAgo")}`;
  if (diffHours < 24) return `${diffHours} ${t("widget.notificationList.hAgo")}`;
  if (diffDays === 1) return t("widget.notificationList.yesterday");
  if (diffDays < 7) return `${diffDays} ${t("widget.notificationList.dAgo")}`;

  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

export function NotificationList({
  notifications,
  selectedFilter,
  onNotificationClick,
  onResetFilter,
}: NotificationListProps) {
  const { t } = useTranslation();

  if (notifications.length === 0) {
    return (
      <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#f9f9f9] rounded-full mb-4">
          <Bell className="w-8 h-8 text-[#767692]" />
        </div>
        <h3 className="text-[18px] font-medium text-[#21214f]">
          {selectedFilter === "ALL"
            ? t("widget.notificationList.noNotifications")
            : selectedFilter === "DEADLINES"
              ? t("widget.notificationList.noDeadlineNotifications")
              : selectedFilter === "REVIEWS"
                ? t("widget.notificationList.noReviewNotifications")
                : t("widget.notificationList.noNotifications")}
        </h3>
        <p className="text-[14px] text-[#767692] mb-6">
          {selectedFilter === "ALL"
            ? t("widget.notificationList.willAppearHere")
            : t("widget.notificationList.tryAnotherFilter")}
        </p>
        {selectedFilter !== "ALL" && (
          <button
            onClick={onResetFilter}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d2e1f8] hover:bg-[#c5d5f5] text-[#21214f] rounded-[8px] text-[14px] font-medium transition-colors"
          >
            {t("widget.notificationList.showAll")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] overflow-hidden divide-y-2 divide-[#e6e8ee]">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onNotificationClick(notification)}
          className={`p-4 desktop:p-5 cursor-pointer hover:bg-[#fafbfc] transition-colors ${getNotificationBgColor(
            notification.type,
            notification.isRead,
          )}`}
        >
          <div className="flex items-start gap-3 desktop:gap-4">
            <div
              className={`w-10 h-10 desktop:w-12 desktop:h-12 rounded-[12px] flex items-center justify-center shrink-0 ${
                notification.isRead ? "bg-[#f9f9f9]" : "bg-white"
              }`}
            >
              {getNotificationIcon(notification.type)}
            </div>

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
                <span>{formatTime(notification.time, t)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
