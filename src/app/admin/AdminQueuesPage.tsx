import { useState, useEffect, useCallback } from "react";
import { AppShell } from "@/app/components/AppShell";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ROUTES } from "@/shared/config/routes.ts";
import { Activity, Play, Pause, RefreshCw, AlertCircle, Server } from "lucide-react";

/**
 * AdminQueuesPage - Мониторинг очередей и воркеров
 *
 * Функции:
 * - Список очередей с глубиной и throughput
 * - Статус карточки воркеров (running/paused)
 * - Retry counts
 * - Демо-данные с автообновлением
 */

interface Queue {
  id: string;
  name: string;
  description: string;
  depth: number;
  processing: number;
  completed: number;
  failed: number;
  throughput: number; // jobs per minute
  avgProcessTime: number; // seconds
}

interface Worker {
  id: string;
  name: string;
  queue: string;
  status: "running" | "paused" | "error";
  currentJob?: string;
  processedToday: number;
  retryCount: number;
  lastActivity: Date;
  uptime: number; // hours
}

const DEMO_QUEUES: Queue[] = [
  {
    id: "q1",
    name: "plagiarism-check",
    description: "Проверка на плагиат",
    depth: 23,
    processing: 5,
    completed: 1847,
    failed: 12,
    throughput: 15,
    avgProcessTime: 45,
  },
  {
    id: "q2",
    name: "email-notifications",
    description: "Отправка уведомлений",
    depth: 156,
    processing: 12,
    completed: 8934,
    failed: 3,
    throughput: 120,
    avgProcessTime: 2,
  },
  {
    id: "q3",
    name: "pdf-generation",
    description: "Генерация PDF отчётов",
    depth: 8,
    processing: 2,
    completed: 542,
    failed: 7,
    throughput: 8,
    avgProcessTime: 18,
  },
  {
    id: "q4",
    name: "code-analysis",
    description: "Анализ кода линтером",
    depth: 34,
    processing: 8,
    completed: 2156,
    failed: 45,
    throughput: 25,
    avgProcessTime: 30,
  },
  {
    id: "q5",
    name: "gradebook-sync",
    description: "Синхронизация оценок",
    depth: 2,
    processing: 1,
    completed: 456,
    failed: 1,
    throughput: 5,
    avgProcessTime: 12,
  },
];

const DEMO_WORKERS: Worker[] = [
  {
    id: "w1",
    name: "plagiarism-worker-01",
    queue: "plagiarism-check",
    status: "running",
    currentJob: "submission-7823",
    processedToday: 234,
    retryCount: 3,
    lastActivity: new Date(Date.now() - 30000),
    uptime: 48.5,
  },
  {
    id: "w2",
    name: "plagiarism-worker-02",
    queue: "plagiarism-check",
    status: "running",
    currentJob: "submission-7891",
    processedToday: 198,
    retryCount: 1,
    lastActivity: new Date(Date.now() - 15000),
    uptime: 48.5,
  },
  {
    id: "w3",
    name: "email-worker-01",
    queue: "email-notifications",
    status: "running",
    currentJob: "email-batch-442",
    processedToday: 1523,
    retryCount: 0,
    lastActivity: new Date(Date.now() - 5000),
    uptime: 72.2,
  },
  {
    id: "w4",
    name: "email-worker-02",
    queue: "email-notifications",
    status: "paused",
    processedToday: 1089,
    retryCount: 0,
    lastActivity: new Date(Date.now() - 600000),
    uptime: 72.2,
  },
  {
    id: "w5",
    name: "pdf-worker-01",
    queue: "pdf-generation",
    status: "running",
    currentJob: "report-332",
    processedToday: 67,
    retryCount: 2,
    lastActivity: new Date(Date.now() - 45000),
    uptime: 24.1,
  },
  {
    id: "w6",
    name: "code-analysis-worker-01",
    queue: "code-analysis",
    status: "error",
    currentJob: "code-check-889",
    processedToday: 156,
    retryCount: 8,
    lastActivity: new Date(Date.now() - 120000),
    uptime: 12.3,
  },
  {
    id: "w7",
    name: "code-analysis-worker-02",
    queue: "code-analysis",
    status: "running",
    currentJob: "code-check-890",
    processedToday: 201,
    retryCount: 1,
    lastActivity: new Date(Date.now() - 8000),
    uptime: 36.7,
  },
  {
    id: "w8",
    name: "gradebook-worker-01",
    queue: "gradebook-sync",
    status: "running",
    processedToday: 89,
    retryCount: 0,
    lastActivity: new Date(Date.now() - 180000),
    uptime: 168.5,
  },
];

export default function AdminQueuesPage() {
  const [queues, setQueues] = useState<Queue[]>(DEMO_QUEUES);
  const [workers, setWorkers] = useState<Worker[]>(DEMO_WORKERS);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh demo data
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate queue depth changes
      setQueues((prevQueues) =>
        prevQueues.map((q) => ({
          ...q,
          depth: Math.max(0, q.depth + Math.floor(Math.random() * 10 - 5)),
          processing: Math.max(0, Math.floor(Math.random() * 10)),
          completed: q.completed + Math.floor(Math.random() * 5),
        })),
      );

      // Update worker activity
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) => ({
          ...w,
          processedToday:
            w.processedToday + (w.status === "running" ? Math.floor(Math.random() * 3) : 0),
          lastActivity: w.status === "running" ? new Date() : w.lastActivity,
        })),
      );

      setLastUpdate(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleToggleWorker = (workerId: string) => {
    setWorkers(
      workers.map((w) => {
        if (w.id !== workerId) return w;

        const newStatus = w.status === "running" ? "paused" : "running";
        return {
          ...w,
          status: newStatus as "running" | "paused" | "error",
          currentJob: newStatus === "paused" ? undefined : w.currentJob,
        };
      }),
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[6px] text-[11px] font-medium">
            <Play className="w-3 h-3" />
            Running
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
            <Pause className="w-3 h-3" />
            Paused
          </span>
        );
      case "error":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[6px] text-[11px] font-medium">
            <AlertCircle className="w-3 h-3" />
            Error
          </span>
        );
      default:
        return null;
    }
  };

  const formatUptime = (hours: number): string => {
    if (hours < 1) return `${Math.floor(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${Math.floor(hours / 24)}d ${(hours % 24).toFixed(0)}h`;
  };

  // Current time for calculations - use state with lazy init
  const [now] = useState(() => Date.now());

  const getTimeSince = useCallback(
    (date: Date): string => {
      const seconds = Math.floor((now - date.getTime()) / 1000);
      if (seconds < 60) return `${seconds}s назад`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m назад`;
      return `${Math.floor(seconds / 3600)}h назад`;
    },
    [now],
  );

  const totalJobs = queues.reduce((sum, q) => sum + q.depth + q.processing, 0);
  const totalProcessing = queues.reduce((sum, q) => sum + q.processing, 0);
  const totalCompleted = queues.reduce((sum, q) => sum + q.completed, 0);
  const totalFailed = queues.reduce((sum, q) => sum + q.failed, 0);
  const activeWorkers = workers.filter((w) => w.status === "running").length;

  return (
    <AppShell title="Очереди и воркеры">
      <Breadcrumbs
        items={[
          { label: "Admin", href: ROUTES.adminOverview },
          { label: "Мониторинг", href: ROUTES.adminHealth },
          { label: "Очереди" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Мониторинг очередей и воркеров
            </h1>
            <p className="text-[16px] text-[#767692]">Фоновые задачи и рабочие процессы системы</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f9f9f9] rounded-[8px] border-2 border-[#e6e8ee]">
            <RefreshCw
              className="w-4 h-4 text-[#767692] animate-spin"
              style={{ animationDuration: "3s" }}
            />
            <span className="text-[12px] text-[#767692]">
              Обновлено: {lastUpdate.toLocaleTimeString("ru-RU")}
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">В очереди</p>
            <p className="text-[28px] font-medium text-[#21214f]">{totalJobs}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Обработка</p>
            <p className="text-[28px] font-medium text-[#ff9800]">{totalProcessing}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Завершено</p>
            <p className="text-[28px] font-medium text-[#4caf50]">{totalCompleted}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Ошибки</p>
            <p className="text-[28px] font-medium text-[#d4183d]">{totalFailed}</p>
          </div>
          <div className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4">
            <p className="text-[12px] text-[#767692] uppercase tracking-wide mb-1">Воркеры</p>
            <p className="text-[28px] font-medium text-[#5b8def]">
              {activeWorkers}/{workers.length}
            </p>
          </div>
        </div>

        {/* Queues Section */}
        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Очереди задач</h2>

          <div className="space-y-4">
            {queues.map((queue) => (
              <div key={queue.id} className="bg-white border-2 border-[#e6e8ee] rounded-[20px] p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-[18px] font-medium text-[#21214f] font-mono">
                        {queue.name}
                      </h3>
                      {queue.depth > 50 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[6px] text-[11px] font-medium">
                          <AlertCircle className="w-3 h-3" />
                          Высокая нагрузка
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] text-[#767692]">{queue.description}</p>
                  </div>
                </div>

                {/* Queue Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Глубина
                    </p>
                    <p className="text-[20px] font-medium text-[#21214f]">{queue.depth}</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      В работе
                    </p>
                    <p className="text-[20px] font-medium text-[#ff9800]">{queue.processing}</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Выполнено
                    </p>
                    <p className="text-[20px] font-medium text-[#4caf50]">{queue.completed}</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Ошибки
                    </p>
                    <p className="text-[20px] font-medium text-[#d4183d]">{queue.failed}</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Throughput
                    </p>
                    <p className="text-[20px] font-medium text-[#5b8def]">{queue.throughput}/m</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Ср. время
                    </p>
                    <p className="text-[20px] font-medium text-[#767692]">
                      {queue.avgProcessTime}s
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workers Section */}
        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Воркеры</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Server className="w-4 h-4 text-[#767692]" />
                      <h3 className="text-[15px] font-medium text-[#21214f] font-mono">
                        {worker.name}
                      </h3>
                    </div>
                    <p className="text-[12px] text-[#767692]">Queue: {worker.queue}</p>
                  </div>
                  {getStatusBadge(worker.status)}
                </div>

                {/* Current Job */}
                {worker.currentJob && (
                  <div className="mb-3 p-2 bg-[#e9f5ff] rounded-[6px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-0.5">
                      Текущая задача
                    </p>
                    <p className="text-[12px] text-[#5b8def] font-mono">{worker.currentJob}</p>
                  </div>
                )}

                {/* Worker Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-[11px] text-[#767692] mb-1">Обработано сегодня</p>
                    <p className="text-[16px] font-medium text-[#21214f]">
                      {worker.processedToday}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#767692] mb-1">Retry count</p>
                    <p
                      className={`text-[16px] font-medium ${worker.retryCount > 5 ? "text-[#d4183d]" : "text-[#21214f]"}`}
                    >
                      {worker.retryCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#767692] mb-1">Uptime</p>
                    <p className="text-[16px] font-medium text-[#21214f]">
                      {formatUptime(worker.uptime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-[#767692] mb-1">Последняя активность</p>
                    <p className="text-[16px] font-medium text-[#767692]">
                      {getTimeSince(worker.lastActivity)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t-2 border-[#e6e8ee]">
                  {worker.status !== "error" && (
                    <button
                      onClick={() => handleToggleWorker(worker.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-[8px] text-[13px] font-medium transition-colors ${
                        worker.status === "running"
                          ? "bg-[#fff4e5] text-[#ff9800] hover:bg-[#ffe5cc]"
                          : "bg-[#e8f5e9] text-[#4caf50] hover:bg-[#d4edda]"
                      }`}
                    >
                      {worker.status === "running" ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Приостановить
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Запустить
                        </>
                      )}
                    </button>
                  )}
                  {worker.status === "error" && (
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#5b8def] text-white rounded-[8px] text-[13px] font-medium hover:bg-[#4a7de8] transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      Перезапустить
                    </button>
                  )}
                </div>

                {/* High retry warning */}
                {worker.retryCount > 5 && (
                  <div className="mt-3 p-2 bg-[#fff5f5] border border-[#d4183d] rounded-[6px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#d4183d] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#d4183d]">
                      Высокий retry count - возможна проблема с задачей
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">О мониторинге</h4>
              <p className="text-[13px] text-[#767692]">
                Данные обновляются каждые 5 секунд. Воркеры можно приостанавливать и запускать
                вручную. При высоком retry count (&gt;5) рекомендуется проверить логи задачи.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
