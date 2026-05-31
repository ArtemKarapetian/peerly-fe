import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import type { AssignedReviewer, DistributionRow } from "../model/types";

import { OverallStatusBadge, ReviewerStatusDot } from "./StatusBadges";

interface DistributionTableProps {
  rows: DistributionRow[];
}

export function DistributionTable({ rows }: DistributionTableProps) {
  const { t } = useTranslation();
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <TableHeader>{t("teacher.distribution.work")}</TableHeader>
              <TableHeader>{t("teacher.distribution.author")}</TableHeader>
              <TableHeader>{t("teacher.distribution.assignedReviewers")}</TableHeader>
              <TableHeader>{t("common.status")}</TableHeader>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <DistributionTableRow key={row.submissionId} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wide">
      {children}
    </th>
  );
}

function DistributionTableRow({ row }: { row: DistributionRow }) {
  return (
    <tr>
      <td className="p-4 text-sm text-foreground font-mono">{row.anonymousId}</td>
      <td className="p-4 text-sm text-foreground">{row.authorName}</td>
      <td className="p-4">
        <ReviewersCell reviewers={row.assignedReviewers} />
      </td>
      <td className="p-4">
        <OverallStatusBadge status={row.overallStatus} />
      </td>
    </tr>
  );
}

function ReviewersCell({ reviewers }: { reviewers: AssignedReviewer[] }) {
  const { t } = useTranslation();
  if (reviewers.length === 0) {
    return (
      <span className="text-13 text-muted-foreground italic">
        {t("teacher.distribution.noReviewers")}
      </span>
    );
  }
  return (
    <ul className="space-y-1">
      {reviewers.map((r) => (
        <li key={r.id} className="flex items-center gap-2 text-13">
          <ReviewerStatusDot status={r.status} />
          <span className="text-foreground">{r.name}</span>
          <span className="text-muted-foreground">
            ({t(`teacher.distribution.reviewerStatus.${r.status}`)})
          </span>
        </li>
      ))}
    </ul>
  );
}
