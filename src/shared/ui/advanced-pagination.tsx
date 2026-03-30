import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/button.tsx";

import { cn } from "./utils.ts";

interface AdvancedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
}

export function AdvancedPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageNumbers = true,
  maxPageButtons = 7,
}: AdvancedPaginationProps) {
  const { t } = useTranslation();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return null;
  }

  // Генерируем массив видимых номеров страниц
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= maxPageButtons) {
      // Показываем все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Всегда показываем первую страницу
      pages.push(1);

      const leftSiblingIndex = Math.max(currentPage - 1, 2);
      const rightSiblingIndex = Math.min(currentPage + 1, totalPages - 1);

      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        // Показываем страницы в начале
        for (let i = 2; i < Math.min(maxPageButtons - 1, totalPages); i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        // Показываем страницы в конце
        pages.push("ellipsis");
        for (let i = Math.max(totalPages - maxPageButtons + 3, 2); i < totalPages; i++) {
          pages.push(i);
        }
      } else if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        // Показываем страницы в середине
        pages.push("ellipsis");
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
      } else {
        // Показываем все страницы (кроме первой и последней)
        for (let i = 2; i < totalPages; i++) {
          pages.push(i);
        }
      }

      // Всегда показываем последнюю страницу
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        className="gap-1 px-3"
      >
        <ChevronLeft className="size-4" />
        <span className="hidden sm:inline">{t("shared.pagination.back")}</span>
      </Button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis") {
              return (
                <div
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-8 items-center justify-center text-muted-foreground"
                >
                  <MoreHorizontal className="size-4" />
                </div>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-[8px] text-[14px] font-medium transition-all",
                  currentPage === page
                    ? "bg-brand-primary text-text-inverse shadow-[0_2px_4px_color-mix(in_srgb,var(--brand-primary)_30%,transparent)]"
                    : "text-foreground hover:bg-info-light hover:text-brand-primary",
                )}
                aria-label={t("shared.pagination.page", { page })}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="gap-1 px-3"
      >
        <span className="hidden sm:inline">{t("shared.pagination.forward")}</span>
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
