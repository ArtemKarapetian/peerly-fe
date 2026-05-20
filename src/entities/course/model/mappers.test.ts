import { describe, it, expect } from "vitest";

import type { CourseDto, CourseStatus, CourseTeacherDto } from "@/shared/api";

import { isArchivedStatus, mapDtoToCourse, mapDtoToTeacher } from "./mappers";

describe("isArchivedStatus", () => {
  it.each<[CourseStatus, boolean]>([
    ["draft", false],
    ["inProgress", false],
    ["canceled", true],
    ["deleted", true],
    ["finished", true],
  ])("returns %s for %s", (status, expected) => {
    expect(isArchivedStatus(status)).toBe(expected);
  });
});

describe("mapDtoToTeacher", () => {
  it("maps fields from the API teacher dto", () => {
    const dto: CourseTeacherDto = {
      teacherId: "t-1",
      email: "t@test.com",
      name: "Maria",
    };
    const result = mapDtoToTeacher(dto);

    expect(result.id).toBe("t-1");
    expect(result.name).toBe("Maria");
    expect(result.email).toBe("t@test.com");
  });

  it("coerces non-string ids via String()", () => {
    const dto = { teacherId: 42, name: "X", email: "x@x" } as unknown as CourseTeacherDto;
    expect(mapDtoToTeacher(dto).id).toBe("42");
  });
});

describe("mapDtoToCourse", () => {
  const baseDto: CourseDto = {
    id: "c-1",
    name: "Algebra",
    description: "Intro course",
    status: "inProgress",
    teachers: [{ teacherId: "t-1", name: "Maria", email: "t@x" }],
  };

  it("maps fields and applies default counts", () => {
    const result = mapDtoToCourse(baseDto);

    expect(result.id).toBe("c-1");
    expect(result.name).toBe("Algebra");
    expect(result.title).toBe("Algebra");
    expect(result.description).toBe("Intro course");
    expect(result.teachers).toHaveLength(1);
    expect(result.teachers[0].id).toBe("t-1");
    expect(result.enrollmentCount).toBe(0);
    expect(result.homeworkCount).toBe(0);
    expect(result.status).toBe("active");
    expect(result.archived).toBe(false);
    expect(result.backendStatus).toBe("inProgress");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("applies the provided counts", () => {
    const result = mapDtoToCourse(baseDto, { studentCount: 12, homeworkCount: 4 });
    expect(result.enrollmentCount).toBe(12);
    expect(result.homeworkCount).toBe(4);
  });

  it("flags archived for canceled/deleted/finished and projects ui status", () => {
    const archivedStatuses: CourseStatus[] = ["canceled", "deleted", "finished"];
    for (const s of archivedStatuses) {
      const r = mapDtoToCourse({ ...baseDto, status: s });
      expect(r.archived).toBe(true);
      expect(r.status).toBe("archived");
      expect(r.backendStatus).toBe(s);
    }
  });

  it("handles missing teachers and description gracefully", () => {
    const dto = {
      id: "c-2",
      name: "X",
      description: undefined,
      status: "draft",
    } as unknown as CourseDto;
    const result = mapDtoToCourse(dto);

    expect(result.description).toBe("");
    expect(result.teachers).toEqual([]);
  });
});
