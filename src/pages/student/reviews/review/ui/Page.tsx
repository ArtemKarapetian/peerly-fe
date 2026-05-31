import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { humanizeApiError } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";
import { Breadcrumbs } from "@/shared/ui/Breadcrumbs.tsx";

import { AppShell } from "@/widgets/app-shell/AppShell.tsx";

import { useReviewState } from "../model/useReviewState";

import { DeadlineBanner } from "./DeadlineBanner";
import { DeadlinePassedView } from "./DeadlinePassedView";
import { NotFoundView } from "./NotFoundView";
import { ReviewForm } from "./ReviewForm";
import { SubmittedBanner } from "./SubmittedBanner";

export default function ReviewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    submissionId,
    submission,
    subError,
    isLoading,
    existingReviewId,
    inboxEntry,
    deadlineLabel,
    isDeadlineSoon,
    isDeadlinePassed,
    subErrorIsApi,
    readonly,
    criteria,
    initialScores,
    initialOverallComment,
    submitMutation,
  } = useReviewState();

  const breadcrumbItems = [
    { label: t("nav.reviews"), href: "/student/reviews" },
    {
      label: inboxEntry?.taskTitle
        ? `${inboxEntry.taskTitle}${inboxEntry.courseName ? ` · ${inboxEntry.courseName}` : ""}`
        : t("page.reviewFill.breadcrumbReview"),
    },
  ];

  if (!isLoading && !submission && isDeadlinePassed) {
    const beMessage = subErrorIsApi
      ? humanizeApiError(subError, t("page.reviewFill.deadlinePassedDesc"))
      : t("page.reviewFill.deadlinePassedDesc");
    return <DeadlinePassedView message={beMessage} breadcrumbs={breadcrumbItems} />;
  }

  if (!isLoading && !submission) return <NotFoundView />;

  if (isLoading || !submission) {
    return (
      <AppShell title={t("page.reviewFill.title")}>
        <p className="mt-6 text-sm text-text-tertiary">{t("common.loading")}</p>
      </AppShell>
    );
  }

  if (!readonly && isDeadlinePassed) {
    return <DeadlinePassedView breadcrumbs={breadcrumbItems} />;
  }

  return (
    <AppShell title={t("page.reviewFill.title")}>
      <Breadcrumbs items={breadcrumbItems} />

      {!readonly && deadlineLabel && (
        <DeadlineBanner deadlineLabel={deadlineLabel} isSoon={isDeadlineSoon} />
      )}

      {readonly && <SubmittedBanner />}

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
                setTimeout(() => void navigate(ROUTES.reviews), 600);
              },
            },
          )
        }
      />
    </AppShell>
  );
}
