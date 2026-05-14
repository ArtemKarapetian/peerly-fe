import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@/shared/api";

import { workHttpRepo } from "./httpRepo";

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

describe("workHttpRepo", () => {
  it("getAll returns [] for non-teachers without hitting the network", async () => {
    currentSession = { userId: "s-1", userName: "S", email: "s@x", role: "Student" };
    const out = await workHttpRepo.getAll();
    expect(out).toEqual([]);
    expect(httpMock.get).not.toHaveBeenCalled();
  });

  it("listForHomework GETs the teacher submissions endpoint", async () => {
    httpMock.get.mockResolvedValueOnce({
      submittedHomeworks: [
        {
          id: "sub-1",
          studentId: "st-1",
          studentName: "S",
          submissionStatus: "submitted",
          studentMark: null,
          teacherMark: null,
        },
      ],
    });

    const out = await workHttpRepo.listForHomework("hw-1");

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/teacher\/homeworks\/hw-1\/submissions\?/);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("sub-1");
  });

  it("getMineForHomework returns null if there is no submission", async () => {
    httpMock.get.mockResolvedValueOnce({ submittedHomeworkId: null });
    const out = await workHttpRepo.getMineForHomework("hw-1");
    expect(out).toBeNull();
    expect(httpMock.get).toHaveBeenCalledTimes(1);
  });

  it("getMineForHomework fetches the submission when an id exists", async () => {
    httpMock.get.mockResolvedValueOnce({ submittedHomeworkId: "sub-7" }).mockResolvedValueOnce({
      submittedHomework: { id: "sub-7", comment: "hi", files: [] },
      submittedReviews: [],
      finalMark: 90,
    });

    const out = await workHttpRepo.getMineForHomework("hw-1");

    expect(httpMock.get.mock.calls[0][0]).toBe("/student/homeworks/hw-1");
    expect(httpMock.get.mock.calls[1][0]).toBe("/submissions/sub-7");
    expect(out?.finalMark).toBe(90);
    expect(out?.content).toBe("hi");
  });

  it("getMineForHomework returns null on errors", async () => {
    httpMock.get.mockRejectedValueOnce(new Error("boom"));
    const out = await workHttpRepo.getMineForHomework("hw-x");
    expect(out).toBeNull();
  });

  it("getMineSubmissionId returns the id as a string", async () => {
    httpMock.get.mockResolvedValueOnce({ submittedHomeworkId: 42 });
    expect(await workHttpRepo.getMineSubmissionId("hw-1")).toBe("42");
  });

  it("getById hits /teacher/submissions when role is Teacher", async () => {
    currentSession = { userId: "t-1", userName: "T", email: "t@x", role: "Teacher" };
    httpMock.get.mockResolvedValueOnce({
      submittedHomework: { id: "sub-2", comment: "x", files: [] },
      submittedReviews: [],
    });

    const out = await workHttpRepo.getById("sub-2");
    expect(httpMock.get.mock.calls[0][0]).toBe("/teacher/submissions/sub-2");
    expect(out?.id).toBe("sub-2");
  });

  it("create POSTs the comment and returns the submission id", async () => {
    httpMock.post.mockResolvedValueOnce({ submittedHomeworkId: 7 });
    const out = await workHttpRepo.create("hw-3", "answer");

    expect(httpMock.post.mock.calls[0][0]).toBe("/homeworks/hw-3/submissions");
    expect(httpMock.post.mock.calls[0][1]).toEqual({ comment: "answer" });
    expect(out.submissionId).toBe("7");
  });

  it("update PUTs the comment", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);
    await workHttpRepo.update("sub-9", "fixed");
    expect(httpMock.put.mock.calls[0][0]).toBe("/submissions/sub-9");
    expect(httpMock.put.mock.calls[0][1]).toEqual({ comment: "fixed" });
  });

  it("delete and correctMark hit the right paths", async () => {
    httpMock.delete.mockResolvedValueOnce(undefined);
    httpMock.put.mockResolvedValueOnce(undefined);

    await workHttpRepo.delete("sub-1");
    await workHttpRepo.correctMark("sub-1", 85);

    expect(httpMock.delete.mock.calls[0][0]).toBe("/submissions/sub-1");
    expect(httpMock.put.mock.calls[0][0]).toBe("/submissions/sub-1/mark");
    expect(httpMock.put.mock.calls[0][1]).toEqual({ teacherMark: 85 });
  });
});
