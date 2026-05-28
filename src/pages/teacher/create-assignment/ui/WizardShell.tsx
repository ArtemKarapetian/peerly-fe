import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { humanizeApiError } from "@/shared/api";
import { assignmentKeys, courseKeys } from "@/shared/api/queryKeys";
import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { assignmentRepo } from "@/entities/assignment";

import {
  StepBasics,
  StepDeadlines,
  StepPeerSession,
  StepPublish,
  StepRubric,
} from "@/features/assignment/create";
import { validateDeadlines } from "@/features/assignment/create/lib/validateDeadlines";
import type { AssignmentFormData, RubricOption } from "@/features/assignment/create/model/types";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { useRubrics } from "@/widgets/rubric-editor";

import { buildChecklist } from "../lib/buildChecklist";
import { saveDraft } from "../lib/draftStorage";

import { WizardFooter } from "./WizardFooter";
import { WizardStepper } from "./WizardStepper";

type StepKey = "stepBasics" | "stepDeadlines" | "stepRubric" | "stepPeerReview" | "stepPublish";

const ALL_STEP_KEYS: StepKey[] = [
  "stepBasics",
  "stepDeadlines",
  "stepRubric",
  "stepPeerReview",
  "stepPublish",
];

export interface WizardShellProps {
  mode: "create" | "edit";
  initialData: AssignmentFormData;
  title: string;
  editId?: string;
  lockCourse?: boolean;
  persistDraftToStorage?: boolean;
  initialStep?: number;
  onSaved?: () => void;
}

export function WizardShell({
  mode,
  initialData,
  title,
  editId,
  lockCourse,
  persistDraftToStorage,
  initialStep = 1,
  onSaved,
}: WizardShellProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const CRUMBS = getCrumbs();
  const rubrics = useRubrics();
  const queryClient = useQueryClient();

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
    shortName: t(`teacher.createAssignment.${key}`),
  }));

  const [currentStep, setCurrentStep] = useState(() =>
    Math.min(Math.max(initialStep, 1), ALL_STEP_KEYS.length),
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<AssignmentFormData>(initialData);

  const isDirty = useMemo(() => !areEqual(formData, initialData), [formData, initialData]);

  useEffect(() => {
    if (!persistDraftToStorage) return;
    saveDraft(formData, currentStep);
  }, [formData, currentStep, persistDraftToStorage]);

  const updateFormData = (updates: Partial<AssignmentFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates, updatedAt: new Date() }));
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

  const handleSubmit = async (asDraft: boolean) => {
    if (!formData.courseId) {
      setSubmitError(t("feature.assignmentCreate.publish.errorMissingFields"));
      return;
    }
    const deadlines = validateDeadlines({
      submission: formData.submissionDeadline,
      review: formData.reviewDeadline,
    });
    if (!deadlines.ok || !formData.submissionDeadline || !formData.reviewDeadline) {
      setSubmitError(t("feature.assignmentCreate.publish.errorInvalidDeadlines"));
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const input = {
        title: formData.title,
        description: formData.description || undefined,
        checklist: buildChecklist(rubrics, formData.rubricId) || undefined,
        dueDate: formData.submissionDeadline,
        reviewDeadline: formData.reviewDeadline,
        reviewCount: formData.reviewsPerSubmission,
        discrepancyThreshold: formData.discrepancyThreshold,
      };

      let homeworkId: string;
      if (mode === "edit" && editId) {
        await assignmentRepo.updateDraft(editId, input);
        homeworkId = editId;
      } else if (formData.groupId) {
        const created = await assignmentRepo.createForGroup(formData.groupId, input);
        homeworkId = created.homeworkId;
      } else {
        const created = await assignmentRepo.createForCourse(formData.courseId, input);
        homeworkId = created.homeworkId;
      }

      if (!asDraft) {
        await assignmentRepo.publish(homeworkId);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: assignmentKeys.all }),
        queryClient.invalidateQueries({ queryKey: courseKeys.detail(formData.courseId) }),
      ]);
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
  const canProceed = checkCanProceed(currentStepKey, formData);

  return (
    <AppShell title={title}>
      <Breadcrumbs items={[CRUMBS.teacherCourses, { label: title }]} />

      <div className="mt-6 max-w-[1000px] mx-auto">
        <WizardStepper steps={STEPS} currentStep={currentStep} />

        <div className="bg-card border border-border shadow-sm rounded-xl p-8 mb-6">
          <StepContent
            stepKey={currentStepKey}
            formData={formData}
            updateFormData={updateFormData}
            rubricOptions={rubricOptions}
            lockCourse={lockCourse}
            mode={mode}
            submitting={submitting}
            submitError={submitError}
            isDirty={isDirty}
            onSubmit={(asDraft) => void handleSubmit(asDraft)}
          />
        </div>

        <WizardFooter
          currentStep={currentStep}
          totalSteps={STEPS.length}
          canProceed={canProceed}
          submitting={submitting}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </div>
    </AppShell>
  );
}

function checkCanProceed(stepKey: StepKey | undefined, formData: AssignmentFormData): boolean {
  switch (stepKey) {
    case "stepBasics":
      return Boolean(formData.courseId) && formData.title.trim().length > 0;
    case "stepDeadlines":
      return validateDeadlines({
        submission: formData.submissionDeadline,
        review: formData.reviewDeadline,
      }).ok;
    case "stepPeerReview":
      return formData.reviewsPerSubmission >= 1;
    case "stepRubric":
    case "stepPublish":
    default:
      return true;
  }
}

interface StepContentProps {
  stepKey: StepKey | undefined;
  formData: AssignmentFormData;
  updateFormData: (u: Partial<AssignmentFormData>) => void;
  rubricOptions: RubricOption[];
  lockCourse?: boolean;
  mode: "create" | "edit";
  submitting: boolean;
  submitError: string | null;
  isDirty: boolean;
  onSubmit: (asDraft: boolean) => void;
}

function StepContent({
  stepKey,
  formData,
  updateFormData,
  rubricOptions,
  lockCourse,
  mode,
  submitting,
  submitError,
  isDirty,
  onSubmit,
}: StepContentProps) {
  switch (stepKey) {
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
          onPublish={onSubmit}
          submitting={submitting}
          errorMessage={submitError}
          mode={mode}
          isDirty={isDirty}
        />
      );
    default:
      return null;
  }
}

function areEqual(a: AssignmentFormData, b: AssignmentFormData): boolean {
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
  return JSON.stringify(norm(a)) === JSON.stringify(norm(b));
}
