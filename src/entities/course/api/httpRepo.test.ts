import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@/shared/api";

import { courseHttpRepo } from "./httpRepo";

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

describe("courseHttpRepo", () => {
  it("getAll uses /student/courses for students", async () => {
    currentSession = {
      userId: "s-1",
      userName: "s",
      email: "s@x",
      role: "Student",
    };
    httpMock.get.mockResolvedValueOnce({ courseInfos: [] });

    const out = await courseHttpRepo.getAll();

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/student\/courses\?/);
    expect(out).toEqual([]);
  });

  it("getAll uses /teacher/courses for teachers", async () => {
    currentSession = {
      userId: "t-1",
      userName: "t",
      email: "t@x",
      role: "Teacher",
    };
    httpMock.get.mockResolvedValueOnce({
      courseInfos: [
        {
          id: "c-1",
          name: "Algebra",
          description: "",
          status: "inProgress",
          teachers: [],
        },
      ],
    });

    const out = await courseHttpRepo.getAll();

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/teacher\/courses\?/);
    expect(out).toHaveLength(1);
    expect(out[0].id).toBe("c-1");
  });

  it("getById returns undefined on error", async () => {
    httpMock.get.mockRejectedValueOnce(new Error("nope"));
    const out = await courseHttpRepo.getById("c-x");
    expect(out).toBeUndefined();
  });

  it("getById maps counts from the response", async () => {
    currentSession = {
      userId: "t-1",
      userName: "t",
      email: "t@x",
      role: "Teacher",
    };
    httpMock.get.mockResolvedValueOnce({
      courseInfo: {
        id: "c-2",
        name: "C",
        description: "",
        status: "inProgress",
        teachers: [],
      },
      studentCount: 5,
      homeworkCount: 2,
      files: [],
    });

    const out = await courseHttpRepo.getById("c-2");

    expect(httpMock.get.mock.calls[0][0]).toBe("/teacher/courses/c-2");
    expect(out?.enrollmentCount).toBe(5);
    expect(out?.homeworkCount).toBe(2);
  });

  it("getParticipants hits the shared participants endpoint", async () => {
    httpMock.get.mockResolvedValueOnce({ students: [], teachers: [] });
    await courseHttpRepo.getParticipants("c-3");
    expect(httpMock.get.mock.calls[0][0]).toBe("/courses/c-3/participants");
  });

  it("create POSTs name+description and returns a synthesised course", async () => {
    httpMock.post.mockResolvedValueOnce({ courseId: 99 });
    const out = await courseHttpRepo.create({ title: "New", description: "Yo" });

    expect(httpMock.post.mock.calls[0][0]).toBe("/courses");
    expect(httpMock.post.mock.calls[0][1]).toEqual({ name: "New", description: "Yo" });
    expect(out.id).toBe("99");
    expect(out.title).toBe("New");
    expect(out.archived).toBe(false);
  });

  it("archive fetches and PUTs a full body with canceled/inProgress", async () => {
    currentSession = {
      userId: "t-1",
      userName: "t",
      email: "t@x",
      role: "Teacher",
    };
    httpMock.get.mockResolvedValue({
      courseInfo: {
        id: "c-9",
        name: "Algebra",
        description: "desc",
        status: "inProgress",
        teachers: [],
      },
      studentCount: 0,
      homeworkCount: 0,
      files: [],
    });
    httpMock.put.mockResolvedValue(undefined);

    await courseHttpRepo.archive("c-9", true);
    expect(httpMock.put.mock.calls[0][0]).toBe("/courses/c-9");
    expect(httpMock.put.mock.calls[0][1]).toEqual({
      name: "Algebra",
      description: "desc",
      status: "canceled",
    });

    await courseHttpRepo.archive("c-9", false);
    expect(httpMock.put.mock.calls[1][1]).toMatchObject({ status: "inProgress" });
  });

  it("delete DELETEs /courses/:id", async () => {
    httpMock.delete.mockResolvedValueOnce(undefined);
    await courseHttpRepo.delete("c-10");
    expect(httpMock.delete.mock.calls[0][0]).toBe("/courses/c-10");
  });
});
