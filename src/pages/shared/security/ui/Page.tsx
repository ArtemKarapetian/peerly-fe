import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  ChangePasswordCard,
  TwoFactorCard,
  ActiveSessionsCard,
  SecurityDangerZoneCard,
} from "@/widgets/security-cards";

export default function SecurityPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();

  return (
    <AppShell title={t("page.security.title")}>
      <Breadcrumbs items={[CRUMBS.settings, { label: t("page.security.title") }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("page.security.title")}
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">{t("page.security.subtitle")}</p>

        <ChangePasswordCard />
        <TwoFactorCard />
        <ActiveSessionsCard />
        <SecurityDangerZoneCard />
      </div>
    </AppShell>
  );
}
