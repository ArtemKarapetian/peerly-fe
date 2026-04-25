import {
  Users,
  BookOpen,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  FileText,
  Database,
} from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { isFlagEnabled } from "@/shared/lib/feature-flags";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { pluginRepo } from "@/entities/plugin";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

interface PluginHealth {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error";
  lastCheck: Date;
}

export default function AdminOverviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pluginsEnabled = isFlagEnabled("enablePlugins");

  const allPlugins = pluginsEnabled ? pluginRepo.getAll() : [];
  const orgUsers = 1247;
  const activeCourses = 89;

  const pluginHealth: PluginHealth[] = allPlugins.map((plugin, index) => ({
    id: plugin.id,
    name: plugin.name,
    status: plugin.enabled ? (index % 10 === 0 ? "warning" : "healthy") : "error",
    lastCheck: new Date("2024-02-14T10:00:00"),
  }));

  const healthyPlugins = pluginHealth.filter((p) => p.status === "healthy").length;
  const warningPlugins = pluginHealth.filter((p) => p.status === "warning").length;
  const errorPlugins = pluginHealth.filter((p) => p.status === "error").length;

  const quickLinks = [
    {
      titleKey: "admin.overviewPage.qlUsers",
      descriptionKey: "admin.overviewPage.qlUsersDesc",
      icon: Users,
      href: "/admin/users",
      color: "bg-info-light",
      iconColor: "text-brand-primary",
    },
    ...(pluginsEnabled
      ? [
          {
            titleKey: "admin.overviewPage.qlPlugins",
            descriptionKey: "admin.overviewPage.qlPluginsDesc",
            icon: Zap,
            href: "/admin/plugins",
            color: "bg-warning-light",
            iconColor: "text-warning",
          },
        ]
      : []),
    {
      titleKey: "admin.overviewPage.qlLogs",
      descriptionKey: "admin.overviewPage.qlLogsDesc",
      icon: FileText,
      href: "/admin/logs",
      color: "bg-accent",
      iconColor: "text-brand-primary",
    },
    {
      titleKey: "admin.overviewPage.qlHealth",
      descriptionKey: "admin.overviewPage.qlHealthDesc",
      icon: Activity,
      href: "/admin/health",
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

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${pluginsEnabled ? "md:grid-cols-3" : ""} gap-4 mb-6`}
        >
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
            <p className="text-[12px] text-success mt-2 flex items-center gap-1">
              <span>↗</span> {t("admin.overviewPage.monthGrowth")}
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
            <p className="text-[12px] text-muted-foreground mt-2">
              {t("admin.overviewPage.archivedCount", {
                count: Math.floor(activeCourses * 0.15),
              })}
            </p>
          </div>

          {pluginsEnabled && (
            <div className="bg-card border-2 border-border rounded-[16px] p-6">
              <div className="w-12 h-12 bg-success-light rounded-[12px] flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-success" />
              </div>
              <p className="text-[13px] text-muted-foreground uppercase tracking-wide mb-1">
                {t("admin.overviewPage.pluginStatus")}
              </p>
              <p className="text-[32px] font-medium text-foreground tracking-[-0.5px]">
                {healthyPlugins}/{pluginHealth.length}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[12px]">
                {warningPlugins > 0 && <span className="text-warning">{warningPlugins} ⚠️</span>}
                {errorPlugins > 0 && <span className="text-error">{errorPlugins} ❌</span>}
                {warningPlugins === 0 && errorPlugins === 0 && (
                  <span className="text-success">{t("admin.overviewPage.allRunning")}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {pluginsEnabled && (
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="bg-card border-2 border-border rounded-[20px] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-brand-primary" />
                <h2 className="text-[18px] font-medium text-foreground">
                  {t("admin.overviewPage.pluginHealth")}
                </h2>
              </div>
              <div className="space-y-3">
                {pluginHealth.slice(0, 3).map((plugin) => (
                  <div
                    key={plugin.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-[8px]"
                  >
                    <div className="flex-1">
                      <p className="text-[14px] font-medium text-foreground">{plugin.name}</p>
                      <p className="text-[12px] text-muted-foreground">
                        {t("admin.overviewPage.checked")}{" "}
                        {plugin.lastCheck.toLocaleTimeString("ru-RU")}
                      </p>
                    </div>
                    <div>
                      {plugin.status === "healthy" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-[6px] text-[11px] font-medium">
                          <CheckCircle className="w-3 h-3" />
                          {t("admin.overviewPage.statusOk")}
                        </span>
                      )}
                      {plugin.status === "warning" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-[6px] text-[11px] font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          {t("admin.overviewPage.statusWarning")}
                        </span>
                      )}
                      {plugin.status === "error" && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-error-light text-error rounded-[6px] text-[11px] font-medium">
                          <XCircle className="w-3 h-3" />
                          {t("admin.overviewPage.statusError")}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-[20px] font-medium text-foreground mb-4">
            {t("admin.overviewPage.quickLinks")}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <p className="text-[14px] text-foreground">
                  {t("admin.overviewPage.eventNewUsers", { count: 12 })}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {t("admin.overviewPage.timeAgo2h")}
                </p>
              </div>
            </div>
            {pluginsEnabled && (
              <div className="flex items-start gap-3 p-3 hover:bg-surface-hover rounded-[8px] transition-colors">
                <div className="w-8 h-8 bg-warning-light rounded-[8px] flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] text-foreground">
                    {t("admin.overviewPage.eventPluginUpdated")}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-1">
                    {t("admin.overviewPage.timeAgo5h")}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 hover:bg-surface-hover rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-info-light rounded-[8px] flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-brand-primary" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-foreground">
                  {t("admin.overviewPage.eventBackupComplete")}
                </p>
                <p className="text-[12px] text-muted-foreground mt-1">
                  {t("admin.overviewPage.timeAgo1d")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
