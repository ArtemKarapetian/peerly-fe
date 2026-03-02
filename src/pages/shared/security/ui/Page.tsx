import { CRUMBS } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import {
  ChangePasswordCard,
  TwoFactorCard,
  ActiveSessionsCard,
  SecurityDangerZoneCard,
} from "@/widgets/security-cards";

export default function SecurityPage() {
  return (
    <AppShell title="Безопасность">
      <Breadcrumbs items={[CRUMBS.settings, { label: "Безопасность" }]} />

      <div className="mt-6 max-w-[800px]">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          Безопасность
        </h1>
        <p className="text-[16px] text-muted-foreground mb-8">
          Управление паролем и параметрами безопасности
        </p>

        <ChangePasswordCard />
        <TwoFactorCard />
        <ActiveSessionsCard />
        <SecurityDangerZoneCard />
      </div>
    </AppShell>
  );
}
