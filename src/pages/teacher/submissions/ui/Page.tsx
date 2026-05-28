import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { storageApi } from "@/entities/storage";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { computeRows } from "../lib/computeRows";
import type { StatusFilter, SubmissionsRawData } from "../model/types";

import { SubmissionDetail } from "./SubmissionDetail";
import { SubmissionFilters } from "./SubmissionFilters";
import { SubmissionList } from "./SubmissionList";

export default function TeacherSubmissionsPage() {
  const { t } = useTranslation();
  const { data, isLoading, error, refetch } = useAsync(
    async () => {
      const [users, assignments, submissions] = await Promise.all([
        userRepo.getAll(),
        assignmentRepo.getAll(),
        workRepo.getAll(),
      ]);
      return { users, assignments, submissions };
    },
    [],
    { onError: "redirect" },
  );

  if (isLoading)
    return (
      <AppShell title={t("teacher.submissions.title")}>
        <PageSkeleton />
      </AppShell>
    );
  if (error)
    return (
      <AppShell title={t("teacher.submissions.title")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );

  return <SubmissionsContent data={data!} />;
}

function SubmissionsContent({ data }: { data: SubmissionsRawData }) {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const filterAssignment = params.get("assignmentId") ?? "all";
  const filterStatus = (params.get("status") ?? "all") as StatusFilter;
  const searchStudent = params.get("search") ?? "";
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const updateParam = (key: string, value: string, fallback = "all") => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value || value === fallback) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const resetFilters = () => {
    updateParam("assignmentId", "all");
    updateParam("status", "all");
    updateParam("search", "", "");
  };

  const rows = useMemo(
    () => computeRows({ data, unknownStudentLabel: t("teacher.submissions.unknownStudent") }),
    [data, t],
  );

  const filtered = rows.filter((r) => {
    if (filterAssignment !== "all" && r.sub.assignmentId !== filterAssignment) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (searchStudent && !r.studentName.toLowerCase().includes(searchStudent.toLowerCase())) {
      return false;
    }
    return true;
  });

  const selected = filtered.find((r) => r.sub.id === selectedId) ?? null;

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const url = await storageApi.getDownloadUrl(fileId);
      storageApi.triggerDownload(url, fileName);
    } catch (e) {
      console.error("Failed to download file", e);
    }
  };

  return (
    <AppShell title={t("teacher.submissions.title")}>
      <Breadcrumbs items={[{ label: t("teacher.submissions.breadcrumb") }]} />
      <PageHeader
        title={t("teacher.submissions.title")}
        subtitle={t("teacher.submissions.subtitle")}
      />

      <SubmissionFilters
        assignments={data.assignments}
        filterAssignment={filterAssignment}
        filterStatus={filterStatus}
        searchStudent={searchStudent}
        resultsCount={filtered.length}
        onAssignmentChange={(v) => updateParam("assignmentId", v)}
        onStatusChange={(v) => updateParam("status", v)}
        onSearchChange={(v) => updateParam("search", v, "")}
        onReset={resetFilters}
      />

      <SubmissionList rows={filtered} onSelect={setSelectedId} />

      {selected && (
        <SubmissionDetail
          row={selected}
          onClose={() => setSelectedId(null)}
          onDownload={handleDownload}
        />
      )}
    </AppShell>
  );
}
