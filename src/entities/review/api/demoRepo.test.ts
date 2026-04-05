import { describe, it, expect } from "vitest";

import { reviewRepo } from "./demoRepo";

describe("reviewRepo", () => {
  it("getAll returns reviews", async () => {
    const reviews = await reviewRepo.getAll();
    expect(reviews).toHaveLength(1);
    expect(reviews[0].id).toBe("rv1");
  });
});
