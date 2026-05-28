import { useState } from "react";
import { useParams } from "react-router-dom";

import { ApiError, humanizeApiError } from "@/shared/api";

import { useAssignedSubmission, useSubmitReview, useSubmittedReview } from "@/entities/review";

import { parseReview } from "@/features/review/fill-review/model/markdown";
import {
  emptyScoresFor,
  parseRubricFromChecklist,
} from "@/features/review/fill-review/model/rubric";

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

  const readonly = existingReviewId !== null;
  const parsed = existingReview ? parseReview(existingReview.comment ?? "") : null;
  const criteria =
    parsed && parsed.criteria.length > 0
      ? parsed.criteria
      : parseRubricFromChecklist(submission?.checklist ?? "");
  const initialScores = parsed?.scores.length ? parsed.scores : emptyScoresFor(criteria);
  const initialOverallComment = parsed?.overallComment ?? "";

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
    initialScores,
    initialOverallComment,
    submitMutation,
  };
}
