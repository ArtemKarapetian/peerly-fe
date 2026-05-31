import { beforeEach, describe, expect, it, vi } from "vitest";

import { rubricHttpRepo } from "../api/httpRepo";

import { loadRubricTotals } from "./loadRubricTotals";

vi.mock("../api/httpRepo", () => ({
  rubricHttpRepo: {
    getById: vi.fn(),
  },
}));

const mockGetById = vi.mocked(rubricHttpRepo.getById);

const detail = (criteria: { maxScore: number }[]) => ({
  rubric: { id: "r", teacherId: "t", name: "n" },
  criteria: criteria.map((c, i) => ({
    id: String(i),
    name: "c",
    description: null,
    maxScore: c.maxScore,
    commentRequired: false,
    position: i,
  })),
});

beforeEach(() => {
  mockGetById.mockReset();
});

describe("loadRubricTotals", () => {
  it("returns an empty map when given no ids", async () => {
    const result = await loadRubricTotals([]);
    expect(result.size).toBe(0);
    expect(mockGetById).not.toHaveBeenCalled();
  });

  it("sums each rubric's criteria max scores", async () => {
    mockGetById.mockImplementation((id) =>
      Promise.resolve(detail(id === "a" ? [{ maxScore: 5 }, { maxScore: 10 }] : [{ maxScore: 3 }])),
    );
    const result = await loadRubricTotals(["a", "b"]);
    expect(result.get("a")).toBe(15);
    expect(result.get("b")).toBe(3);
  });

  it("dedupes ids before fetching", async () => {
    mockGetById.mockResolvedValue(detail([{ maxScore: 4 }]));
    await loadRubricTotals(["a", "a", "a"]);
    expect(mockGetById).toHaveBeenCalledTimes(1);
  });

  it("skips rubrics whose fetch failed", async () => {
    mockGetById.mockImplementation((id) =>
      id === "ok" ? Promise.resolve(detail([{ maxScore: 7 }])) : Promise.reject(new Error("boom")),
    );
    const result = await loadRubricTotals(["ok", "fail"]);
    expect(result.get("ok")).toBe(7);
    expect(result.has("fail")).toBe(false);
  });

  it("skips rubrics whose total is zero", async () => {
    mockGetById.mockResolvedValue(detail([{ maxScore: 0 }]));
    const result = await loadRubricTotals(["zero"]);
    expect(result.has("zero")).toBe(false);
  });

  it("skips rubrics whose detail came back null", async () => {
    mockGetById.mockResolvedValue(null);
    const result = await loadRubricTotals(["nothing"]);
    expect(result.has("nothing")).toBe(false);
  });
});
