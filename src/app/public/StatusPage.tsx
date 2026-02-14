import { useState } from 'react';
import { PublicLayout } from '@/app/components/PublicLayout';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/Input';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Bell,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * StatusPage - System Status & Incidents
 * 
 * Features:
 * - System status indicator (demo toggle)
 * - Incidents list with expand/collapse
 * - Subscribe to updates (demo)
 */

type SystemStatus = 'operational' | 'degraded' | 'outage';
type IncidentStatus = 'investigating' | 'monitoring' | 'resolved';

interface Incident {
  id: string;
  title: string;
  status: IncidentStatus;
  severity: 'low' | 'medium' | 'high';
  startTime: string;
  endTime?: string;
  summary: string;
  updates: {
    time: string;
    status: IncidentStatus;
    message: string;
  }[];
}

// Mock incidents data
const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-001',
    title: 'Все системы работают нормально',
    status: 'resolved',
    severity: 'low',
    startTime: '2026-01-25T09:00:00Z',
    endTime: '2026-01-25T09:00:00Z',
    summary: 'Системы Peerly работают в штатном режиме.',
    updates: [
      {
        time: '2026-01-25T09:00:00Z',
        status: 'resolved',
        message: 'Все сервисы работают стабильно. Никаких проблем не обнаружено.'
      }
    ]
  },
  {
    id: 'inc-002',
    title: 'Временное замедление загрузки файлов',
    status: 'resolved',
    severity: 'medium',
    startTime: '2026-01-24T14:30:00Z',
    endTime: '2026-01-24T16:45:00Z',
    summary: 'Пользователи испытывали задержки при загрузке больших файлов submissions.',
    updates: [
      {
        time: '2026-01-24T16:45:00Z',
        status: 'resolved',
        message: 'Проблема решена. Мы увеличили пропускную способность серверов хранения файлов. Все загрузки работают нормально.'
      },
      {
        time: '2026-01-24T15:20:00Z',
        status: 'monitoring',
        message: 'Мы применили временное исправление и наблюдаем за системой. Скорость загрузки улучшилась.'
      },
      {
        time: '2026-01-24T14:30:00Z',
        status: 'investigating',
        message: 'Мы получили сообщения о медленной загрузке файлов и начали расследование.'
      }
    ]
  },
  {
    id: 'inc-003',
    title: 'Проблемы с аутентификацией',
    status: 'resolved',
    severity: 'high',
    startTime: '2026-01-23T08:15:00Z',
    endTime: '2026-01-23T09:30:00Z',
    summary: 'Некоторые пользователи не могли войти в систему из-за проблем с сервером аутентификации.',
    updates: [
      {
        time: '2026-01-23T09:30:00Z',
        status: 'resolved',
        message: 'Сервис аутентификации полностью восстановлен. Все пользователи могут войти в систему.'
      },
      {
        time: '2026-01-23T08:45:00Z',
        status: 'monitoring',
        message: 'Мы перезапустили сервис аутентификации. Большинство пользователей могут войти, продолжаем мониторинг.'
      },
      {
        time: '2026-01-23T08:15:00Z',
        status: 'investigating',
        message: 'Мы расследуем проблемы с входом в систему, о которых сообщили пользователи.'
      }
    ]
  },
  {
    id: 'inc-004',
    title: 'Плановое техническое обслуживание',
    status: 'resolved',
    severity: 'low',
    startTime: '2026-01-20T02:00:00Z',
    endTime: '2026-01-20T04:00:00Z',
    summary: 'Запланированное обновление базы данных с кратковременным отключением сервиса.',
    updates: [
      {
        time: '2026-01-20T04:00:00Z',
        status: 'resolved',
        message: 'Техническое обслуживание завершено успешно. Все системы работают нормально.'
      },
      {
        time: '2026-01-20T02:00:00Z',
        status: 'monitoring',
        message: 'Начато плановое техническое обслуживание. Сервис будет недоступен до 04:00 UTC.'
      }
    ]
  },
  {
    id: 'inc-005',
    title: 'Ошибки при экспорте оценок',
    status: 'resolved',
    severity: 'medium',
    startTime: '2026-01-18T11:20:00Z',
    endTime: '2026-01-18T13:10:00Z',
    summary: 'Преподаватели получали ошибки при попытке экспорта gradebook в CSV формат.',
    updates: [
      {
        time: '2026-01-18T13:10:00Z',
        status: 'resolved',
        message: 'Исправлена ошибка в модуле экспорта. Функция экспорта оценок работает корректно.'
      },
      {
        time: '2026-01-18T11:20:00Z',
        status: 'investigating',
        message: 'Мы получили сообщения об ошибках экспорта и начали расследование.'
      }
    ]
  }
];

export default function StatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('operational');
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  // Toggle incident expansion
  const toggleIncident = (id: string) => {
    const newExpanded = new Set(expandedIncidents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIncidents(newExpanded);
  };

  // Cycle through status states (for demo)
  const cycleStatus = () => {
    const statuses: SystemStatus[] = ['operational', 'degraded', 'outage'];
    const currentIndex = statuses.indexOf(systemStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setSystemStatus(statuses[nextIndex]);
  };

  // Get status config
  const getStatusConfig = (status: SystemStatus) => {
    switch (status) {
      case 'operational':
        return {
          label: 'Все системы работают',
          icon: CheckCircle2,
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
          dotColor: 'bg-green-500'
        };
      case 'degraded':
        return {
          label: 'Частичный сбой',
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          dotColor: 'bg-yellow-500'
        };
      case 'outage':
        return {
          label: 'Проблемы с сервисом',
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          dotColor: 'bg-red-500'
        };
    }
  };

  // Get incident status config
  const getIncidentStatusConfig = (status: IncidentStatus) => {
    switch (status) {
      case 'investigating':
        return {
          label: 'Расследуется',
          color: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-300'
        };
      case 'monitoring':
        return {
          label: 'Мониторинг',
          color: 'text-yellow-700',
          bg: 'bg-yellow-100',
          border: 'border-yellow-300'
        };
      case 'resolved':
        return {
          label: 'Решено',
          color: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-300'
        };
    }
  };

  // Format time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('ru-RU', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Validate email
  const isEmailValid = () => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle subscribe
  const handleSubscribe = () => {
    setEmailTouched(true);
    
    if (!isEmailValid()) {
      return;
    }

    // Demo: just show success toast
    toast.success('Подписка оформлена', {
      description: `Уведомления будут отправляться на ${email}`
    });
    setEmail('');
    setEmailTouched(false);
  };

  const statusConfig = getStatusConfig(systemStatus);
  const StatusIcon = statusConfig.icon;

  return (
    <PublicLayout maxWidth="lg">
      <div className="py-8 tablet:py-12 desktop:py-16 px-4">
        <div className="max-w-[900px] mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <Activity className="size-6 text-primary" />
              </div>
              <h1 className="text-[32px] tablet:text-[40px] font-medium text-foreground tracking-[-0.5px]">
                Статус сервиса
              </h1>
            </div>
            <p className="text-[15px] text-muted-foreground">
              Текущее состояние систем Peerly и история инцидентов
            </p>
          </div>

          {/* System Status Card */}
          <div
            className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl p-6 mb-8 cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]`}
            onClick={cycleStatus}
            title="Нажмите для переключения статуса (демо)"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <StatusIcon className={`size-10 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`size-3 ${statusConfig.dotColor} rounded-full animate-pulse`} />
                  <h2 className="text-[24px] font-medium text-foreground">
                    {statusConfig.label}
                  </h2>
                </div>
                <p className="text-[15px] text-muted-foreground">
                  {systemStatus === 'operational' && 'Все сервисы работают в штатном режиме'}
                  {systemStatus === 'degraded' && 'Некоторые функции могут работать медленнее обычного'}
                  {systemStatus === 'outage' && 'Мы работаем над восстановлением сервиса'}
                </p>
              </div>
              <div className="text-xs text-muted-foreground">
                Обновлено: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          {/* Subscribe Section */}
          <div className="bg-card border-2 border-border rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <Bell className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-[20px] font-medium text-foreground mb-2">
                  Подписаться на обновления
                </h3>
                <p className="text-[15px] text-muted-foreground mb-4">
                  Получайте уведомления о статусе сервиса и плановых работах
                </p>
                <div className="flex gap-3 max-w-[500px]">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="your.email@university.edu"
                      error={emailTouched && !isEmailValid() && email ? 'Некорректный email' : ''}
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleSubscribe}
                    disabled={!email || (emailTouched && !isEmailValid())}
                  >
                    Подписаться
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Demo: уведомления не отправляются
                </p>
              </div>
            </div>
          </div>

          {/* Incidents Section */}
          <div className="mb-8">
            <h2 className="text-[24px] font-medium text-foreground mb-4">
              История инцидентов
            </h2>
            <p className="text-[15px] text-muted-foreground mb-6">
              Последние 5 инцидентов и обновлений
            </p>

            <div className="space-y-4">
              {MOCK_INCIDENTS.map((incident) => {
                const isExpanded = expandedIncidents.has(incident.id);
                const statusConfig = getIncidentStatusConfig(incident.status);

                return (
                  <div
                    key={incident.id}
                    className="bg-card border-2 border-border rounded-xl overflow-hidden"
                  >
                    {/* Incident Header */}
                    <button
                      onClick={() => toggleIncident(incident.id)}
                      className="w-full p-5 flex items-start gap-4 hover:bg-accent/30 transition-colors text-left"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border} border`}
                          >
                            {statusConfig.label}
                          </span>
                          <h3 className="text-[17px] font-medium text-foreground">
                            {incident.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{formatTime(incident.startTime)}</span>
                          {incident.endTime && (
                            <>
                              <span>→</span>
                              <span>{formatTime(incident.endTime)}</span>
                            </>
                          )}
                        </div>
                        {!isExpanded && (
                          <p className="text-[14px] text-muted-foreground mt-2 line-clamp-1">
                            {incident.summary}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0 mt-1">
                        {isExpanded ? (
                          <ChevronUp className="size-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="size-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Incident Details (Expanded) */}
                    {isExpanded && (
                      <div className="border-t-2 border-border px-5 py-4 bg-accent/20">
                        <p className="text-[15px] text-muted-foreground mb-4">
                          {incident.summary}
                        </p>

                        {/* Updates Timeline */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">
                            Обновления
                          </h4>
                          <div className="space-y-3">
                            {incident.updates.map((update, index) => {
                              const updateStatusConfig = getIncidentStatusConfig(update.status);
                              return (
                                <div
                                  key={index}
                                  className="flex gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                                >
                                  <div className="flex-shrink-0 w-[120px] text-xs text-muted-foreground pt-1">
                                    {formatTime(update.time)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span
                                        className={`px-2 py-0.5 rounded text-xs font-medium ${updateStatusConfig.bg} ${updateStatusConfig.color}`}
                                      >
                                        {updateStatusConfig.label}
                                      </span>
                                    </div>
                                    <p className="text-[14px] text-foreground">
                                      {update.message}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-accent/50 border border-border rounded-lg px-4 py-3">
            <p className="text-sm text-muted-foreground">
              По вопросам о статусе сервиса:{' '}
              <a href="mailto:support@peerly.edu" className="text-primary hover:underline">
                support@peerly.edu
              </a>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}