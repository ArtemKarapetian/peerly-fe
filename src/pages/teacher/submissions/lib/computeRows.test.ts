import { describe, expect, it } from "vitest";

import type { SubmissionsRawData } from "../model/types";

import { computeRows } from "./computeRows";

type Sub = SubmissionsRawData["submissions"][number];
type Asg = SubmissionsRawData["assignments"][number];
type Usr = SubmissionsRawData["users"][number];

function asg(id: string, dueDate: Date): Asg {
  return { id, title: `t-${id}`, dueDate } as unknown as Asg;
}

function usr(id: string, name: string): Usr {
  return { id, name, email: "x", role: "Student" } as unknown as Usr;
}

function sub(
  id: string,
  studentId: string,
  assignmentId: string,
  status: Sub["status"],
  submittedAt?: Date,
  studentName?: string,
): Sub {
  return {
    id,
    studentId,
    assignmentId,
    status,
    submittedAt,
    studentName,
    files: [],
  } as unknown as Sub;
}

describe("computeRows", () => {
  const DEADLINE = new Date("2026-06-01T12:00:00Z");

  it("marks draft submissions as draft", () => {
    const result = computeRows({
      data: {
        users: [usr("u1", "Alice")],
        assignments: [asg("a1", DEADLINE)],
        submissions: [sub("s1", "u1", "a1", "draft")],
      },
      unknownStudentLabel: "?",
    });
    expect(result[0].status).toBe("draft");
  });

  it("marks on-time submitted as submitted", () => {
    const result = computeRows({
      data: {
        users: [usr("u1", "Alice")],
        assignments: [asg("a1", DEADLINE)],
        submissions: [sub("s1", "u1", "a1", "submitted", new Date(DEADLINE.getTime() - 1000))],
      },
      unknownStudentLabel: "?",
    });
    expect(result[0].status).toBe("submitted");
  });

  it("marks late submissions when past deadline", () => {
    const result = computeRows({
      data: {
        users: [usr("u1", "Alice")],
        assignments: [asg("a1", DEADLINE)],
        submissions: [sub("s1", "u1", "a1", "submitted", new Date(DEADLINE.getTime() + 60_000))],
      },
      unknownStudentLabel: "?",
    });
    expect(result[0].status).toBe("late");
  });

  it("falls back to unknownStudentLabel when student not found", () => {
    const result = computeRows({
      data: {
        users: [],
        assignments: [asg("a1", DEADLINE)],
        submissions: [sub("s1", "u-missing", "a1", "submitted")],
      },
      unknownStudentLabel: "(unknown)",
    });
    expect(result[0].studentName).toBe("(unknown)");
  });

  it("prefers sub.studentName over unknownStudentLabel when user lookup fails", () => {
    const result = computeRows({
      data: {
        users: [],
        assignments: [asg("a1", DEADLINE)],
        submissions: [sub("s1", "u-missing", "a1", "submitted", undefined, "Frozen")],
      },
      unknownStudentLabel: "?",
    });
    expect(result[0].studentName).toBe("Frozen");
  });
});
