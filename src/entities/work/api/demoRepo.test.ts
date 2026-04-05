import { describe, it, expect } from "vitest";

import { workRepo } from "./demoRepo";

describe("workRepo", () => {
  it("getAll returns submissions", async () => {
    const submissions = await workRepo.getAll();
    expect(submissions).toHaveLength(1);
    expect(submissions[0].id).toBe("s1");
  });
});
