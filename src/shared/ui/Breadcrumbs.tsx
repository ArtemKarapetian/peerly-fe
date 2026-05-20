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
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 mb-4 min-w-0 max-w-full">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div
            key={index}
            className={`flex items-center gap-2 min-w-0 ${isLast ? "flex-1" : "shrink-0"}`}
          >
            {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-[--text-tertiary] shrink-0" />}
            {item.href ? (
              <button
                onClick={() => handleClick(item.href!)}
                title={item.label}
                className="text-[14px] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-colors cursor-pointer truncate min-w-0"
              >
                {item.label}
              </button>
            ) : (
              <span
                title={item.label}
                className="text-[14px] text-[--text-primary] truncate min-w-0"
              >
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
