import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getScoreColor } from "../lib/scoreColor";

import type { GradeEntry } from "./GradeTable.types";

interface GradeTableMobileProps {
  grades: GradeEntry[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onRowClick: (grade: GradeEntry) => void;
}

export function GradeTableMobile({
  grades,
  statusLabels,
  statusColors,
  onRowClick,
}: GradeTableMobileProps) {
  return (
    <div className="tablet:hidden divide-y-2 divide-border">
      {grades.map((grade) => (
        <MobileGradeCard
          key={grade.id}
          grade={grade}
          statusLabel={statusLabels[grade.status] ?? ""}
          statusColor={statusColors[grade.status] ?? ""}
          onClick={() => onRowClick(grade)}
        />
      ))}
    </div>
  );
}

function MobileGradeCard({
  grade,
  statusLabel,
  statusColor,
  onClick,
}: {
  grade: GradeEntry;
  statusLabel: string;
  statusColor: string;
  onClick: () => void;
}) {
  const { t } = useTranslation();
  return (
    <div onClick={onClick} className="p-3 hover:bg-surface-hover cursor-pointer transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="text-13 text-muted-foreground mb-1">{grade.courseName}</div>
          <div className="text-15 text-foreground font-medium">{grade.taskTitle}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <MobileScore grade={grade} />
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-2sm text-xs font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {grade.isScoreLocked && (
        <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground bg-muted rounded-sm p-2.5">
          <Lock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{t("widget.gradeTable.lockedTooltip")}</span>
        </div>
      )}
    </div>
  );
}

function MobileScore({ grade }: { grade: GradeEntry }) {
  if (grade.isScoreLocked) {
    return (
      <div className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">—</span>
      </div>
    );
  }
  if (grade.score === null) {
    return <span className="text-sm text-muted-foreground">— / {grade.maxScore}</span>;
  }
  return (
    <span className={`text-base font-semibold ${getScoreColor(grade.score, grade.maxScore)}`}>
      {grade.score} / {grade.maxScore}
    </span>
  );
}
