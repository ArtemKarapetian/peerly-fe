import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { setRubrics, useRubric, useRubrics } from "./store";
import type { RubricData } from "./types";

function makeRubric(id: string, name: string): RubricData {
  return {
    id,
    name,
    description: `desc ${id}`,
    criteria: [
      {
        id: `${id}-c1`,
        name: "Criterion 1",
        description: "",
        maxScore: 5,
        required: true,
      },
    ],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
    teacherId: "t-1",
  };
}

beforeEach(() => {
  localStorage.clear();
  act(() => setRubrics([]));
});

describe("rubric-editor store", () => {
  it("starts with an empty list", () => {
    const { result } = renderHook(() => useRubrics());
    expect(result.current).toEqual([]);
  });

  it("setRubrics updates the list and notifies subscribers", () => {
    const { result } = renderHook(() => useRubrics());
    const r1 = makeRubric("r-1", "Alpha");
    const r2 = makeRubric("r-2", "Beta");

    act(() => setRubrics([r1, r2]));
    expect(result.current).toHaveLength(2);
    expect(result.current[0].name).toBe("Alpha");
    expect(result.current[1].id).toBe("r-2");
  });

  it("persists rubrics to localStorage", () => {
    const r1 = makeRubric("r-1", "Alpha");
    act(() => setRubrics([r1]));

    const raw = localStorage.getItem("peerly_rubrics_library");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!) as Array<{ id: string; name: string }>;
    expect(parsed[0].id).toBe("r-1");
    expect(parsed[0].name).toBe("Alpha");
  });

  it("useRubric returns the matching rubric by id", () => {
    const r1 = makeRubric("r-1", "Alpha");
    const r2 = makeRubric("r-2", "Beta");
    act(() => setRubrics([r1, r2]));

    const { result } = renderHook(() => useRubric("r-2"));
    expect(result.current).not.toBeNull();
    expect(result.current!.name).toBe("Beta");
  });

  it("useRubric returns null when id is not present", () => {
    act(() => setRubrics([makeRubric("r-1", "Alpha")]));
    const { result } = renderHook(() => useRubric("does-not-exist"));
    expect(result.current).toBeNull();
  });

  it("useRubric returns null when id is undefined", () => {
    act(() => setRubrics([makeRubric("r-1", "Alpha")]));
    const { result } = renderHook(() => useRubric(undefined));
    expect(result.current).toBeNull();
  });
});
