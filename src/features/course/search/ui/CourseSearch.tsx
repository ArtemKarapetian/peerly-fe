import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CourseSearch — поиск курсов.
 * Использует CSS-переменные дизайн-системы вместо хардкода.
 */

interface CourseSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CourseSearch({ value, onChange, placeholder }: CourseSearchProps) {
  const { t } = useTranslation();
  const resolvedPlaceholder = placeholder ?? t("feature.courseSearch.placeholder");
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--text-tertiary]" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={resolvedPlaceholder}
        className="
          w-full pl-9 pr-4 py-2.5
          text-[14px] leading-[1.4] text-[--text-primary]
          placeholder:text-[--text-tertiary]
          bg-white
          border border-[--surface-border] rounded-[var(--radius-md)]
          outline-none
          transition-colors duration-150
          focus:border-[--brand-primary] focus:ring-2 focus:ring-[--brand-primary]/15
        "
      />
    </div>
  );
}
