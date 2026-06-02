import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./button.tsx";
import { cn } from "./utils.ts";

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}: SimplePaginationProps) {
  const { t } = useTranslation();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  const hasPageSizePicker = pageSize !== undefined && onPageSizeChange !== undefined;

  if (totalPages <= 1 && !hasPageSizePicker) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-4 flex-wrap", className)}>
      {totalPages > 1 ? (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canGoPrevious}
            className="gap-1"
            aria-label={t("shared.pagination.previous")}
          >
            <ChevronLeft className="size-4" />
            {t("shared.pagination.previous")}
          </Button>

          <div className="flex items-center gap-2 px-3">
            <span className="text-sm text-[var(--text-secondary)]">
              {t("shared.pagination.pageLabel")}{" "}
              <span className="font-medium text-[var(--text-primary)]">{currentPage}</span>{" "}
              {t("shared.pagination.of")}{" "}
              <span className="font-medium text-[var(--text-primary)]">{totalPages}</span>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canGoNext}
            className="gap-1"
            aria-label={t("shared.pagination.next")}
          >
            {t("shared.pagination.next")}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}

      {hasPageSizePicker ? (
        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          {t("shared.pagination.perPage")}
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 border-2 border-border rounded-sm text-sm bg-card"
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      ) : null}
    </div>
  );
}

export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(itemsPerPage);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = items.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    pageSize,
    setCurrentPage,
    setPageSize: handlePageSizeChange,
  };
}
