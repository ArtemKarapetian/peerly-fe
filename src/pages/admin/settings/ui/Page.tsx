import { Shield, Database, AlertTriangle, ArrowRight, CheckCircle } from "lucide-react";
import { useCallback } from "react";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

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
  const settingsSections = [
    {
      id: "flags",
      title: "Фиче-флаги",
      description: "Управление экспериментальными функциями платформы",
      icon: Shield,
      href: "/admin/flags",
      bgColor: "bg-[#e9f5ff]",
      iconColor: "text-[#5b8def]",
    },
    {
      id: "limits",
      title: "Лимиты и квоты",
      description: "Ограничения на курсы, файлы и пользователей",
      icon: AlertTriangle,
      href: "/admin/limits",
      bgColor: "bg-[#fff4e5]",
      iconColor: "text-[#ff9800]",
    },
    {
      id: "retention",
      title: "Хранение данных",
      description: "Политики retention и удаления данных",
      icon: Database,
      href: "/admin/retention",
      bgColor: "bg-[#f3e5f5]",
      iconColor: "text-[#8e24aa]",
    },
  ];

  const handleNavigate = useCallback((href: string) => {
    window.location.hash = `#${href}`;
  }, []);

  return (
    <AppShell title="Настройки">
      <Breadcrumbs items={[{ label: "Настройки" }]} />

      <div className="mt-6">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-6">Настройки</h1>

        {/* Settings Sections */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {settingsSections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => handleNavigate(section.href)}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
              >
                <div
                  className={`w-12 h-12 ${section.bgColor} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${section.iconColor}`} />
                </div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-1">{section.title}</h3>
                <p className="text-[13px] text-[#767692] mb-3">{section.description}</p>
                <div className="flex items-center gap-1 text-[13px] text-[#5b8def] font-medium">
                  Настроить
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>

        {/* System Status */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[#4caf50]" />
            <h2 className="text-[18px] font-medium text-[#21214f]">Статус системы</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4caf50] rounded-full"></div>
                <span className="text-[14px] text-[#21214f]">Фиче-флаги синхронизированы</span>
              </div>
              <span className="text-[12px] text-[#4caf50] font-medium">OK</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4caf50] rounded-full"></div>
                <span className="text-[14px] text-[#21214f]">Лимиты соблюдаются</span>
              </div>
              <span className="text-[12px] text-[#4caf50] font-medium">OK</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4caf50] rounded-full"></div>
                <span className="text-[14px] text-[#21214f]">Retention выполняется</span>
              </div>
              <span className="text-[12px] text-[#4caf50] font-medium">OK</span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
