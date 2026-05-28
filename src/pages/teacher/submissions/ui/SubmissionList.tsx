import { FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card, EmptyState } from "@/shared/ui";

import type { SubmissionRow } from "../model/types";

import { StatusBadge } from "./StatusBadge";

interface SubmissionListProps {
  rows: SubmissionRow[];
  onSelect: (id: string) => void;
}

export function SubmissionList({ rows, onSelect }: SubmissionListProps) {
  const { t } = useTranslation();

  if (rows.length === 0) {
    return (
      <Card className="p-0 overflow-hidden">
        <EmptyState icon={FileText} message={t("teacher.submissions.emptyState")} />
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <SubmissionListItem key={row.sub.id} row={row} onSelect={onSelect} />
        ))}
      </div>
    </Card>
  );
}

function SubmissionListItem({
  row,
  onSelect,
}: {
  row: SubmissionRow;
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => onSelect(row.sub.id)}
      className="w-full text-left p-6 hover:bg-surface-hover transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-[17px] font-medium text-foreground">{row.studentName}</h3>
            <StatusBadge status={row.status} />
          </div>
          <p className="text-13 text-muted-foreground">
            {row.assignment?.title ?? t("teacher.submissions.unknownAssignment")}
          </p>
        </div>
        <div className="text-right shrink-0">
          {row.sub.submittedAt && (
            <p className="text-xs text-muted-foreground">
              {row.sub.submittedAt.toLocaleString("ru-RU", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            {t("teacher.submissions.filesLabel", { count: row.sub.files.length })}
          </p>
        </div>
      </div>
    </button>
  );
}
