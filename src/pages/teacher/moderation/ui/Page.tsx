import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function TeacherModerationPage() {
  const { t } = useTranslation();

  return (
    <AppShell title={t("teacher.moderation.title")}>
      <Breadcrumbs items={[{ label: t("teacher.moderation.breadcrumb") }]} />

      <PageHeader
        title={t("teacher.moderation.title")}
        subtitle={t("teacher.moderation.subtitle")}
      />

      <div className="bg-card border border-border shadow-sm rounded-[16px] py-16 text-center">
        <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="text-[18px] font-medium text-foreground mb-2">
          {t("teacher.moderation.noFlaggedReviews")}
        </h3>
        <p className="text-[14px] text-muted-foreground">
          {t("teacher.moderation.allReviewsFine")}
        </p>
      </div>
    </AppShell>
  );
}
