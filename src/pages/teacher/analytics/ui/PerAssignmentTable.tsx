import { useTranslation } from "react-i18next";

import { Card, SectionHeader } from "@/shared/ui";

import type { AssignmentMetrics } from "../model/types";

interface PerAssignmentTableProps {
  metrics: AssignmentMetrics[];
}

export function PerAssignmentTable({ metrics }: PerAssignmentTableProps) {
  const { t } = useTranslation();

  return (
    <Card className="mb-6">
      <SectionHeader>{t("teacher.analytics.perAssignment")}</SectionHeader>
      {metrics.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          {t("teacher.analytics.noAssignmentsYet")}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide border-b-2 border-border">
                <th className="p-3">{t("teacher.analytics.assignmentLabel")}</th>
                <th className="p-3 text-right">{t("teacher.analytics.submissionRate")}</th>
                <th className="p-3 text-right">{t("teacher.analytics.reviewCompletion")}</th>
                <th className="p-3 text-right">{t("teacher.analytics.avgScore")}</th>
                <th className="p-3 text-right">{t("teacher.analytics.avgDiscrepancy")}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr
                  key={m.id}
                  className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted"}`}
                >
                  <td className="p-3 text-foreground">{m.title}</td>
                  <td className="p-3 text-right text-foreground">
                    {Math.round(m.submissionRate)}%
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {Math.round(m.reviewCompletionRate)}%
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {m.avgScore > 0 ? m.avgScore.toFixed(2) : "—"}
                  </td>
                  <td className="p-3 text-right text-foreground">
                    {m.hasDiscrepancyData ? `±${m.avgDiscrepancy.toFixed(2)}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
