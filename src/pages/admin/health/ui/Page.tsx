import { useState, useEffect } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ROUTES } from "@/shared/config/routes.ts";
import {
  Activity,
  CheckCircle,
  XCircle,
  AlertCircle,
  Database,
  HardDrive,
  Zap,
  Server,
  Clock,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";

/**
 * AdminHealthPage - Здоровье системы и метрики
 *
 * Функции:
 * - Health checks для DB, S3, Plugins, Workers
 * - Метрики: latency, errors, throughput
 * - Last updated timestamp
 * - Демо-данные с автообновлением
 */

interface HealthCheck {
  id: string;
  service: string;
  name: string;
  status: "healthy" | "degraded" | "down";
  responseTime: number; // ms
  lastCheck: Date;
  details?: string;
  uptime: number; // percentage
}

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number; // percentage
  category: "performance" | "reliability" | "usage";
}

const DEMO_HEALTH_CHECKS: HealthCheck[] = [
  {
    id: "hc1",
    service: "database",
    name: "PostgreSQL Database",
    status: "healthy",
    responseTime: 12,
    lastCheck: new Date(),
    details: "All connections healthy",
    uptime: 99.98,
  },
  {
    id: "hc2",
    service: "storage",
    name: "S3 Storage",
    status: "healthy",
    responseTime: 145,
    lastCheck: new Date(),
    details: "Bucket accessible",
    uptime: 99.95,
  },
  {
    id: "hc3",
    service: "plugin",
    name: "Plagiarism Plugin",
    status: "degraded",
    responseTime: 3200,
    lastCheck: new Date(),
    details: "Slow response time detected",
    uptime: 98.2,
  },
  {
    id: "hc4",
    service: "plugin",
    name: "Code Analyzer Plugin",
    status: "healthy",
    responseTime: 890,
    lastCheck: new Date(),
    details: "Operating normally",
    uptime: 99.1,
  },
  {
    id: "hc5",
    service: "worker",
    name: "Email Workers",
    status: "healthy",
    responseTime: 45,
    lastCheck: new Date(),
    details: "3/3 workers running",
    uptime: 99.7,
  },
  {
    id: "hc6",
    service: "worker",
    name: "Processing Workers",
    status: "healthy",
    responseTime: 78,
    lastCheck: new Date(),
    details: "5/5 workers running",
    uptime: 99.5,
  },
  {
    id: "hc7",
    service: "api",
    name: "API Gateway",
    status: "healthy",
    responseTime: 23,
    lastCheck: new Date(),
    details: "All endpoints responsive",
    uptime: 99.99,
  },
  {
    id: "hc8",
    service: "cache",
    name: "Redis Cache",
    status: "healthy",
    responseTime: 3,
    lastCheck: new Date(),
    details: "Cache hit ratio: 87%",
    uptime: 99.92,
  },
];

const DEMO_METRICS: Metric[] = [
  {
    id: "m1",
    name: "API Latency (p95)",
    value: 234,
    unit: "ms",
    trend: "down",
    change: -12,
    category: "performance",
  },
  {
    id: "m2",
    name: "Error Rate",
    value: 0.15,
    unit: "%",
    trend: "stable",
    change: 0.02,
    category: "reliability",
  },
  {
    id: "m3",
    name: "Request Throughput",
    value: 1250,
    unit: "req/min",
    trend: "up",
    change: 8,
    category: "usage",
  },
  {
    id: "m4",
    name: "Database Connections",
    value: 45,
    unit: "active",
    trend: "stable",
    change: 0,
    category: "usage",
  },
  {
    id: "m5",
    name: "CPU Usage",
    value: 38,
    unit: "%",
    trend: "down",
    change: -5,
    category: "performance",
  },
  {
    id: "m6",
    name: "Memory Usage",
    value: 62,
    unit: "%",
    trend: "up",
    change: 3,
    category: "performance",
  },
  {
    id: "m7",
    name: "Storage Used",
    value: 2.4,
    unit: "TB",
    trend: "up",
    change: 2,
    category: "usage",
  },
  {
    id: "m8",
    name: "Cache Hit Rate",
    value: 87,
    unit: "%",
    trend: "up",
    change: 4,
    category: "performance",
  },
  {
    id: "m9",
    name: "Queue Depth",
    value: 156,
    unit: "jobs",
    trend: "down",
    change: -18,
    category: "usage",
  },
];

export default function AdminHealthPage() {
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>(DEMO_HEALTH_CHECKS);
  const [metrics, setMetrics] = useState<Metric[]>(DEMO_METRICS);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  // Update "now" periodically for time calculations
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh health checks
  useEffect(() => {
    const interval = setInterval(() => {
      setHealthChecks((prev) =>
        prev.map((check) => ({
          ...check,
          responseTime: check.responseTime + Math.floor(Math.random() * 20 - 10),
          lastCheck: new Date(),
          status: check.status === "degraded" && Math.random() > 0.5 ? "healthy" : check.status,
        })),
      );

      setMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: Math.max(0, metric.value + (Math.random() * 10 - 5)),
          change: Math.random() * 10 - 5,
        })),
      );

      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setHealthChecks((prev) =>
      prev.map((check) => ({
        ...check,
        lastCheck: new Date(),
      })),
    );

    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "healthy":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[12px] font-medium">
            <CheckCircle className="w-4 h-4" />
            Healthy
          </span>
        );
      case "degraded":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[8px] text-[12px] font-medium">
            <AlertCircle className="w-4 h-4" />
            Degraded
          </span>
        );
      case "down":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#fff5f5] text-[#d4183d] rounded-[8px] text-[12px] font-medium">
            <XCircle className="w-4 h-4" />
            Down
          </span>
        );
      default:
        return null;
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "database":
        return <Database className="w-6 h-6 text-[#5b8def]" />;
      case "storage":
        return <HardDrive className="w-6 h-6 text-[#ff9800]" />;
      case "plugin":
        return <Zap className="w-6 h-6 text-[#8e24aa]" />;
      case "worker":
        return <Server className="w-6 h-6 text-[#4caf50]" />;
      case "api":
        return <Activity className="w-6 h-6 text-[#5b8def]" />;
      case "cache":
        return <Clock className="w-6 h-6 text-[#ff9800]" />;
      default:
        return <Activity className="w-6 h-6 text-[#767692]" />;
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === "up") {
      return (
        <TrendingUp className={`w-4 h-4 ${change > 0 ? "text-[#d4183d]" : "text-[#4caf50]"}`} />
      );
    }
    if (trend === "down") {
      return (
        <TrendingDown className={`w-4 h-4 ${change < 0 ? "text-[#4caf50]" : "text-[#d4183d]"}`} />
      );
    }
    return (
      <span className="w-4 h-4 inline-flex items-center justify-center text-[#767692]">─</span>
    );
  };

  const overallStatus = healthChecks.every((c) => c.status === "healthy")
    ? "healthy"
    : healthChecks.some((c) => c.status === "down")
      ? "down"
      : "degraded";

  const healthyCount = healthChecks.filter((c) => c.status === "healthy").length;
  const degradedCount = healthChecks.filter((c) => c.status === "degraded").length;
  const downCount = healthChecks.filter((c) => c.status === "down").length;

  const avgResponseTime = Math.floor(
    healthChecks.reduce((sum, c) => sum + c.responseTime, 0) / healthChecks.length,
  );

  return (
    <AppShell title="Здоровье системы">
      <Breadcrumbs
        items={[
          { label: "Администратор", href: ROUTES.adminOverview },
          { label: "Мониторинг", href: ROUTES.adminHealth },
          { label: "Здоровье" },
        ]}
      />

      <div className="mt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
              Здоровье системы и метрики
            </h1>
            <p className="text-[16px] text-[#767692]">Мониторинг сервисов и производительности</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f9f9f9] rounded-[8px] border-2 border-[#e6e8ee]">
              <Clock className="w-4 h-4 text-[#767692]" />
              <span className="text-[12px] text-[#767692]">
                {lastUpdate.toLocaleTimeString("ru-RU")}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-2 bg-[#5b8def] text-white rounded-[12px] hover:bg-[#4a7de8] transition-colors text-[14px] font-medium disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
              Обновить
            </button>
          </div>
        </div>

        {/* Overall Status */}
        <div
          className={`p-6 rounded-[20px] mb-8 border-2 ${
            overallStatus === "healthy"
              ? "bg-[#e8f5e9] border-[#4caf50]"
              : overallStatus === "degraded"
                ? "bg-[#fff4e5] border-[#ff9800]"
                : "bg-[#fff5f5] border-[#d4183d]"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${
                overallStatus === "healthy"
                  ? "bg-[#4caf50]"
                  : overallStatus === "degraded"
                    ? "bg-[#ff9800]"
                    : "bg-[#d4183d]"
              }`}
            >
              {overallStatus === "healthy" ? (
                <CheckCircle className="w-8 h-8 text-white" />
              ) : overallStatus === "degraded" ? (
                <AlertCircle className="w-8 h-8 text-white" />
              ) : (
                <XCircle className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-[24px] font-medium text-[#21214f] mb-1">
                {overallStatus === "healthy"
                  ? "Все системы работают"
                  : overallStatus === "degraded"
                    ? "Обнаружены проблемы"
                    : "Критическая ошибка"}
              </h2>
              <p className="text-[14px] text-[#767692]">
                {healthyCount} здоровых, {degradedCount} деградированных, {downCount} недоступных •
                Ср. время отклика: {avgResponseTime}ms
              </p>
            </div>
          </div>
        </div>

        {/* Health Checks Grid */}
        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">Проверки здоровья</h2>

          <div className="grid md:grid-cols-2 gap-4">
            {healthChecks.map((check) => (
              <div key={check.id} className="bg-white border-2 border-[#e6e8ee] rounded-[16px] p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-[#f9f9f9] rounded-[12px] flex items-center justify-center flex-shrink-0">
                      {getServiceIcon(check.service)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[16px] font-medium text-[#21214f] mb-1">{check.name}</h3>
                      <p className="text-[12px] text-[#767692]">{check.details}</p>
                    </div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">Время</p>
                    <p
                      className={`text-[16px] font-medium ${
                        check.responseTime > 1000 ? "text-[#d4183d]" : "text-[#21214f]"
                      }`}
                    >
                      {check.responseTime}ms
                    </p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Uptime
                    </p>
                    <p className="text-[16px] font-medium text-[#4caf50]">{check.uptime}%</p>
                  </div>
                  <div className="p-3 bg-[#f9f9f9] rounded-[8px]">
                    <p className="text-[11px] text-[#767692] uppercase tracking-wide mb-1">
                      Проверка
                    </p>
                    <p className="text-[16px] font-medium text-[#767692]">
                      {Math.floor((now - check.lastCheck.getTime()) / 1000)}s
                    </p>
                  </div>
                </div>

                {check.status === "degraded" && (
                  <div className="mt-3 p-2 bg-[#fff4e5] border border-[#ff9800] rounded-[6px] flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-[#ff9800] flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[#ff9800]">Сервис работает медленнее обычного</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mb-8">
          <h2 className="text-[20px] font-medium text-[#21214f] mb-4">
            Метрики производительности
          </h2>

          {/* Category: Performance */}
          <div className="mb-6">
            <h3 className="text-[16px] font-medium text-[#767692] mb-3 uppercase tracking-wide">
              Производительность
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics
                .filter((m) => m.category === "performance")
                .map((metric) => (
                  <div
                    key={metric.id}
                    className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-[#767692]">{metric.name}</p>
                      {getTrendIcon(metric.trend, metric.change)}
                    </div>
                    <p className="text-[24px] font-medium text-[#21214f] mb-1">
                      {metric.value.toFixed(metric.unit === "%" ? 1 : 0)}
                      <span className="text-[14px] text-[#767692] ml-1">{metric.unit}</span>
                    </p>
                    <p
                      className={`text-[11px] ${
                        metric.change > 0
                          ? "text-[#d4183d]"
                          : metric.change < 0
                            ? "text-[#4caf50]"
                            : "text-[#767692]"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change.toFixed(1)}% за час
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Category: Reliability */}
          <div className="mb-6">
            <h3 className="text-[16px] font-medium text-[#767692] mb-3 uppercase tracking-wide">
              Надёжность
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics
                .filter((m) => m.category === "reliability")
                .map((metric) => (
                  <div
                    key={metric.id}
                    className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-[#767692]">{metric.name}</p>
                      {getTrendIcon(metric.trend, metric.change)}
                    </div>
                    <p className="text-[24px] font-medium text-[#21214f] mb-1">
                      {metric.value.toFixed(2)}
                      <span className="text-[14px] text-[#767692] ml-1">{metric.unit}</span>
                    </p>
                    <p
                      className={`text-[11px] ${
                        metric.change > 0
                          ? "text-[#d4183d]"
                          : metric.change < 0
                            ? "text-[#4caf50]"
                            : "text-[#767692]"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change.toFixed(2)}% за час
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Category: Usage */}
          <div>
            <h3 className="text-[16px] font-medium text-[#767692] mb-3 uppercase tracking-wide">
              Использование ресурсов
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {metrics
                .filter((m) => m.category === "usage")
                .map((metric) => (
                  <div
                    key={metric.id}
                    className="bg-white border-2 border-[#e6e8ee] rounded-[12px] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] text-[#767692]">{metric.name}</p>
                      {getTrendIcon(metric.trend, metric.change)}
                    </div>
                    <p className="text-[24px] font-medium text-[#21214f] mb-1">
                      {metric.value.toFixed(metric.unit === "TB" ? 1 : 0)}
                      <span className="text-[14px] text-[#767692] ml-1">{metric.unit}</span>
                    </p>
                    <p
                      className={`text-[11px] ${
                        Math.abs(metric.change) < 1 ? "text-[#767692]" : "text-[#5b8def]"
                      }`}
                    >
                      {metric.change > 0 ? "+" : ""}
                      {metric.change.toFixed(1)}% за час
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-[#e9f5ff] border-2 border-[#5b8def] rounded-[16px] p-4">
          <div className="flex gap-3">
            <Activity className="w-5 h-5 text-[#5b8def] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-[14px] font-medium text-[#21214f] mb-1">
                О мониторинге здоровья
              </h4>
              <p className="text-[13px] text-[#767692]">
                Проверки здоровья выполняются каждые 30 секунд. Метрики обновляются каждые 10
                секунд. При обнаружении проблем автоматически создаются инциденты в системе
                алертинга.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
