import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

type ThemeMode = "light" | "dark" | "system";

export function AppearanceCard() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const themes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
    { value: "light", label: t("widget.appearance.light"), icon: Sun },
    { value: "dark", label: t("widget.appearance.dark"), icon: Moon },
    { value: "system", label: t("widget.appearance.system"), icon: Monitor },
  ];

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
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium transition-all ${
              theme === value
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
