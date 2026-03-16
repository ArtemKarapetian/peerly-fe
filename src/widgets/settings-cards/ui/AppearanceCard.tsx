import { Monitor, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ThemeMode = "light" | "dark" | "system";

export function AppearanceCard() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<ThemeMode>("light");

  return (
    <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-[8px] flex items-center justify-center">
          <Monitor className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-[20px] font-medium text-foreground">{t("widget.appearance.title")}</h2>
      </div>

      <p className="text-[14px] text-muted-foreground mb-4">{t("widget.appearance.subtitle")}</p>

      <div className="inline-flex bg-muted rounded-[12px] p-1">
        <button
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
            theme === "light"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sun className="w-4 h-4" />
          {t("widget.appearance.light")}
        </button>
        <button
          onClick={() => setTheme("dark")}
          disabled
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all opacity-40 cursor-not-allowed ${
            theme === "dark" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
          title={t("widget.appearance.darkTooltip")}
        >
          <Moon className="w-4 h-4" />
          {t("widget.appearance.dark")}
        </button>
        <button
          onClick={() => setTheme("system")}
          disabled
          className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all opacity-40 cursor-not-allowed ${
            theme === "system" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
          title={t("widget.appearance.systemTooltip")}
        >
          <Monitor className="w-4 h-4" />
          {t("widget.appearance.system")}
        </button>
      </div>

      <p className="text-[13px] text-muted-foreground mt-3 italic">{t("widget.appearance.note")}</p>
    </div>
  );
}
