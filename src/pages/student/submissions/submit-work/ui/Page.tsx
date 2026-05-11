import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Download, FileText, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
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

  if (submission && submission.id !== syncedId) {
    setSyncedId(submission.id);
    setComment(submission.content.trim() === "" ? "" : submission.content);
  }

  const refreshSubmission = () =>
    queryClient.invalidateQueries({ queryKey: ["submissions", "mine", taskId] });

  const commentForBe = (text: string) => (text.trim() === "" ? " " : text);

  const ensureSubmission = async (): Promise<string> => {
    if (submission?.id) return submission.id;
    const { submissionId } = await workRepo.create(taskId, commentForBe(comment));
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

      <div className="mb-6 mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[28px] desktop:text-[32px] font-medium text-foreground tracking-[-0.5px] mb-1">
            {t("page.submitWork.pageTitle")}
          </h1>
          <p className="text-[15px] text-muted-foreground leading-[1.5]">{taskTitle}</p>
        </div>
        {isDeadlinePassed && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-error-light border border-error text-destructive text-[13px] font-medium">
            ⚠ {t("page.submitWork.deadlinePassedHint")}
          </div>
        )}
      </div>

      <div className="task-layout">
        <div className="space-y-4">
          <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
            <h2 className="text-[15px] font-medium text-foreground mb-3">
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
            <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
              <h2 className="text-[15px] font-medium text-foreground mb-3">
                {t("page.submitWork.uploadedFiles")}
              </h2>
              <ul className="space-y-2">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-3 bg-muted rounded-[10px] px-3 py-2"
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
                      title={t("common.download")}
                      className="inline-flex items-center justify-center size-8 bg-card border border-border hover:bg-surface-hover rounded-[8px] transition-colors disabled:opacity-50"
                    >
                      <Download className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={isBusy}
                      title={t("common.delete")}
                      className="inline-flex items-center justify-center size-8 bg-error-light text-destructive hover:bg-error-light rounded-[8px] transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
            <h2 className="text-[15px] font-medium text-foreground mb-3">
              {t("page.submitWork.commentToTeacher")}
              <span className="text-muted-foreground font-normal ml-2 text-[13px]">
                {t("page.submitWork.commentOptional")}
              </span>
            </h2>
            <textarea
              className="w-full min-h-[120px] px-3 py-2 bg-card border-2 border-border rounded-[10px] text-[14px] text-foreground placeholder:text-muted-foreground focus:border-brand-primary focus:outline-none resize-none transition-colors"
              placeholder={t("page.submitWork.commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isBusy}
            />
          </section>

          <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
            <div className="flex flex-col tablet:flex-row gap-3">
              <button
                onClick={() => void navigate(ROUTES.submissions(courseId, taskId))}
                disabled={isBusy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border text-foreground rounded-[12px] text-[15px] font-medium hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ArrowLeft className="size-4" />
                {t("page.submitWork.goToMySubmission")}
              </button>
              <button
                onClick={handleSave}
                disabled={isBusy}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] text-[15px] font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="size-4" />
                {saveMutation.isPending
                  ? t("page.submitWork.saving")
                  : t("page.submitWork.saveDraft")}
              </button>
            </div>
            {actionError && (
              <p className="text-[13px] text-destructive mt-3 text-center">{actionError}</p>
            )}
          </section>
        </div>

        <div className="hide-below-desktop">
          <div className="task-sidebar-sticky">
            <section className="bg-card border border-border shadow-sm rounded-[16px] p-4 desktop:p-6">
              <h2 className="text-[14px] font-medium text-muted-foreground uppercase tracking-wider mb-4">
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
