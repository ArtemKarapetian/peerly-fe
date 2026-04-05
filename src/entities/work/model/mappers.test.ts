import { describe, it, expect } from "vitest";

import type { ApiSubmission } from "./api.types";
import { mapApiSubmission } from "./mappers";

describe("mapApiSubmission", () => {
  const api: ApiSubmission = {
    submission_id: "sub-1",
    homework_id: "hw-1",
    student_id: "s-1",
    content: "My essay about algorithms",
    files: ["essay.pdf", "references.bib"],
    submitted_at: "2025-06-14T20:00:00Z",
    status: "submitted",
  };

  it("maps all fields correctly", () => {
    const result = mapApiSubmission(api);

    expect(result.id).toBe("sub-1");
    expect(result.assignmentId).toBe("hw-1");
    expect(result.studentId).toBe("s-1");
    expect(result.content).toBe("My essay about algorithms");
    expect(result.files).toEqual(["essay.pdf", "references.bib"]);
    expect(result.status).toBe("submitted");
  });

  it("parses submitted_at into Date", () => {
    const result = mapApiSubmission(api);
    expect(result.submittedAt).toBeInstanceOf(Date);
    expect(result.submittedAt.toISOString()).toBe("2025-06-14T20:00:00.000Z");
  });
});
