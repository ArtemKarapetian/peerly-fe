import { describe, it, expect } from "vitest";

import type { GroupDto, ListParticipantsResponse } from "@/shared/api";

import { mapDtoToGroup, mapParticipants } from "./mappers";

describe("mapDtoToGroup", () => {
  it("maps fields and coerces ids to strings", () => {
    const dto: GroupDto = {
      id: 42 as unknown as string,
      name: "A",
      courseId: 9 as unknown as string,
    };
    const result = mapDtoToGroup(dto);

    expect(result.id).toBe("42");
    expect(result.name).toBe("A");
    expect(result.courseId).toBe("9");
  });

  it("handles string ids unchanged", () => {
    const result = mapDtoToGroup({ id: "g-1", name: "Group 1", courseId: "c-1" });
    expect(result).toEqual({ id: "g-1", name: "Group 1", courseId: "c-1" });
  });
});

describe("mapParticipants", () => {
  it("maps students and teachers separately and coerces ids", () => {
    const dto: ListParticipantsResponse = {
      students: [{ id: 1 as unknown as string, userName: "Alice" }],
      teachers: [{ id: "t-1", userName: "Maria" }],
    };
    const result = mapParticipants(dto);

    expect(result.students).toEqual([{ id: "1", userName: "Alice" }]);
    expect(result.teachers).toEqual([{ id: "t-1", userName: "Maria" }]);
  });

  it("returns empty arrays for empty input", () => {
    const result = mapParticipants({ students: [], teachers: [] });
    expect(result.students).toEqual([]);
    expect(result.teachers).toEqual([]);
  });
});
