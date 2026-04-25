import { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs, BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  breadcrumbs?: BreadcrumbItem[];
}

export function AdminPlaceholderPage({
  title,
  description,
  icon: Icon,
  breadcrumbs = [],
}: AdminPlaceholderPageProps) {
  const { t } = useTranslation();

  return (
    <AppShell title={title}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6">
        <div className="bg-card border-2 border-border rounded-[20px] p-8 text-center max-w-[600px] mx-auto">
          <div className="w-16 h-16 bg-accent rounded-[16px] flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-brand-primary" />
          </div>
          <h1 className="text-[28px] font-medium text-foreground tracking-[-0.5px] mb-3">
            {title}
          </h1>
          <p className="text-[16px] text-muted-foreground leading-[1.6] mb-6">{description}</p>
          <div className="bg-muted border border-border rounded-[12px] p-4">
            <p className="text-[14px] text-muted-foreground">
              <strong>{t("admin.placeholderPage.demoMode")}</strong>{" "}
              {t("admin.placeholderPage.demoText")}
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
