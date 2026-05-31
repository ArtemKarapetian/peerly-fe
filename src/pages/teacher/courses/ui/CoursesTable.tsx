import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Card } from "@/shared/ui";

import type { CourseRow } from "../model/types";

import { CourseStatusBadge } from "./CourseStatusBadge";

interface CoursesTableProps {
  rows: CourseRow[];
  onOpen: (id: string) => void;
}

export function CoursesTable({ rows, onOpen }: CoursesTableProps) {
  const { t } = useTranslation();
  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col />
            <col className="w-[105px]" />
            <col className="w-[48px]" />
          </colgroup>
          <thead>
            <tr className="border-b-2 border-border bg-surface-hover">
              <TableHeader>{t("common.course")}</TableHeader>
              <TableHeader>{t("common.status")}</TableHeader>
              <th className="py-3 w-[48px]" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <CoursesTableRow key={row.id} row={row} onOpen={onOpen} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-5 py-3 text-2xs font-semibold text-muted-foreground uppercase tracking-[0.5px]">
      {children}
    </th>
  );
}

function CoursesTableRow({ row, onOpen }: { row: CourseRow; onOpen: (id: string) => void }) {
  const { t } = useTranslation();
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen(row.id);
    }
  };

  return (
    <tr
      className="hover:bg-brand-primary-lighter transition-colors duration-150 cursor-pointer group"
      onClick={() => onOpen(row.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t("teacher.courses.openCourse", { name: row.name })}
    >
      <td className="px-5 py-4">
        <p className="text-sm font-semibold text-foreground tracking-[-0.2px] leading-snug">
          {row.name}
        </p>
      </td>
      <td className="px-5 py-4">
        <CourseStatusBadge status={row.status} />
      </td>
      <td className="pr-4 py-4 w-[48px]">
        <ChevronRight
          aria-hidden="true"
          className="w-4 h-4 text-muted-foreground opacity-20 group-hover:opacity-50 transition-opacity duration-150 ml-auto"
        />
      </td>
    </tr>
  );
}
