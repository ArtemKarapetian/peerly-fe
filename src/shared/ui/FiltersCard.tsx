import { Filter, X } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "./card.tsx";
import { cn } from "./utils.ts";

interface FiltersCardProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  title?: ReactNode;
  resultsLabel?: ReactNode;
  onReset?: () => void;
  showReset?: boolean;
  className?: string;
}

const GRID_COLS: Record<NonNullable<FiltersCardProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
};

export function FiltersCard({
  children,
  columns = 3,
  title,
  resultsLabel,
  onReset,
  showReset = false,
  className,
}: FiltersCardProps) {
  const { t } = useTranslation();
  return (
    <Card className={cn("mb-6", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-base font-medium text-foreground">{title ?? t("common.filters")}</h2>
      </div>

      <div className={cn("grid gap-4", GRID_COLS[columns])}>{children}</div>

      {(resultsLabel || (showReset && onReset)) && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{resultsLabel}</div>
          {showReset && onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 text-brand-primary hover:bg-info-light rounded-sm text-sm"
            >
              <X className="w-4 h-4" />
              {t("teacher.submissions.resetFilters")}
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
