import { beforeEach, describe, expect, it, vi } from "vitest";

import { ApiError, type Session } from "@/shared/api";

import { rubricHttpRepo } from "./httpRepo";

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
  currentSession = { userId: "t-1", userName: "T", email: "t@x", role: "Teacher" };
});

describe("rubricHttpRepo", () => {
  it("listMine GETs /teacher/rubrics and maps the response", async () => {
    httpMock.get.mockResolvedValueOnce({
      rubrics: [{ id: 1, teacherId: 5, name: "Default" }],
    });
    const out = await rubricHttpRepo.listMine();
    expect(httpMock.get.mock.calls[0]![0]).toBe("/teacher/rubrics");
    expect(out).toEqual([{ id: "1", teacherId: "5", name: "Default" }]);
  });

  it("getById returns mapped detail with criteria sorted by position", async () => {
    httpMock.get.mockResolvedValueOnce({
      rubric: { id: 1, teacherId: 5, name: "R" },
      criteria: [
        { id: 11, name: "B", description: null, maxScore: 5, commentRequired: false, position: 1 },
        { id: 10, name: "A", description: "desc", maxScore: 4, commentRequired: true, position: 0 },
      ],
    });
    const out = await rubricHttpRepo.getById("1");
    expect(httpMock.get.mock.calls[0]![0]).toBe("/teacher/rubrics/1");
    expect(out?.criteria.map((c) => c.id)).toEqual(["10", "11"]);
    expect(out?.criteria[0]!.description).toBe("desc");
    expect(out?.criteria[1]!.description).toBeNull();
  });

  it("getById uses /student/rubrics for Student role", async () => {
    currentSession = { userId: "s-1", userName: "S", email: "s@x", role: "Student" };
    httpMock.get.mockResolvedValueOnce({
      rubric: { id: 1, teacherId: 5, name: "R" },
      criteria: [],
    });
    await rubricHttpRepo.getById("1");
    expect(httpMock.get.mock.calls[0]![0]).toBe("/student/rubrics/1");
  });

  it("getById returns null on 404", async () => {
    httpMock.get.mockRejectedValueOnce(new ApiError(404, null, "not found"));
    expect(await rubricHttpRepo.getById("missing")).toBeNull();
  });

  it("getById rethrows non-404 errors", async () => {
    httpMock.get.mockRejectedValueOnce(new ApiError(500, null, "boom"));
    await expect(rubricHttpRepo.getById("boom")).rejects.toBeInstanceOf(ApiError);
  });

  it("create POSTs /rubrics with positioned criteria and returns the new id", async () => {
    httpMock.post.mockResolvedValueOnce({ rubricId: 7 });
    const out = await rubricHttpRepo.create({
      name: "New",
      criteria: [
        { name: "A", maxScore: 5, commentRequired: false, position: 0 },
        { name: "B", maxScore: 3, commentRequired: true, position: 1 },
      ],
    });

    expect(httpMock.post.mock.calls[0]![0]).toBe("/rubrics");
    expect(httpMock.post.mock.calls[0]![1]).toEqual({
      name: "New",
      criteria: [
        { name: "A", description: undefined, maxScore: 5, commentRequired: false, position: 0 },
        { name: "B", description: undefined, maxScore: 3, commentRequired: true, position: 1 },
      ],
    });
    expect(out).toEqual({ rubricId: "7" });
  });

  it("update PUTs /rubrics/{id} with the body", async () => {
    httpMock.put.mockResolvedValueOnce(undefined);
    await rubricHttpRepo.update("7", {
      name: "Updated",
      criteria: [{ name: "A", maxScore: 5, commentRequired: false, position: 0 }],
    });
    expect(httpMock.put.mock.calls[0]![0]).toBe("/rubrics/7");
    expect(httpMock.put.mock.calls[0]![1]!.name).toBe("Updated");
  });

  it("delete DELETEs /rubrics/{id}", async () => {
    httpMock.delete.mockResolvedValueOnce(undefined);
    await rubricHttpRepo.delete("7");
    expect(httpMock.delete.mock.calls[0]![0]).toBe("/rubrics/7");
  });
});
