import { useState, useCallback } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import {
  Users,
  BookOpen,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Database,
  FileText,
} from "lucide-react";
import { pluginRepo } from "@/entities/plugin";

/**
 * AdminOverviewPage - Главная страница админ панели
 *
 * Функции:
 * - Переключатель организации/тенанта
 * - Карточки статистики: пользователи, курсы, очереди, плагины
 * - Быстрые ссылки на разделы: Users, Plugins, Logs, Health
 */

interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: "free" | "pro" | "enterprise";
  userCount: number;
  courseCount: number;
  isActive: boolean;
}

interface PluginHealth {
  id: string;
  name: string;
  status: "healthy" | "warning" | "error";
  lastCheck: Date;
}

interface QueueStats {
  total: number;
  running: number;
  pending: number;
  failed: number;
}

export default function AdminOverviewPage() {
  // Demo organizations
  const demoOrgs: Organization[] = [
    {
      id: "org1",
      name: "HSE",
      slug: "hse",
      plan: "enterprise",
      userCount: 1247,
      courseCount: 89,
      isActive: true,
    },
    {
      id: "org2",
      name: "MGUSiT",
      slug: "mgusit",
      plan: "pro",
      userCount: 523,
      courseCount: 34,
      isActive: true,
    },
    {
      id: "org3",
      name: "Demo University",
      slug: "demo",
      plan: "free",
      userCount: 156,
      courseCount: 12,
      isActive: true,
    },
  ];

  const [selectedOrg, setSelectedOrg] = useState<string>(demoOrgs[0].id);

  const currentOrg = demoOrgs.find((o) => o.id === selectedOrg) || demoOrgs[0];

  // Get data from store
  const allPlugins = pluginRepo.getAll();

  // Filter by selected org (in real app)
  const orgUsers = currentOrg.userCount;
  const activeCourses = currentOrg.courseCount;

  // Demo queue stats
  const queueStats: QueueStats = {
    total: 247,
    running: 12,
    pending: 235,
    failed: 0,
  };

  // Demo plugin health - use deterministic values with fixed dates
  const pluginHealth: PluginHealth[] = allPlugins.map((plugin, index) => ({
    id: plugin.id,
    name: plugin.name,
    status: plugin.enabled ? (index % 10 === 0 ? "warning" : "healthy") : "error",
    lastCheck: new Date("2024-02-14T10:00:00"),
  }));

  const healthyPlugins = pluginHealth.filter((p) => p.status === "healthy").length;
  const warningPlugins = pluginHealth.filter((p) => p.status === "warning").length;
  const errorPlugins = pluginHealth.filter((p) => p.status === "error").length;

  // Quick links
  const quickLinks = [
    {
      title: "Пользователи",
      description: "Управление пользователями и ролями",
      icon: Users,
      href: "/admin/users",
      color: "bg-[#e9f5ff]",
      iconColor: "text-[#5b8def]",
    },
    {
      title: "Плагины",
      description: "Настройка и мониторинг плагинов",
      icon: Zap,
      href: "/admin/plugins",
      color: "bg-[#fff4e5]",
      iconColor: "text-[#ff9800]",
    },
    {
      title: "Логи",
      description: "Журнал действий и аудит",
      icon: FileText,
      href: "/admin/logs",
      color: "bg-[#f3e5f5]",
      iconColor: "text-[#8e24aa]",
    },
    {
      title: "Здоровье системы",
      description: "Мониторинг и диагностика",
      icon: Activity,
      href: "/admin/health",
      color: "bg-[#e8f5e9]",
      iconColor: "text-[#4caf50]",
    },
  ];

  const handleNavigate = useCallback((href: string) => {
    window.location.hash = `#${href}`;
  }, []);

  return (
    <AppShell title="Админ панель">
      <Breadcrumbs
        items={[{ label: "Администратор", href: ROUTES.adminOverview }, { label: "Обзор" }]}
      />

      <div className="mt-6">
        {/* Header with Org Selector */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
                Административная панель
              </h1>
              <p className="text-[16px] text-[#767692]">Мониторинг и управление системой Peerly</p>
            </div>

            {/* Organization Selector */}
            <div className="min-w-[280px]">
              <label className="block text-[13px] font-medium text-[#767692] mb-2 uppercase tracking-wide">
                Организация
              </label>
              <select
                value={selectedOrg}
                onChange={(e) => setSelectedOrg(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#e6e8ee] rounded-[12px] text-[15px] text-[#21214f] focus:border-[#5b8def] focus:outline-none transition-colors bg-white"
              >
                {demoOrgs.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name} ({org.plan})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Org Info */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center">
                <Database className="w-6 h-6 text-[#5b8def]" />
              </div>
              <div>
                <h3 className="text-[16px] font-medium text-[#21214f]">{currentOrg.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[13px] text-[#767692]">
                    Slug: <span className="text-[#21214f] font-mono">{currentOrg.slug}</span>
                  </span>
                  <span className="inline-flex px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium uppercase">
                    {currentOrg.plan}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#4caf50]" />
              <span className="text-[13px] text-[#4caf50] font-medium">Активна</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Users */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
            <div className="w-12 h-12 bg-[#e9f5ff] rounded-[12px] flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[#5b8def]" />
            </div>
            <p className="text-[13px] text-[#767692] uppercase tracking-wide mb-1">
              Всего пользователей
            </p>
            <p className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
              {orgUsers.toLocaleString()}
            </p>
            <p className="text-[12px] text-[#4caf50] mt-2 flex items-center gap-1">
              <span>↗</span> +12% за месяц
            </p>
          </div>

          {/* Active Courses */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
            <div className="w-12 h-12 bg-[#e8f5e9] rounded-[12px] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#4caf50]" />
            </div>
            <p className="text-[13px] text-[#767692] uppercase tracking-wide mb-1">
              Активных курсов
            </p>
            <p className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
              {activeCourses}
            </p>
            <p className="text-[12px] text-[#767692] mt-2">
              {Math.floor(activeCourses * 0.15)} архивных
            </p>
          </div>

          {/* Running Queues/Jobs */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
            <div className="w-12 h-12 bg-[#fff4e5] rounded-[12px] flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-[#ff9800]" />
            </div>
            <p className="text-[13px] text-[#767692] uppercase tracking-wide mb-1">
              Задач в очереди
            </p>
            <p className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
              {queueStats.running}
            </p>
            <p className="text-[12px] text-[#767692] mt-2">{queueStats.pending} в ожидании</p>
          </div>

          {/* Plugin Health */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
            <div className="w-12 h-12 bg-[#e8f5e9] rounded-[12px] flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-[#4caf50]" />
            </div>
            <p className="text-[13px] text-[#767692] uppercase tracking-wide mb-1">
              Статус плагинов
            </p>
            <p className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px]">
              {healthyPlugins}/{pluginHealth.length}
            </p>
            <div className="flex items-center gap-2 mt-2 text-[12px]">
              {warningPlugins > 0 && <span className="text-[#ff9800]">{warningPlugins} ⚠️</span>}
              {errorPlugins > 0 && <span className="text-[#d4183d]">{errorPlugins} ❌</span>}
              {warningPlugins === 0 && errorPlugins === 0 && (
                <span className="text-[#4caf50]">Все работают</span>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Stats Row */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Queue Details */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-[#ff9800]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Очереди задач</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#ff9800] rounded-full"></div>
                  <span className="text-[14px] text-[#21214f]">Выполняется</span>
                </div>
                <span className="text-[16px] font-medium text-[#ff9800]">{queueStats.running}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#5b8def] rounded-full"></div>
                  <span className="text-[14px] text-[#21214f]">В ожидании</span>
                </div>
                <span className="text-[16px] font-medium text-[#5b8def]">{queueStats.pending}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#d4183d] rounded-full"></div>
                  <span className="text-[14px] text-[#21214f]">Ошибки</span>
                </div>
                <span className="text-[16px] font-medium text-[#d4183d]">{queueStats.failed}</span>
              </div>
            </div>
          </div>

          {/* Plugin Health Details */}
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-[#5b8def]" />
              <h2 className="text-[18px] font-medium text-[#21214f]">Здоровье плагинов</h2>
            </div>
            <div className="space-y-3">
              {pluginHealth.slice(0, 3).map((plugin) => (
                <div
                  key={plugin.id}
                  className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]"
                >
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#21214f]">{plugin.name}</p>
                    <p className="text-[12px] text-[#767692]">
                      Проверено: {plugin.lastCheck.toLocaleTimeString("ru-RU")}
                    </p>
                  </div>
                  <div>
                    {plugin.status === "healthy" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
                        <CheckCircle className="w-3 h-3" />
                        OK
                      </span>
                    )}
                    {plugin.status === "warning" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        Внимание
                      </span>
                    )}
                    {plugin.status === "error" && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
                        <XCircle className="w-3 h-3" />
                        Ошибка
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Быстрые переходы</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavigate(link.href)}
                  className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
                >
                  <div
                    className={`w-12 h-12 ${link.color} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className={`w-6 h-6 ${link.iconColor}`} />
                  </div>
                  <h3 className="text-[16px] font-medium text-[#21214f] mb-2">{link.title}</h3>
                  <p className="text-[13px] text-[#767692] mb-3">{link.description}</p>
                  <div className="flex items-center gap-1 text-[13px] text-[#5b8def] font-medium">
                    Перейти
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#767692]" />
            <h2 className="text-[18px] font-medium text-[#21214f]">Последние события</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 hover:bg-[#fafbfc] rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-[#e8f5e9] rounded-[8px] flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-[#4caf50]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#21214f]">
                  Новая организация создана: "{currentOrg.name}"
                </p>
                <p className="text-[12px] text-[#767692] mt-1">2 часа назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-[#fafbfc] rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-[#fff4e5] rounded-[8px] flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-[#ff9800]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#21214f]">
                  Плагин обновлён: "Plagiarism Checker v2.1"
                </p>
                <p className="text-[12px] text-[#767692] mt-1">5 часов назад</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 hover:bg-[#fafbfc] rounded-[8px] transition-colors">
              <div className="w-8 h-8 bg-[#e9f5ff] rounded-[8px] flex items-center justify-center flex-shrink-0">
                <Database className="w-4 h-4 text-[#5b8def]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] text-[#21214f]">
                  Резервное копирование завершено успешно
                </p>
                <p className="text-[12px] text-[#767692] mt-1">1 день назад</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
