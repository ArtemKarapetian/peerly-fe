import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, it, expect } from "vitest";

const routerPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "Router.tsx");
const source = readFileSync(routerPath, "utf8");

describe("Router — structural guards", () => {
  it("registers /teacher/courses/new → TeacherCreateCoursePage", () => {
    expect(source).toMatch(
      /path="\/teacher\/courses\/new"\s+element={<TeacherCreateCoursePage\s*\/>}/,
    );
  });

  it("imports TeacherCreateCoursePage", () => {
    expect(source).toMatch(/const TeacherCreateCoursePage = lazy\(/);
  });

  it("wraps teacher routes with RoleRoute allow={['Teacher']}", () => {
    expect(source).toMatch(/RoleRoute\s+allow={\["Teacher"\]}/);
  });

  it("wraps admin routes with RoleRoute allow={['Admin']}", () => {
    expect(source).toMatch(/RoleRoute\s+allow={\["Admin"\]}/);
  });

  it("imports RoleRoute from routing/", () => {
    expect(source).toMatch(/import { RoleRoute } from "@\/app\/routing\/RoleRoute";/);
  });

  it("does not contain LegacyRedirect helper", () => {
    expect(source).not.toMatch(/LegacyRedirect/);
  });

  it("does not register legacy /course/:courseId route", () => {
    expect(source).not.toMatch(/path="\/course\/:courseId"/);
  });

  it("does not register legacy /task/:taskId route", () => {
    expect(source).not.toMatch(/path="\/task\/:taskId"/);
  });

  it("does not register legacy /teacher/course/:courseId route", () => {
    expect(source).not.toMatch(/path="\/teacher\/course\/:courseId"/);
  });
});
