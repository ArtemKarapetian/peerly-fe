import { Filter, CheckCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { PageHeader } from "@/shared/ui/PageHeader";

export type FilterType = "ALL" | "UNREAD" | "DEADLINES" | "REVIEWS";

interface InboxHeaderProps {
  unreadCount: number;
  selectedFilter: FilterType;
  filterLabels: Record<FilterType, string>;
  onFilterChange: (filter: FilterType) => void;
  onMarkAllAsRead: () => void;
}

export function InboxHeader({
  unreadCount,
  selectedFilter,
  filterLabels,
  onFilterChange,
  onMarkAllAsRead,
}: InboxHeaderProps) {
  const { t } = useTranslation();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const subtitleText =
    unreadCount > 0
      ? t("student.inbox.unreadCount", { count: unreadCount })
      : t("student.inbox.allRead");

  return (
    <>
      <PageHeader title={t("student.inbox.title")} subtitle={subtitleText} />

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-[14px] text-muted-foreground">
          <Filter className="w-4 h-4" />
          <span className="hidden tablet:inline">{t("common.filter")}:</span>
        </div>

        <div className="hidden tablet:flex items-center gap-2">
          {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-brand-primary text-text-inverse"
                  : "bg-card text-foreground hover:bg-surface-hover border-2 border-border"
              }`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>

        <div className="relative tablet:hidden flex-1">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between gap-2 w-full px-4 py-2 bg-card border-2 border-border rounded-[8px] text-[14px] text-foreground"
          >
            <span>{filterLabels[selectedFilter]}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-border rounded-[12px] shadow-lg z-10 overflow-hidden">
              {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    onFilterChange(filter);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-surface-hover transition-colors ${
                    selectedFilter === filter
                      ? "bg-brand-primary-light text-brand-primary font-medium"
                      : "text-foreground"
                  }`}
                >
                  {filterLabels[filter]}
                </button>
              ))}
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <>
            <button
              onClick={onMarkAllAsRead}
              className="hidden tablet:flex items-center gap-2 px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-text-inverse rounded-[8px] text-[14px] font-medium transition-colors ml-auto"
            >
              <CheckCheck className="w-4 h-4" />
              {t("student.inbox.markAllRead")}
            </button>
            <button
              onClick={onMarkAllAsRead}
              className="tablet:hidden flex items-center justify-center w-10 h-10 bg-brand-primary hover:bg-brand-primary-hover text-text-inverse rounded-[8px] transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
