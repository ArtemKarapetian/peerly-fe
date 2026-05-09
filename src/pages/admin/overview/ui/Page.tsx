import { Users, BookOpen, ArrowRight, FileText, Database, CheckCircle } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // TODO BE: admin-endpoints для глобальных счётчиков.
  const orgUsers = 0;
  const activeCourses = 0;

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-[16px] p-6">
            <div className="w-12 h-12 bg-info-light rounded-[12px] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-brand-primary" />
            </div>
            <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.overviewPage.totalUsers")}
            </p>
            <p className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
              {orgUsers.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-[16px] p-6">
            <div className="w-12 h-12 bg-success-light rounded-[12px] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.overviewPage.activeCourses")}
            </p>
            <p className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
              {activeCourses}
            </p>
          </div>
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

        {/* TODO BE: audit-log endpoint. */}
        <div className="mt-6 bg-card border-2 border-border rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-[18px] font-medium text-foreground">
              {t("admin.overviewPage.recentEvents")}
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 hover:bg-surface-hover rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-success-light rounded-[8px] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-muted-foreground italic">
                  {t("admin.overviewPage.noEvents")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-surface-hover rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-info-light rounded-[8px] flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-muted-foreground italic">
                  {t("admin.overviewPage.noEvents")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
