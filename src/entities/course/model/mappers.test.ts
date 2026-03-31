import { describe, it, expect } from "vitest";

import type { ApiCourse } from "./api.types";
import { mapApiCourse, mapCourseToPayload } from "./mappers";
import type { CreateCourseInput } from "./types";

describe("mapApiCourse", () => {
  const api: ApiCourse = {
    course_id: "c-1",
    name: "Algorithms",
    code: "CS201",
    teacher_id: "t-1",
    org_id: "org-1",
    enrollment_count: 42,
    status: "active",
    created_at: "2025-01-10T12:00:00Z",
  };

  it("maps all fields correctly", () => {
    const result = mapApiCourse(api);

    expect(result.id).toBe("c-1");
    expect(result.name).toBe("Algorithms");
    expect(result.title).toBe("Algorithms");
    expect(result.code).toBe("CS201");
    expect(result.teacherId).toBe("t-1");
    expect(result.orgId).toBe("org-1");
    expect(result.enrollmentCount).toBe(42);
    expect(result.status).toBe("active");
  });

  it("parses created_at into Date", () => {
    const result = mapApiCourse(api);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.getFullYear()).toBe(2025);
  });

  it("defaults orgId to empty string when null", () => {
    const noOrg: ApiCourse = { ...api, org_id: undefined };
    expect(mapApiCourse(noOrg).orgId).toBe("");
  });

  it("defaults enrollmentCount to 0 when null", () => {
    const noCount: ApiCourse = { ...api, enrollment_count: undefined };
    expect(mapApiCourse(noCount).enrollmentCount).toBe(0);
  });
});

describe("mapCourseToPayload", () => {
  it("maps input to API payload with active status", () => {
    const input: CreateCourseInput = {
      title: "New Course",
      code: "NC100",
      instructorId: "t-2",
      semester: "Fall 2025",
      description: "A new course",
      archived: false,
    };

    const result = mapCourseToPayload(input);

    expect(result.name).toBe("New Course");
    expect(result.code).toBe("NC100");
    expect(result.teacher_id).toBe("t-2");
    expect(result.semester).toBe("Fall 2025");
    expect(result.description).toBe("A new course");
    expect(result.status).toBe("active");
  });

  it("sets status to archived when archived is true", () => {
    const input: CreateCourseInput = {
      title: "Old Course",
      code: "OC100",
      instructorId: "t-1",
      archived: true,
    };

    expect(mapCourseToPayload(input).status).toBe("archived");
  });
});
