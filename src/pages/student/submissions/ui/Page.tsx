import { useQuery } from "@tanstack/react-query";
import { Download, Edit, FileText, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { type GetSubmittedHomeworkResponse, http } from "@/shared/api";
import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { storageApi } from "@/entities/storage";
import { useMySubmission } from "@/entities/work";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

function formatFileSize(bytes: number, t: (k: string) => string): string {
  if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
}

async function downloadFile(fileId: string, fileName: string, errorMsg: string) {
  try {
    const url = await storageApi.getDownloadUrl(fileId);
    storageApi.triggerDownload(url, fileName);
  } catch {
    alert(errorMsg);
  }
}

export default function SubmissionsPage() {
  const { courseId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();

  const { data: course } = useCourse(courseId);
  const { data: hw } = useAssignment(taskId);
  const { data: submission, isLoading, isError } = useMySubmission(taskId);

  // Reviews + finalMark are only available via the per-submission endpoint.
  const submissionDetail = useQuery({
    queryKey: ["submissions", submission?.id, "detail"],
    enabled: !!submission?.id,
    queryFn: () => http.get<GetSubmittedHomeworkResponse>(`/submissions/${submission!.id}`),
  });

  const courseName = course?.title ?? "";
  const taskTitle = hw?.title ?? "";
  const reviews = submissionDetail.data?.submittedReviews ?? [];
  const finalMark = submissionDetail.data?.finalMark ?? null;

  const breadcrumbs = [
    CRUMBS.courses,
    { label: courseName, href: ROUTES.course(courseId) },
    { label: taskTitle, href: ROUTES.task(courseId, taskId) },
    { label: t("student.submissions.breadcrumb") },
  ];

  if (isLoading) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex min-h-[300px] items-center justify-center text-muted-foreground">
          {t("common.loading")}
        </div>
      </AppShell>
    );
  }

  if (isError) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex min-h-[300px] items-center justify-center text-destructive">
          {t("student.submissions.loadError")}
        </div>
      </AppShell>
    );
  }

  if (!submission) {
    return (
      <AppShell title={t("student.submissions.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-muted rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-brand-primary-lighter rounded-full mx-auto flex items-center justify-center">
                <Upload className="size-7 text-brand-primary" />
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("student.submissions.noSubmissions")}
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.5] mb-6">
              {t("student.submissions.noSubmissionsDesc")}
            </p>
            <button
              onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] transition-colors text-[15px] font-medium"
            >
              {t("student.submissions.submitWork")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={t("student.submissions.title")}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-1">
            {t("student.submissions.title")}
          </h1>
          <p className="text-[16px] text-muted-foreground leading-[1.5]">{taskTitle}</p>
        </div>
        <button
          onClick={() => void navigate(ROUTES.submitWork(courseId, taskId))}
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary-lighter hover:bg-brand-primary-light text-foreground rounded-[12px] text-[14px] font-medium transition-colors"
        >
          <Edit className="size-4" />
          {t("student.submissions.editWork")}
        </button>
      </div>

      <div className="grid gap-4 desktop:grid-cols-3">
        <div className="desktop:col-span-2 space-y-4">
          <section className="bg-card border border-border rounded-[16px] p-6">
            <h2 className="text-[16px] font-medium text-foreground mb-3">
              {t("student.submissions.commentTitle")}
            </h2>
            {(() => {
              const trimmed = (submission.content ?? "").trim();
              return trimmed && trimmed !== "—";
            })() ? (
              <p className="text-[15px] text-foreground whitespace-pre-wrap leading-[1.5]">
                {submission.content}
              </p>
            ) : (
              <p className="text-[14px] text-muted-foreground italic">
                {t("student.submissions.noComment")}
              </p>
            )}
          </section>

          <section className="bg-card border border-border rounded-[16px] p-6">
            <h2 className="text-[16px] font-medium text-foreground mb-3">
              {t("student.submissions.filesTitle")}
            </h2>
            {submission.files.length === 0 ? (
              <p className="text-[14px] text-muted-foreground italic">
                {t("student.submissions.noFiles")}
              </p>
            ) : (
              <ul className="space-y-2">
                {submission.files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-[10px] bg-muted"
                  >
                    <FileText className="size-5 text-brand-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-foreground truncate">
                        {file.name}
                      </div>
                      <div className="text-[12px] text-muted-foreground">
                        {formatFileSize(file.size, t)}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        void downloadFile(
                          file.id,
                          file.name,
                          t("student.submissions.downloadError"),
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card border border-border hover:bg-surface-hover rounded-[8px] text-[13px] font-medium transition-colors"
                    >
                      <Download className="size-4" />
                      {t("common.download")}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-card border border-border rounded-[16px] p-6">
            <h2 className="text-[16px] font-medium text-foreground mb-3">
              {t("student.submissions.reviewsTitle")}
            </h2>
            {reviews.length === 0 ? (
              <p className="text-[14px] text-muted-foreground italic">
                {t("student.submissions.noReviews")}
              </p>
            ) : (
              <ul className="space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-[10px] bg-muted p-4">
                    <div className="mb-2 text-[13px] font-medium text-brand-primary">
                      {t("student.submissions.reviewMark")}: {r.mark} / 5
                    </div>
                    <p className="text-[14px] text-foreground whitespace-pre-wrap leading-[1.5]">
                      {r.comment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="desktop:col-span-1">
          <div className="bg-card border border-border rounded-[16px] p-6">
            <h2 className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
              {t("student.submissions.finalMarkTitle")}
            </h2>
            {finalMark != null ? (
              <div className="text-[40px] font-medium text-foreground leading-none">
                {finalMark}
                <span className="text-[20px] text-muted-foreground">/5</span>
              </div>
            ) : (
              <p className="text-[14px] text-muted-foreground italic">
                {t("student.submissions.noFinalMark")}
              </p>
            )}
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
