import type { GradebookEntry } from "../model/types";

interface ExportArgs {
  courseTitle: string;
  assignments: { id: string; title: string }[];
  gradebook: GradebookEntry[];
  studentHeader: string;
  finalGradeHeader: string;
}

export function exportGradebookCsv({
  courseTitle,
  assignments,
  gradebook,
  studentHeader,
  finalGradeHeader,
}: ExportArgs): void {
  const headers = [studentHeader, ...assignments.map((a) => a.title), finalGradeHeader];
  const rows = gradebook.map((entry) => [
    entry.studentName,
    ...assignments.map((a) => entry.scores[a.id]?.toString() ?? "—"),
    entry.finalScore?.toString() ?? "—",
  ]);
  const csv = [headers, ...rows]
    .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `gradebook_${courseTitle}_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
