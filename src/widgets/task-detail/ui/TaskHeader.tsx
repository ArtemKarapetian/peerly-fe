import { Calendar, Award, FileText, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface TaskHeaderProps {
  title: string;
  courseName: string;
  teacher: string;
  deadline: string;
  points: number;
  type: string;
  status: string;
  statusColor: string;
  extensionInfo?: {
    isExtended: boolean;
    newDeadline?: string;
  };
}

export function TaskHeader({
  title,
  courseName,
  teacher,
  deadline,
  points,
  type,
  status,
  statusColor,
  extensionInfo,
}: TaskHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-card border border-border shadow-sm rounded-[20px] p-5 desktop:p-8 mb-6 desktop:mb-8">
      <div className="flex flex-col desktop:flex-row items-start desktop:items-start desktop:justify-between gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-[28px] desktop:text-[40px] font-['Work_Sans:Regular',sans-serif] tracking-[-1.8px] text-foreground dark:text-foreground leading-[1.05] mb-2">
            {title}
          </h1>
          <p className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground dark:text-muted-foreground">
            {courseName} • {teacher}
          </p>
        </div>
        <div className={`${statusColor} px-4 py-2 rounded-[12px] shrink-0`}>
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-foreground whitespace-nowrap">
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col desktop:flex-row items-start desktop:items-center gap-4 desktop:gap-6 mt-4 desktop:mt-6">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-muted-foreground dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground dark:text-muted-foreground">
            {t("widget.taskHeader.deadline")} {deadline}
            {extensionInfo?.isExtended && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 bg-success-light text-success rounded text-xs font-medium">
                <Clock className="w-3 h-3" />
                {t("widget.taskHeader.extended")}
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="size-5 text-muted-foreground dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground dark:text-muted-foreground">
            {t("widget.taskHeader.points")} {points}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="size-5 text-muted-foreground dark:text-muted-foreground" />
          <span className="text-[14px] desktop:text-[16px] font-['Work_Sans:Regular',sans-serif] tracking-[-0.48px] text-muted-foreground dark:text-muted-foreground">
            {t("widget.taskHeader.type")} {type}
          </span>
        </div>
      </div>
    </div>
  );
}
