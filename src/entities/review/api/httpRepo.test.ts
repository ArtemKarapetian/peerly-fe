import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@/shared/api";

import { reviewHttpRepo } from "./httpRepo";

const httpMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

let currentSession: Session | null = null;

vi.mock("@/shared/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/api")>("@/shared/api");
  return {
    ...actual,
    http: {
      get: (...args: unknown[]): unknown => httpMock.get(...args),
      post: (...args: unknown[]): unknown => httpMock.post(...args),
      put: (...args: unknown[]): unknown => httpMock.put(...args),
      delete: (...args: unknown[]): unknown => httpMock.delete(...args),
    },
    getSession: () => currentSession,
  };
});

beforeEach(() => {
  httpMock.get.mockReset();
  httpMock.post.mockReset();
  httpMock.put.mockReset();
  httpMock.delete.mockReset();
  currentSession = null;
});

describe("reviewHttpRepo", () => {
  it("getAll returns [] for non-teachers without network", async () => {
    currentSession = { userId: "s-1", userName: "S", email: "s@x", role: "Student" };
    const out = await reviewHttpRepo.getAll();
    expect(out).toEqual([]);
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it("listAssigned maps each entry and includes homeworkId", async () => {
    httpMock.get.mockResolvedValueOnce({
      assignedReviews: [{ submittedHomeworkId: "sub-1", studentId: "st-1", studentName: "P" }],
    });

    const out = await reviewHttpRepo.listAssigned("hw-9");

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/homeworks\/hw-9\/assigned-reviews\?/);
    expect(out).toEqual([
      {
        submissionId: "sub-1",
        studentId: "st-1",
        studentName: "P",
        homeworkId: "hw-9",
      },
    ]);
  });

  it("getAssignedSubmission flattens the API response", async () => {
    httpMock.get.mockResolvedValueOnce({
      submission: {
        submittedHomeworkId: "sub-1",
        comment: "see this",
        files: [{ id: "f1", name: "n", size: 1 }],
        checklist: "task",
        submittedReviewId: "rev-1",
      },
    });

    const out = await reviewHttpRepo.getAssignedSubmission("sub-1");

    expect(httpMock.get.mock.calls[0][0]).toBe("/submissions/sub-1/reviews");
    expect(out.id).toBe("sub-1");
    expect(out.comment).toBe("see this");
    expect(out.files).toEqual([{ id: "f1", name: "n", size: 1 }]);
    expect(out.checklist).toBe("task");
    expect(out.submittedReviewId).toBe("rev-1");
  });

  it("getAssignedSubmission returns null submittedReviewId when missing", async () => {
    httpMock.get.mockResolvedValueOnce({
      submission: {
        submittedHomeworkId: "sub-2",
        comment: "",
        files: [],
        checklist: "",
      },
    });

    const out = await reviewHttpRepo.getAssignedSubmission("sub-2");
    expect(out.submittedReviewId).toBeNull();
  });

  it("create POSTs mark+comment and returns reviewId as string", async () => {
    httpMock.post.mockResolvedValueOnce({ reviewId: 17 });
    const out = await reviewHttpRepo.create("sub-1", 8, "well done");

    expect(httpMock.post.mock.calls[0][0]).toBe("/submissions/sub-1/reviews");
    expect(httpMock.post.mock.calls[0][1]).toEqual({ mark: 8, comment: "well done" });
    expect(out.reviewId).toBe("17");
  });

  it("getById returns null on error", async () => {
    httpMock.get.mockRejectedValueOnce(new Error("nope"));
    expect(await reviewHttpRepo.getById("r-x")).toBeNull();
  });

  it("getById maps the response when successful", async () => {
    httpMock.get.mockResolvedValueOnce({
      submittedReview: { id: "r-1", mark: 4, comment: "ok" },
    });
    const out = await reviewHttpRepo.getById("r-1");
    expect(httpMock.get.mock.calls[0][0]).toBe("/reviews/r-1");
    expect(out?.scores.overall).toBe(4);
  });

  it("update and delete hit the right endpoints", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);
    httpMock.delete.mockResolvedValueOnce(undefined);

    await reviewHttpRepo.update("r-1", 9, "ok");
    await reviewHttpRepo.delete("r-1");

    expect(httpMock.put.mock.calls[0][0]).toBe("/reviews/r-1");
    expect(httpMock.put.mock.calls[0][1]).toEqual({ mark: 9, comment: "ok" });
    expect(httpMock.delete.mock.calls[0][0]).toBe("/reviews/r-1");
  });
});
