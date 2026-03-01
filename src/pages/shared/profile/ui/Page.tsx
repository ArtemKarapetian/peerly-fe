import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { UserInfoCard } from "@/features/profile/edit-profile";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { DangerZoneCard, SupportLinkCard } from "@/widgets/profile-cards";

export default function ProfilePage() {
  return (
    <AppShell title="Профиль">
      <Breadcrumbs items={[{ label: "Профиль" }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">Профиль</h1>
        <p className="text-[16px] text-muted-foreground mb-8">Управление личной информацией</p>

        <UserInfoCard />
        <DangerZoneCard />
        <SupportLinkCard />
      </div>
    </AppShell>
  );
}
