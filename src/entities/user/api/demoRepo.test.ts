import { describe, it, expect } from "vitest";

import { userRepo } from "./demoRepo";

describe("userRepo", () => {
  it("getAll returns all demo users", async () => {
    const users = await userRepo.getAll();
    expect(users.length).toBeGreaterThanOrEqual(3);
    const ids = users.map((u) => u.id);
    expect(ids).toContain("u1");
    expect(ids).toContain("u2");
    expect(ids).toContain("u3");
    const roles = new Set(users.map((u) => u.role));
    expect(roles.has("Student")).toBe(true);
    expect(roles.has("Teacher")).toBe(true);
    expect(roles.has("Admin")).toBe(true);
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
