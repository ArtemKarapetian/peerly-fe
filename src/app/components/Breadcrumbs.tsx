/**
 * Breadcrumbs - Навигационные хлебные крошки
 */

import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  items: string[];
  onItemClick?: (index: number) => void;
}

export function Breadcrumbs({ items, onItemClick }: BreadcrumbsProps) {
  // Скрываем breadcrumbs если только один элемент
  if (items.length <= 1) {
    return null;
  }

  const handleClick = (index: number) => {
    if (onItemClick) {
      onItemClick(index);
    } else {
      // Навигация на дашборд при клике на первый элемент
      const itemLower = items[index].toLowerCase();
      
      if (index === 0) {
        if (itemLower === 'студент' || itemLower === 'student') {
          window.location.hash = '#/';
        } else if (itemLower === 'преподаватель' || itemLower === 'teacher' || itemLower === 'дашборд преподавателя' || itemLower === 'teacher dashboard') {
          window.location.hash = '#/teacher/dashboard';
        } else if (itemLower === 'администратор' || itemLower === 'admin') {
          window.location.hash = '#/admin/overview';
        }
      } else if (index === 1) {
        // Поддержка клика на второй элемент "Дашборд преп��давателя" в трехуровневых breadcrumbs
        if (itemLower === 'дашборд преподавателя' || itemLower === 'teacher dashboard') {
          window.location.hash = '#/teacher/dashboard';
        }
      }
    }
  };

  return (
    <nav className="flex items-center gap-2 text-sm mb-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-[--text-tertiary]" />
          )}
          {index === items.length - 1 ? (
            <span className="text-[--text-primary] font-medium">
              {item}
            </span>
          ) : (
            <button
              onClick={() => handleClick(index)}
              className="text-[--text-secondary] hover:text-[--brand-primary] transition-colors"
            >
              {item}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}