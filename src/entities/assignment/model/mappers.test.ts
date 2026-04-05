import { describe, it, expect } from "vitest";

import type { ApiHomework } from "./api.types";
import { mapHomeworkToAssignment } from "./mappers";

describe("mapHomeworkToAssignment", () => {
  const api: ApiHomework = {
    homework_id: "hw-1",
    course_id: "c-1",
    title: "Essay Assignment",
    description: "Write a 500 word essay",
    due_date: "2025-06-15T23:59:00Z",
    review_count: 3,
    status: "published",
    rubric_id: "r-1",
  };

  it("maps all fields correctly", () => {
    const result = mapHomeworkToAssignment(api);

    expect(result.id).toBe("hw-1");
    expect(result.courseId).toBe("c-1");
    expect(result.title).toBe("Essay Assignment");
    expect(result.description).toBe("Write a 500 word essay");
    expect(result.reviewCount).toBe(3);
    expect(result.status).toBe("published");
    expect(result.rubricId).toBe("r-1");
  });

  it("parses due_date into a Date object", () => {
    const result = mapHomeworkToAssignment(api);
    expect(result.dueDate).toBeInstanceOf(Date);
    expect(result.dueDate.toISOString()).toBe("2025-06-15T23:59:00.000Z");
  });

  it("handles missing rubric_id", () => {
    const withoutRubric: ApiHomework = { ...api, rubric_id: undefined };
    const result = mapHomeworkToAssignment(withoutRubric);
    expect(result.rubricId).toBeUndefined();
  });
});
