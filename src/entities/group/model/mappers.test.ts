import { describe, it, expect } from "vitest";

import type { GroupDto, ListParticipantsResponse } from "@/shared/api";

import { mapDtoToGroup, mapParticipants } from "./mappers";

describe("mapDtoToGroup", () => {
  it("maps fields and coerces ids to strings", () => {
    const dto: GroupDto = {
      id: 42 as unknown as string,
      name: "A",
      studentCount: 5,
    };
    const result = mapDtoToGroup(dto);

    expect(result.id).toBe("42");
    expect(result.name).toBe("A");
    expect(result.studentCount).toBe(5);
  });

  it("handles string ids unchanged", () => {
    const result = mapDtoToGroup({ id: "g-1", name: "Group 1", studentCount: 0 });
    expect(result).toEqual({ id: "g-1", name: "Group 1", studentCount: 0 });
  });

  it("defaults studentCount to 0 when missing", () => {
    const result = mapDtoToGroup({
      id: "g-2",
      name: "G2",
      studentCount: undefined as unknown as number,
    });
    expect(result.studentCount).toBe(0);
  });
});

describe("mapParticipants", () => {
  it("maps students and teachers separately and coerces ids", () => {
    const dto: ListParticipantsResponse = {
      students: [{ studentId: 1 as unknown as string, email: "a@x", name: "Alice" }],
      teachers: [{ teacherId: "t-1", email: "m@x", name: "Maria" }],
    };
    const result = mapParticipants(dto);

    expect(result.students).toEqual([{ id: "1", name: "Alice", email: "a@x" }]);
    expect(result.teachers).toEqual([{ id: "t-1", name: "Maria", email: "m@x" }]);
  });

  it("returns empty arrays for empty input", () => {
    const result = mapParticipants({ students: [], teachers: [] });
    expect(result.students).toEqual([]);
    expect(result.teachers).toEqual([]);
  });
});
