import { Users, BookOpen, ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const quickLinks = [
    {
      titleKey: "admin.overviewPage.qlUsers",
      descriptionKey: "admin.overviewPage.qlUsersDesc",
      icon: Users,
      href: "/admin/users",
      color: "bg-info-light",
      iconColor: "text-brand-primary",
    },
    {
      titleKey: "admin.overviewPage.qlCourses",
      descriptionKey: "admin.overviewPage.qlCoursesDesc",
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-success-light",
      iconColor: "text-success",
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
          <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
            {t("admin.overview.title")}
          </h1>
          <p className="text-[16px] text-muted-foreground">{t("admin.overview.subtitle")}</p>
        </div>

        <div>
          <h2 className="text-[20px] font-medium text-foreground mb-4">
            {t("admin.overviewPage.quickLinks")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className="bg-card border-2 border-border rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-brand-primary hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${link.color} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${link.iconColor}`} />
                  </div>
                  <h3 className="text-[16px] font-medium text-foreground mb-2">
                    {t(link.titleKey)}
                  </h3>
                  <p className="text-[13px] text-muted-foreground mb-3">{t(link.descriptionKey)}</p>
                  <div className="flex items-center gap-1 text-[13px] text-brand-primary font-medium">
                    {t("admin.overviewPage.goTo")}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
