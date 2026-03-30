/**
 * Breadcrumbs - Навигационные хлебные крошки
 *
 * Использование:
 * <Breadcrumbs items={[
 *   { label: 'Курсы', href: ROUTES.courses },
 *   { label: 'Математика', href: ROUTES.course('math-1') },
 *   { label: 'Задание 1' }  // без href = текущая страница
 * ]} />
 */

import { ChevronRight } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const navigate = useNavigate();
  // Hooks must be called before any early returns
  const handleClick = useCallback(
    (href: string) => {
      void navigate(href.startsWith("#") ? href.slice(1) : href);
    },
    [navigate],
  );

  if (items.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[--text-tertiary] shrink-0" />}
          {item.href ? (
            <button
              onClick={() => handleClick(item.href!)}
              className="text-[14px] text-[--text-secondary] hover:text-[--brand-primary] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[14px] text-[--text-primary]">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
