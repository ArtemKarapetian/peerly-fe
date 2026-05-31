import { AlertTriangle, BarChart3 } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/shared/ui";

import type { AssignmentMetrics } from "../model/types";

interface ChartCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}

function ChartCard({ icon, title, children }: ChartCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-medium text-foreground">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground text-center px-6">
      {label}
    </div>
  );
}

const CHART_TOOLTIP_STYLE = {
  backgroundColor: "var(--card)",
  border: "2px solid var(--border)",
  borderRadius: "8px",
};

const X_AXIS_PROPS = {
  dataKey: "name",
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  angle: -30,
  textAnchor: "end" as const,
  height: 70,
};

const Y_AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 12 };

interface ChartsRowProps {
  metrics: AssignmentMetrics[];
}

export function ChartsRow({ metrics }: ChartsRowProps) {
  const { t } = useTranslation();

  const activityData = metrics.map((m) => ({
    name: m.shortTitle,
    [t("teacher.analytics.submissionsSubmitted")]: Math.round(m.submissionRate),
    [t("teacher.analytics.reviewsCompleted")]: Math.round(m.reviewCompletionRate),
  }));

  const discrepancyData = metrics
    .filter((m) => m.hasDiscrepancyData)
    .map((m) => ({
      name: m.shortTitle,
      [t("teacher.analytics.discrepancyShort")]: Math.round(m.avgDiscrepancy * 10) / 10,
    }));

  return (
    <div className="grid lg:grid-cols-2 gap-6 mb-6">
      <ChartCard
        icon={<BarChart3 className="w-5 h-5 text-brand-primary" />}
        title={t("teacher.analytics.activityByAssignment")}
      >
        {activityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis {...X_AXIS_PROPS} />
              <YAxis tick={Y_AXIS_TICK} domain={[0, 100]} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar
                dataKey={t("teacher.analytics.submissionsSubmitted")}
                fill="var(--brand-primary)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey={t("teacher.analytics.reviewsCompleted")}
                fill="var(--success)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label={t("teacher.analytics.noDataToDisplay")} />
        )}
      </ChartCard>

      <ChartCard
        icon={<AlertTriangle className="w-5 h-5 text-warning" />}
        title={t("teacher.analytics.discrepancyByAssignment")}
      >
        {discrepancyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={discrepancyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis {...X_AXIS_PROPS} />
              <YAxis tick={Y_AXIS_TICK} />
              <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
              <Bar
                dataKey={t("teacher.analytics.discrepancyShort")}
                fill="var(--warning)"
                radius={[6, 6, 0, 0]}
              >
                {discrepancyData.map((_, i) => (
                  <Cell key={i} fill="var(--warning)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart label={t("teacher.analytics.noDiscrepancyData")} />
        )}
      </ChartCard>
    </div>
  );
}
