import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { useAssignedSubmission, useSubmitReview, useSubmittedReview } from "@/entities/review";

import { parseReview } from "@/features/review/fill-review/model/markdown";
import {
  emptyScoresFor,
  parseRubricFromChecklist,
} from "@/features/review/fill-review/model/rubric";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { ReviewForm } from "./ReviewForm";

export default function ReviewPage() {
  const { reviewId: submissionId = "" } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: submission, isLoading: subLoading } = useAssignedSubmission(submissionId);
  const existingReviewId = submission?.submittedReviewId ?? null;
  const { data: existingReview, isLoading: revLoading } = useSubmittedReview(existingReviewId);
  const submitMutation = useSubmitReview();

  const waitingForExisting = existingReviewId !== null && revLoading;
  const isLoading = subLoading || waitingForExisting;

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
  const parsed = existingReview ? parseReview(existingReview.comment ?? "") : null;

  const criteria =
    parsed && parsed.criteria.length > 0
      ? parsed.criteria
      : parseRubricFromChecklist(submission.checklist ?? "");

  const initialScores = parsed?.scores.length ? parsed.scores : emptyScoresFor(criteria);
  const initialOverallComment = parsed?.overallComment ?? "";

  return (
    <AppShell title={t("page.reviewFill.title")}>
      <Breadcrumbs
        items={[
          { label: t("page.reviewFill.breadcrumbCourses"), href: "/student/courses" },
          { label: t("nav.reviews"), href: "/student/reviews" },
          { label: t("page.reviewFill.breadcrumbReview") },
        ]}
      />

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
              onError: () => {
                toast.error(t("page.reviewFill.saveErrorTitle"));
              },
            },
          )
        }
      />
    </AppShell>
  );
}
