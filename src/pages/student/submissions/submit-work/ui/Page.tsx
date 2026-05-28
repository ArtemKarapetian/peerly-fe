import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { ROUTES } from "@/shared/config/routes.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignment } from "@/entities/assignment";
import { useCourse } from "@/entities/course";
import { storageApi } from "@/entities/storage";
import { useMySubmission } from "@/entities/work";

import type { TaskRules } from "@/features/submission/submit-work/ui/TaskRulesCard";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { formatDeadline, normalizeSavedComment } from "../lib/formatters";
import { useSubmitWorkMutations } from "../model/useSubmitWorkMutations";

import { ActionsBar } from "./ActionsBar";
import { CommentCard } from "./CommentCard";
import { DeadlinePassedView } from "./DeadlinePassedView";
import { SidebarRules } from "./SidebarRules";
import { UploadCard } from "./UploadCard";
import { UploadedFilesList } from "./UploadedFilesList";

export default function SubmitWorkPage() {
  const { courseId = "", taskId = "" } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const CRUMBS = getCrumbs();

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
    setComment(normalizeSavedComment(submission.content));
  }

  const savedComment = normalizeSavedComment(submission?.content);
  const commentDirty = comment !== savedComment;

  const breadcrumbs = [
    CRUMBS.courses,
    { label: courseName, href: ROUTES.course(courseId) },
    { label: taskTitle, href: ROUTES.task(courseId, taskId) },
    { label: t("page.submitWork.breadcrumbSubmit") },
  ];

  const { uploadMutation, deleteFileMutation, saveMutation } = useSubmitWorkMutations({
    taskId,
    submissionId: submission?.id,
    comment,
    onError: setActionError,
  });

  if (isDeadlinePassed) {
    return <DeadlinePassedView courseId={courseId} taskId={taskId} breadcrumbs={breadcrumbs} />;
  }

  const isBusy = uploadMutation.isPending || deleteFileMutation.isPending || saveMutation.isPending;
  const files = submission?.files ?? [];

  const taskRules: TaskRules = {
    deadline: formatDeadline(dueDate, i18n.language),
    isDeadlinePassed,
  };

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
          <UploadCard
            isUploading={uploadMutation.isPending || subLoading}
            disabled={isBusy}
            error={uploadError}
            onFileSelected={handleFileSelected}
            onUploadError={setUploadError}
          />

          <UploadedFilesList
            files={files}
            disabled={isBusy}
            onDownload={(id, name) => void handleDownloadFile(id, name)}
            onDelete={handleDeleteFile}
          />

          <CommentCard value={comment} onChange={setComment} disabled={isBusy} />

          <ActionsBar
            saving={saveMutation.isPending}
            disabled={isBusy}
            canSave={commentDirty}
            errorMessage={actionError}
            onBack={() => void navigate(ROUTES.submissions(courseId, taskId))}
            onSave={handleSave}
          />
        </div>

        <SidebarRules rules={taskRules} />
      </div>
    </AppShell>
  );
}
