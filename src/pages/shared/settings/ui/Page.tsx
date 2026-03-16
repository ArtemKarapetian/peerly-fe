import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { AppearanceCard, LanguageCard, TimezoneCard, AboutCard } from "@/widgets/settings-cards";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("page.settings.title")}>
      <Breadcrumbs items={[{ label: t("page.settings.title") }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("page.settings.title")}
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">{t("page.settings.subtitle")}</p>

        <AppearanceCard />
        <LanguageCard />
        <TimezoneCard />
        <AboutCard />
      </div>
    </AppShell>
  );
}
