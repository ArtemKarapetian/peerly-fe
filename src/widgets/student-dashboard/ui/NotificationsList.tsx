import { Bell, MessageSquare, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatRelativeTime } from "@/shared/lib/formatDate";

export type NotificationType = "feedback" | "grade" | "reminder" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
  isRead: boolean;
}

interface NotificationsListProps {
  items: Notification[];
  onNotificationClick: (id: string) => void;
  onViewAllClick: () => void;
}

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case "feedback":
      return MessageSquare;
    case "grade":
      return CheckCircle;
    case "reminder":
      return AlertCircle;
    case "info":
    default:
      return Bell;
  }
}

function getNotificationAccent(type: NotificationType): string {
  switch (type) {
    case "feedback":
      return "var(--success)";
    case "grade":
      return "var(--brand-primary)";
    case "reminder":
      return "var(--warning)";
    case "info":
    default:
      return "var(--chart-3)";
  }
}

export function NotificationsList({
  items,
  onNotificationClick,
  onViewAllClick,
}: NotificationsListProps) {
  const { t, i18n } = useTranslation();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center px-5">
        <div className="w-10 h-10 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
          <Bell className="w-5 h-5 text-[--text-tertiary]" />
        </div>
        <p className="text-[13px] text-[--text-secondary]">
          {t("widget.notificationsList.noNewNotifications")}
        </p>
      </div>
    );
  }

  const displayItems = items.slice(0, 3);

  return (
    <>
      <div className="divide-y divide-[--surface-border]">
        {displayItems.map((notification) => {
          const Icon = getNotificationIcon(notification.type);
          const accent = getNotificationAccent(notification.type);

          return (
            <button
              key={notification.id}
              onClick={() => onNotificationClick(notification.id)}
              className="w-full text-left px-5 py-3.5 hover:bg-surface-hover active:bg-accent transition-colors duration-150 group"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: accent + "15" }}
                >
                  <Icon className="w-4 h-4" style={{ color: accent }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-[13px] leading-[1.4] tracking-[-0.2px] ${
                      notification.isRead
                        ? "text-[--text-secondary]"
                        : "text-[--text-primary] font-semibold"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <p className="text-[11px] text-[--text-tertiary] mt-0.5">
                    {formatRelativeTime(notification.time, i18n.language)}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 mt-1">
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-[--brand-primary] rounded-full" />
                  )}
                  <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {items.length > 3 && (
        <button
          onClick={onViewAllClick}
          className="w-full text-center text-[13px] font-medium text-[--brand-primary] hover:text-[--brand-primary-hover] py-3 border-t border-[--surface-border] transition-colors"
        >
          {t("widget.notificationsList.allNotifications")} ({items.length})
        </button>
      )}
    </>
  );
}
