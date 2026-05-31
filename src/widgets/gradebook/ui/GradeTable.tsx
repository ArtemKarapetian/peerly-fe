import { Card } from "@/shared/ui";

import { EmptyGradesView } from "./EmptyGradesView";
import type { GradeEntry } from "./GradeTable.types";
import { GradeTableDesktop } from "./GradeTableDesktop";
import { GradeTableMobile } from "./GradeTableMobile";

export type { GradeEntry } from "./GradeTable.types";

interface GradeTableProps {
  grades: GradeEntry[];
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
  onRowClick: (grade: GradeEntry) => void;
}

export function GradeTable({ grades, statusLabels, statusColors, onRowClick }: GradeTableProps) {
  if (grades.length === 0) return <EmptyGradesView />;

  return (
    <Card className="p-0 overflow-hidden">
      <GradeTableDesktop
        grades={grades}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onRowClick={onRowClick}
      />
      <GradeTableMobile
        grades={grades}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onRowClick={onRowClick}
      />
    </Card>
  );
}
