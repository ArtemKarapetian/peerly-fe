import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";

import { humanizeApiError } from "@/shared/api";
import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { useAsync } from "@/shared/lib/useAsync";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { ErrorBanner } from "@/shared/ui/ErrorBanner";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { assignmentRepo } from "@/entities/assignment";

import {
  StepBasics,
  StepDeadlines,
  StepPeerSession,
  StepPublish,
  StepRubric,
} from "@/features/assignment/create";
import type { AssignmentFormData, RubricOption } from "@/features/assignment/create/model/types";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { useRubrics } from "@/widgets/rubric-editor";

type StepKey = "stepBasics" | "stepDeadlines" | "stepRubric" | "stepPeerReview" | "stepPublish";

const ALL_STEP_KEYS: StepKey[] = [
  "stepBasics",
  "stepDeadlines",
  "stepRubric",
  "stepPeerReview",
  "stepPublish",
];

const STORAGE_KEY = "peerly_assignment_draft";

function blankFormData(): AssignmentFormData {
  return {
    courseId: "",
    title: "",
    description: "",
    submissionDeadline: null,
    reviewDeadline: null,
    rubricId: null,
    reviewsPerSubmission: 3,
    discrepancyThreshold: 2,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function loadDraftFromStorage(): AssignmentFormData | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored) as Omit<
      AssignmentFormData,
      "submissionDeadline" | "reviewDeadline" | "createdAt" | "updatedAt"
    > & {
      submissionDeadline: string | null;
      reviewDeadline: string | null;
      createdAt: string;
      updatedAt: string;
    };
    return {
      ...parsed,
      discrepancyThreshold: parsed.discrepancyThreshold ?? 30,
      submissionDeadline: parsed.submissionDeadline ? new Date(parsed.submissionDeadline) : null,
      reviewDeadline: parsed.reviewDeadline ? new Date(parsed.reviewDeadline) : null,
      createdAt: new Date(parsed.createdAt),
      updatedAt: new Date(parsed.updatedAt),
    };
  } catch (e) {
    console.error("Failed to parse assignment draft", e);
    return null;
  }
}

interface TeacherCreateAssignmentPageProps {
  courseId?: string;
}

export default function TeacherCreateAssignmentPage({
  courseId,
}: TeacherCreateAssignmentPageProps) {
  const [params] = useSearchParams();
  const editId = params.get("edit");
  const courseIdFromQuery = params.get("courseId");

  if (editId) {
    return <EditDraftAssignment editId={editId} />;
  }
  return <CreateAssignment initialCourseId={courseId ?? courseIdFromQuery ?? undefined} />;
}

function CreateAssignment({ initialCourseId }: { initialCourseId?: string }) {
  const { t } = useTranslation();
  const initial = useMemo(() => {
    const fromStorage = loadDraftFromStorage();
    const base = fromStorage ?? blankFormData();
    if (initialCourseId) base.courseId = initialCourseId;
    return base;
  }, [initialCourseId]);

  return (
    <WizardShell
      mode="create"
      initialData={initial}
      title={t("teacher.createAssignment.title")}
      onSaved={() => localStorage.removeItem(STORAGE_KEY)}
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
    title: data.title,
    description: data.description,
    submissionDeadline: data.dueDate,
    reviewDeadline: data.reviewDeadline ?? null,
    rubricId: null,
    reviewsPerSubmission: data.reviewCount || 3,
    discrepancyThreshold: data.discrepancyThreshold || 30,
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

interface WizardShellProps {
  mode: "create" | "edit";
  initialData: AssignmentFormData;
  title: string;
  editId?: string;
  lockCourse?: boolean;
  persistDraftToStorage?: boolean;
  onSaved?: () => void;
}

function WizardShell({
  mode,
  initialData,
  title,
  editId,
  lockCourse,
  persistDraftToStorage,
  onSaved,
}: WizardShellProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const rubrics = useRubrics();
  const rubricOptions: RubricOption[] = useMemo(
    () =>
      rubrics.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        criteria: r.criteria.map((c) => ({
          name: c.name,
          description: c.description,
          maxScore: c.maxScore,
        })),
      })),
    [rubrics],
  );
  const STEPS = ALL_STEP_KEYS.map((key, idx) => ({
    id: idx + 1,
    key,
    name: t(`teacher.createAssignment.${key}`),
    shortName: t(`teacher.createAssignment.${key}`),
  }));
  const lastStepId = STEPS.length;
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(initialData);
  const isDirty = useMemo(() => {
    const cmp = (a: AssignmentFormData, b: AssignmentFormData) => {
      const norm = (d: AssignmentFormData) => ({
        courseId: d.courseId,
        title: d.title,
        description: d.description,
        submissionDeadline: d.submissionDeadline?.getTime() ?? null,
        reviewDeadline: d.reviewDeadline?.getTime() ?? null,
        rubricId: d.rubricId,
        reviewsPerSubmission: d.reviewsPerSubmission,
        discrepancyThreshold: d.discrepancyThreshold,
      });
      return JSON.stringify(norm(a)) !== JSON.stringify(norm(b));
    };
    return cmp(formData, initialData);
  }, [formData, initialData]);

  useEffect(() => {
    if (!persistDraftToStorage) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData, persistDraftToStorage]);

  const updateFormData = (updates: Partial<AssignmentFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date(),
    }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const buildChecklist = (): string => {
    if (!formData.rubricId) return "";
    const rubric = rubrics.find((r) => r.id === formData.rubricId);
    if (!rubric) return "";
    return rubric.criteria
      .map((c) => {
        const head = `${c.name} (${c.maxScore})`;
        return c.description ? `${head}: ${c.description}` : head;
      })
      .join("\n");
  };

  const handleSubmit = async (asDraft: boolean) => {
    if (!formData.courseId || !formData.submissionDeadline || !formData.reviewDeadline) {
      setSubmitError(t("feature.assignmentCreate.publish.errorMissingFields"));
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const input = {
        title: formData.title,
        description: formData.description || undefined,
        checklist: buildChecklist() || undefined,
        dueDate: formData.submissionDeadline,
        reviewDeadline: formData.reviewDeadline,
        reviewCount: formData.reviewsPerSubmission,
        discrepancyThreshold: formData.discrepancyThreshold,
      };

      let homeworkId: string;
      if (mode === "edit" && editId) {
        await assignmentRepo.updateDraft(editId, input);
        homeworkId = editId;
      } else {
        const created = await assignmentRepo.createForCourse(formData.courseId, input);
        homeworkId = created.homeworkId;
      }

      if (!asDraft) {
        await assignmentRepo.publish(homeworkId);
      }
      onSaved?.();
      void navigate(`/teacher/assignment/${homeworkId}`);
    } catch (e) {
      console.error("Failed to save assignment", e);
      setSubmitError(humanizeApiError(e, t("feature.assignmentCreate.publish.errorGeneric")));
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepKey = STEPS[currentStep - 1]?.key;

  const canProceed = () => {
    switch (currentStepKey) {
      case "stepBasics":
        return formData.courseId && formData.title.trim().length > 0;
      case "stepDeadlines":
        return formData.submissionDeadline && formData.reviewDeadline;
      case "stepPeerReview":
        return formData.reviewsPerSubmission >= 1;
      case "stepRubric":
      case "stepPublish":
      default:
        return true;
    }
  };

  const renderStep = () => {
    switch (currentStepKey) {
      case "stepBasics":
        return <StepBasics data={formData} onUpdate={updateFormData} lockCourse={lockCourse} />;
      case "stepDeadlines":
        return <StepDeadlines data={formData} onUpdate={updateFormData} />;
      case "stepRubric":
        return <StepRubric data={formData} onUpdate={updateFormData} rubrics={rubricOptions} />;
      case "stepPeerReview":
        return <StepPeerSession data={formData} onUpdate={updateFormData} />;
      case "stepPublish":
        return (
          <StepPublish
            data={formData}
            onPublish={(asDraft) => void handleSubmit(asDraft)}
            submitting={submitting}
            errorMessage={submitError}
            mode={mode}
            isDirty={isDirty}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title={title}>
      <Breadcrumbs items={[CRUMBS.teacherCourses, { label: title }]} />

      <div className="mt-6 max-w-[1000px] mx-auto">
        <div className="bg-card border border-border shadow-sm rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all
                      ${
                        currentStep > step.id
                          ? "bg-success text-primary-foreground"
                          : currentStep === step.id
                            ? "bg-brand-primary text-primary-foreground"
                            : "bg-card text-muted-foreground border border-border"
                      }
                    `}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span
                    className={`
                      mt-2 text-xs desktop:text-13 text-center
                      ${currentStep === step.id ? "text-foreground font-medium" : "text-muted-foreground"}
                    `}
                  >
                    {step.shortName}
                  </span>
                </div>

                {index < STEPS.length - 1 && (
                  <div
                    className={`
                      h-0.5 flex-1 mx-2 transition-all
                      ${currentStep > step.id ? "bg-success" : "bg-border"}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border shadow-sm rounded-xl p-8 mb-6">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1 || submitting}
            className="flex items-center gap-2 px-4 py-3 border border-border text-foreground rounded-md hover:bg-surface-hover hover:border-border-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("teacher.createAssignment.backBtn")}
          </button>

          <div className="text-sm text-muted-foreground">
            {t("teacher.createAssignment.stepOf", { current: currentStep, total: STEPS.length })}
          </div>

          {currentStep < lastStepId ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-md hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {t("teacher.createAssignment.nextBtn")}
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div aria-hidden className="invisible flex items-center gap-2 px-6 py-3">
              <span>{t("teacher.createAssignment.nextBtn")}</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
