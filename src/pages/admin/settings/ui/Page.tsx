import { Shield, Database, AlertTriangle, ArrowRight } from "lucide-react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminSettingsPage - Центр настроек системы
 *
 * Содержит ссылки на разделы:
 * - Фиче-флаги
 * - Лимиты и квоты
 * - Retention (хранение данных)
 */

export default function AdminSettingsPage() {
  const { t } = useTranslation();
  const settingsSections = [
    {
      id: "flags",
      title: t("admin.settingsCard.featureFlags"),
      description: t("admin.settingsCard.featureFlagsDesc"),
      icon: Shield,
      href: "/admin/flags",
      bgColor: "bg-[#e9f5ff]",
      iconColor: "text-[#5b8def]",
      statusLabel: t("admin.settingsCard.synchronized"),
      statusOk: true,
    },
    {
      id: "limits",
      title: t("admin.settingsCard.limitsAndQuotas"),
      description: t("admin.settingsCard.limitsDesc"),
      icon: AlertTriangle,
      href: "/admin/limits",
      bgColor: "bg-[#fff4e5]",
      iconColor: "text-[#ff9800]",
      statusLabel: t("admin.settingsCard.compliant"),
      statusOk: true,
    },
    {
      id: "retention",
      title: t("admin.settingsCard.dataRetention"),
      description: t("admin.settingsCard.retentionDesc"),
      icon: Database,
      href: "/admin/retention",
      bgColor: "bg-[#f3e5f5]",
      iconColor: "text-[#8e24aa]",
      statusLabel: t("admin.settingsCard.running"),
      statusOk: true,
    },
  ];

  const handleNavigate = useCallback((href: string) => {
    window.location.hash = `#${href}`;
  }, []);

  return (
    <AppShell title={t("admin.settings.title")}>
      <Breadcrumbs items={[{ label: t("admin.settings.title") }]} />

      <PageHeader title={t("admin.settings.title")} />

      <div>
        <div className="grid md:grid-cols-3 gap-4">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.href)}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 ${section.bgColor} rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${section.iconColor}`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`w-2 h-2 rounded-full ${section.statusOk ? "bg-[#4caf50]" : "bg-[#ff9800]"}`}
                    ></div>
                    <span
                      className={`text-[11px] font-medium ${section.statusOk ? "text-[#4caf50]" : "text-[#ff9800]"}`}
                    >
                      {section.statusLabel}
                    </span>
                  </div>
                </div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-1">{section.title}</h3>
                <p className="text-[13px] text-[#767692] mb-3">{section.description}</p>
                <div className="flex items-center gap-1 text-[13px] text-[#5b8def] font-medium">
                  {t("common.configure")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
