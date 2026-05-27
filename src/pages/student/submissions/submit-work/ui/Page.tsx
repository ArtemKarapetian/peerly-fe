import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Clock, Download, FileText, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { storageApi } from "@/entities/storage";
import { useMySubmission, workRepo } from "@/entities/work";

import { FileUploadArea } from "@/features/submission/submit-work/ui/FileUploadArea";
import { TaskRulesCard } from "@/features/submission/submit-work/ui/TaskRulesCard";
import type { TaskRules } from "@/features/submission/submit-work/ui/TaskRulesCard";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

function formatFileSize(bytes: number, t: (k: string) => string): string {
  if (bytes < 1024) return `${bytes} ${t("entity.work.bytes")}`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} ${t("entity.work.kb")}`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} ${t("entity.work.mb")}`;
}

function formatDeadline(d: Date | undefined, locale: string): string {
  if (!d) return "—";
  return d.toLocaleString(locale, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SubmitWorkPage() {
  const { courseId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const CRUMBS = getCrumbs();
  const queryClient = useQueryClient();

  const { data: course } = useCourse(courseId);
  const { data: hw } = useAssignment(taskId);
  const { data: submission, isLoading: subLoading } = useMySubmission(taskId);

  const [comment, setComment] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [syncedId, setSyncedId] = useState<string | null>(null);
  const [now] = useState(() => Date.now());

  const courseName = course?.title ?? "";
  const taskTitle = hw?.title ?? "";
  const dueDate = hw?.dueDate;
  const isDeadlinePassed = dueDate ? dueDate.getTime() < now : false;

  if (submission && submission.id !== syncedId) {
    setSyncedId(submission.id);
    const incoming = (submission.content ?? "").trim();
    setComment(incoming === "" || incoming === "—" ? "" : (submission.content ?? ""));
  }

  const savedCommentRaw = (submission?.content ?? "").trim();
  const savedComment = savedCommentRaw === "" || savedCommentRaw === "—" ? "" : savedCommentRaw;
  const commentDirty = comment !== savedComment;

  const breadcrumbs = [
    CRUMBS.courses,
    { label: courseName, href: ROUTES.course(courseId) },
    { label: taskTitle, href: ROUTES.task(courseId, taskId) },
    { label: t("page.submitWork.breadcrumbSubmit") },
  ];

  const refreshSubmission = () =>
    queryClient.invalidateQueries({ queryKey: ["submissions", "mine", taskId] });

  const commentForBe = (text: string) => (text.trim() === "" ? "—" : text);

  const ensureSubmission = async (): Promise<string> => {
    if (submission?.id) return submission.id;
    const { submissionId } = await workRepo.create(taskId, commentForBe(comment));
    await refreshSubmission();
    return submissionId;
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const existedBefore = !!submission?.id;
      const submissionId = await ensureSubmission();
      try {
        await storageApi.upload(file, { kind: "submission", submissionId });
      } catch (err) {
        if (!existedBefore) {
          try {
            await workRepo.delete(submissionId);
          } catch {
            // noop
          }
          await refreshSubmission();
        }
        throw err;
      }
    },
    onSuccess: () => refreshSubmission(),
    onError: () => setActionError(t("page.submitWork.uploadError")),
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      if (!submission?.id) return;
      await storageApi.deleteSubmissionFile(submission.id, fileId);
    },
    onSuccess: () => refreshSubmission(),
    onError: () => setActionError(t("page.submitWork.deleteFileError")),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (submission?.id) {
        await workRepo.update(submission.id, commentForBe(comment));
      } else {
        await workRepo.create(taskId, commentForBe(comment));
      }
    },
    onSuccess: async () => {
      await refreshSubmission();
      toast.success(t("page.submitWork.draftSaved"));
    },
    onError: () => setActionError(t("page.submitWork.saveError")),
  });

  const taskRules: TaskRules = {
    deadline: formatDeadline(dueDate, i18n.language),
    isDeadlinePassed,
  };

  const acceptedFormats = [".zip", ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"];
  const maxFileSize = 10;

  const isBusy = uploadMutation.isPending || deleteFileMutation.isPending || saveMutation.isPending;
  const files = submission?.files ?? [];

  if (isDeadlinePassed) {
    return (
      <AppShell title={t("page.submitWork.title")}>
        <Breadcrumbs items={breadcrumbs} />
        <div className="flex items-center justify-center min-h-[400px] mt-6">
          <div className="bg-error-light border border-error rounded-xl p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center">
                <Clock className="size-7 text-destructive" />
              </div>
            </div>
            <h2 className="text-2xl font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.submitWork.deadlinePassedTitle")}
            </h2>
            <p className="text-base text-foreground leading-[1.5] mb-6">
              {t("page.submitWork.deadlinePassedDesc")}
            </p>
            <Link
              to={ROUTES.task(courseId, taskId)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-md transition-colors text-15 font-medium"
            >
              <ArrowLeft className="size-4" />
              {t("page.submitWork.backToTask")}
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const handleFileSelected = (file: File) => {
    setActionError("");
    uploadMutation.mutate(file);
  };

  const handleDeleteFile = (fileId: string) => {
    if (!confirm(t("page.submitWork.deleteFileConfirm"))) return;
    setActionError("");
    deleteFileMutation.mutate(fileId);
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const url = await storageApi.getDownloadUrl(fileId);
      storageApi.triggerDownload(url, fileName);
    } catch {
      setActionError(t("page.submitWork.downloadError"));
    }
  };

  const handleSave = () => {
    setActionError("");
    saveMutation.mutate();
  };

  return (
    <AppShell title={t("page.submitWork.title")}>
      <Breadcrumbs items={breadcrumbs} />

      <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] desktop:text-page-h1 font-medium text-foreground tracking-[-0.5px] mb-1">
            {t("page.submitWork.pageTitle")}
          </h1>
          <p className="text-15 text-muted-foreground leading-[1.5]">{taskTitle}</p>
        </div>
      </div>

      <div className="task-layout">
        <div className="space-y-4">
          <section className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
            <h2 className="text-15 font-medium text-foreground mb-3">
              {t("page.submitWork.uploadFiles")}
            </h2>
            <FileUploadArea
              acceptedFormats={acceptedFormats}
              maxSizeMB={maxFileSize}
              onFileSelected={handleFileSelected}
              onUploadError={(err) => setUploadError(err)}
              isUploading={uploadMutation.isPending || subLoading}
              error={uploadError}
              disabled={isBusy}
            />
          </section>

          {files.length > 0 && (
            <section className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
              <h2 className="text-15 font-medium text-foreground mb-3">
                {t("page.submitWork.uploadedFiles")}
              </h2>
              <ul className="space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 bg-muted rounded-2md px-3 py-2"
                  >
                    <FileText className="size-5 text-brand-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatFileSize(file.size, t)}
                      </div>
                    </div>
                    <button
                      onClick={() => void handleDownloadFile(file.id, file.name)}
                      disabled={isBusy}
                      title={t("common.download")}
                      className="inline-flex items-center justify-center size-8 bg-card border border-border hover:bg-surface-hover rounded-sm transition-colors disabled:opacity-50"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={isBusy}
                      title={t("common.delete")}
                      className="inline-flex items-center justify-center size-8 bg-error-light text-destructive hover:bg-error-light rounded-sm transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
            <h2 className="text-15 font-medium text-foreground mb-3">
              {t("page.submitWork.commentToTeacher")}
              <span className="text-muted-foreground font-normal ml-2 text-13">
                {t("page.submitWork.commentOptional")}
              </span>
            </h2>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 bg-card border-2 border-border rounded-2md text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none resize-none transition-colors"
              placeholder={t("page.submitWork.commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isBusy}
            />
          </section>

          <section className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
            <div className="flex flex-col tablet:flex-row gap-3">
              <button
                onClick={() => void navigate(ROUTES.submissions(courseId, taskId))}
                disabled={isBusy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-md text-15 font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="size-4" />
                {t("page.submitWork.goToMySubmission")}
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy || !commentDirty}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-md text-15 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="size-4" />
                {saveMutation.isPending
                  ? t("page.submitWork.saving")
                  : t("page.submitWork.saveDraft")}
              </button>
            </div>
            {actionError && (
              <p className="text-13 text-destructive mt-3 text-center">{actionError}</p>
            )}
          </section>
        </div>

        <div className="hide-below-desktop">
          <div className="task-sidebar-sticky">
            <section className="bg-card border border-border shadow-sm rounded-lg p-4 desktop:p-6">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
                {t("page.submitWork.taskRules")}
              </h2>
              <TaskRulesCard rules={taskRules} />
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
