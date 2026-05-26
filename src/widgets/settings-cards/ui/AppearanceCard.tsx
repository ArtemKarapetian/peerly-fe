import { Monitor, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

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
    <Card className="mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center">
          <Monitor className="w-5 h-5 text-accent-foreground" />
        </div>
        <h2 className="text-xl font-medium text-foreground">{t("widget.appearance.title")}</h2>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{t("widget.appearance.subtitle")}</p>

      <div className="inline-flex bg-muted rounded-md p-1">
        {themes.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-all ${
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
    </Card>
  );
}
