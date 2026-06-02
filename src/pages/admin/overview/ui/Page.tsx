import { Users, BookOpen, ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { userRepo } from "@/entities/user";

import { AppShell } from "@/widgets/app-shell";

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { data: users } = useAsync(() => userRepo.search("demo"), []);
  const activeCourses = 6;
  const totalStudents = (users ?? []).filter((u) => u.role === "Student").length;

  const quickLinks = [
    {
      titleKey: "admin.overviewPage.qlUsers",
      descriptionKey: "admin.overviewPage.qlUsersDesc",
      icon: Users,
      href: "/admin/users",
      color: "bg-info-light",
      iconColor: "text-brand-primary",
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-card border-2 border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-info-light rounded-md flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-brand-primary" />
            </div>
            <p className="text-13 text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.overviewPage.totalStudents")}
            </p>
            <p className="text-page-h1 font-medium text-foreground tracking-[-0.5px]">
              {totalStudents.toLocaleString()}
            </p>
          </div>

          <div className="bg-card border-2 border-border rounded-lg p-6">
            <div className="w-12 h-12 bg-success-light rounded-md flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-success" />
            </div>
            <p className="text-13 text-muted-foreground uppercase tracking-wide mb-1">
              {t("admin.overviewPage.activeCourses", { count: activeCourses })}
            </p>
            <p className="text-page-h1 font-medium text-foreground tracking-[-0.5px]">
              {activeCourses.toLocaleString()}
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-medium text-foreground mb-4">
            {t("admin.overviewPage.quickLinks")}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className="bg-card border-2 border-border rounded-lg p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-brand-primary hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${link.color} rounded-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${link.iconColor}`} />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">{t(link.titleKey)}</h3>
                  <p className="text-13 text-muted-foreground mb-3">{t(link.descriptionKey)}</p>
                  <div className="flex items-center gap-1 text-13 text-brand-primary font-medium">
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
