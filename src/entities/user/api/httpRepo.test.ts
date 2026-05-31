import { beforeEach, describe, expect, it, vi } from "vitest";

import { userHttpRepo } from "./httpRepo";

const httpMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

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
  };
});

beforeEach(() => {
  httpMock.get.mockReset();
  httpMock.post.mockReset();
  httpMock.put.mockReset();
  httpMock.delete.mockReset();
});

const apiStudent = {
  student_id: "s-1",
  email: "s@x",
  name: "Student One",
  avatar: undefined,
  created_at: "2025-01-01T00:00:00Z",
};

const apiTeacher = {
  teacher_id: "t-1",
  email: "t@x",
  name: "Teacher One",
  avatar: undefined,
  created_at: "2025-01-01T00:00:00Z",
};

describe("userHttpRepo", () => {
  it("search forwards query string to SearchUsers endpoint", async () => {
    httpMock.get.mockResolvedValueOnce({
      users: [
        { id: 1, email: "a@x", name: "Alice", role: "Student" },
        { id: 2, email: "b@x", name: "Bob", role: "Teacher" },
      ],
    });
    const out = await userHttpRepo.search("ali");
    expect(httpMock.get.mock.calls[0][0]).toMatch(/^\/users\?/);
    expect(httpMock.get.mock.calls[0][0]).toContain("filter.query=ali");
    expect(httpMock.get.mock.calls[0][0]).toContain("limit=100");
    expect(out).toHaveLength(2);
    expect(out[0]).toMatchObject({ id: "1", name: "Alice", role: "Student" });
    expect(out[1]).toMatchObject({ id: "2", name: "Bob", role: "Teacher" });
  });

  it("search defaults role to Student when BE omits it", async () => {
    httpMock.get.mockResolvedValueOnce({ users: [{ id: 1, email: "a@x", name: "Alice" }] });
    const out = await userHttpRepo.search("ali");
    expect(out[0].role).toBe("Student");
  });

  it("getStudent calls /students/:id and returns a mapped DemoUser", async () => {
    httpMock.get.mockResolvedValueOnce(apiStudent);
    const out = await userHttpRepo.getStudent("s-1");
    expect(httpMock.get.mock.calls[0][0]).toBe("/students/s-1");
    expect(out.role).toBe("Student");
    expect(out.id).toBe("s-1");
  });

  it("getTeacher calls /teachers/:id and returns a mapped DemoUser", async () => {
    httpMock.get.mockResolvedValueOnce(apiTeacher);
    const out = await userHttpRepo.getTeacher("t-1");
    expect(httpMock.get.mock.calls[0][0]).toBe("/teachers/t-1");
    expect(out.role).toBe("Teacher");
  });

  it("getById falls back to teacher when the student lookup fails", async () => {
    httpMock.get.mockRejectedValueOnce(new Error("404")).mockResolvedValueOnce(apiTeacher);

    const out = await userHttpRepo.getById("t-1");

    expect(httpMock.get.mock.calls[0][0]).toBe("/students/t-1");
    expect(httpMock.get.mock.calls[1][0]).toBe("/teachers/t-1");
    expect(out?.role).toBe("Teacher");
  });

  it("getById returns the student when the first lookup succeeds", async () => {
    httpMock.get.mockResolvedValueOnce(apiStudent);
    const out = await userHttpRepo.getById("s-1");
    expect(out?.role).toBe("Student");
    expect(httpMock.get).toHaveBeenCalledTimes(1);
  });

  it("updateStudent and updateTeacher PUT to /students or /teachers and return mapped users", async () => {
    httpMock.put.mockResolvedValueOnce(apiStudent).mockResolvedValueOnce(apiTeacher);

    const updated1 = await userHttpRepo.updateStudent("s-1", { name: "New" });
    const updated2 = await userHttpRepo.updateTeacher("t-1", { name: "New" });

    expect(httpMock.put.mock.calls[0][0]).toBe("/students/s-1");
    expect(httpMock.put.mock.calls[0][1]).toEqual({ name: "New" });
    expect(updated1.role).toBe("Student");
    expect(httpMock.put.mock.calls[1][0]).toBe("/teachers/t-1");
    expect(updated2.role).toBe("Teacher");
  });
});
