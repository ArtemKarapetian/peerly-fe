import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HelpSearchProps {
  value: string;
  onChange: (q: string) => void;
}

export function HelpSearch({ value, onChange }: HelpSearchProps) {
  const { t } = useTranslation();
  return (
    <div className="max-w-[600px] mx-auto mb-12">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        <input
          type="text"
          placeholder={t("page.help.searchPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>
    </div>
  );
}
