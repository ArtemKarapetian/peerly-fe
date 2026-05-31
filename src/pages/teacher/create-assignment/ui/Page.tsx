import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAsync } from "@/shared/lib/useAsync";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";

import type { AssignmentFormData } from "@/features/assignment/create/model/types";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { blankFormData, clearDraftStorage, loadDraftFromStorage } from "../lib/draftStorage";

import { WizardShell } from "./WizardShell";

interface TeacherCreateAssignmentPageProps {
  courseId?: string;
}

export default function TeacherCreateAssignmentPage({
  courseId,
}: TeacherCreateAssignmentPageProps) {
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const courseIdFromQuery = params.get("courseId");
  const groupIdFromQuery = params.get("groupId");

  if (editId) {
    return <EditDraftAssignment editId={editId} />;
  }
  return (
    <CreateAssignment
      initialCourseId={courseId ?? courseIdFromQuery ?? undefined}
      initialGroupId={groupIdFromQuery ?? undefined}
    />
  );
}

function CreateAssignment({
  initialCourseId,
  initialGroupId,
}: {
  initialCourseId?: string;
  initialGroupId?: string;
}) {
  const { t } = useTranslation();
  const { initial, initialStep } = useMemo(() => {
    const draft = loadDraftFromStorage();
    const base = draft?.formData ?? blankFormData();
    if (initialCourseId) base.courseId = initialCourseId;
    if (initialGroupId) base.groupId = initialGroupId;
    return { initial: base, initialStep: draft?.currentStep ?? 1 };
  }, [initialCourseId, initialGroupId]);

  return (
    <WizardShell
      mode="create"
      initialData={initial}
      initialStep={initialStep}
      title={t("teacher.createAssignment.title")}
      onSaved={clearDraftStorage}
      persistDraftToStorage
      lockCourse={Boolean(initialCourseId)}
    />
  );
}

function EditDraftAssignment({ editId }: { editId: string }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useAsync(
    () => assignmentRepo.getById(editId),
    [editId],
  );

  if (isLoading) {
    return (
      <AppShell title={t("teacher.editAssignment.title")}>
        <PageSkeleton />
      </AppShell>
    );
  }
  if (error) {
    return (
      <AppShell title={t("teacher.editAssignment.title")}>
        <ErrorBanner error={error} onRetry={refetch} />
      </AppShell>
    );
  }
  if (!data) {
    return (
      <AppShell title={t("teacher.editAssignment.title")}>
        <ErrorBanner message={t("teacher.editAssignment.notFound")} />
      </AppShell>
    );
  }
  if (data.backendStatus !== "draft") {
    return (
      <AppShell title={t("teacher.editAssignment.title")}>
        <div className="mt-6 bg-warning-light border border-warning rounded-lg p-6 text-center">
          <p className="text-15 text-foreground mb-4">
            {t("teacher.editAssignment.publishedHint")}
          </p>
          <button
            onClick={() => void navigate(`/teacher/assignment/${editId}`)}
            className="px-4 py-2 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors text-sm font-medium"
          >
            {t("teacher.editAssignment.backToAssignment")}
          </button>
        </div>
      </AppShell>
    );
  }

  const initial: AssignmentFormData = {
    courseId: data.courseId,
    groupId: data.groupId ?? null,
    title: data.title,
    description: data.description,
    submissionDeadline: data.dueDate,
    reviewDeadline: data.reviewDeadline ?? null,
    rubricId: null,
    reviewsPerSubmission: data.reviewCount || 3,
    discrepancyThreshold: data.discrepancyThreshold ?? 2,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <WizardShell
      mode="edit"
      editId={editId}
      initialData={initial}
      title={t("teacher.editAssignment.title")}
      lockCourse
    />
  );
}
