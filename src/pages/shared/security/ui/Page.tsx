import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Card, EmptyState } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell";

export default function SecurityPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();

  return (
    <AppShell title={t("page.security.title")}>
      <Breadcrumbs items={[CRUMBS.settings, { label: t("page.security.title") }]} />

      <div className="max-w-[800px]">
        <PageHeader title={t("page.security.title")} subtitle={t("page.security.subtitle")} />

        <Card>
          <EmptyState
            icon={Lock}
            title={t("page.security.passwordChangeUnavailableTitle")}
            message={t("page.security.passwordChangeUnavailableMessage")}
          />
        </Card>
      </div>
    </AppShell>
  );
}
