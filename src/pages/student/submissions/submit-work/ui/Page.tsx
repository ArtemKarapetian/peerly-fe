import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { FilePreviewCard } from "@/features/submission/submit-work/ui/FilePreviewCard";
import type { UploadedFile } from "@/features/submission/submit-work/ui/FilePreviewCard";
import { FileUploadArea } from "@/features/submission/submit-work/ui/FileUploadArea";
import { TaskRulesCard } from "@/features/submission/submit-work/ui/TaskRulesCard";
import type { TaskRules } from "@/features/submission/submit-work/ui/TaskRulesCard";
import { ValidationChecks } from "@/features/submission/submit-work/ui/ValidationChecks";
import type { ValidationCheck } from "@/features/submission/submit-work/ui/ValidationChecks";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

export default function SubmitWorkPage() {
  const { courseId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [comment, setComment] = useState("");
  const [validationChecks, setValidationChecks] = useState<ValidationCheck[]>([]);

  // TODO заменить на данные из API, когда появятся task/submission репо
  const courseName = t("student.submissions.mockCourseName");
  const taskTitle = t("student.submissions.mockTaskTitle");

  const taskRules: TaskRules = {
    deadline: t("student.task.mockDeadlineFull"),
    isDeadlinePassed: false,
    allowedResubmissions: 2,
    currentVersion: 0,
    latePolicy: t("page.submitWork.latePolicy"),
  };

  const acceptedFormats = [".zip", ".pdf", ".jpg", ".png"];
  const maxFileSize = 10; // МБ

  const handleFileSelected = (file: File) => {
    const newFile: UploadedFile = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "long",
      }),
    };

    setUploadedFile(newFile);

    // имитация прогона проверок после загрузки — статусы меняем по таймерам, чтобы было визуально
    setTimeout(() => {
      setValidationChecks([
        {
          id: "1",
          name: t("page.submitWork.plagiarismCheck"),
          description: t("page.submitWork.plagiarismCheckDesc"),
          status: "queued",
        },
        {
          id: "2",
          name: t("page.submitWork.codeLinting"),
          description: t("page.submitWork.codeLintingDesc"),
          status: "not-started",
        },
        {
          id: "3",
          name: t("page.submitWork.fileFormat"),
          description: t("page.submitWork.fileFormatDesc"),
          status: "not-started",
        },
        {
          id: "4",
          name: t("page.submitWork.anonymization"),
          description: t("page.submitWork.anonymizationDesc"),
          status: "not-started",
        },
      ]);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) => (i === 0 ? { ...check, status: "running" } : check)),
        );
      }, 500);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 0
              ? { ...check, status: "passed", message: t("page.submitWork.noMatchesFound") }
              : i === 1
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 2000);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 1
              ? { ...check, status: "warning", message: t("page.submitWork.styleWarnings") }
              : i === 2
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 3500);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 2
              ? { ...check, status: "passed", message: t("page.submitWork.allFilesOk") }
              : i === 3
                ? { ...check, status: "running" }
                : check,
          ),
        );
      }, 5000);

      setTimeout(() => {
        setValidationChecks((prev) =>
          prev.map((check, i) =>
            i === 3
              ? { ...check, status: "passed", message: t("page.submitWork.noPersonalData") }
              : check,
          ),
        );
      }, 6000);
    }, 100);
  };

  const handleReplace = () => {
    setUploadedFile(null);
    setValidationChecks([]);
    setUploadError("");
  };

  const handleDownload = () => {
    console.log("Download file:", uploadedFile?.name);
    alert(t("page.submitWork.downloadFile", { name: uploadedFile?.name }));
  };

  const handleDelete = () => {
    if (confirm(t("page.submitWork.deleteFileConfirm"))) {
      setUploadedFile(null);
      setValidationChecks([]);
      setUploadError("");
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert(t("page.submitWork.draftSaved"));
    }, 1000);
  };

  const handleSubmit = () => {
    if (taskRules.isDeadlinePassed) {
      const confirmSubmit = confirm(t("page.submitWork.deadlineConfirm"));
      if (!confirmSubmit) return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
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

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-success-light border-2 border-success rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-success-light rounded-full mx-auto flex items-center justify-center">
                <span className="text-[32px]">✓</span>
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.submitWork.successTitle")}
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.5] mb-6">
              {t("page.submitWork.successDesc")}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  void navigate(`/student/courses/${courseId}/tasks/${taskId}/submissions`);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] transition-colors text-[15px] font-medium"
              >
                {t("page.submitWork.goToVersionHistory")}
              </button>
              <button
                onClick={() => {
                  void navigate(`/student/courses/${courseId}/tasks/${taskId}`);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-card border-2 border-border text-foreground rounded-[12px] hover:border-brand-primary-lighter hover:bg-muted transition-colors text-[15px] font-medium"
              >
                {t("page.submitWork.backToTask")}
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

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
              onUploadStart={() => setIsUploading(true)}
              onUploadProgress={(progress) => setUploadProgress(progress)}
              onUploadComplete={() => setIsUploading(false)}
              onUploadError={(error) => setUploadError(error)}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              error={uploadError}
              disabled={isSubmitting}
            />
          </section>

          {uploadedFile && (
            <section className="bg-muted rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
                {t("page.submitWork.uploadedFiles")}
              </h2>
              <FilePreviewCard
                file={uploadedFile}
                onReplace={handleReplace}
                onDownload={handleDownload}
                onDelete={handleDelete}
                disabled={isSubmitting}
              />
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
            />
          </section>

          <section className="bg-card rounded-[20px] p-6 border-2 border-border">
            <div className="flex flex-col tablet:flex-row gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={!uploadedFile || isSaving || isSubmitting}
                className="flex-1 px-6 py-3 bg-card border-2 border-border text-foreground rounded-[12px] text-[16px] font-medium hover:border-brand-primary-lighter hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? t("page.submitWork.saving") : t("page.submitWork.saveDraft")}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!uploadedFile || isSaving || isSubmitting}
                className="flex-1 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] text-[16px] font-medium hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting
                  ? t("page.submitWork.submitting")
                  : taskRules.currentVersion > 0
                    ? t("page.submitWork.submitWorkVersioned", {
                        version: taskRules.currentVersion + 1,
                      })
                    : t("page.submitWork.submitWork")}
              </button>
            </div>

            {!uploadedFile && (
              <p className="text-[13px] text-muted-foreground mt-3 text-center">
                {t("page.submitWork.uploadFileHint")}
              </p>
            )}
            {taskRules.currentVersion > 0 && uploadedFile && (
              <p className="text-[13px] text-brand-primary mt-3 text-center">
                {t("page.submitWork.newVersionHint", { version: taskRules.currentVersion + 1 })}
              </p>
            )}
            {taskRules.isDeadlinePassed && (
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

            <section className="bg-muted rounded-[20px] p-6">
              <h2 className="text-[18px] font-medium text-foreground mb-4 tracking-[-0.5px]">
                {t("page.submitWork.validationChecks")}
              </h2>
              <ValidationChecks checks={validationChecks} />
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
