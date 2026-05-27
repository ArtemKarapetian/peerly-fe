import { CheckCircle, Clock, Download, FileText, Filter, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { Card, Select } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { storageApi } from "@/entities/storage";
import { userRepo } from "@/entities/user";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

type StatusFilter = "all" | "draft" | "submitted" | "late";

function isLate(submittedAt: Date | undefined, deadline: Date | undefined): boolean {
  if (!submittedAt || !deadline) return false;
  return submittedAt.getTime() > deadline.getTime();
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

interface ContentData {
  users: Awaited<ReturnType<typeof userRepo.getAll>>;
  assignments: Awaited<ReturnType<typeof assignmentRepo.getAll>>;
  submissions: Awaited<ReturnType<typeof workRepo.getAll>>;
}

function SubmissionsContent({ data }: { data: ContentData }) {
  const { t } = useTranslation();
  const { users, assignments, submissions } = data;
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
  const setFilterAssignment = (v: string) => updateParam("assignmentId", v);
  const setFilterStatus = (v: StatusFilter) => updateParam("status", v);
  const setSearchStudent = (v: string) => updateParam("search", v, "");

  const rows = useMemo(() => {
    return submissions.map((sub) => {
      const assignment = assignments.find((a) => a.id === sub.assignmentId);
      const student = users.find((u) => u.id === sub.studentId);
      const late = isLate(sub.submittedAt, assignment?.dueDate);
      const status: Exclude<StatusFilter, "all"> =
        sub.status === "draft" ? "draft" : late ? "late" : "submitted";
      return {
        sub,
        assignment,
        studentName: student?.name ?? sub.studentName ?? t("teacher.submissions.unknownStudent"),
        status,
      };
    });
  }, [submissions, assignments, users, t]);

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

  const statusBadge = (status: Exclude<StatusFilter, "all">) => {
    if (status === "submitted") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-light text-success rounded-2sm text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          {t("teacher.submissions.submitted")}
        </span>
      );
    }
    if (status === "late") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-warning-light text-warning rounded-2sm text-xs font-medium">
          <Clock className="w-3 h-3" />
          {t("teacher.submissions.late")}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-2sm text-xs font-medium">
        <FileText className="w-3 h-3" />
        {t("teacher.submissions.draft")}
      </span>
    );
  };

  const filtersDirty =
    filterAssignment !== "all" || filterStatus !== "all" || searchStudent.length > 0;

  return (
    <AppShell title={t("teacher.submissions.title")}>
      <Breadcrumbs items={[{ label: t("teacher.submissions.breadcrumb") }]} />
      <PageHeader
        title={t("teacher.submissions.title")}
        subtitle={t("teacher.submissions.subtitle")}
      />

      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-base font-medium text-foreground">{t("common.filters")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-13 font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("common.assignments")}
            </label>
            <Select value={filterAssignment} onChange={(e) => setFilterAssignment(e.target.value)}>
              <option value="all">{t("teacher.submissions.allAssignments")}</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-13 font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("common.status")}
            </label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as StatusFilter)}
            >
              <option value="all">{t("teacher.submissions.allStatuses")}</option>
              <option value="submitted">{t("teacher.submissions.submitted")}</option>
              <option value="late">{t("teacher.submissions.late")}</option>
              <option value="draft">{t("teacher.submissions.draft")}</option>
            </Select>
          </div>

          <div>
            <label className="block text-13 font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              {t("teacher.submissions.studentSearch")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder={t("teacher.submissions.studentNamePlaceholder")}
                className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-md text-15 focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("teacher.submissions.foundSubmissions")}{" "}
            <strong className="text-foreground">{filtered.length}</strong>
          </p>
          {filtersDirty && (
            <button
              onClick={() => {
                setFilterAssignment("all");
                setFilterStatus("all");
                setSearchStudent("");
              }}
              className="flex items-center gap-2 px-3 py-2 text-brand-primary hover:bg-info-light rounded-sm text-sm"
            >
              <X className="w-4 h-4" />
              {t("teacher.submissions.resetFilters")}
            </button>
          )}
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-15 text-muted-foreground">{t("teacher.submissions.emptyState")}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((row) => (
              <button
                key={row.sub.id}
                onClick={() => setSelectedId(row.sub.id)}
                className="w-full text-left p-6 hover:bg-surface-hover transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-[17px] font-medium text-foreground">{row.studentName}</h3>
                      {statusBadge(row.status)}
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
            ))}
          </div>
        )}
      </Card>

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

interface DetailRow {
  sub: Awaited<ReturnType<typeof workRepo.getAll>>[number];
  assignment: Awaited<ReturnType<typeof assignmentRepo.getAll>>[number] | undefined;
  studentName: string;
  status: Exclude<StatusFilter, "all">;
}

function SubmissionDetail({
  row,
  onClose,
  onDownload,
}: {
  row: DetailRow;
  onClose: () => void;
  onDownload: (fileId: string, fileName: string) => Promise<void>;
}) {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-foreground/40" onClick={onClose}>
      <div
        className="w-full max-w-[600px] bg-card h-full overflow-y-auto border-l-2 border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-xl font-medium text-foreground">{row.studentName}</h2>
            <p className="text-13 text-muted-foreground">
              {row.assignment?.title ?? t("teacher.submissions.unknownAssignment")}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-sm hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {row.sub.content?.trim() && (
            <section>
              <h3 className="text-sm font-medium text-foreground mb-2">
                {t("teacher.submissions.studentComment")}
              </h3>
              <p className="text-sm text-foreground whitespace-pre-line">{row.sub.content}</p>
            </section>
          )}

          <section>
            <h3 className="text-sm font-medium text-foreground mb-2">
              {t("teacher.submissions.files")}
            </h3>
            {row.sub.files.length === 0 ? (
              <p className="text-13 text-muted-foreground">{t("teacher.submissions.noFiles")}</p>
            ) : (
              <ul className="space-y-2">
                {row.sub.files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between gap-3 p-3 border border-border rounded-2md"
                  >
                    <div className="min-w-0">
                      <p className="text-sm text-foreground truncate">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(f.size)}</p>
                    </div>
                    <button
                      onClick={() => void onDownload(f.id, f.name)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-13 text-brand-primary hover:bg-info-light rounded-sm"
                    >
                      <Download className="w-4 h-4" />
                      {t("common.download")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {(row.sub.studentMark != null ||
            row.sub.teacherMark != null ||
            row.sub.finalMark != null) && (
            <section>
              <h3 className="text-sm font-medium text-foreground mb-2">
                {t("teacher.submissions.marks")}
              </h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <MarkCell
                  label={t("teacher.submissions.studentMark")}
                  value={row.sub.studentMark}
                />
                <MarkCell
                  label={t("teacher.submissions.teacherMark")}
                  value={row.sub.teacherMark}
                />
                <MarkCell label={t("teacher.submissions.finalMark")} value={row.sub.finalMark} />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function MarkCell({ label, value }: { label: string; value: number | null | undefined }) {
  return (
    <div className="border border-border rounded-2md p-3">
      <p className="text-2xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-lg font-medium text-foreground">{value ?? "—"}</p>
    </div>
  );
}
