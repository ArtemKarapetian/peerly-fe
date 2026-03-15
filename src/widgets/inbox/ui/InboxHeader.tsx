import { Filter, CheckCheck, ChevronDown } from "lucide-react";
import { useState } from "react";

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
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const subtitleText =
    unreadCount > 0
      ? `У вас ${unreadCount} ${unreadCount === 1 ? "непрочитанное уведомление" : "непрочитанных уведомлений"}`
      : "Все уведомления прочитаны";

  return (
    <>
      <PageHeader title="Уведомления" subtitle={subtitleText} />

      {/* Filters + Actions */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2 text-[14px] text-[#767692]">
          <Filter className="w-4 h-4" />
          <span className="hidden tablet:inline">Фильтр:</span>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden tablet:flex items-center gap-2">
          {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-[8px] text-[14px] font-medium transition-colors ${
                selectedFilter === filter
                  ? "bg-[#3d6bc6] text-white"
                  : "bg-white text-[#21214f] hover:bg-[#f9f9f9] border-2 border-[#e6e8ee]"
              }`}
            >
              {filterLabels[filter]}
            </button>
          ))}
        </div>

        {/* Mobile Dropdown */}
        <div className="relative tablet:hidden flex-1">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center justify-between gap-2 w-full px-4 py-2 bg-white border-2 border-[#e6e8ee] rounded-[8px] text-[14px] text-[#21214f]"
          >
            <span>{filterLabels[selectedFilter]}</span>
            <ChevronDown className="w-4 h-4 text-[#767692]" />
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-[#e6e8ee] rounded-[12px] shadow-lg z-10 overflow-hidden">
              {(Object.keys(filterLabels) as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => {
                    onFilterChange(filter);
                    setShowFilterDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-[14px] hover:bg-[#f9f9f9] transition-colors ${
                    selectedFilter === filter
                      ? "bg-[#f0f4ff] text-[#3d6bc6] font-medium"
                      : "text-[#21214f]"
                  }`}
                >
                  {filterLabels[filter]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mark all as read */}
        {unreadCount > 0 && (
          <>
            <button
              onClick={onMarkAllAsRead}
              className="hidden tablet:flex items-center gap-2 px-4 py-2.5 bg-[#3d6bc6] hover:bg-[#2e5bb8] text-white rounded-[8px] text-[14px] font-medium transition-colors ml-auto"
            >
              <CheckCheck className="w-4 h-4" />
              Прочитать все
            </button>
            <button
              onClick={onMarkAllAsRead}
              className="tablet:hidden flex items-center justify-center w-10 h-10 bg-[#3d6bc6] hover:bg-[#2e5bb8] text-white rounded-[8px] transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
