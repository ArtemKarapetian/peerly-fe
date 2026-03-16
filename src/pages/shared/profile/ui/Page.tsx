import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { UserInfoCard } from "@/features/profile/edit-profile";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { DangerZoneCard, SupportLinkCard } from "@/widgets/profile-cards";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("page.profile.title")}>
      <Breadcrumbs items={[{ label: t("page.profile.title") }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("page.profile.title")}
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">{t("page.profile.subtitle")}</p>

        <UserInfoCard />
        <DangerZoneCard />
        <SupportLinkCard />
      </div>
    </AppShell>
  );
}
