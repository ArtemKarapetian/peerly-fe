import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@/shared/api";

import { assignmentHttpRepo } from "./httpRepo";

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

describe("assignmentHttpRepo", () => {
  it("getByCourse hits the student endpoint when role is Student", async () => {
    currentSession = {
      userId: "s-1",
      userName: "S",
      email: "s@test.com",
      role: "Student",
    };
    httpMock.get.mockResolvedValueOnce({ studentHomeworkInfos: [] });

    await assignmentHttpRepo.getByCourse("course-7");

    expect(httpMock.get).toHaveBeenCalledTimes(1);
    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/student\/courses\/course-7\/homeworks\?/);
  });

  it("getByCourse hits the teacher endpoint when role is Teacher", async () => {
    currentSession = {
      userId: "t-1",
      userName: "T",
      email: "t@test.com",
      role: "Teacher",
    };
    httpMock.get.mockResolvedValueOnce({
      teacherHomeworkInfos: [
        {
          id: "hw-1",
          name: "HW1",
          status: "published",
          deadline: "2026-01-01T00:00:00Z",
        },
      ],
    });

    const out = await assignmentHttpRepo.getByCourse("c-9");

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/teacher\/courses\/c-9\/homeworks\?/);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("hw-1");
  });

  it("getById returns undefined when the call fails", async () => {
    currentSession = {
      userId: "s-1",
      userName: "S",
      email: "s@test.com",
      role: "Student",
    };
    httpMock.get.mockRejectedValueOnce(new Error("404"));

    const out = await assignmentHttpRepo.getById("hw-404");
    expect(out).toBeUndefined();
  });

  it("getTeacherDetail returns the assignment plus submittedCount", async () => {
    httpMock.get.mockResolvedValueOnce({
      teacherHomeworkInfo: {
        id: "hw-2",
        name: "HW2",
        status: "published",
        deadline: "2026-02-02T00:00:00Z",
      },
      submittedCount: 7,
      files: [],
    });

    const out = await assignmentHttpRepo.getTeacherDetail("hw-2");

    expect(httpMock.get.mock.calls[0][0]).toBe("/teacher/homeworks/hw-2");
    expect(out?.submittedCount).toBe(7);
    expect(out?.assignment.id).toBe("hw-2");
  });

  it("createForCourse posts to /courses/:id/homeworks and returns the new id", async () => {
    httpMock.post.mockResolvedValueOnce({ homeworkId: 42 });

    const out = await assignmentHttpRepo.createForCourse("c-1", {
      title: "Title",
      dueDate: "2026-01-01T00:00:00Z",
      reviewDeadline: "2026-01-08T00:00:00Z",
      reviewCount: 2,
    });

    expect(httpMock.post.mock.calls[0][0]).toBe("/courses/c-1/homeworks");
    expect(httpMock.post.mock.calls[0][1]).toMatchObject({
      name: "Title",
      amountOfReviewers: 2,
      deadline: "2026-01-01T00:00:00Z",
    });
    expect(out.homeworkId).toBe("42");
  });

  it("createForGroup posts to /groups/:id/homeworks", async () => {
    httpMock.post.mockResolvedValueOnce({ homeworkId: "h-9" });

    await assignmentHttpRepo.createForGroup("g-3", {
      title: "T",
      dueDate: "2026-01-01T00:00:00Z",
      reviewDeadline: "2026-01-08T00:00:00Z",
      reviewCount: 1,
    });

    expect(httpMock.post.mock.calls[0][0]).toBe("/groups/g-3/homeworks");
  });

  it("updateDraft PUTs the mapped body to /homeworks/:id", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);

    await assignmentHttpRepo.updateDraft("hw-x", {
      title: "Updated",
      dueDate: "2026-01-01T00:00:00Z",
      reviewDeadline: "2026-01-08T00:00:00Z",
      reviewCount: 3,
    });

    expect(httpMock.put.mock.calls[0][0]).toBe("/homeworks/hw-x");
    expect(httpMock.put.mock.calls[0][1]).toMatchObject({ name: "Updated", amountOfReviewers: 3 });
  });

  it("postponeDeadlines serialises Date arguments", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);

    await assignmentHttpRepo.postponeDeadlines(
      "hw-x",
      new Date("2026-03-01T00:00:00Z"),
      new Date("2026-03-08T00:00:00Z"),
    );

    expect(httpMock.put.mock.calls[0][0]).toBe("/homeworks/hw-x/deadlines");
    expect(httpMock.put.mock.calls[0][1]).toEqual({
      deadline: "2026-03-01T00:00:00.000Z",
      reviewDeadline: "2026-03-08T00:00:00.000Z",
    });
  });

  it("publish, confirm, delete and archive call the matching endpoints", async () => {
    httpMock.put.mockResolvedValue(undefined);
    httpMock.delete.mockResolvedValue(undefined);

    await assignmentHttpRepo.publish("hw-1");
    await assignmentHttpRepo.confirm("hw-1");
    await assignmentHttpRepo.delete("hw-1");
    await assignmentHttpRepo.archive("hw-1", true);
    await assignmentHttpRepo.archive("hw-1", false);

    expect(httpMock.put.mock.calls.map((c: unknown[]) => c[0])).toEqual([
      "/homeworks/hw-1/publish",
      "/homeworks/hw-1/confirm",
    ]);
    expect(httpMock.delete.mock.calls.map((c: unknown[]) => c[0])).toEqual([
      "/homeworks/hw-1",
      "/homeworks/hw-1",
    ]);
  });
});
