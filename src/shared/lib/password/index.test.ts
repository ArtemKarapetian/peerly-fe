import { describe, expect, it } from "vitest";

import { checkPasswordStrength, MIN_PASSWORD_SCORE } from "./index";

describe("checkPasswordStrength", () => {
  it("rejects very weak passwords", () => {
    const r = checkPasswordStrength("12345");
    expect(r.isStrongEnough).toBe(false);
    expect(r.score).toBeLessThan(MIN_PASSWORD_SCORE);
  });

  it("rejects common dictionary passwords", () => {
    const r = checkPasswordStrength("password");
    expect(r.isStrongEnough).toBe(false);
  });

  it("accepts a complex unguessable password", () => {
    const r = checkPasswordStrength("Tr0ub4dor&3xZ");
    expect(r.isStrongEnough).toBe(true);
    expect(r.score).toBeGreaterThanOrEqual(MIN_PASSWORD_SCORE);
  });

  it("scores a password lower when it equals the user input", () => {
    const withoutHint = checkPasswordStrength("IvanPetrov1");
    const withHint = checkPasswordStrength("IvanPetrov1", ["Ivan", "Petrov"]);
    expect(withHint.score).toBeLessThanOrEqual(withoutHint.score);
  });
});
