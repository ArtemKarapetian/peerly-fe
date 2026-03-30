import { useTranslation } from "react-i18next";

import { TaskStatus } from "./StatusCard";

/**
 * TaskListItem - Строка задания в списке
 */

interface TaskListItemProps {
  title: string;
  deadline: string;
  status: TaskStatus;
  onClick?: () => void;
}

export function TaskListItem({ title, deadline, status, onClick }: TaskListItemProps) {
  const { t } = useTranslation();

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
        w-full flex items-center gap-4 px-5 py-4
        text-left
        transition-all
        hover:bg-card hover:shadow-sm hover:rounded-[12px]
        group
      "
    >
      {/* Left: Title and Deadline */}
      <div className="flex-1 min-w-[100px] space-y-1">
        <p className="text-[18px] leading-[1.05] tracking-[-0.81px] text-text-primary">{title}</p>
        <p className="text-[16px] leading-[1.1] tracking-[-0.72px] text-text-secondary">
          {deadline}
        </p>
      </div>

      {/* Right: Status Pill */}
      <div className="flex items-center gap-2 shrink-0">
        <div className={`${statusInfo.color} ${statusInfo.textColor} px-2 py-2 rounded-[12px]`}>
          <span className="text-[16px] leading-[1.1] tracking-[-0.72px]">{statusInfo.label}</span>
        </div>
      </div>
    </button>
  );
}
