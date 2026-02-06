import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { 
  Shield, Lock, Clock, Database, AlertTriangle, 
  FileText, Settings, ArrowRight, CheckCircle
} from 'lucide-react';

/**
 * AdminSettingsPage - Центр настроек системы
 * 
 * Содержит ссылки на все разделы настроек:
 * - Политики безопасности
 * - Лимиты и квоты
 * - Retention (хранение данных)
 * - И другие настройки
 */

export default function AdminSettingsPage() {
  const settingsSections = [
    {
      id: 'policies',
      title: 'Политики безопасности',
      description: 'Настройка паролей, сессий и безопасности',
      icon: Shield,
      href: '/admin/policies',
      bgColor: 'bg-[#e9f5ff]',
      iconColor: 'text-[#5b8def]',
      stats: '8 политик'
    },
    {
      id: 'limits',
      title: 'Лимиты и квоты',
      description: 'Ограничения на курсы, файлы и пользователей',
      icon: AlertTriangle,
      href: '/admin/limits',
      bgColor: 'bg-[#fff4e5]',
      iconColor: 'text-[#ff9800]',
      stats: '12 лимитов'
    },
    {
      id: 'retention',
      title: 'Хранение данных',
      description: 'Политики retention и удаления данных',
      icon: Database,
      href: '/admin/retention',
      bgColor: 'bg-[#f3e5f5]',
      iconColor: 'text-[#8e24aa]',
      stats: '5 правил'
    },
    {
      id: 'integrations',
      title: 'Интеграции',
      description: 'Настройка внешних сервисов и API',
      icon: Settings,
      href: '/admin/integrations',
      bgColor: 'bg-[#e0f7fa]',
      iconColor: 'text-[#06b6d4]',
      stats: '4 интеграции'
    }
  ];

  const quickStats = [
    {
      label: 'Активных политик',
      value: '8',
      icon: Shield,
      bgColor: 'bg-[#e9f5ff]',
      iconColor: 'text-[#5b8def]',
      textColor: 'text-[#5b8def]'
    },
    {
      label: 'Установленных лимитов',
      value: '12',
      icon: AlertTriangle,
      bgColor: 'bg-[#fff4e5]',
      iconColor: 'text-[#ff9800]',
      textColor: 'text-[#ff9800]'
    },
    {
      label: 'Правил retention',
      value: '5',
      icon: Database,
      bgColor: 'bg-[#f3e5f5]',
      iconColor: 'text-[#8e24aa]',
      textColor: 'text-[#8e24aa]'
    },
    {
      label: 'Интеграций',
      value: '4',
      icon: Settings,
      bgColor: 'bg-[#e0f7fa]',
      iconColor: 'text-[#06b6d4]',
      textColor: 'text-[#06b6d4]'
    }
  ];

  const handleNavigate = (href: string) => {
    window.location.hash = `#${href}`;
  };

  return (
    <AppShell title="Настройки системы">
      <Breadcrumbs items={['Admin', 'Настройки системы']} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Настройки системы
          </h1>
          <p className="text-[16px] text-[#767692]">
            Управление политиками, лимитами и конфигурацией Peerly
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-[12px] flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <p className="text-[13px] text-[#767692] uppercase tracking-wide mb-1">
                  {stat.label}
                </p>
                <p className={`text-[32px] font-medium tracking-[-0.5px] ${stat.textColor}`}>
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* Settings Sections */}
        <div>
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Разделы настроек</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {settingsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavigate(section.href)}
                  className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 ${section.bgColor} rounded-[12px] flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${section.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[16px] font-medium text-[#21214f] mb-1">
                        {section.title}
                      </h3>
                      <p className="text-[13px] text-[#767692] mb-3">
                        {section.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#767692]">
                          {section.stats}
                        </span>
                        <div className="flex items-center gap-1 text-[13px] text-[#5b8def] font-medium">
                          Настроить
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Status */}
        <div className="mt-6 bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-[#4caf50]" />
            <h2 className="text-[18px] font-medium text-[#21214f]">Статус системы</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#f9f9f9] rounded-[8px]">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#4caf50] rounded-full"></div>
                <span className="text-[14px] text-[#21214f]">Все политики активны</span>
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