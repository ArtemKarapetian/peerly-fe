import { useTranslation } from "react-i18next";

import type { GradeEntry } from "./GradeTable.types";
import { ScoreCell } from "./ScoreCell";

interface GradeTableDesktopProps {
  grades: GradeEntry[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onRowClick: (grade: GradeEntry) => void;
}

export function GradeTableDesktop({
  grades,
  statusLabels,
  statusColors,
  onRowClick,
}: GradeTableDesktopProps) {
  const { t } = useTranslation();
  return (
    <div className="hidden tablet:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-muted border-b-2 border-border">
            <TableHeader>{t("widget.gradeTable.course")}</TableHeader>
            <TableHeader>{t("widget.gradeTable.assignment")}</TableHeader>
            <TableHeader>{t("widget.gradeTable.status")}</TableHeader>
            <TableHeader align="right">{t("widget.gradeTable.grade")}</TableHeader>
            <TableHeader align="right">{t("widget.gradeTable.max")}</TableHeader>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <GradeRow
              key={grade.id}
              grade={grade}
              statusLabel={statusLabels[grade.status]}
              statusColor={statusColors[grade.status]}
              onClick={() => onRowClick(grade)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableHeader({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`text-${align} px-4 desktop:px-6 py-4 text-13 font-medium text-muted-foreground uppercase tracking-wide`}
    >
      {children}
    </th>
  );
}

function GradeRow({
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
  return (
    <tr
      onClick={onClick}
      className="border-b border-border hover:bg-surface-hover cursor-pointer transition-colors group"
    >
      <td className="px-4 desktop:px-6 py-4">
        <div className="text-sm text-foreground font-medium group-hover:text-brand-primary transition-colors">
          {grade.courseName}
        </div>
      </td>
      <td className="px-4 desktop:px-6 py-4">
        <div className="text-sm text-foreground">{grade.taskTitle}</div>
      </td>
      <td className="px-4 desktop:px-6 py-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-2sm text-13 font-medium ${statusColor}`}
        >
          {statusLabel}
        </span>
      </td>
      <td className="px-4 desktop:px-6 py-4 text-right">
        <ScoreCell
          score={grade.score}
          maxScore={grade.maxScore}
          isScoreLocked={grade.isScoreLocked}
          withTooltip
        />
      </td>
      <td className="px-4 desktop:px-6 py-4 text-right">
        <span className="text-sm text-muted-foreground">{grade.maxScore}</span>
      </td>
    </tr>
  );
}
