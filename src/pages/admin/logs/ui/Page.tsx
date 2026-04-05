import {
  FileSearch,
  Search,
  Info,
  AlertTriangle,
  XCircle,
  Activity,
  User,
  Download,
  RefreshCw,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { PageHeader } from "@/shared/ui/PageHeader";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * AdminLogsPage - Логи и аудит
 *
 * Функции:
 * - Searchable logs table с фильтрами (service, level, time)
 * - Audit log stream (user actions, admin changes)
 * - Демо-данные с автообновлением
 */

// ========== TYPES ==========

interface BaseLog {
  id: string;
  timestamp: Date;
}

interface SystemLog extends BaseLog {
  service: string;
  level: "info" | "warn" | "error" | "debug";
  message: string;
  details?: string;
}

interface AuditLog extends BaseLog {
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
}

// ========== EXPORT CONFIG ==========

interface LogExportConfig<T extends BaseLog> {
  headers: string[];
  rowMapper: (log: T) => string[];
}

const LOG_EXPORT_CONFIGS = {
  system: {
    headers: ["Timestamp", "Service", "Level", "Message", "Details"],
    rowMapper: (log: SystemLog) => [
      log.timestamp.toISOString(),
      log.service,
      log.level,
      log.message,
      log.details || "",
    ],
  } as LogExportConfig<SystemLog>,
  audit: {
    headers: ["Timestamp", "User", "Action", "Resource", "Details", "IP"],
    rowMapper: (log: AuditLog) => [
      log.timestamp.toISOString(),
      log.userName,
      log.action,
      log.resource,
      log.details,
      log.ipAddress || "",
    ],
  } as LogExportConfig<AuditLog>,
};

const exportToCsv = <T extends BaseLog>(
  logs: T[],
  config: LogExportConfig<T>,
  filename: string,
): void => {
  const escapeCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

  const csvContent = [
    config.headers.join(","),
    ...logs.map((log) => config.rowMapper(log).map(escapeCell).join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// ========== CONSTANTS ==========

const SERVICES = ["api", "worker", "database", "auth", "storage", "plugin"];

const CLASSES = {
  input:
    "w-full px-4 py-3 border-2 border-border rounded-[12px] text-[15px] text-foreground focus:border-ring focus:outline-none transition-colors",
  card: "bg-card border-2 border-border rounded-[12px] p-4",
  statValue: "text-[28px] font-medium",
  statLabel: "text-[12px] text-muted-foreground uppercase tracking-wide mb-1",
  badge: "inline-flex items-center gap-1 px-2 py-1 rounded-[6px] text-[11px] font-medium",
  filterTag:
    "inline-flex items-center gap-1 px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px]",
};

const LEVEL_CONFIG = {
  info: {
    bg: "bg-info-light",
    text: "text-brand-primary",
    icon: Info,
    label: "INFO",
  },
  warn: {
    bg: "bg-warning-light",
    text: "text-warning",
    icon: AlertTriangle,
    label: "WARN",
  },
  error: {
    bg: "bg-error-light",
    text: "text-error",
    icon: XCircle,
    label: "ERROR",
  },
  debug: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    icon: Activity,
    label: "DEBUG",
  },
} as const;

const DEMO_SYSTEM_LOGS: SystemLog[] = [
  {
    id: "log-1",
    timestamp: new Date(Date.now() - 60000),
    service: "api",
    level: "info",
    message: "GET /api/submissions/123 - 200 OK",
    details: "Response time: 145ms",
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 120000),
    service: "worker",
    level: "info",
    message: "Plagiarism check completed for work-7823",
    details: "Similarity: 12%",
  },
  {
    id: "log-3",
    timestamp: new Date(Date.now() - 180000),
    service: "database",
    level: "warn",
    message: "Slow query detected: SELECT * FROM submissions",
    details: "Execution time: 3.2s",
  },
  {
    id: "log-4",
    timestamp: new Date(Date.now() - 240000),
    service: "auth",
    level: "error",
    message: "Failed login attempt for user: student@example.com",
    details: "Invalid password",
  },
  {
    id: "log-5",
    timestamp: new Date(Date.now() - 300000),
    service: "storage",
    level: "info",
    message: "File uploaded: document.pdf (2.3 MB)",
    details: "S3 bucket: peerly-submissions",
  },
  {
    id: "log-6",
    timestamp: new Date(Date.now() - 360000),
    service: "plugin",
    level: "warn",
    message: "Plugin execution timeout: code-analyzer",
    details: "Timeout after 30s",
  },
  {
    id: "log-7",
    timestamp: new Date(Date.now() - 420000),
    service: "api",
    level: "error",
    message: "POST /api/reviews - 500 Internal Server Error",
    details: "Database connection lost",
  },
  {
    id: "log-8",
    timestamp: new Date(Date.now() - 480000),
    service: "worker",
    level: "info",
    message: "Email notification sent to 45 users",
    details: "Queue: email-notifications",
  },
  {
    id: "log-9",
    timestamp: new Date(Date.now() - 540000),
    service: "database",
    level: "info",
    message: "Backup completed successfully",
    details: "Size: 1.2 GB",
  },
  {
    id: "log-10",
    timestamp: new Date(Date.now() - 600000),
    service: "auth",
    level: "info",
    message: "User logged in: teacher@university.edu",
    details: "IP: 192.168.1.100",
  },
];

// ========== REUSABLE COMPONENTS ==========

interface StatCardProps {
  label: string;
  value: number | string;
  valueColor?: string;
}

const StatCard = ({ label, value, valueColor = "text-foreground" }: StatCardProps) => (
  <div className={CLASSES.card}>
    <p className={CLASSES.statLabel}>{label}</p>
    <p className={`${CLASSES.statValue} ${valueColor}`}>{value}</p>
  </div>
);

interface FilterTagProps {
  label: string;
  onRemove: () => void;
}

const FilterTag = ({ label, onRemove }: FilterTagProps) => (
  <span className={CLASSES.filterTag}>
    {label}
    <button onClick={onRemove} className="hover:text-error">
      <X className="w-3 h-3" />
    </button>
  </span>
);

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => (
  <div className="bg-card border-2 border-border rounded-[20px] p-12 text-center">
    <Icon className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
    <h3 className="text-[18px] font-medium text-foreground mb-2">{title}</h3>
    <p className="text-[14px] text-muted-foreground">{description}</p>
  </div>
);

// ========== HELPERS ==========

const getUserName = (userId: string): string => {
  const users: Record<string, string> = {
    u1: "Иван Петров",
    u2: "Мария Сидорова",
    u3: "Admin",
    "webhook-system": "Webhook System",
    "retention-system": "Retention System",
    "limits-system": "Limits System",
    "flags-system": "Feature Flags System",
  };
  return users[userId] || "Unknown User";
};

interface StoredAuditLog {
  id: string;
  userId?: string;
  adminId?: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
}

// Initialize audit logs from localStorage
const getInitialAuditLogs = (): AuditLog[] => {
  const stored = localStorage.getItem("admin_audit_logs");
  if (stored) {
    const parsed: StoredAuditLog[] = JSON.parse(stored) as StoredAuditLog[];
    return parsed.map(
      (log): AuditLog => ({
        id: log.id,
        timestamp: new Date(log.timestamp),
        userId: log.userId || log.adminId || "unknown",
        userName: getUserName(log.userId || log.adminId || ""),
        action: log.action,
        resource: log.resource,
        details: log.details,
        ipAddress: "192.168.1." + Math.floor(Math.random() * 255),
      }),
    );
  }
  return [];
};

// ========== MAIN COMPONENT ==========

export default function AdminLogsPage() {
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(DEMO_SYSTEM_LOGS);
  const [auditLogs] = useState<AuditLog[]>(getInitialAuditLogs);
  const [activeTab, setActiveTab] = useState<"system" | "audit">("system");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterService, setFilterService] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh: add new demo logs
  useEffect(() => {
    const getRandomLogMessage = (): string => {
      const messages = [
        "Request processed successfully",
        "Cache miss for key: user-sessions",
        "Database query executed",
        "File processing started",
        "Background job completed",
        "API rate limit check passed",
        "Session expired and cleaned up",
        "Configuration reloaded",
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    };

    const interval = setInterval(() => {
      const newLog: SystemLog = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        service: SERVICES[Math.floor(Math.random() * SERVICES.length)],
        level: (["info", "warn", "error", "debug"] as const)[Math.floor(Math.random() * 4)],
        message: getRandomLogMessage(),
        details: "Auto-generated demo log",
      };

      setSystemLogs((prev) => [newLog, ...prev].slice(0, 50));
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getLevelBadge = (level: string) => {
    const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG];
    if (!config) return null;

    const Icon = config.icon;
    return (
      <span className={`${CLASSES.badge} ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Filtering logic
  const filteredSystemLogs = systemLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesService = filterService === "all" || log.service === filterService;
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;

    return matchesSearch && matchesService && matchesLevel;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const handleExport = () => {
    if (activeTab === "system") {
      exportToCsv(filteredSystemLogs, LOG_EXPORT_CONFIGS.system, "system-logs");
    } else {
      exportToCsv(filteredAuditLogs, LOG_EXPORT_CONFIGS.audit, "audit-logs");
    }
  };

  const stats = {
    system: {
      total: systemLogs.length,
      info: systemLogs.filter((l) => l.level === "info").length,
      warn: systemLogs.filter((l) => l.level === "warn").length,
      error: systemLogs.filter((l) => l.level === "error").length,
    },
    audit: {
      total: auditLogs.length,
      today: auditLogs.filter((l) => {
        const today = new Date();
        const logDate = new Date(l.timestamp);
        return logDate.toDateString() === today.toDateString();
      }).length,
    },
  };

  const hasActiveFilters = searchQuery || filterService !== "all" || filterLevel !== "all";

  return (
    <AppShell title={t("admin.logsPage.title")}>
      <Breadcrumbs items={[CRUMBS.adminOverview, { label: t("admin.logsPage.breadcrumbLogs") }]} />

      <PageHeader
        title={t("admin.logsPage.pageTitle")}
        subtitle={t("admin.logsPage.pageSubtitle")}
      />

      <div>
        {/* Header actions */}
        <div className="flex items-center justify-end gap-2 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-[8px] border-2 border-border">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <span className="text-[12px] text-muted-foreground">
              {lastUpdate.toLocaleTimeString("ru-RU")}
            </span>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors text-[14px] font-medium"
          >
            <Download className="w-4 h-4" />
            {t("admin.logsPage.exportCsv")}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("system")}
            className={`px-6 py-3 rounded-[12px] text-[14px] font-medium transition-colors ${
              activeTab === "system"
                ? "bg-brand-primary text-primary-foreground"
                : "bg-card border-2 border-border text-foreground hover:bg-muted"
            }`}
          >
            {t("admin.logsPage.tabSystemLogs")} ({stats.system.total})
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`px-6 py-3 rounded-[12px] text-[14px] font-medium transition-colors ${
              activeTab === "audit"
                ? "bg-brand-primary text-primary-foreground"
                : "bg-card border-2 border-border text-foreground hover:bg-muted"
            }`}
          >
            {t("admin.logsPage.tabAudit")} ({stats.audit.total})
          </button>
        </div>

        {/* Stats */}
        {activeTab === "system" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard label={t("admin.logsPage.statsTotal")} value={stats.system.total} />
            <StatCard label="Info" value={stats.system.info} valueColor="text-brand-primary" />
            <StatCard label="Warnings" value={stats.system.warn} valueColor="text-warning" />
            <StatCard label="Errors" value={stats.system.error} valueColor="text-error" />
          </div>
        )}

        {activeTab === "audit" && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatCard label={t("admin.logsPage.statsTotalRecords")} value={stats.audit.total} />
            <StatCard
              label={t("admin.logsPage.statsToday")}
              value={stats.audit.today}
              valueColor="text-brand-primary"
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-card border-2 border-border rounded-[20px] p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                {t("admin.logsPage.searchLabel")}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("admin.logsPage.searchPlaceholder")}
                  className={`${CLASSES.input} pl-11`}
                />
              </div>
            </div>

            {activeTab === "system" && (
              <>
                <div className="w-full md:w-[200px]">
                  <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {t("admin.logsPage.serviceLabel")}
                  </label>
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className={CLASSES.input}
                  >
                    <option value="all">{t("admin.logsPage.allServices")}</option>
                    {SERVICES.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full md:w-[200px]">
                  <label className="block text-[13px] font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                    {t("admin.logsPage.levelLabel")}
                  </label>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className={CLASSES.input}
                  >
                    <option value="all">{t("admin.logsPage.allLevels")}</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t-2 border-border">
              <span className="text-[13px] text-muted-foreground">
                {t("admin.logsPage.filtersLabel")}
              </span>
              {searchQuery && (
                <FilterTag label={`"${searchQuery}"`} onRemove={() => setSearchQuery("")} />
              )}
              {filterService !== "all" && (
                <FilterTag label={filterService} onRemove={() => setFilterService("all")} />
              )}
              {filterLevel !== "all" && (
                <FilterTag label={filterLevel} onRemove={() => setFilterLevel("all")} />
              )}
            </div>
          )}
        </div>

        {/* System Logs Table */}
        {activeTab === "system" && (
          <div className="bg-card border-2 border-border rounded-[20px] overflow-hidden">
            {filteredSystemLogs.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b-2 border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("admin.logsPage.headerTime")}
                      </th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("admin.logsPage.headerService")}
                      </th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("admin.logsPage.headerLevel")}
                      </th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("admin.logsPage.headerMessage")}
                      </th>
                      <th className="px-4 py-3 text-left text-[12px] font-medium text-muted-foreground uppercase tracking-wide">
                        {t("admin.logsPage.headerDetails")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSystemLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className={`border-b border-border ${index % 2 === 0 ? "bg-card" : "bg-surface-hover"}`}
                      >
                        <td className="px-4 py-3 text-[13px] text-muted-foreground whitespace-nowrap">
                          {log.timestamp.toLocaleString("ru-RU")}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-1 bg-muted text-foreground rounded-[6px] text-[12px] font-mono">
                            {log.service}
                          </span>
                        </td>
                        <td className="px-4 py-3">{getLevelBadge(log.level)}</td>
                        <td className="px-4 py-3 text-[13px] text-foreground">{log.message}</td>
                        <td className="px-4 py-3 text-[12px] text-muted-foreground">
                          {log.details || "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileSearch className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                <h3 className="text-[18px] font-medium text-foreground mb-2">
                  {t("admin.logsPage.noLogs")}
                </h3>
                <p className="text-[14px] text-muted-foreground">
                  {t("admin.logsPage.noLogsHint")}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Audit Logs Stream */}
        {activeTab === "audit" && (
          <div className="space-y-3">
            {filteredAuditLogs.length > 0 ? (
              filteredAuditLogs.map((log) => (
                <div key={log.id} className="bg-card border-2 border-border rounded-[16px] p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-info-light rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-brand-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-[15px] font-medium text-foreground">{log.userName}</h3>
                        <span className="inline-flex px-2 py-1 bg-muted text-muted-foreground rounded-[6px] text-[11px] font-mono">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-[13px] text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">{log.resource}</span>:{" "}
                        {log.details}
                      </p>
                      <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
                        <span>🕒 {log.timestamp.toLocaleString("ru-RU")}</span>
                        {log.ipAddress && <span>📍 IP: {log.ipAddress}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                icon={Activity}
                title={t("admin.logsPage.noAuditRecords")}
                description={
                  searchQuery
                    ? t("admin.logsPage.noAuditWithSearch")
                    : t("admin.logsPage.noAuditEmpty")
                }
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
