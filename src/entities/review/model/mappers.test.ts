import { describe, it, expect } from "vitest";

import type { ApiReview } from "./api.types";
import { mapApiReview } from "./mappers";

describe("mapApiReview", () => {
  const api: ApiReview = {
    review_id: "rev-1",
    submission_id: "sub-1",
    reviewer_id: "u-1",
    scores: { clarity: 4, depth: 5 },
    comment: "Great work!",
    submitted_at: "2025-03-20T14:30:00Z",
    status: "submitted",
  };

  it("maps all fields correctly", () => {
    const result = mapApiReview(api);

    expect(result.id).toBe("rev-1");
    expect(result.submissionId).toBe("sub-1");
    expect(result.reviewerId).toBe("u-1");
    expect(result.scores).toEqual({ clarity: 4, depth: 5 });
    expect(result.comment).toBe("Great work!");
    expect(result.status).toBe("submitted");
  });

  it("parses submitted_at into Date when present", () => {
    const result = mapApiReview(api);
    expect(result.submittedAt).toBeInstanceOf(Date);
    expect(result.submittedAt!.toISOString()).toBe("2025-03-20T14:30:00.000Z");
  });

  it("leaves submittedAt undefined when not present", () => {
    const draft: ApiReview = { ...api, submitted_at: undefined };
    const result = mapApiReview(draft);
    expect(result.submittedAt).toBeUndefined();
  });
});
