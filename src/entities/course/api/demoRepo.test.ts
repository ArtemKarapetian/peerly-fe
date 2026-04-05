import { describe, it, expect, beforeEach } from "vitest";

import { courseRepo } from "./demoRepo";

describe("courseRepo", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("getAll returns all courses", async () => {
    const courses = await courseRepo.getAll();
    expect(courses).toHaveLength(3);
    expect(courses.map((c) => c.id)).toEqual(["c1", "c2", "c3"]);
  });

  it("getById returns correct course", async () => {
    const course = await courseRepo.getById("c2");
    expect(course).toBeDefined();
    expect(course!.id).toBe("c2");
    expect(course!.title).toBe("Базы данных");
  });

  it("getById returns undefined for unknown id", async () => {
    const course = await courseRepo.getById("unknown");
    expect(course).toBeUndefined();
  });

  it("create returns new course with generated id", async () => {
    const created = await courseRepo.create({
      title: "New Course",
      code: "CS999",
      instructorId: "u2",
    });
    expect(created.id).toBeDefined();
    expect(created.title).toBe("New Course");
    expect(created.code).toBe("CS999");
    expect(created.enrollmentCount).toBe(0);
  });

  it("archive changes course status", async () => {
    await courseRepo.archive("c1", true);
    const course = await courseRepo.getById("c1");
    expect(course!.status).toBe("archived");

    await courseRepo.archive("c1", false);
    const restored = await courseRepo.getById("c1");
    expect(restored!.status).toBe("active");
  });
});
