import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Session } from "@/shared/api";

import { groupHttpRepo } from "./httpRepo";

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

describe("groupHttpRepo", () => {
  it("listForCourse uses student prefix by default", async () => {
    httpMock.get.mockResolvedValueOnce({ groups: [] });
    await groupHttpRepo.listForCourse("c-1");
    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/student\/courses\/c-1\/groups\?/);
  });

  it("listForCourse uses teacher prefix when role is Teacher", async () => {
    currentSession = { userId: "t-1", userName: "T", email: "t@x", role: "Teacher" };
    httpMock.get.mockResolvedValueOnce({
      groups: [{ id: "g-1", name: "G", courseId: "c-1" }],
    });

    const out = await groupHttpRepo.listForCourse("c-1");

    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/teacher\/courses\/c-1\/groups\?/);
    expect(out[0]).toEqual({ id: "g-1", name: "G", courseId: "c-1" });
  });

  it("getById returns undefined on error", async () => {
    httpMock.get.mockRejectedValueOnce(new Error("nope"));
    expect(await groupHttpRepo.getById("g-x")).toBeUndefined();
  });

  it("getById maps the response", async () => {
    httpMock.get.mockResolvedValueOnce({
      group: { id: "g-2", name: "G2", courseId: "c-2" },
    });
    const out = await groupHttpRepo.getById("g-2");
    expect(httpMock.get.mock.calls[0][0]).toBe("/student/groups/g-2");
    expect(out?.name).toBe("G2");
  });

  it("getParticipants maps the participants response", async () => {
    httpMock.get.mockResolvedValueOnce({
      students: [{ id: "s-1", userName: "S" }],
      teachers: [],
    });
    const out = await groupHttpRepo.getParticipants("g-3");
    expect(httpMock.get.mock.calls[0][0]).toBe("/groups/g-3/participants");
    expect(out.students).toEqual([{ id: "s-1", userName: "S" }]);
  });

  it("create POSTs name+courseId and returns the new id", async () => {
    httpMock.post.mockResolvedValueOnce({ groupId: 5 });
    const out = await groupHttpRepo.create({ courseId: "c-1", name: "New" });

    expect(httpMock.post.mock.calls[0][0]).toBe("/groups");
    expect(httpMock.post.mock.calls[0][1]).toEqual({ courseId: "c-1", name: "New" });
    expect(out).toEqual({ id: "5", name: "New", courseId: "c-1" });
  });

  it("update, delete, addStudent and addTeacher hit the right endpoints", async () => {
    httpMock.put.mockResolvedValue(undefined);
    httpMock.delete.mockResolvedValue(undefined);

    await groupHttpRepo.update("g-1", { courseId: "c-1", name: "Renamed" });
    await groupHttpRepo.delete("g-1");
    await groupHttpRepo.addStudent("g-1", "s-1");
    await groupHttpRepo.addTeacher("g-1", "t-1");

    expect(httpMock.put.mock.calls[0][0]).toBe("/groups/g-1");
    expect(httpMock.put.mock.calls[0][1]).toEqual({ name: "Renamed", courseId: "c-1" });
    expect(httpMock.delete.mock.calls[0][0]).toBe("/groups/g-1");
    expect(httpMock.put.mock.calls[1][0]).toBe("/groups/g-1/students");
    expect(httpMock.put.mock.calls[1][1]).toEqual({ studentId: "s-1" });
    expect(httpMock.put.mock.calls[2][0]).toBe("/groups/g-1/teachers");
    expect(httpMock.put.mock.calls[2][1]).toEqual({ teacherId: "t-1" });
  });
});
