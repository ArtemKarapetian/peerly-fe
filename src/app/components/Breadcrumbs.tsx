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

import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) {
    return null;
  }

  const handleClick = (href: string) => {
    // Поддержка hash-роутинга
    window.location.hash = href.startsWith('#') ? href : `#${href}`;
  };

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-[--text-tertiary]" />
          )}
          {item.href ? (
            <button
              onClick={() => handleClick(item.href!)}
              className="text-[--text-secondary] hover:text-[--brand-primary] transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-[--text-primary] font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}