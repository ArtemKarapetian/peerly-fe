import { Clock, BookOpen, FileText, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { formatRelativeTime } from "@/shared/lib/formatDate";

export type RecentItemType = "course" | "task";

export interface RecentItem {
  id: string;
  type: RecentItemType;
  title: string;
  subtitle?: string;
  timestamp: string;
  coverColor?: string;
}

interface RecentActivityProps {
  items: RecentItem[];
  onItemClick: (id: string, type: RecentItemType) => void;
}

export function RecentActivity({ items, onItemClick }: RecentActivityProps) {
  const { t, i18n } = useTranslation();
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center px-5">
        <div className="w-10 h-10 bg-[--surface-hover] rounded-[var(--radius-lg)] flex items-center justify-center mb-3">
          <Clock className="w-5 h-5 text-[--text-tertiary]" />
        </div>
        <p className="text-[14px] font-medium text-[--text-primary] mb-0.5">
          {t("widget.recentActivity.noActivity")}
        </p>
        <p className="text-[13px] text-[--text-secondary]">
          {t("widget.recentActivity.recentItems")}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[--surface-border]">
      {items.map((item) => {
        const Icon = item.type === "course" ? BookOpen : FileText;

        return (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id, item.type)}
            className="w-full text-left px-5 py-3.5 hover:bg-surface-hover transition-colors duration-150 group"
          >
            <div className="flex items-center gap-3">
              {item.type === "course" && item.coverColor ? (
                <div
                  className="w-9 h-9 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
                  style={{ backgroundColor: item.coverColor }}
                >
                  <BookOpen className="w-4 h-4 text-[--text-primary]" />
                </div>
              ) : (
                <div className="w-9 h-9 bg-[--surface-hover] rounded-[var(--radius-sm)] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[--text-secondary]" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold text-[--text-primary] tracking-[-0.2px] truncate leading-snug">
                  {item.title}
                </p>
                <div className="flex items-center gap-1.5 text-[12px] text-[--text-tertiary] mt-0.5">
                  {item.subtitle && (
                    <>
                      <span className="truncate">{item.subtitle}</span>
                      <span>·</span>
                    </>
                  )}
                  <span className="shrink-0">
                    {formatRelativeTime(item.timestamp, i18n.language)}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-[--text-tertiary] opacity-25 group-hover:opacity-60 transition-opacity duration-150 shrink-0" />
            </div>
          </button>
        );
      })}
    </div>
  );
}
