import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Bell,
  Activity,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/shared/ui/button.tsx";
import { Input } from "@/shared/ui/input.tsx";

import { PublicLayout } from "@/widgets/public-layout";

/**
 * StatusPage - System Status & Incidents
 *
 * Features:
 * - System status indicator (demo toggle)
 * - Incidents list with expand/collapse
 * - Subscribe to updates (demo)
 */

type SystemStatus = "operational" | "degraded" | "outage";
type IncidentStatus = "investigating" | "monitoring" | "resolved";

interface Incident {
  id: string;
  titleKey: string;
  status: IncidentStatus;
  severity: "low" | "medium" | "high";
  startTime: string;
  endTime?: string;
  summaryKey: string;
  updates: {
    time: string;
    status: IncidentStatus;
    messageKey: string;
  }[];
}

// Mock incidents data
const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc-001",
    titleKey: "page.status.incident1Title",
    status: "resolved",
    severity: "low",
    startTime: "2026-01-25T09:00:00Z",
    endTime: "2026-01-25T09:00:00Z",
    summaryKey: "page.status.incident1Summary",
    updates: [
      {
        time: "2026-01-25T09:00:00Z",
        status: "resolved",
        messageKey: "page.status.incident1Update1",
      },
    ],
  },
  {
    id: "inc-002",
    titleKey: "page.status.incident2Title",
    status: "resolved",
    severity: "medium",
    startTime: "2026-01-24T14:30:00Z",
    endTime: "2026-01-24T16:45:00Z",
    summaryKey: "page.status.incident2Summary",
    updates: [
      {
        time: "2026-01-24T16:45:00Z",
        status: "resolved",
        messageKey: "page.status.incident2Update1",
      },
      {
        time: "2026-01-24T15:20:00Z",
        status: "monitoring",
        messageKey: "page.status.incident2Update2",
      },
      {
        time: "2026-01-24T14:30:00Z",
        status: "investigating",
        messageKey: "page.status.incident2Update3",
      },
    ],
  },
  {
    id: "inc-003",
    titleKey: "page.status.incident3Title",
    status: "resolved",
    severity: "high",
    startTime: "2026-01-23T08:15:00Z",
    endTime: "2026-01-23T09:30:00Z",
    summaryKey: "page.status.incident3Summary",
    updates: [
      {
        time: "2026-01-23T09:30:00Z",
        status: "resolved",
        messageKey: "page.status.incident3Update1",
      },
      {
        time: "2026-01-23T08:45:00Z",
        status: "monitoring",
        messageKey: "page.status.incident3Update2",
      },
      {
        time: "2026-01-23T08:15:00Z",
        status: "investigating",
        messageKey: "page.status.incident3Update3",
      },
    ],
  },
  {
    id: "inc-004",
    titleKey: "page.status.incident4Title",
    status: "resolved",
    severity: "low",
    startTime: "2026-01-20T02:00:00Z",
    endTime: "2026-01-20T04:00:00Z",
    summaryKey: "page.status.incident4Summary",
    updates: [
      {
        time: "2026-01-20T04:00:00Z",
        status: "resolved",
        messageKey: "page.status.incident4Update1",
      },
      {
        time: "2026-01-20T02:00:00Z",
        status: "monitoring",
        messageKey: "page.status.incident4Update2",
      },
    ],
  },
  {
    id: "inc-005",
    titleKey: "page.status.incident5Title",
    status: "resolved",
    severity: "medium",
    startTime: "2026-01-18T11:20:00Z",
    endTime: "2026-01-18T13:10:00Z",
    summaryKey: "page.status.incident5Summary",
    updates: [
      {
        time: "2026-01-18T13:10:00Z",
        status: "resolved",
        messageKey: "page.status.incident5Update1",
      },
      {
        time: "2026-01-18T11:20:00Z",
        status: "investigating",
        messageKey: "page.status.incident5Update2",
      },
    ],
  },
];

export default function StatusPage() {
  const { t } = useTranslation();
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("operational");
  const [expandedIncidents, setExpandedIncidents] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
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
    const statuses: SystemStatus[] = ["operational", "degraded", "outage"];
    const currentIndex = statuses.indexOf(systemStatus);
    const nextIndex = (currentIndex + 1) % statuses.length;
    setSystemStatus(statuses[nextIndex]);
  };

  // Get status config
  const getStatusConfig = useMemo(
    () => (status: SystemStatus) => {
      switch (status) {
        case "operational":
          return {
            label: t("page.status.operational"),
            desc: t("page.status.operationalDesc"),
            icon: CheckCircle2,
            color: "text-success",
            bg: "bg-success-light",
            border: "border-green-200",
            dotColor: "bg-success-light0",
          };
        case "degraded":
          return {
            label: t("page.status.degraded"),
            desc: t("page.status.degradedDesc"),
            icon: AlertTriangle,
            color: "text-warning",
            bg: "bg-warning-light",
            border: "border-yellow-200",
            dotColor: "bg-warning-light0",
          };
        case "outage":
          return {
            label: t("page.status.outage"),
            desc: t("page.status.outageDesc"),
            icon: AlertCircle,
            color: "text-error",
            bg: "bg-error-light",
            border: "border-red-200",
            dotColor: "bg-error-light0",
          };
      }
    },
    [t],
  );

  // Get incident status config
  const getIncidentStatusConfig = useMemo(
    () => (status: IncidentStatus) => {
      switch (status) {
        case "investigating":
          return {
            label: t("page.status.investigating"),
            color: "text-error",
            bg: "bg-error-light",
            border: "border-red-300",
          };
        case "monitoring":
          return {
            label: t("page.status.monitoring"),
            color: "text-warning",
            bg: "bg-warning-light",
            border: "border-yellow-300",
          };
        case "resolved":
          return {
            label: t("page.status.resolved"),
            color: "text-success",
            bg: "bg-success-light",
            border: "border-green-300",
          };
      }
    },
    [t],
  );

  // Format time
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
    toast.success(t("page.status.subscribeSuccess"), {
      description: t("page.status.subscribeSuccessDesc", { email }),
    });
    setEmail("");
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
              <div className="w-12 h-12 bg-brand-primary-lighter text-brand-primary rounded-xl flex items-center justify-center">
                <Activity className="size-6 text-primary" />
              </div>
              <h1 className="text-[32px] tablet:text-[40px] font-medium text-foreground tracking-[-0.5px]">
                {t("page.status.title")}
              </h1>
            </div>
            <p className="text-[15px] text-muted-foreground">{t("page.status.subtitle")}</p>
          </div>

          {/* System Status Card */}
          <div
            className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl p-6 mb-8 cursor-pointer transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]`}
            onClick={cycleStatus}
            title={t("page.status.clickToToggle")}
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <StatusIcon className={`size-10 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`size-3 ${statusConfig.dotColor} rounded-full animate-pulse`} />
                  <h2 className="text-[24px] font-medium text-foreground">{statusConfig.label}</h2>
                </div>
                <p className="text-[15px] text-muted-foreground">{statusConfig.desc}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {t("page.status.updatedAt")}{" "}
                {new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
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
                  {t("page.status.subscribeTitle")}
                </h3>
                <p className="text-[15px] text-muted-foreground mb-4">
                  {t("page.status.subscribeDesc")}
                </p>
                <div className="flex gap-3 max-w-[500px]">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setEmailTouched(true)}
                      placeholder="your.email@university.edu"
                      error={
                        emailTouched && !isEmailValid() && email
                          ? t("page.status.invalidEmail")
                          : ""
                      }
                    />
                  </div>
                  <Button
                    variant="primary"
                    onClick={handleSubscribe}
                    disabled={!email || (emailTouched && !isEmailValid())}
                  >
                    {t("page.status.subscribe")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("page.status.demoNote")}</p>
              </div>
            </div>
          </div>

          {/* Incidents Section */}
          <div className="mb-8">
            <h2 className="text-[24px] font-medium text-foreground mb-4">
              {t("page.status.incidentsTitle")}
            </h2>
            <p className="text-[15px] text-muted-foreground mb-6">
              {t("page.status.incidentsSubtitle")}
            </p>

            <div className="space-y-4">
              {MOCK_INCIDENTS.map((incident) => {
                const isExpanded = expandedIncidents.has(incident.id);
                const incidentStatusConfig = getIncidentStatusConfig(incident.status);

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
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${incidentStatusConfig.bg} ${incidentStatusConfig.color} ${incidentStatusConfig.border} border`}
                          >
                            {incidentStatusConfig.label}
                          </span>
                          <h3 className="text-[17px] font-medium text-foreground">
                            {t(incident.titleKey)}
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
                            {t(incident.summaryKey)}
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
                          {t(incident.summaryKey)}
                        </p>

                        {/* Updates Timeline */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-medium text-foreground uppercase tracking-wide">
                            {t("page.status.updates")}
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
                                      {t(update.messageKey)}
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
              {t("page.status.footerNote")}{" "}
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
