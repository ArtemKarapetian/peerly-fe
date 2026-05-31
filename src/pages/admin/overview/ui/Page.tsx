import { Users, ArrowRight, ScrollText, Settings } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface QuickLink {
  titleKey: string;
  descriptionKey: string;
  icon: typeof Users;
  href: string;
  color: string;
  iconColor: string;
  disabled?: boolean;
}

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickLinks: QuickLink[] = [
    {
      titleKey: "admin.overviewPage.qlUsers",
      descriptionKey: "admin.overviewPage.qlUsersDesc",
      icon: Users,
      href: "/admin/users",
      color: "bg-info-light",
      iconColor: "text-brand-primary",
    },
    {
      titleKey: "admin.overviewPage.qlLogs",
      descriptionKey: "admin.overviewPage.qlLogsDesc",
      icon: ScrollText,
      href: "/admin/logs",
      color: "bg-warning-light",
      iconColor: "text-warning",
      disabled: true,
    },
    {
      titleKey: "admin.overviewPage.qlSettings",
      descriptionKey: "admin.overviewPage.qlSettingsDesc",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-muted",
      iconColor: "text-muted-foreground",
      disabled: true,
    },
  ];

  const handleNavigate = useCallback(
    (href: string) => {
      void navigate(href);
    },
    [navigate],
  );

  return (
    <AppShell title={t("admin.overview.title")}>
      <Breadcrumbs items={[{ label: t("admin.overview.title") }]} />

      <div className="mt-6">
        <div className="mb-6">
          <h1 className="text-page-h1 font-medium text-foreground tracking-[-0.5px] mb-2">
            {t("admin.overview.title")}
          </h1>
          <p className="text-base text-muted-foreground">{t("admin.overview.subtitle")}</p>
        </div>

        <div>
          <h2 className="text-xl font-medium text-foreground mb-4">
            {t("admin.overviewPage.quickLinks")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              const interactive = !link.disabled;
              return (
                <button
                  key={link.href}
                  onClick={() => interactive && handleNavigate(link.href)}
                  disabled={!interactive}
                  className={`bg-card border-2 border-border rounded-lg p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all group ${
                    interactive
                      ? "hover:border-brand-primary hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-12 h-12 ${link.color} rounded-md flex items-center justify-center mb-4 ${
                      interactive ? "group-hover:scale-110 transition-transform" : ""
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${link.iconColor}`} />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">{t(link.titleKey)}</h3>
                  <p className="text-13 text-muted-foreground mb-3">{t(link.descriptionKey)}</p>
                  <div
                    className={`flex items-center gap-1 text-13 font-medium ${
                      interactive ? "text-brand-primary" : "text-muted-foreground"
                    }`}
                  >
                    {interactive
                      ? t("admin.overviewPage.goTo")
                      : t("admin.overviewPage.comingSoon")}
                    {interactive && (
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
