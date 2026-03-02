import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { AppearanceCard, LanguageCard, TimezoneCard, AboutCard } from "@/widgets/settings-cards";

export default function SettingsPage() {
  return (
    <AppShell title="Настройки">
      <Breadcrumbs items={[{ label: "Настройки" }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          Настройки
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">Управление настройками приложения</p>

        <AppearanceCard />
        <LanguageCard />
        <TimezoneCard />
        <AboutCard />
      </div>
    </AppShell>
  );
}
