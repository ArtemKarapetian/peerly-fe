import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { UserInfoCard } from "@/features/profile/edit-profile";

import { AppShell } from "@/widgets/app-shell";
import { DangerZoneCard } from "@/widgets/profile-cards";

export default function ProfilePage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("page.profile.title")}>
      <Breadcrumbs items={[{ label: t("page.profile.title") }]} />

      <div className="max-w-[800px]">
        <PageHeader title={t("page.profile.title")} subtitle={t("page.profile.subtitle")} />

        <UserInfoCard />
        <DangerZoneCard />
      </div>
    </AppShell>
  );
}
