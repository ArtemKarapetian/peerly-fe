import { CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ApiError, humanizeApiError } from "@/shared/api";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignedSubmission, useSubmitReview, useSubmittedReview } from "@/entities/review";

import { parseReview } from "@/features/review/fill-review/model/markdown";
import {
  emptyScoresFor,
  parseRubricFromChecklist,
} from "@/features/review/fill-review/model/rubric";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { useAssignedReviewsInbox } from "@/widgets/reviews-inbox";

import { ReviewForm } from "./ReviewForm";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export default function ReviewPage() {
  const { reviewId: submissionId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    data: submission,
    isLoading: subLoading,
    error: subError,
  } = useAssignedSubmission(submissionId);
  const existingReviewId = submission?.submittedReviewId ?? null;
  const { data: existingReview, isLoading: revLoading } = useSubmittedReview(existingReviewId);
  const { data: inbox } = useAssignedReviewsInbox();
  const submitMutation = useSubmitReview();
  const [now] = useState(() => Date.now());

  const waitingForExisting = existingReviewId !== null && revLoading;
  const isLoading = subLoading || waitingForExisting;

  const inboxEntry = inbox?.find((r) => r.id === submissionId);
  const deadlineTs = inboxEntry?.reviewDeadlineTimestamp ?? 0;
  const deadlineLabel = inboxEntry?.reviewDeadline ?? "";
  const inboxSaysDeadlinePassed = deadlineTs > 0 && deadlineTs <= now;
  const isDeadlineSoon = deadlineTs > now && deadlineTs - now < TWO_DAYS_MS;

  const subErrorIsApi = subError instanceof ApiError;
  const subErrorIsClosed =
    subErrorIsApi && subError.status === 400 && humanizeApiError(subError, "").length > 0;
  const isDeadlinePassed = inboxSaysDeadlinePassed || subErrorIsClosed;

  const breadcrumbItems = [
    { label: t("page.reviewFill.breadcrumbCourses"), href: "/student/courses" },
    { label: t("nav.reviews"), href: "/student/reviews" },
    { label: t("page.reviewFill.breadcrumbReview") },
  ];

  if (!isLoading && !submission && isDeadlinePassed) {
    const beMessage = subErrorIsApi
      ? humanizeApiError(subError, t("page.reviewFill.deadlinePassedDesc"))
      : t("page.reviewFill.deadlinePassedDesc");
    return (
      <AppShell title={t("page.reviewFill.title")}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[400px] mt-6">
          <div className="bg-error-light border border-error rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center">
                <Clock className="size-7 text-destructive" />
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.reviewFill.deadlinePassedTitle")}
            </h2>
            <p className="text-[16px] text-foreground leading-[1.5] mb-6 whitespace-pre-line">
              {beMessage}
            </p>
            <button
              onClick={() => void navigate("/student/reviews")}
              className="px-6 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-[12px] transition-colors text-[15px] font-medium"
            >
              {t("page.reviewFill.backToReviews")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isLoading && !submission) {
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

  if (isLoading || !submission) {
    return (
      <AppShell title={t("page.reviewFill.title")}>
        <p className="mt-6 text-[14px] text-text-tertiary">{t("common.loading")}</p>
      </AppShell>
    );
  }

  const readonly = existingReviewId !== null;

  if (!readonly && isDeadlinePassed) {
    return (
      <AppShell title={t("page.reviewFill.title")}>
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-center min-h-[400px] mt-6">
          <div className="bg-error-light border border-error rounded-[20px] p-8 max-w-[480px] text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-card rounded-full mx-auto flex items-center justify-center">
                <Clock className="size-7 text-destructive" />
              </div>
            </div>
            <h2 className="text-[24px] font-medium text-foreground mb-3 tracking-[-0.5px]">
              {t("page.reviewFill.deadlinePassedTitle")}
            </h2>
            <p className="text-[16px] text-foreground leading-[1.5] mb-6">
              {t("page.reviewFill.deadlinePassedDesc")}
            </p>
            <button
              onClick={() => void navigate("/student/reviews")}
              className="px-6 py-3 bg-card border border-border hover:bg-surface-hover text-foreground rounded-[12px] transition-colors text-[15px] font-medium"
            >
              {t("page.reviewFill.backToReviews")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  const parsed = existingReview ? parseReview(existingReview.comment ?? "") : null;

  const criteria =
    parsed && parsed.criteria.length > 0
      ? parsed.criteria
      : parseRubricFromChecklist(submission.checklist ?? "");

  const initialScores = parsed?.scores.length ? parsed.scores : emptyScoresFor(criteria);
  const initialOverallComment = parsed?.overallComment ?? "";

  return (
    <AppShell title={t("page.reviewFill.title")}>
      <Breadcrumbs items={breadcrumbItems} />

      {!readonly && deadlineLabel && (
        <div
          className={`mt-4 rounded-[16px] p-4 flex items-start gap-3 border-2 ${
            isDeadlineSoon ? "bg-warning-light border-warning" : "bg-muted border-transparent"
          }`}
        >
          <Clock
            className={`w-5 h-5 shrink-0 mt-0.5 ${
              isDeadlineSoon ? "text-warning" : "text-muted-foreground"
            }`}
          />
          <p
            className={`text-[14px] ${
              isDeadlineSoon ? "text-foreground font-medium" : "text-muted-foreground"
            }`}
          >
            {isDeadlineSoon
              ? t("page.reviewFill.deadlineSoonBanner", { date: deadlineLabel })
              : t("page.reviewFill.deadlineBanner", { date: deadlineLabel })}
          </p>
        </div>
      )}

      {readonly && (
        <div className="mt-4 bg-success-light border-2 border-success rounded-[16px] p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[16px] font-medium text-foreground mb-1">
              {t("page.reviewFill.submittedTitle")}
            </h3>
            <p className="text-[14px] text-foreground">{t("page.reviewFill.submittedDesc")}</p>
          </div>
        </div>
      )}

      <ReviewForm
        key={existingReviewId ?? "new"}
        submission={submission}
        criteria={criteria}
        readonly={readonly}
        initialScores={initialScores}
        initialOverallComment={initialOverallComment}
        isSubmitting={submitMutation.isPending}
        onSubmit={({ mark, comment }) =>
          submitMutation.mutate(
            { submissionId, mark, comment },
            {
              onSuccess: () => {
                toast.success(t("page.reviewFill.successToast"));
                setTimeout(() => void navigate("/student/reviews"), 600);
              },
            },
          )
        }
      />
    </AppShell>
  );
}
