import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { assignmentRepo } from "@/entities/assignment";

import {
  StepBasics,
  StepDeadlines,
  StepRubric,
  StepPeerSession,
  StepPublish,
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

const getInitialFormData = (): AssignmentFormData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
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
        submissionDeadline: parsed.submissionDeadline ? new Date(parsed.submissionDeadline) : null,
        reviewDeadline: parsed.reviewDeadline ? new Date(parsed.reviewDeadline) : null,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (e) {
      console.error("Failed to parse assignment draft", e);
    }
  }

  return {
    courseId: "",
    title: "",
    description: "",
    submissionDeadline: null,
    reviewDeadline: null,
    rubricId: null,
    reviewsPerSubmission: 3,
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

interface TeacherCreateAssignmentPageProps {
  courseId?: string;
}

export default function TeacherCreateAssignmentPage({
  courseId,
}: TeacherCreateAssignmentPageProps) {
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
  const [formData, setFormData] = useState<AssignmentFormData>(() => {
    const initial = getInitialFormData();
    if (courseId) {
      initial.courseId = courseId;
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

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

  const handlePublish = async (asDraft: boolean) => {
    if (!formData.courseId || !formData.submissionDeadline || !formData.reviewDeadline) {
      setSubmitError(t("feature.assignmentCreate.publish.errorMissingFields"));
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const { homeworkId } = await assignmentRepo.createForCourse(formData.courseId, {
        title: formData.title,
        description: formData.description || undefined,
        checklist: buildChecklist() || undefined,
        dueDate: formData.submissionDeadline,
        reviewDeadline: formData.reviewDeadline,
        reviewCount: formData.reviewsPerSubmission,
      });
      if (!asDraft) {
        try {
          await assignmentRepo.publish(homeworkId);
        } catch (e) {
          console.error("Failed to publish homework", e);
        }
      }
      localStorage.removeItem(STORAGE_KEY);
      void navigate(`/teacher/assignment/${homeworkId}`);
    } catch (e) {
      console.error("Failed to create assignment", e);
      setSubmitError(
        e instanceof Error ? e.message : t("feature.assignmentCreate.publish.errorGeneric"),
      );
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
        return <StepBasics data={formData} onUpdate={updateFormData} />;
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
            onPublish={(asDraft) => void handlePublish(asDraft)}
            submitting={submitting}
            errorMessage={submitError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title={t("teacher.createAssignment.title")}>
      <Breadcrumbs
        items={[CRUMBS.teacherCourses, { label: t("teacher.createAssignment.title") }]}
      />

      <div className="mt-6 max-w-[1000px] mx-auto">
        {/* Step Indicator */}
        <div className="bg-card border border-border shadow-sm rounded-[20px] p-6 mb-6">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-[14px] font-medium transition-all
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
                  {/* Step Label */}
                  <span
                    className={`
                      mt-2 text-[12px] desktop:text-[13px] text-center
                      ${currentStep === step.id ? "text-foreground font-medium" : "text-muted-foreground"}
                    `}
                  >
                    {step.shortName}
                  </span>
                </div>

                {/* Connector Line */}
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

        {/* Step Content */}
        <div className="bg-card border border-border shadow-sm rounded-[20px] p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < lastStepId && (
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-3 border border-border text-foreground rounded-[12px] hover:bg-surface-hover hover:border-border-strong transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              {t("teacher.createAssignment.backBtn")}
            </button>

            <div className="text-[14px] text-muted-foreground">
              {t("teacher.createAssignment.stepOf", { current: currentStep, total: STEPS.length })}
            </div>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-primary-foreground rounded-[12px] hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {t("teacher.createAssignment.nextBtn")}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
