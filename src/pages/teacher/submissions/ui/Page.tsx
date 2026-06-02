import { Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { EmptyState, Field, Select } from "@/shared/ui";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageHeader } from "@/shared/ui/PageHeader";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";
import { courseRepo } from "@/entities/course";
import { storageApi } from "@/entities/storage";
import { workRepo } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell";

import { computeRows } from "../lib/computeRows";
import type { StatusFilter } from "../model/types";

import { SubmissionDetail } from "./SubmissionDetail";
import { SubmissionList } from "./SubmissionList";

export default function TeacherSubmissionsPage() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();

  const courseId = params.get("courseId") ?? "";
  const assignmentId = params.get("assignmentId") ?? "";

  const setParam = (key: string, value: string) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (!value) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  };

  const onCourseChange = (next: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (!next) p.delete("courseId");
        else p.set("courseId", next);
        p.delete("assignmentId");
        return p;
      },
      { replace: true },
    );
  };

  return (
    <AppShell title={t("teacher.submissions.title")}>
      <Breadcrumbs items={[{ label: t("teacher.submissions.breadcrumb") }]} />
      <PageHeader
        title={t("teacher.submissions.title")}
        subtitle={t("teacher.submissions.subtitle")}
      />

      <PickerCard
        courseId={courseId}
        assignmentId={assignmentId}
        onCourseChange={onCourseChange}
        onAssignmentChange={(v) => setParam("assignmentId", v)}
      />

      {assignmentId ? (
        <SubmissionsContent assignmentId={assignmentId} />
      ) : (
        <EmptyState
          icon={Inbox}
          title={t(
            courseId
              ? "teacher.submissions.pickAssignmentTitle"
              : "teacher.submissions.pickCourseTitle",
          )}
          message={t(
            courseId
              ? "teacher.submissions.pickAssignmentHint"
              : "teacher.submissions.pickCourseHint",
          )}
          className="border-2 border-dashed border-border rounded-md mt-6"
        />
      )}
    </AppShell>
  );
}

interface PickerCardProps {
  courseId: string;
  assignmentId: string;
  onCourseChange: (id: string) => void;
  onAssignmentChange: (id: string) => void;
}

function PickerCard({
  courseId,
  assignmentId,
  onCourseChange,
  onAssignmentChange,
}: PickerCardProps) {
  const { t } = useTranslation();

  const { data: courses, isLoading: coursesLoading } = useAsync(() => courseRepo.getAll(), []);
  const { data: assignments, isLoading: assignmentsLoading } = useAsync(
    () => (courseId ? assignmentRepo.getByCourse(courseId) : Promise.resolve([])),
    [courseId],
  );

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl p-4 tablet:p-6 mb-6">
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        <Field label={t("common.course")}>
          <Select
            value={courseId}
            onChange={(e) => onCourseChange(e.target.value)}
            disabled={coursesLoading}
          >
            <option value="">{t("teacher.submissions.coursePlaceholder")}</option>
            {(courses ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>

        <Field label={t("common.assignment")}>
          <Select
            value={assignmentId}
            onChange={(e) => onAssignmentChange(e.target.value)}
            disabled={!courseId || assignmentsLoading}
          >
            <option value="">
              {courseId
                ? t("teacher.submissions.assignmentPlaceholder")
                : t("teacher.submissions.pickCourseFirst")}
            </option>
            {(assignments ?? []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.title}
              </option>
            ))}
          </Select>
        </Field>
      </div>
    </div>
  );
}

function SubmissionsContent({ assignmentId }: { assignmentId: string }) {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterStatus = (params.get("status") ?? "all") as StatusFilter;
  const searchStudent = params.get("search") ?? "";

  const setParam = (key: string, value: string, fallback = "all") => {
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

  const { data, isLoading, error, refetch } = useAsync(async () => {
    const [assignment, submissions] = await Promise.all([
      assignmentRepo.getById(assignmentId),
      workRepo.listForHomework(assignmentId),
    ]);
    return { assignment, submissions };
  }, [assignmentId]);

  const rows = useMemo(() => {
    if (!data?.assignment) return [];
    return computeRows({
      data: {
        users: [],
        assignments: [data.assignment],
        submissions: data.submissions,
      },
      unknownStudentLabel: t("teacher.submissions.unknownStudent"),
    });
  }, [data, t]);

  const filtered = rows.filter((r) => {
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

  if (isLoading) return <PageSkeleton />;
  if (error) return <ErrorBanner error={error} onRetry={refetch} />;

  return (
    <>
      <div className="bg-card border border-border shadow-sm rounded-xl p-4 tablet:p-6 mb-6 flex flex-wrap items-end gap-4 justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <Field label={t("common.status")}>
            <Select value={filterStatus} onChange={(e) => setParam("status", e.target.value)}>
              <option value="all">{t("teacher.submissions.allStatuses")}</option>
              <option value="submitted">{t("teacher.submissions.submitted")}</option>
              <option value="late">{t("teacher.submissions.late")}</option>
              <option value="draft">{t("teacher.submissions.draft")}</option>
            </Select>
          </Field>
          <Field label={t("teacher.submissions.studentSearch")}>
            <input
              type="search"
              value={searchStudent}
              onChange={(e) => setParam("search", e.target.value, "")}
              placeholder={t("teacher.submissions.studentNamePlaceholder")}
              className="w-full tablet:w-72 h-10 px-3 rounded-md border-2 border-border bg-card text-sm focus:outline-none focus:border-brand-primary"
            />
          </Field>
        </div>
        <p className="text-13 text-muted-foreground">
          {t("teacher.submissions.foundSubmissions")}{" "}
          <strong className="text-foreground">{filtered.length}</strong>
        </p>
      </div>

      <SubmissionList rows={filtered} onSelect={setSelectedId} />

      {selected && (
        <SubmissionDetailContainer
          row={selected}
          onClose={() => setSelectedId(null)}
          onDownload={handleDownload}
        />
      )}
    </>
  );
}

interface SubmissionDetailContainerProps {
  row: import("../model/types").SubmissionRow;
  onClose: () => void;
  onDownload: (fileId: string, fileName: string) => Promise<void>;
}

function SubmissionDetailContainer({ row, onClose, onDownload }: SubmissionDetailContainerProps) {
  const {
    data: fullSubmission,
    isLoading,
    error,
  } = useAsync(() => workRepo.getById(row.sub.id), [row.sub.id]);

  const enrichedRow = useMemo(
    () =>
      fullSubmission
        ? {
            ...row,
            sub: {
              ...row.sub,
              content: fullSubmission.content,
              files: fullSubmission.files,
            },
          }
        : row,
    [row, fullSubmission],
  );

  return (
    <SubmissionDetail
      row={enrichedRow}
      isLoadingDetails={isLoading}
      detailsError={error}
      onClose={onClose}
      onDownload={onDownload}
    />
  );
}
