import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * TaskSearch - Assignment search field
 */

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TaskSearch({ value, onChange, placeholder }: TaskSearchProps) {
  const { t } = useTranslation();

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t("feature.taskSearch.placeholder")}
        className="
          w-full pl-9 pr-4 py-2.5
          text-[14px] leading-[1.4] text-foreground
          placeholder:text-text-tertiary
          bg-card
          border border-border rounded-[12px]
          outline-none
          transition-colors
          focus:border-ring focus:ring-2 focus:ring-ring/20
        "
      />
    </div>
  );
}
