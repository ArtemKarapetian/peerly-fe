import { describe, expect, it, vi } from "vitest";

import { addStudentsToGroup } from "./addStudents";

describe("addStudentsToGroup", () => {
  it("calls add() for each student id with the same group id", async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    await addStudentsToGroup("g-1", ["u-1", "u-2", "u-3"], add);

    expect(add).toHaveBeenCalledTimes(3);
    expect(add).toHaveBeenNthCalledWith(1, "g-1", "u-1");
    expect(add).toHaveBeenNthCalledWith(2, "g-1", "u-2");
    expect(add).toHaveBeenNthCalledWith(3, "g-1", "u-3");
  });

  it("counts all successes when every add() resolves", async () => {
    const add = vi.fn().mockResolvedValue(undefined);
    const result = await addStudentsToGroup("g-1", ["u-1", "u-2"], add);

    expect(result).toEqual({ added: 2, failed: 0, firstFailure: undefined });
  });

  it("counts failures and exposes the first rejection reason", async () => {
    const boom = new Error("boom");
    const add = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(boom)
      .mockRejectedValueOnce(new Error("other"));
    const result = await addStudentsToGroup("g-1", ["u-1", "u-2", "u-3"], add);

    expect(result.added).toBe(1);
    expect(result.failed).toBe(2);
    expect(result.firstFailure).toBe(boom);
  });

  it("returns zeros for an empty student list and does not call add()", async () => {
    const add = vi.fn();
    const result = await addStudentsToGroup("g-1", [], add);

    expect(result).toEqual({ added: 0, failed: 0, firstFailure: undefined });
    expect(add).not.toHaveBeenCalled();
  });

  it("does not short-circuit on a rejection — every id still gets a call", async () => {
    const add = vi.fn().mockRejectedValueOnce(new Error("first")).mockResolvedValueOnce(undefined);
    const result = await addStudentsToGroup("g-1", ["u-1", "u-2"], add);

    expect(add).toHaveBeenCalledTimes(2);
    expect(result.added).toBe(1);
    expect(result.failed).toBe(1);
  });
});
