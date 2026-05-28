export function isValidDate(d: Date | null): d is Date {
  return d !== null && !Number.isNaN(d.getTime());
}

export type DeadlineErrorKey =
  | "submissionInvalid"
  | "submissionPast"
  | "reviewInvalid"
  | "reviewBeforeSubmission";

export interface DeadlineErrors {
  submission: DeadlineErrorKey | null;
  review: DeadlineErrorKey | null;
}

export interface DeadlinesValidation {
  ok: boolean;
  errors: DeadlineErrors;
}

interface ValidateArgs {
  submission: Date | null;
  review: Date | null;
  now?: number;
}

export function validateDeadlines({
  submission,
  review,
  now = Date.now(),
}: ValidateArgs): DeadlinesValidation {
  const errors: DeadlineErrors = { submission: null, review: null };

  if (submission === null) {
    errors.submission = "submissionInvalid";
  } else if (!isValidDate(submission)) {
    errors.submission = "submissionInvalid";
  } else if (submission.getTime() <= now) {
    errors.submission = "submissionPast";
  }

  if (review === null) {
    errors.review = "reviewInvalid";
  } else if (!isValidDate(review)) {
    errors.review = "reviewInvalid";
  } else if (isValidDate(submission) && review.getTime() <= submission.getTime()) {
    errors.review = "reviewBeforeSubmission";
  }

  return { ok: errors.submission === null && errors.review === null, errors };
}
