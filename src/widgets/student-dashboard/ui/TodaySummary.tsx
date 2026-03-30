import { Calendar, CheckSquare, MessageSquare } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface TodaySummaryData {
  tasksToday: number;
  reviewsPending: number;
}

interface TodaySummaryProps {
  data: TodaySummaryData;
}

export function TodaySummary({ data }: TodaySummaryProps) {
  const { t } = useTranslation();
  const items = [
    {
      icon: CheckSquare,
      label: t("widget.todaySummary.tasksToday"),
      count: data.tasksToday,
      accent: "var(--brand-primary)",
    },
    {
      icon: MessageSquare,
      label: t("widget.todaySummary.reviewsPending"),
      count: data.reviewsPending,
      accent: "var(--success)",
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <div key={index} className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-[var(--radius-md)] flex items-center justify-center shrink-0"
              style={{ backgroundColor: item.accent + "15" }}
            >
              <Icon className="w-4 h-4" style={{ color: item.accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-[--text-tertiary] mb-0.5">{item.label}</p>
              <p className="text-[20px] font-semibold text-[--text-primary] leading-none">
                {item.count}
              </p>
            </div>
          </div>
        );
      })}

      <div className="pt-3 border-t border-[--surface-border] flex items-center gap-2 text-[12px] text-[--text-tertiary]">
        <Calendar className="w-3.5 h-3.5 shrink-0" />
        <span className="capitalize">
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </span>
      </div>
    </div>
  );
}
