import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";
import { SimplePagination, usePagination } from "@/shared/ui/simple-pagination";

import { courseRepo } from "@/entities/course";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { filterCourses } from "../lib/filterCourses";
import type { CourseRow, StatusFilter } from "../model/types";

import { CoursesEmptyState } from "./CoursesEmptyState";
import { CoursesFiltersRow } from "./CoursesFiltersRow";
import { CoursesHeroCard } from "./CoursesHeroCard";
import { CoursesTable } from "./CoursesTable";

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useAsync(() => courseRepo.getAll(), [], { onError: "redirect" });

  const handleOpenCourse = useCallback(
    (courseId: string) => void navigate(`/teacher/courses/${courseId}`),
    [navigate],
  );

  if (isLoading)
    return (
      <AppShell title={t("teacher.courses.management")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.courses.management")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  const allRows: CourseRow[] = (courses ?? []).map((c) => ({
    id: c.id,
    name: c.title,
    status: c.status,
  }));
  const activeCount = allRows.filter((c) => c.status === "active").length;
  const filteredRows = filterCourses(allRows, statusFilter, searchQuery);

  return (
    <AppShell title={t("teacher.courses.management")}>
      <Breadcrumbs items={[{ label: t("teacher.courses.title") }]} />

      <div className="mt-6">
        <CoursesHeroCard total={allRows.length} active={activeCount} />

        <CoursesFiltersRow
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          resultsCount={filteredRows.length}
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />

        {filteredRows.length > 0 ? (
          <PaginatedCoursesTable rows={filteredRows} onOpen={handleOpenCourse} />
        ) : (
          <CoursesEmptyState isSearching={Boolean(searchQuery)} />
        )}
      </div>
    </AppShell>
  );
}

function PaginatedCoursesTable({
  rows,
  onOpen,
}: {
  rows: CourseRow[];
  onOpen: (id: string) => void;
}) {
  const { currentPage, totalPages, pageSize, setPageSize, handlePageChange } = usePagination(
    rows,
    10,
  );
  const pageRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <>
      <CoursesTable rows={pageRows} onOpen={onOpen} />
      <div className="mt-4">
        <SimplePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      </div>
    </>
  );
}
