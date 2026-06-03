import { Activity, AlertTriangle, ClipboardCheck, FileText, TrendingUp, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { OverallMetrics } from "../model/types";

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}

function MetricCard({ icon, label, value, hint }: MetricCardProps) {
  return (
    <div className="bg-card border-2 border-border rounded-md p-4" title={hint}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-[22px] font-medium text-foreground">{value}</p>
    </div>
  );
}

interface OverallMetricsRowProps {
  overall: OverallMetrics;
  studentCount: number;
}

export function OverallMetricsRow({ overall, studentCount }: OverallMetricsRowProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <MetricCard
        icon={<FileText className="w-4 h-4 text-brand-primary" />}
        label={t("teacher.analytics.assignmentsCount")}
        value={String(overall.totalAssignments)}
      />
      <MetricCard
        icon={<Users className="w-4 h-4 text-brand-primary" />}
        label={t("teacher.analytics.studentsCount")}
        value={String(studentCount)}
      />
      <MetricCard
        icon={<TrendingUp className="w-4 h-4 text-brand-primary" />}
        label={t("teacher.analytics.avgScore")}
        value={overall.avgScore > 0 ? overall.avgScore.toFixed(1) : "—"}
      />
      <MetricCard
        icon={<AlertTriangle className="w-4 h-4 text-warning" />}
        label={t("teacher.analytics.avgDiscrepancy")}
        value={overall.avgDiscrepancy > 0 ? `±${overall.avgDiscrepancy.toFixed(2)}` : "—"}
        hint={t("teacher.analytics.discrepancyHint")}
      />
      <MetricCard
        icon={<Activity className="w-4 h-4 text-success" />}
        label={t("teacher.analytics.submissionRate")}
        value={`${Math.round(overall.avgSubmissionRate)}%`}
      />
      <MetricCard
        icon={<ClipboardCheck className="w-4 h-4 text-success" />}
        label={t("teacher.analytics.reviewCompletion")}
        value={`${Math.round(overall.avgReviewCompletionRate)}%`}
      />
    </div>
  );
}
