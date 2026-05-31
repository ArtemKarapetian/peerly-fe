import { describe, expect, it } from "vitest";

import { isValidDate, validateDeadlines } from "./validateDeadlines";

const NOW = new Date("2026-06-01T12:00:00Z").getTime();
const FUTURE_1 = new Date("2026-06-10T12:00:00Z");
const FUTURE_2 = new Date("2026-06-20T12:00:00Z");
const PAST = new Date("2025-12-01T12:00:00Z");

describe("isValidDate", () => {
  it("returns true for a real Date", () => {
    expect(isValidDate(new Date("2026-06-01T12:00:00Z"))).toBe(true);
  });
  it("returns false for null", () => {
    expect(isValidDate(null)).toBe(false);
  });
  it("returns false for an Invalid Date", () => {
    expect(isValidDate(new Date("garbage"))).toBe(false);
  });
});

describe("validateDeadlines", () => {
  it("ok when both are future and review > submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: FUTURE_1,
      review: FUTURE_2,
      now: NOW,
    });
    expect(ok).toBe(true);
    expect(errors).toEqual({ submission: null, review: null });
  });

  it("flags null submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: null,
      review: FUTURE_2,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.submission).toBe("submissionInvalid");
  });

  it("flags invalid (NaN) submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: new Date("garbage"),
      review: FUTURE_2,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.submission).toBe("submissionInvalid");
  });

  it("flags past submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: PAST,
      review: FUTURE_2,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.submission).toBe("submissionPast");
  });

  it("flags submission == now as past", () => {
    const { ok, errors } = validateDeadlines({
      submission: new Date(NOW),
      review: FUTURE_2,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.submission).toBe("submissionPast");
  });

  it("flags review equal to submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: FUTURE_1,
      review: FUTURE_1,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.review).toBe("reviewBeforeSubmission");
  });

  it("flags review before submission", () => {
    const { ok, errors } = validateDeadlines({
      submission: FUTURE_2,
      review: FUTURE_1,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.review).toBe("reviewBeforeSubmission");
  });

  it("flags null review", () => {
    const { ok, errors } = validateDeadlines({
      submission: FUTURE_1,
      review: null,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.review).toBe("reviewInvalid");
  });

  it("flags both invalid", () => {
    const { ok, errors } = validateDeadlines({
      submission: null,
      review: null,
      now: NOW,
    });
    expect(ok).toBe(false);
    expect(errors.submission).toBe("submissionInvalid");
    expect(errors.review).toBe("reviewInvalid");
  });

  it("does NOT flag reviewBeforeSubmission when submission is invalid", () => {
    const { errors } = validateDeadlines({
      submission: null,
      review: FUTURE_1,
      now: NOW,
    });
    expect(errors.review).toBeNull();
  });
});
