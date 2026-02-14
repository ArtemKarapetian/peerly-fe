import { AppShell } from '@/app/components/AppShell';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { Book, FileCheck, Clock, Settings, BarChart, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

/**
 * TeacherDashboardPage - Главная панель преподавателя
 */

export default function TeacherDashboardPage() {
  const quickActions = [
    { 
      id: 'courses',
      icon: Book, 
      label: 'Курсы', 
      sublabel: '4 активных',
      description: 'Управление курсами и заданиями',
      color: '#5b8def',
      bgColor: 'bg-[#e9f5ff]',
      iconColor: 'text-[#5b8def]',
      link: '#/teacher/courses'
    },
    { 
      id: 'works',
      icon: FileCheck, 
      label: 'Работы студентов', 
      sublabel: '23 на проверке',
      description: 'Просмотр и оценка работ',
      color: '#ff9800',
      bgColor: 'bg-[#fff4e5]',
      iconColor: 'text-[#ff9800]',
      link: '#/teacher/submissions'
    },
    { 
      id: 'extensions',
      icon: Clock, 
      label: 'Продления', 
      sublabel: '3 запроса',
      description: 'Запросы на продление дедлайнов',
      color: '#4caf50',
      bgColor: 'bg-[#e8f5e9]',
      iconColor: 'text-[#4caf50]',
      link: '#/teacher/extensions'
    },
    { 
      id: 'automation',
      icon: Settings, 
      label: 'Автоматизация', 
      sublabel: '8 правил',
      description: 'Настройка правил и триггеров',
      color: '#8e24aa',
      bgColor: 'bg-[#f3e5f5]',
      iconColor: 'text-[#8e24aa]',
      link: '#/teacher/automation'
    },
    { 
      id: 'analytics',
      icon: BarChart, 
      label: 'Отчеты', 
      sublabel: 'Аналитика',
      description: 'Статистика и аналитика курсов',
      color: '#06b6d4',
      bgColor: 'bg-[#e0f7fa]',
      iconColor: 'text-[#06b6d4]',
      link: '#/teacher/analytics'
    },
  ];

  const recentActivities = [
    { 
      text: 'Новая работа сдана в курсе «Веб-разработка»', 
      time: '5 минут назад',
      icon: FileCheck,
      bgColor: 'bg-[#e9f5ff]',
      iconColor: 'text-[#5b8def]'
    },
    { 
      text: 'Студент запросил продление дедлайна', 
      time: '1 час назад',
      icon: Clock,
      bgColor: 'bg-[#fff4e5]',
      iconColor: 'text-[#ff9800]'
    },
    { 
      text: '3 рецензии завершены в курсе «Дизайн»', 
      time: '2 часа назад',
      icon: CheckCircle,
      bgColor: 'bg-[#e8f5e9]',
      iconColor: 'text-[#4caf50]'
    },
  ];

  return (
    <AppShell title="Панель преподавателя">
      <Breadcrumbs items={[{ label: 'Панель преподавателя' }]} />

      <div className="mt-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
            Панель преподавателя
          </h1>
          <p className="text-[16px] text-[#767692]">
            Управление курсами, проверка работ и аналитика
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => window.location.hash = action.link}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-6 text-left shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:border-[#2563eb] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] transition-all group"
              >
                <div className={`w-12 h-12 ${action.bgColor} rounded-[12px] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${action.iconColor}`} />
                </div>
                <h3 className="text-[16px] font-medium text-[#21214f] mb-1">{action.label}</h3>
                <p className="text-[13px] text-[#767692] mb-3">{action.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium" style={{ color: action.color }}>
                    {action.sublabel}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#5b8def] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#767692]" />
            <h2 className="text-[18px] font-medium text-[#21214f]">Недавняя активность</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-3 hover:bg-[#fafbfc] rounded-[8px] transition-colors">
                  <div className={`w-8 h-8 ${activity.bgColor} rounded-[8px] flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] text-[#21214f]">{activity.text}</p>
                    <p className="text-[12px] text-[#767692] mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}