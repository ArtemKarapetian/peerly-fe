import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { ApiError, humanizeApiError } from "@/shared/api";

import { useAssignedSubmission, useSubmitReview, useSubmittedReview } from "@/entities/review";
import { useRubric } from "@/entities/rubric";

import { emptyScoresFor, type UICriterionScore } from "@/features/review/fill-review/model/rubric";

import { useAssignedReviewsInbox } from "@/widgets/reviews-inbox";

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export function useReviewState() {
  const { reviewId: submissionId = "" } = useParams();

  const {
    data: submission,
    isLoading: subLoading,
    error: subError,
  } = useAssignedSubmission(submissionId);
  const existingReviewId = submission?.submittedReviewId ?? null;
  const { data: existingReview, isLoading: revLoading } = useSubmittedReview(existingReviewId);
  const { data: rubricDetail, isLoading: rubricLoading } = useRubric(
    submission?.rubricId ?? undefined,
  );
  const { data: inbox } = useAssignedReviewsInbox();
  const submitMutation = useSubmitReview();
  const [now] = useState(() => Date.now());

  const waitingForExisting = existingReviewId !== null && revLoading;
  const waitingForRubric = !!submission?.rubricId && rubricLoading;
  const isLoading = subLoading || waitingForExisting || waitingForRubric;

  const inboxEntry = inbox?.find((r) => r.id === submissionId);
  const deadlineTs = inboxEntry?.reviewDeadlineTimestamp ?? 0;
  const deadlineLabel = inboxEntry?.reviewDeadline ?? "";
  const inboxSaysDeadlinePassed = deadlineTs > 0 && deadlineTs <= now;
  const isDeadlineSoon = deadlineTs > now && deadlineTs - now < TWO_DAYS_MS;

  const subErrorIsApi = subError instanceof ApiError;
  const subErrorIsClosed =
    subErrorIsApi && subError.status === 400 && humanizeApiError(subError, "").length > 0;
  const isDeadlinePassed = inboxSaysDeadlinePassed || subErrorIsClosed;

  const readonly = existingReviewId !== null;
  const criteria = useMemo(() => rubricDetail?.criteria ?? [], [rubricDetail]);

  const initialScores: UICriterionScore[] = useMemo(() => {
    if (criteria.length === 0) return [];
    const existingByCriterion = new Map(
      (existingReview?.scores ?? []).map((s) => [s.criterionId, s] as const),
    );
    return criteria.map((c) => {
      const ex = existingByCriterion.get(c.id);
      return {
        criterionId: c.id,
        score: ex?.score ?? null,
        comment: ex?.comment ?? "",
      };
    });
  }, [criteria, existingReview]);

  const fallbackScores = useMemo(() => emptyScoresFor(criteria), [criteria]);
  const initialOverallComment = existingReview?.comment ?? "";

  return {
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
    initialScores: initialScores.length > 0 ? initialScores : fallbackScores,
    initialOverallComment,
    submitMutation,
  };
}
