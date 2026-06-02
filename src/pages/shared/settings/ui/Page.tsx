import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell";
import { AppearanceCard, LanguageCard, AboutCard } from "@/widgets/settings-cards";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("page.settings.title")}>
      <Breadcrumbs items={[{ label: t("page.settings.title") }]} />

      <div className="max-w-[800px]">
        <PageHeader title={t("page.settings.title")} subtitle={t("page.settings.subtitle")} />

        <AppearanceCard />
        <LanguageCard />
        <AboutCard />
      </div>
    </AppShell>
  );
}
