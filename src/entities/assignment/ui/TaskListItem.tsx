import { useTranslation } from "react-i18next";

import { TaskStatus } from "./StatusCard";

/**
 * TaskListItem - Строка задания в списке
 */

interface TaskListItemProps {
  title: string;
  /** ISO date string (e.g. "2026-01-31") or already-formatted string. */
  deadline: string;
  status: TaskStatus;
  onClick?: () => void;
}

function formatDeadline(deadline: string, locale: string): string {
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return deadline;
  return d.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    day: "numeric",
    month: "long",
  });
}

export function TaskListItem({ title, deadline, status, onClick }: TaskListItemProps) {
  const { t, i18n } = useTranslation();
  const formattedDeadline = `${t("entity.assignment.deadline")}: ${formatDeadline(deadline, i18n.language)}`;

  const getStatusInfo = () => {
    switch (status) {
      case "NOT_STARTED":
        return {
          label: t("entity.assignment.statusNotStarted"),
          color: "bg-muted",
          textColor: "text-muted-foreground",
        };
      case "SUBMITTED":
        return {
          label: t("entity.assignment.statusSubmitted"),
          color: "bg-info-light",
          textColor: "text-foreground",
        };
      case "PEER_REVIEW":
        return {
          label: t("entity.assignment.statusPeerReview"),
          color: "bg-info-light",
          textColor: "text-foreground",
        };
      case "TEACHER_REVIEW":
        return {
          label: t("entity.assignment.statusTeacherReview"),
          color: "bg-warning-light",
          textColor: "text-foreground",
        };
      case "GRADING":
        return {
          label: t("entity.assignment.statusGrading"),
          color: "bg-muted",
          textColor: "text-muted-foreground",
        };
      case "GRADED":
        return {
          label: t("entity.assignment.statusGraded"),
          color: "bg-success-light",
          textColor: "text-foreground",
        };
      case "OVERDUE":
        return {
          label: t("entity.assignment.statusOverdue"),
          color: "bg-error-light",
          textColor: "text-foreground",
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <button
      onClick={onClick}
      className="
        relative w-full flex items-center gap-4 px-5 py-4 rounded-[12px]
        text-left border border-transparent
        transition-colors duration-150
        hover:bg-brand-primary-lighter hover:border-brand-primary/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40
        group
      "
    >
      <div className="flex-1 min-w-[100px] space-y-1">
        <p className="text-[16px] font-medium leading-[1.3] tracking-[-0.3px] text-foreground group-hover:text-brand-primary transition-colors">
          {title}
        </p>
        <p className="text-[13px] leading-[1.3] text-muted-foreground">{formattedDeadline}</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`${statusInfo.color} ${statusInfo.textColor} inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap`}
        >
          {statusInfo.label}
        </span>
      </div>
    </button>
  );
}
