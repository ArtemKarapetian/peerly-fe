import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useReviewState } from "./useReviewState";

const {
  useAssignedSubmissionMock,
  useSubmittedReviewMock,
  useRubricMock,
  useInboxMock,
  useSubmitReviewMock,
  useParamsMock,
} = vi.hoisted(() => ({
  useAssignedSubmissionMock: vi.fn(),
  useSubmittedReviewMock: vi.fn(),
  useRubricMock: vi.fn(),
  useInboxMock: vi.fn(),
  useSubmitReviewMock: vi.fn(),
  useParamsMock: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useParams: useParamsMock,
}));

vi.mock("@/entities/review", () => ({
  useAssignedSubmission: useAssignedSubmissionMock,
  useSubmittedReview: useSubmittedReviewMock,
  useSubmitReview: useSubmitReviewMock,
}));

vi.mock("@/entities/rubric", () => ({
  useRubric: useRubricMock,
}));

vi.mock("@/widgets/reviews-inbox", () => ({
  useAssignedReviewsInbox: useInboxMock,
}));

const RUBRIC = {
  rubric: { id: "r1", teacherId: "t1", name: "R" },
  criteria: [
    {
      id: "c1",
      name: "A",
      description: null,
      maxScore: 5,
      commentRequired: false,
      position: 0,
    },
    {
      id: "c2",
      name: "B",
      description: null,
      maxScore: 5,
      commentRequired: false,
      position: 1,
    },
  ],
};

beforeEach(() => {
  useParamsMock.mockReturnValue({ reviewId: "sub-1" });
  useInboxMock.mockReturnValue({ data: [] });
  useSubmitReviewMock.mockReturnValue({ isPending: false, mutate: vi.fn() });
});

describe("useReviewState", () => {
  it("returns empty initialScores when rubric is loading", () => {
    useAssignedSubmissionMock.mockReturnValue({
      data: { id: "sub-1", comment: "", files: [], rubricId: "r1", submittedReviewId: null },
      isLoading: false,
      error: null,
    });
    useSubmittedReviewMock.mockReturnValue({ data: null, isLoading: false });
    useRubricMock.mockReturnValue({ data: null, isLoading: true });

    const { result } = renderHook(() => useReviewState());
    expect(result.current.isLoading).toBe(true);
    expect(result.current.criteria).toEqual([]);
  });

  it("builds one empty UICriterionScore per BE criterion when there is no existing review", () => {
    useAssignedSubmissionMock.mockReturnValue({
      data: { id: "sub-1", comment: "", files: [], rubricId: "r1", submittedReviewId: null },
      isLoading: false,
      error: null,
    });
    useSubmittedReviewMock.mockReturnValue({ data: null, isLoading: false });
    useRubricMock.mockReturnValue({ data: RUBRIC, isLoading: false });

    const { result } = renderHook(() => useReviewState());
    expect(result.current.readonly).toBe(false);
    expect(result.current.criteria).toHaveLength(2);
    expect(result.current.initialScores).toEqual([
      { criterionId: "c1", score: null, comment: "" },
      { criterionId: "c2", score: null, comment: "" },
    ]);
  });

  it("merges existing review.scores into initialScores by criterionId", () => {
    useAssignedSubmissionMock.mockReturnValue({
      data: { id: "sub-1", comment: "", files: [], rubricId: "r1", submittedReviewId: "rv-7" },
      isLoading: false,
      error: null,
    });
    useSubmittedReviewMock.mockReturnValue({
      data: {
        id: "rv-7",
        submissionId: "sub-1",
        reviewerId: "",
        scores: [
          { criterionId: "c1", score: 4, comment: "ok" },
          { criterionId: "c2", score: 5, comment: null },
        ],
        mark: 4,
        comment: "great work overall",
        status: "submitted",
      },
      isLoading: false,
    });
    useRubricMock.mockReturnValue({ data: RUBRIC, isLoading: false });

    const { result } = renderHook(() => useReviewState());
    expect(result.current.readonly).toBe(true);
    expect(result.current.initialOverallComment).toBe("great work overall");
    expect(result.current.initialScores).toEqual([
      { criterionId: "c1", score: 4, comment: "ok" },
      { criterionId: "c2", score: 5, comment: "" },
    ]);
  });

  it("isDeadlinePassed becomes true when inbox deadline is in the past", () => {
    useAssignedSubmissionMock.mockReturnValue({
      data: { id: "sub-1", comment: "", files: [], rubricId: null, submittedReviewId: null },
      isLoading: false,
      error: null,
    });
    useSubmittedReviewMock.mockReturnValue({ data: null, isLoading: false });
    useRubricMock.mockReturnValue({ data: null, isLoading: false });
    useInboxMock.mockReturnValue({
      data: [{ id: "sub-1", reviewDeadlineTimestamp: Date.now() - 1000, reviewDeadline: "" }],
    });

    const { result } = renderHook(() => useReviewState());
    expect(result.current.isDeadlinePassed).toBe(true);
  });
});
