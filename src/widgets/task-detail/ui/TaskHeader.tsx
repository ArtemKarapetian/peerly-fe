import { Calendar, ClipboardCheck, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatDateTime } from "@/shared/lib/formatDate";

interface TaskHeaderProps {
  title: string;
  courseName: string;
  deadline?: Date;
  reviewDeadline?: Date;
  reviewCount?: number;
  statusLabel: string;
  statusColor: string;
}

export function TaskHeader({
  title,
  courseName,
  deadline,
  reviewDeadline,
  reviewCount,
  statusLabel,
  statusColor,
}: TaskHeaderProps) {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-card border border-border shadow-sm rounded-[20px] p-5 desktop:p-8 mb-6 desktop:mb-8">
      <div className="flex flex-col desktop:flex-row items-start desktop:justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-[28px] desktop:text-[40px] tracking-[-1.2px] text-foreground leading-[1.05] mb-2 break-words">
            {title}
          </h1>
          {courseName ? (
            <p className="text-[14px] desktop:text-[16px] tracking-[-0.3px] text-muted-foreground">
              {courseName}
            </p>
          ) : null}
        </div>
        <div className={`${statusColor} px-4 py-2 rounded-[12px] shrink-0`}>
          <span className="text-[14px] desktop:text-[16px] tracking-[-0.3px] text-foreground whitespace-nowrap">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="flex flex-col desktop:flex-row items-start desktop:items-center gap-3 desktop:gap-6 mt-4 desktop:mt-6">
        {deadline ? (
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-muted-foreground" />
            <span className="text-[14px] desktop:text-[16px] tracking-[-0.3px] text-muted-foreground">
              {t("student.task.deadline")}: {formatDateTime(deadline.toISOString(), i18n.language)}
            </span>
          </div>
        ) : null}
        {reviewDeadline ? (
          <div className="flex items-center gap-2">
            <ClipboardCheck className="size-5 text-muted-foreground" />
            <span className="text-[14px] desktop:text-[16px] tracking-[-0.3px] text-muted-foreground">
              {t("student.task.reviewDeadline")}:{" "}
              {formatDateTime(reviewDeadline.toISOString(), i18n.language)}
            </span>
          </div>
        ) : null}
        {reviewCount && reviewCount > 0 ? (
          <div className="flex items-center gap-2">
            <Users className="size-5 text-muted-foreground" />
            <span className="text-[14px] desktop:text-[16px] tracking-[-0.3px] text-muted-foreground">
              {t("student.task.reviewers")}: {reviewCount}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
