import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HelpSearchProps {
  value: string;
  onChange: (q: string) => void;
}

export function HelpSearch({ value, onChange }: HelpSearchProps) {
  const { t } = useTranslation();
  return (
    <div className="max-w-[640px] mx-auto mb-12 tablet:mb-16">
      <div className="relative">
        <Search
          className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-foreground/40 pointer-events-none"
          aria-hidden
        />
        <input
          type="search"
          placeholder={t("page.help.searchPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-14 pr-5 py-4 text-base bg-card border border-border rounded-xl shadow-sm placeholder:text-muted-foreground transition focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:shadow-md"
        />
      </div>
    </div>
  );
}
