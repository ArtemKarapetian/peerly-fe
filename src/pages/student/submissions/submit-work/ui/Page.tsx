import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

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

  // Sync the comment field once when the server's submission first loads
  // (or its id changes). Guarded so it doesn't clobber user edits.
  if (submission && submission.id !== syncedId) {
    setSyncedId(submission.id);
    setComment(submission.content);
  }

  const refreshSubmission = () =>
    queryClient.invalidateQueries({ queryKey: ["submissions", "mine", taskId] });

  // Lazily create the submission on first action that needs an id.
  const ensureSubmission = async (): Promise<string> => {
    if (submission?.id) return submission.id;
    const { submissionId } = await workRepo.create(taskId, comment);
    await refreshSubmission();
    return submissionId;
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const submissionId = await ensureSubmission();
      await storageApi.upload(file, { kind: "submission", submissionId });
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
        await workRepo.update(submission.id, comment);
      } else {
        await workRepo.create(taskId, comment);
      }
    },
    onSuccess: async () => {
      await refreshSubmission();
      alert(t("page.submitWork.draftSaved"));
    },
    onError: () => setActionError(t("page.submitWork.saveError")),
  });

  const courseName = course?.title ?? "";
  const taskTitle = hw?.title ?? "";
  const dueDate = hw?.dueDate;
  const isDeadlinePassed = dueDate ? dueDate.getTime() < now : false;

  const taskRules: TaskRules = {
    deadline: formatDeadline(dueDate, i18n.language),
    isDeadlinePassed,
    latePolicy: t("page.submitWork.latePolicy"),
  };

  const acceptedFormats = [".zip", ".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx", ".txt"];
  const maxFileSize = 10;

  const isBusy = uploadMutation.isPending || deleteFileMutation.isPending || saveMutation.isPending;
  const files = submission?.files ?? [];

  const handleFileSelected = (file: File) => {
    setActionError("");
    uploadMutation.mutate(file);
  };

  const handleDeleteFile = (fileId: string) => {
    if (!confirm(t("page.submitWork.deleteFileConfirm"))) return;
    setActionError("");
    deleteFileMutation.mutate(fileId);
  };

  const handleDownloadFile = async (fileId: string) => {
    try {
      const url = await storageApi.getDownloadUrl(fileId);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch {
      setActionError(t("page.submitWork.downloadError"));
    }
  };

  const handleSave = () => {
    if (isDeadlinePassed && !confirm(t("page.submitWork.deadlineConfirm"))) return;
    setActionError("");
    saveMutation.mutate();
  };

  return (
    <AppShell title={t("page.submitWork.title")}>
      <Breadcrumbs
        items={[
          CRUMBS.courses,
          { label: courseName, href: ROUTES.course(courseId) },
          { label: taskTitle, href: ROUTES.task(courseId, taskId) },
          { label: t("page.submitWork.breadcrumbSubmit") },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-[32px] font-medium text-foreground tracking-[-0.5px] mb-2">
          {t("page.submitWork.pageTitle")}
        </h1>
        <p className="text-[16px] text-muted-foreground leading-[1.5]">{taskTitle}</p>
      </div>

      <div className="task-layout">
        <div className="space-y-6">
          <section className="bg-muted rounded-[20px] p-6">
            <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
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
            <section className="bg-muted rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
                {t("page.submitWork.uploadedFiles")}
              </h2>
              <ul className="space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 bg-card border border-border rounded-[12px] px-3 py-2"
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
                      onClick={() => void handleDownloadFile(file.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-surface-hover rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-50"
                    >
                      <Download className="size-4" />
                      {t("common.download")}
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={isBusy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-error-light hover:bg-error-light text-destructive rounded-[8px] text-[13px] font-medium transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                      {t("common.delete")}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-muted rounded-[20px] p-6">
            <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
              {t("page.submitWork.commentToTeacher")}
              <span className="text-muted-foreground font-normal ml-2">
                {t("page.submitWork.commentOptional")}
              </span>
            </h2>
            <textarea
              className="w-full min-h-[120px] px-4 py-3 bg-card border-2 border-border rounded-[12px] text-[15px] text-foreground placeholder:text-muted-foreground focus:border-brand-primary-light focus:outline-none resize-none transition-colors"
              placeholder={t("page.submitWork.commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isBusy}
            />
          </section>

          <section className="bg-card rounded-[20px] p-6 border-2 border-border">
            <div className="flex flex-col tablet:flex-row gap-3">
              <button
                onClick={() => void navigate(ROUTES.submissions(courseId, taskId))}
                disabled={isBusy}
                className="flex-1 px-6 py-3 bg-card border-2 border-border text-foreground rounded-[12px] text-[16px] font-medium hover:border-brand-primary-lighter hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t("page.submitWork.goToMySubmission")}
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy}
                className="flex-1 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] text-[16px] font-medium hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saveMutation.isPending
                  ? t("page.submitWork.saving")
                  : t("page.submitWork.saveDraft")}
              </button>
            </div>

            {actionError && (
              <p className="text-[13px] text-destructive mt-3 text-center">{actionError}</p>
            )}
            {isDeadlinePassed && (
              <p className="text-[13px] text-error mt-3 text-center font-medium">
                ⚠️ {t("page.submitWork.deadlinePassedHint")}
              </p>
            )}
          </section>
        </div>

        <div className="space-y-6 hide-below-desktop">
          <div className="task-sidebar-sticky space-y-6">
            <section className="bg-muted rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
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
