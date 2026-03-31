import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { InboxHeader, NotificationList } from "@/widgets/inbox";

import type { Notification, FilterType } from "../model/mockNotifications";
import {
  mockNotifications as initialNotifications,
  filterLabels,
} from "../model/mockNotifications";

export default function InboxPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("ALL");

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

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );
      void navigate(notification.link.replace("#", ""));
    },
    [navigate],
  );

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <AppShell>
      <InboxHeader
        unreadCount={unreadCount}
        selectedFilter={selectedFilter}
        filterLabels={filterLabels}
        onFilterChange={setSelectedFilter}
        onMarkAllAsRead={handleMarkAllAsRead}
      />

      <NotificationList
        notifications={filteredNotifications}
        selectedFilter={selectedFilter}
        onNotificationClick={handleNotificationClick}
        onResetFilter={() => setSelectedFilter("ALL")}
      />

      {/* Info Card */}
      <div className="mt-6 bg-info-light border border-border rounded-[16px] p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
            <span className="text-primary-foreground text-[14px] font-semibold">i</span>
          </div>
          <div>
            <h4 className="text-[15px] font-medium text-foreground mb-1">
              {t("student.inbox.about")}
            </h4>
            <p className="text-[14px] text-muted-foreground leading-[1.6]">
              {t("student.inbox.aboutDesc")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
