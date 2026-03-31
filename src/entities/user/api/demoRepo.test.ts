import { describe, it, expect } from "vitest";

import { userRepo } from "./demoRepo";

describe("userRepo", () => {
  it("getAll returns all demo users", async () => {
    const users = await userRepo.getAll();
    expect(users).toHaveLength(3);
    expect(users.map((u) => u.id)).toEqual(["u1", "u2", "u3"]);
    expect(users.map((u) => u.role)).toEqual(["Student", "Teacher", "Admin"]);
  });

  it("getById returns correct user", async () => {
    const user = await userRepo.getById("u1");
    expect(user).toBeDefined();
    expect(user!.id).toBe("u1");
    expect(user!.name).toBe("Иван Петров");
  });

  it("getById returns undefined for unknown id", async () => {
    const user = await userRepo.getById("unknown");
    expect(user).toBeUndefined();
  });
});
