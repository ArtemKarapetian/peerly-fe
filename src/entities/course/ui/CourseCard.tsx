import { AlertCircle, BookOpen, CheckCircle2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

// Карточка курса в списке студента; footer прижат к низу через mt-auto
interface CourseCardProps {
  id: string;
  title: string;
  teacher: string;
  coverColor?: string;
  deadline?: string;
  progress?: number;
  newAssignments?: number;
  status?: "active" | "completed";
  onClick?: () => void;
}

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return name.substring(0, 2).toUpperCase();
}

export function CourseCard({
  title,
  teacher,
  coverColor = "#b0e9fb",
  deadline,
  progress,
  newAssignments,
  status = "active",
  onClick,
}: CourseCardProps) {
  const { t } = useTranslation();
  const isCompleted = status === "completed";

  const formatDeadline = (isoDate: string): { label: string; urgent: boolean } => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: t("entity.course.deadlineExpired"), urgent: true };
    if (diffDays === 0) return { label: t("entity.course.today"), urgent: true };
    if (diffDays === 1) return { label: t("entity.course.tomorrow"), urgent: true };
    if (diffDays <= 3)
      return { label: t("entity.course.inDays", { count: diffDays }), urgent: true };
    if (diffDays <= 7)
      return { label: t("entity.course.inDaysMany", { count: diffDays }), urgent: false };
    return {
      label: date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" }),
      urgent: false,
    };
  };

  const deadlineInfo = !isCompleted && deadline ? formatDeadline(deadline) : null;
  const isUrgent = deadlineInfo?.urgent === true;

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col
        bg-card rounded-[var(--radius-xl)] overflow-hidden w-full text-left
        border transition-all duration-200
        shadow-[var(--shadow-md)]
        hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--brand-primary]/40
        group
        ${isUrgent ? "border-[--error]/40" : "border-[--surface-border]"}
      `}
    >
      <div
        className="relative h-[52px] flex items-end px-3 pb-2 shrink-0"
        style={{ backgroundColor: coverColor }}
      >
        {!isCompleted && newAssignments && newAssignments > 0 ? (
          <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-card/90 backdrop-blur-sm rounded-full text-[11px] font-semibold text-[--brand-primary] shadow-sm">
            <BookOpen className="w-3 h-3" />
            {newAssignments}{" "}
            {newAssignments === 1 ? t("entity.course.newOne") : t("entity.course.newMany")}
          </span>
        ) : null}
      </div>

      <div className="px-4 pt-3 pb-3 flex flex-col flex-1 gap-2">
        <h3 className="text-[14px] leading-[1.35] tracking-[-0.2px] text-[--text-primary] font-semibold line-clamp-2 min-h-[2.7em]">
          {title}
        </h3>

        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold text-[--text-primary]"
            style={{ backgroundColor: coverColor }}
          >
            {getInitials(teacher)}
          </div>
          <p className="text-[12px] text-[--text-secondary] truncate">{teacher}</p>
        </div>

        {typeof progress === "number" && (
          <div className="space-y-1">
            <div className="h-1.5 bg-[--surface-border] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={
                  isCompleted
                    ? { width: "100%", backgroundColor: "var(--success)" }
                    : { width: `${progress}%`, backgroundColor: coverColor }
                }
              />
            </div>
            <p className="text-[11px] text-[--text-tertiary]">
              {isCompleted
                ? `100% ${t("entity.course.percentComplete")}`
                : `${progress}% ${t("entity.course.percentComplete")}`}
            </p>
          </div>
        )}

        <div className="mt-auto">
          {isCompleted ? (
            <div className="flex items-center gap-1.5 pt-1 text-[--success]">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="text-[12px] font-medium">{t("entity.course.completed")}</span>
            </div>
          ) : deadlineInfo ? (
            <div
              className={`flex items-center gap-1.5 pt-1 ${
                deadlineInfo.urgent ? "text-[--error]" : "text-[--text-tertiary]"
              }`}
            >
              {deadlineInfo.urgent ? (
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 shrink-0" />
              )}
              <span className="text-[12px] font-medium">{deadlineInfo.label}</span>
            </div>
          ) : null}
        </div>
      </div>
    </button>
  );
}
