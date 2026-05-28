import type { CourseRow, StatusFilter } from "../model/types";

export function filterCourses(
  rows: CourseRow[],
  statusFilter: StatusFilter,
  searchQuery: string,
): CourseRow[] {
  const query = searchQuery.trim().toLowerCase();
  return rows.filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    if (query && !row.name.toLowerCase().includes(query)) return false;
    return true;
  });
}
