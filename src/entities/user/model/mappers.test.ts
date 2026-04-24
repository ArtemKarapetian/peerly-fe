import { describe, it, expect } from "vitest";

import type { ApiStudent, ApiTeacher } from "./api.types";
import { mapApiStudent, mapApiTeacher } from "./mappers";

describe("mapApiStudent", () => {
  const api: ApiStudent = {
    student_id: "s-1",
    email: "student@test.com",
    name: "Ivan Petrov",
    avatar: "https://example.com/avatar.jpg",
    created_at: "2025-01-01T00:00:00Z",
  };

  it("maps fields and sets role to Student", () => {
    const result = mapApiStudent(api);

    expect(result.id).toBe("s-1");
    expect(result.email).toBe("student@test.com");
    expect(result.name).toBe("Ivan Petrov");
    expect(result.role).toBe("Student");
    expect(result.avatar).toBe("https://example.com/avatar.jpg");
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});

describe("mapApiTeacher", () => {
  const api: ApiTeacher = {
    teacher_id: "t-1",
    email: "teacher@test.com",
    name: "Maria Ivanova",
    avatar: undefined,
    created_at: "2024-09-01T10:00:00Z",
  };

  it("maps fields and sets role to Teacher", () => {
    const result = mapApiTeacher(api);

    expect(result.id).toBe("t-1");
    expect(result.email).toBe("teacher@test.com");
    expect(result.name).toBe("Maria Ivanova");
    expect(result.role).toBe("Teacher");
    expect(result.avatar).toBeUndefined();
  });
});
