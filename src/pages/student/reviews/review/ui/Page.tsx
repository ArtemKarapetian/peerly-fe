import { Send, CheckCircle, RotateCcw, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";

import { debounce } from "@/shared/lib/debounce.ts";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";
import { SaveStatusIndicator } from "@/shared/ui/SaveStatusIndicator";
import type { SaveStatus } from "@/shared/ui/SaveStatusIndicator";

import { useReviewStore } from "@/entities/review/api/reviewRepo.mock.ts";

import type { CriterionScore } from "@/features/review";
import { RubricSection, ReviewProgress } from "@/features/review";
import {
  saveDraftToStorage,
  loadDraftFromStorage,
  clearDraftFromStorage,
} from "@/features/review/fill-review/model/draftStorage.ts";
import { WorkPreviewCard } from "@/features/submission";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import {
  workFiles,
  validationChecks,
  rubricSections,
  allCriteria,
  requiredCriteria,
  minOverallCommentLength,
} from "../model/mockReviewData";

export default function ReviewPage() {
  const { reviewId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { getReview } = useReviewStore();
  const review = getReview(reviewId);

  // Extract review data (use defaults if review is null)
  const courseName = review?.courseName ?? "";
  const taskTitle = review?.taskTitle ?? "";
  const courseId = review?.courseId ?? "";
  const taskId = review?.taskId ?? "";

  // State - ALL hooks must be called unconditionally
  // Load draft (if any) synchronously during initial render via lazy initializers
  const getDraft = () => {
    if (!review) return null;
    try {
      return loadDraftFromStorage(courseId, taskId, reviewId);
    } catch {
      return null;
    }
  };

  const draft = getDraft();

  const [scores, setScores] = useState<CriterionScore[]>(() => {
    if (draft) return draft.scores;
    return allCriteria.map((criterion) => ({
      criterionId: criterion.id,
      score: null,
      comment: "",
    }));
  });

  const [overallComment, setOverallComment] = useState<string>(() =>
    draft ? draft.overallComment : "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showDraftToast, setShowDraftToast] = useState<boolean>(() => !!draft);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveError, setShowSaveError] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<number | undefined>(() =>
    draft ? draft.lastSaved : undefined,
  );
  const [focusedCriterionId, setFocusedCriterionId] = useState<string | null>(null);

  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle score change
  const handleScoreChange = useCallback((criterionId: string, newScore: CriterionScore) => {
    setScores((prev) => prev.map((s) => (s.criterionId === criterionId ? newScore : s)));

    // Clear error for this criterion
    setErrors((prev) => {
      if (prev[criterionId]) {
        const newErrors = { ...prev };
        delete newErrors[criterionId];
        return newErrors;
      }
      return prev;
    });
  }, []);

  // If draft was restored on initial render, hide the restoration toast after a short delay
  useEffect(() => {
    if (draft) {
      const t = setTimeout(() => setShowDraftToast(false), 4000);
      return () => clearTimeout(t);
    }
    return;
    // draft is derived from review/course/task ids at render time
  }, [draft]);

  // Auto-save to localStorage (debounced)
  const debouncedSave = useMemo(
    () =>
      debounce(() => {
        if (isSubmitted || !review) return;

        setSaveStatus("saving");
        const success = saveDraftToStorage(courseId, taskId, reviewId, scores, overallComment);

        if (success) {
          // Use a simple counter to track saves instead of timestamp
          setLastSavedTimestamp((prev) => (prev ?? 0) + 1);
          setSaveStatus("saved");
        } else {
          setSaveStatus("error");
          setShowSaveError(true);
          setTimeout(() => setShowSaveError(false), 5000);
        }
      }, 1000),
    [courseId, taskId, reviewId, scores, overallComment, isSubmitted, review],
  );

  // Trigger auto-save on changes: schedule setSaveStatus and debouncedSave asynchronously to avoid cascading renders
  useEffect(() => {
    if (scores.length > 0 && review) {
      const t = setTimeout(() => {
        setSaveStatus("unsaved");
        debouncedSave();
      }, 0);
      return () => clearTimeout(t);
    }
  }, [scores, overallComment, debouncedSave, review]);

  // Auto-save every 10 seconds
  useEffect(() => {
    if (isSubmitted || !review) return;

    saveIntervalRef.current = setInterval(() => {
      const success = saveDraftToStorage(courseId, taskId, reviewId, scores, overallComment);
      if (success) {
        const now = Date.now();
        setLastSavedTimestamp(now);
        setSaveStatus("saved");
      }
    }, 10000);

    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [courseId, taskId, reviewId, scores, overallComment, isSubmitted, review]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted || !review) return;

      const target = e.target as HTMLElement;
      const isTyping = target.tagName === "TEXTAREA" || target.tagName === "INPUT";

      // If typing in input/textarea, require Alt key
      if (isTyping && !e.altKey) return;

      // Number keys 1-5: set score
      if (e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const score = parseInt(e.key, 10);

        // Find criterion to score
        let criterionId = focusedCriterionId;
        if (!criterionId) {
          // Use first criterion in view
          const firstCriterion = document.querySelector("[data-criterion-id]");
          criterionId = firstCriterion?.getAttribute("data-criterion-id") || null;
        }

        if (criterionId) {
          const currentScore = scores.find((s) => s.criterionId === criterionId);
          if (currentScore) {
            handleScoreChange(criterionId, { ...currentScore, score });
          }
        }
      }

      // 0: Clear score
      if (e.key === "0") {
        e.preventDefault();
        let criterionId = focusedCriterionId;
        if (!criterionId) {
          const firstCriterion = document.querySelector("[data-criterion-id]");
          criterionId = firstCriterion?.getAttribute("data-criterion-id") || null;
        }

        if (criterionId) {
          const currentScore = scores.find((s) => s.criterionId === criterionId);
          if (currentScore) {
            handleScoreChange(criterionId, { ...currentScore, score: null });
          }
        }
      }

      // Arrow keys: Navigate between criteria
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const allCriteriaElements = Array.from(document.querySelectorAll("[data-criterion-id]"));

        if (allCriteriaElements.length === 0) return;

        let currentIndex = -1;
        if (focusedCriterionId) {
          currentIndex = allCriteriaElements.findIndex(
            (el) => el.getAttribute("data-criterion-id") === focusedCriterionId,
          );
        }

        let nextIndex: number;
        if (e.key === "ArrowUp") {
          nextIndex = currentIndex > 0 ? currentIndex - 1 : allCriteriaElements.length - 1;
        } else {
          nextIndex = currentIndex < allCriteriaElements.length - 1 ? currentIndex + 1 : 0;
        }

        const nextElement = allCriteriaElements[nextIndex];
        const nextCriterionId = nextElement.getAttribute("data-criterion-id");
        if (nextCriterionId) {
          setFocusedCriterionId(nextCriterionId);
          (nextElement as HTMLElement).focus();
          nextElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [scores, focusedCriterionId, isSubmitted, handleScoreChange, review]);

  // Calculate progress
  const filledCriteria = scores.filter((s) => s.score !== null).length;

  // If review not found, show error
  if (!review) {
    return (
      <AppShell title={t("page.reviewFill.notFoundTitle")}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-muted rounded-[20px] p-8 max-w-[480px] text-center">
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.reviewFill.notFoundTitle")}
            </h2>
            <p className="text-[16px] text-muted-foreground leading-[1.5] mb-6">
              {t("page.reviewFill.notFoundDesc")}
            </p>
            <button
              onClick={() => void navigate("/student/reviews")}
              className="px-6 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
            >
              {t("page.reviewFill.backToReviews")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    requiredCriteria.forEach((criterion) => {
      const score = scores.find((s) => s.criterionId === criterion.id);
      if (!score || score.score === null) {
        newErrors[criterion.id] = t("page.reviewFill.requiredField");
      }

      if (criterion.commentRequired && (!score?.comment || score.comment.trim() === "")) {
        newErrors[criterion.id] = t("page.reviewFill.commentRequired");
      }

      if (
        criterion.minCommentLength &&
        score?.comment &&
        score.comment.length < criterion.minCommentLength
      ) {
        newErrors[criterion.id] = t("page.reviewFill.minChars", {
          count: criterion.minCommentLength,
        });
      }
    });

    if (overallComment.length < minOverallCommentLength) {
      newErrors["overall"] = t("page.reviewFill.minChars", { count: minOverallCommentLength });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Can submit?
  const canSubmit = () => {
    const allRequiredFilled = requiredCriteria.every((criterion) => {
      const score = scores.find((s) => s.criterionId === criterion.id);
      return score && score.score !== null;
    });

    const commentValid = overallComment.length >= minOverallCommentLength;
    return allRequiredFilled && commentValid && !isSubmitted;
  };

  // Submit review
  const handleSubmit = () => {
    if (!validate()) {
      const firstErrorElement = document.querySelector("[data-error]");
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    setShowSuccessToast(true);

    // Clear draft after successful submit
    clearDraftFromStorage(courseId, taskId, reviewId);

    setTimeout(() => setShowSuccessToast(false), 5000);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset draft
  const handleResetDraft = () => {
    setShowResetModal(true);
  };

  const confirmResetDraft = () => {
    clearDraftFromStorage(courseId, taskId, reviewId);

    // Reset to default state
    const initialScores: CriterionScore[] = allCriteria.map((criterion) => ({
      criterionId: criterion.id,
      score: null,
      comment: "",
    }));
    setScores(initialScores);
    setOverallComment("");
    setErrors({});
    setSaveStatus("saved");
    setShowResetModal(false);
  };

  // Handlers
  const handleDownloadFile = (fileId: string) => {
    alert(t("page.reviewFill.downloadFile", { fileId }));
  };

  const handleOpenInNewWindow = () => {
    window.open("#", "_blank");
  };

  return (
    <AppShell title={t("page.reviewFill.title")}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Breadcrumbs
          items={[
            { label: t("page.reviewFill.breadcrumbCourses"), href: "/student/courses" },
            { label: courseName, href: `/student/courses/${courseId}` },
            { label: taskTitle, href: `/student/courses/${courseId}/tasks/${taskId}` },
            { label: t("page.reviewFill.breadcrumbReview") },
          ]}
        />

        <div className="flex items-center gap-3">
          <SaveStatusIndicator status={saveStatus} lastSavedTimestamp={lastSavedTimestamp} />

          {!isSubmitted && (
            <button
              onClick={handleResetDraft}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title={t("page.reviewFill.resetDraft")}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden tablet:inline">{t("page.reviewFill.resetLabel")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Error Banner */}
      {showSaveError && (
        <div className="bg-error-light border-2 border-error rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-error shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-foreground mb-1">
              {t("page.reviewFill.saveErrorTitle")}
            </h3>
            <p className="text-[14px] text-foreground">{t("page.reviewFill.saveErrorDesc")}</p>
          </div>
        </div>
      )}

      {/* Draft Restored Toast */}
      {showDraftToast && (
        <div className="bg-info-light border-2 border-brand-primary rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-brand-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-foreground mb-1">
              {t("page.reviewFill.draftRestoredTitle")}
            </h3>
            <p className="text-[14px] text-foreground">{t("page.reviewFill.draftRestoredDesc")}</p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {isSubmitted && (
        <div className="bg-success-light border-2 border-success rounded-[16px] p-4 mb-6 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-foreground mb-1">
              {t("page.reviewFill.submittedTitle")}
            </h3>
            <p className="text-[14px] text-foreground">{t("page.reviewFill.submittedDesc")}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="desktop:grid desktop:grid-cols-[1fr_360px] desktop:gap-6 desktop:items-start">
        <div className="space-y-6">
          <WorkPreviewCard
            files={workFiles}
            validationChecks={validationChecks}
            onDownloadFile={handleDownloadFile}
            onOpenInNewWindow={handleOpenInNewWindow}
          />

          {rubricSections.map((section) => (
            <RubricSection
              key={section.id}
              section={section}
              scores={scores}
              onScoreChange={handleScoreChange}
              errors={errors}
              readonly={isSubmitted}
              onCriterionFocus={setFocusedCriterionId}
            />
          ))}

          <div className="bg-card border-2 border-border rounded-[16px] p-4 desktop:p-6">
            <h3 className="text-[18px] desktop:text-[20px] font-medium text-foreground tracking-[-0.5px] mb-4">
              {t("page.reviewFill.overallComment")}
              <span className="text-error ml-1">*</span>
            </h3>
            <textarea
              value={overallComment}
              onChange={(e) => {
                setOverallComment(e.target.value);
                if (errors["overall"]) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors["overall"];
                    return newErrors;
                  });
                }
              }}
              disabled={isSubmitted}
              rows={6}
              placeholder={t("page.reviewFill.overallCommentPlaceholder")}
              className={`
                w-full px-4 py-3 border-2 rounded-[12px] text-[14px] text-foreground 
                placeholder:text-text-tertiary transition-colors resize-none
                ${errors["overall"] ? "border-error bg-error-light" : "border-border focus:border-brand-primary-light"}
                ${isSubmitted ? "bg-muted cursor-not-allowed" : "bg-card"}
              `}
            />
            <div className="flex items-center justify-between mt-2">
              <p
                className={`text-[13px] ${
                  overallComment.length >= minOverallCommentLength
                    ? "text-success"
                    : errors["overall"]
                      ? "text-error"
                      : "text-muted-foreground"
                }`}
              >
                {overallComment.length} / {minOverallCommentLength}{" "}
                {t("page.reviewFill.characters")}
              </p>
              {errors["overall"] && <p className="text-[13px] text-error">{errors["overall"]}</p>}
            </div>
          </div>

          {/* Mobile/Tablet Actions */}
          {!isSubmitted && (
            <div className="desktop:hidden bg-muted border-2 border-border rounded-[16px] p-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{t("page.reviewFill.submitReview")}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="hidden desktop:block desktop:sticky desktop:top-6 space-y-4">
          <ReviewProgress
            filledCriteria={filledCriteria}
            totalCriteria={requiredCriteria.length}
            overallCommentLength={overallComment.length}
            minOverallCommentLength={minOverallCommentLength}
            tips={[t("page.reviewFill.tip1"), t("page.reviewFill.tip2"), t("page.reviewFill.tip3")]}
          />

          {!isSubmitted && (
            <div className="bg-card border-2 border-border rounded-[16px] p-4">
              <button
                onClick={handleSubmit}
                disabled={!canSubmit()}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{t("page.reviewFill.submitReview")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="desktop:hidden mt-6">
        <ReviewProgress
          filledCriteria={filledCriteria}
          totalCriteria={requiredCriteria.length}
          overallCommentLength={overallComment.length}
          minOverallCommentLength={minOverallCommentLength}
          tips={[t("page.reviewFill.tip1"), t("page.reviewFill.tip2"), t("page.reviewFill.tip3")]}
        />
      </div>

      {/* Confirm Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-[20px] p-6 max-w-md w-full">
            <h3 className="text-[20px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.reviewFill.confirmTitle")}
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.5] mb-6">
              {t("page.reviewFill.confirmDesc")}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-muted hover:bg-border text-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                {t("page.reviewFill.confirmCancel")}
              </button>
              <button
                onClick={() => void confirmSubmit()}
                className="flex-1 px-4 py-3 bg-brand-primary hover:bg-brand-primary-hover text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                {t("page.reviewFill.confirmSubmit")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Draft Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-[20px] p-6 max-w-md w-full">
            <h3 className="text-[20px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.reviewFill.resetTitle")}
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.5] mb-6">
              {t("page.reviewFill.resetDesc")}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-3 bg-muted hover:bg-border text-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                {t("page.reviewFill.resetCancel")}
              </button>
              <button
                onClick={confirmResetDraft}
                className="flex-1 px-4 py-3 bg-destructive hover:bg-destructive text-primary-foreground rounded-[12px] text-[15px] font-medium transition-colors"
              >
                {t("page.reviewFill.resetConfirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-20 right-4 bg-success text-primary-foreground rounded-[12px] px-4 py-3 shadow-lg z-50 flex items-center gap-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span className="text-[14px] font-medium">{t("page.reviewFill.successToast")}</span>
        </div>
      )}
    </AppShell>
  );
}
