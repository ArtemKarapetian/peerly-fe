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
      return <Clock className="w-5 h-5 text-error" />;
    case "REVIEW_ASSIGNED":
      return <FileCheck className="w-5 h-5 text-brand-primary" />;
    case "REVIEW_RECEIVED":
      return <MessageSquare className="w-5 h-5 text-brand-primary" />;
    case "GRADE_PUBLISHED":
      return <Award className="w-5 h-5 text-success" />;
    case "COMMENT":
      return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
    case "TASK_UPDATED":
      return <AlertCircle className="w-5 h-5 text-warning" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
}

function getNotificationBgColor(type: NotificationType, isRead: boolean) {
  if (isRead) return "bg-card";

  switch (type) {
    case "DEADLINE":
      return "bg-warning-light";
    case "REVIEW_ASSIGNED":
    case "REVIEW_RECEIVED":
      return "bg-brand-primary-light";
    case "GRADE_PUBLISHED":
      return "bg-success-light";
    default:
      return "bg-muted";
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
      <div className="bg-card border-2 border-border rounded-[20px] py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
          <Bell className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-[18px] font-medium text-foreground">
          {selectedFilter === "ALL"
            ? t("widget.notificationList.noNotifications")
            : selectedFilter === "DEADLINES"
              ? t("widget.notificationList.noDeadlineNotifications")
              : selectedFilter === "REVIEWS"
                ? t("widget.notificationList.noReviewNotifications")
                : t("widget.notificationList.noNotifications")}
        </h3>
        <p className="text-[14px] text-muted-foreground mb-6">
          {selectedFilter === "ALL"
            ? t("widget.notificationList.willAppearHere")
            : t("widget.notificationList.tryAnotherFilter")}
        </p>
        {selectedFilter !== "ALL" && (
          <button
            onClick={onResetFilter}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-light hover:bg-brand-primary-hover text-foreground rounded-[8px] text-[14px] font-medium transition-colors"
          >
            {t("widget.notificationList.showAll")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden divide-y-2 divide-border">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          onClick={() => onNotificationClick(notification)}
          className={`p-4 desktop:p-5 cursor-pointer hover:bg-surface-hover transition-colors ${getNotificationBgColor(
            notification.type,
            notification.isRead,
          )}`}
        >
          <div className="flex items-start gap-3 desktop:gap-4">
            <div
              className={`w-10 h-10 desktop:w-12 desktop:h-12 rounded-[12px] flex items-center justify-center shrink-0 ${
                notification.isRead ? "bg-muted" : "bg-card"
              }`}
            >
              {getNotificationIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3
                  className={`text-[15px] desktop:text-[16px] font-medium ${
                    notification.isRead ? "text-muted-foreground" : "text-foreground"
                  }`}
                >
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-brand-primary rounded-full shrink-0 mt-1.5"></div>
                )}
              </div>
              <p
                className={`text-[14px] leading-[1.5] mb-2 ${
                  notification.isRead ? "text-text-tertiary" : "text-muted-foreground"
                }`}
              >
                {notification.message}
              </p>
              <div className="flex items-center gap-1.5 text-[13px] text-text-tertiary">
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
