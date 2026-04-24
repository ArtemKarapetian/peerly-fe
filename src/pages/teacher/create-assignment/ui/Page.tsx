import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCrumbs } from "@/shared/config/breadcrumbs.ts";
import { isFlagEnabled } from "@/shared/lib/feature-flags";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import {
  StepBasics,
  StepDeadlines,
  StepRubric,
  StepPeerSession,
  StepPlugins,
  StepPublish,
} from "@/features/assignment/create";
import type { AssignmentFormData } from "@/features/assignment/create/model/types";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

/**
 * TeacherCreateAssignmentPage - Мастер создания задания
 *
 * Шаги визарда:
 * 1. Основная информация
 * 2. Дедлайны
 * 3. Рубрика
 * 4. Настройки peer review
 * 5. Плагины и проверки   (только при enablePlugins)
 * 6. Публикация
 */

type StepKey =
  | "stepBasics"
  | "stepDeadlines"
  | "stepRubric"
  | "stepPeerReview"
  | "stepPlugins"
  | "stepPublish";

const ALL_STEP_KEYS: StepKey[] = [
  "stepBasics",
  "stepDeadlines",
  "stepRubric",
  "stepPeerReview",
  "stepPlugins",
  "stepPublish",
];

const STORAGE_KEY = "peerly_assignment_draft";

const getInitialFormData = (): AssignmentFormData => {
  // Try to load draft from localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as AssignmentFormData & {
        submissionDeadline: string | null;
        reviewDeadline: string | null;
        reassignmentDeadline: string | null;
        createdAt: string;
        updatedAt: string;
      };
      // Convert date strings back to Date objects
      return {
        ...parsed,
        submissionDeadline: parsed.submissionDeadline ? new Date(parsed.submissionDeadline) : null,
        reviewDeadline: parsed.reviewDeadline ? new Date(parsed.reviewDeadline) : null,
        reassignmentDeadline: parsed.reassignmentDeadline
          ? new Date(parsed.reassignmentDeadline)
          : null,
        createdAt: new Date(parsed.createdAt),
        updatedAt: new Date(parsed.updatedAt),
      };
    } catch (e) {
      console.error("Failed to parse assignment draft", e);
    }
  }

  // Default values
  return {
    courseId: "",
    title: "",
    description: "",
    taskType: "project",
    attachments: [],
    submissionDeadline: null,
    reviewDeadline: null,
    latePolicy: "soft",
    latePenalty: 10,
    timezone: "Europe/Moscow",
    rubricId: null,
    reviewsPerSubmission: 3,
    distributionMode: "random",
    anonymityMode: "full",
    allowReassignment: true,
    reassignmentDeadline: null,
    enablePlagiarismCheck: true,
    plagiarismThreshold: 15,
    enableLinter: false,
    linterConfig: "",
    enableFormatCheck: true,
    formatRules: ["pdf", "docx", "zip"],
    enableAnonymization: true,
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
  const pluginsEnabled = isFlagEnabled("enablePlugins");
  const STEPS = ALL_STEP_KEYS.filter((key) => key !== "stepPlugins" || pluginsEnabled).map(
    (key, idx) => ({
      id: idx + 1,
      key,
      name: t(`teacher.createAssignment.${key}`),
      shortName: t(`teacher.createAssignment.${key}`),
    }),
  );
  const lastStepId = STEPS.length;
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<AssignmentFormData>(() => {
    const initial = getInitialFormData();
    if (courseId) {
      initial.courseId = courseId;
    }
    return initial;
  });

  // Save draft to localStorage
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

  const handlePublish = (asDraft: boolean) => {
    const finalData = {
      ...formData,
      status: asDraft ? "draft" : "published",
      updatedAt: new Date(),
    };

    // Save to localStorage or backend
    console.log("Publishing assignment:", finalData);

    // Clear draft
    localStorage.removeItem(STORAGE_KEY);

    // Navigate to assignment details (mock for now)
    const assignmentId = `a${Date.now()}`;
    void navigate(`/teacher/assignment/${assignmentId}`);
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
      case "stepPlugins":
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
        return <StepRubric data={formData} onUpdate={updateFormData} />;
      case "stepPeerReview":
        return <StepPeerSession data={formData} onUpdate={updateFormData} />;
      case "stepPlugins":
        return <StepPlugins data={formData} onUpdate={updateFormData} />;
      case "stepPublish":
        return <StepPublish data={formData} onPublish={handlePublish} />;
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
