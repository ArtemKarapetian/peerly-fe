import { describe, expect, it } from "vitest";

import { buildRegisterSchema, registerFormDefaults } from "./schema";

const identity = ((key: string) => key) as unknown as Parameters<typeof buildRegisterSchema>[0];

const strongPassword = "Tr0ub4dor&3xZ";

const valid = {
  ...registerFormDefaults,
  firstName: "Ivan",
  lastName: "Petrov",
  email: "ivan@example.com",
  password: strongPassword,
  confirmPassword: strongPassword,
};

describe("buildRegisterSchema", () => {
  const schema = buildRegisterSchema(identity, "ru");

  it("accepts a fully valid payload", () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it("rejects an empty first name", () => {
    const r = schema.safeParse({ ...valid, firstName: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "firstName")).toBe(true);
    }
  });

  it("rejects an invalid email format", () => {
    const r = schema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "email")).toBe(true);
    }
  });

  it("rejects a weak password through superRefine", () => {
    const r = schema.safeParse({ ...valid, password: "12345", confirmPassword: "12345" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "password")).toBe(true);
    }
  });

  it("rejects a confirmPassword that doesn't match the password", () => {
    const r = schema.safeParse({ ...valid, confirmPassword: "different-pass-9!" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path.join(".") === "confirmPassword")).toBe(true);
    }
  });

  it("accepts both Student and Teacher as roles", () => {
    expect(schema.safeParse({ ...valid, role: "Student" }).success).toBe(true);
    expect(schema.safeParse({ ...valid, role: "Teacher" }).success).toBe(true);
  });

  it("rejects any other role value", () => {
    const r = schema.safeParse({ ...valid, role: "Admin" });
    expect(r.success).toBe(false);
  });
});
