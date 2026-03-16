import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "./button.tsx";
import { cn } from "./utils.ts";

interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: SimplePaginationProps) {
  const { t } = useTranslation();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="gap-1"
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
      >
        {t("shared.pagination.next")}
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

// Hook for pagination logic
export function usePagination<T>(items: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  React.useEffect(() => {
    // Reset to page 1 if items change
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [items.length, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    setCurrentPage,
    handlePageChange,
  };
}
