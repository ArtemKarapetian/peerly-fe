import { Download, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, EmptyState } from "@/shared/ui";

import { truncate } from "../lib/computeAnalytics";
import type { GradebookEntry } from "../model/types";

function ScoreBadge({ value }: { value: number }) {
  const tone =
    value >= 4
      ? "bg-success-light text-success"
      : value >= 3
        ? "bg-warning-light text-warning"
        : "bg-destructive-light text-destructive";
  return (
    <span
      className={`inline-flex items-center justify-center w-12 h-8 rounded-2sm text-sm font-medium ${tone}`}
    >
      {value.toFixed(1)}
    </span>
  );
}

function FinalScoreBadge({ value }: { value: number }) {
  const tone =
    value >= 4
      ? "bg-success text-primary-foreground"
      : value >= 3
        ? "bg-warning text-primary-foreground"
        : "bg-destructive text-primary-foreground";
  return (
    <span
      className={`inline-flex items-center justify-center w-14 h-9 rounded-sm text-15 font-medium ${tone}`}
    >
      {value.toFixed(1)}
    </span>
  );
}

interface GradebookCardProps {
  assignments: { id: string; title: string }[];
  gradebook: GradebookEntry[];
  canExport: boolean;
  onExport: () => void;
}

export function GradebookCard({ assignments, gradebook, canExport, onExport }: GradebookCardProps) {
  const { t } = useTranslation();
  const isEmpty = gradebook.length === 0 || assignments.length === 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-lg font-medium text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-primary" />
          {t("teacher.analytics.gradebook")}
        </h2>
        <button
          onClick={onExport}
          disabled={!canExport}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4" />
          {t("teacher.analytics.exportCSV")}
        </button>
      </div>

      {isEmpty ? (
        <EmptyState icon={FileText} message={t("teacher.analytics.selectCourseWithData")} />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="text-left p-3 text-13 font-medium text-muted-foreground uppercase tracking-wide sticky left-0 bg-card">
                  {t("teacher.analytics.studentHeader")}
                </th>
                {assignments.map((a) => (
                  <th
                    key={a.id}
                    className="text-center p-3 text-13 font-medium text-muted-foreground uppercase tracking-wide min-w-[100px]"
                    title={a.title}
                  >
                    {truncate(a.title, 15)}
                  </th>
                ))}
                <th className="text-center p-3 text-13 font-medium text-muted-foreground uppercase tracking-wide bg-muted min-w-[100px]">
                  {t("teacher.analytics.finalGrade")}
                </th>
              </tr>
            </thead>
            <tbody>
              {gradebook.map((entry, index) => (
                <tr
                  key={entry.studentId}
                  className={`border-b border-border ${index % 2 === 0 ? "bg-card" : "bg-muted"}`}
                >
                  <td className="p-3 text-sm text-foreground font-medium sticky left-0 bg-inherit">
                    {entry.studentName}
                  </td>
                  {assignments.map((a) => {
                    const score = entry.scores[a.id];
                    return (
                      <td key={a.id} className="p-3 text-center">
                        {score !== null ? (
                          <ScoreBadge value={score} />
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="p-3 text-center bg-muted">
                    {entry.finalScore !== null ? (
                      <FinalScoreBadge value={entry.finalScore} />
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
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
