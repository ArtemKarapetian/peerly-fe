import { describe, it, expect } from "vitest";

import { humanizeApiError } from "./errorMessage";
import { ApiError } from "./httpClient";

describe("humanizeApiError", () => {
  const fallback = "Something broke";

  it("flattens body.errors object into newline-joined string", () => {
    const err = new ApiError(
      400,
      { errors: { Name: ["Name required", "Name too short"], Email: ["Bad email"] } },
      "HTTP 400",
    );
    const result = humanizeApiError(err, fallback);
    expect(result).toContain("Name required");
    expect(result).toContain("Name too short");
    expect(result).toContain("Bad email");
  });

  it("uses body.detail when no errors", () => {
    const err = new ApiError(400, { detail: "Some explanation" }, "HTTP 400");
    expect(humanizeApiError(err, fallback)).toBe("Some explanation");
  });

  it("uses body.title when no errors and no detail", () => {
    const err = new ApiError(400, { title: "Bad Request" }, "HTTP 400");
    expect(humanizeApiError(err, fallback)).toBe("Bad Request");
  });

  it("uses body string when body is a string", () => {
    const err = new ApiError(500, "Plain text error", "HTTP 500");
    expect(humanizeApiError(err, fallback)).toBe("Plain text error");
  });

  it("returns fallback when ApiError has no body", () => {
    const err = new ApiError(500, null, "HTTP 500");
    expect(humanizeApiError(err, fallback)).toBe(fallback);
  });

  it("returns Error.message for non-ApiError Error", () => {
    expect(humanizeApiError(new Error("network down"), fallback)).toBe("network down");
  });

  it("returns fallback for non-Error inputs", () => {
    expect(humanizeApiError("string", fallback)).toBe(fallback);
    expect(humanizeApiError(undefined, fallback)).toBe(fallback);
    expect(humanizeApiError(42, fallback)).toBe(fallback);
  });

  it("strips 'Validation failed: ' prefix and 'Severity: Error' suffix from errors lines", () => {
    const err = new ApiError(
      400,
      { errors: { Field: ["Validation failed: Name is required Severity: Error"] } },
      "HTTP 400",
    );
    expect(humanizeApiError(err, fallback)).toBe("Name is required");
  });

  it("supports string-valued (non-array) entries in errors", () => {
    const err = new ApiError(400, { errors: { A: "Just a string" } }, "HTTP 400");
    expect(humanizeApiError(err, fallback)).toBe("Just a string");
  });

  it("falls back when errors flattens to empty after filtering", () => {
    const err = new ApiError(400, { errors: { A: [""] } }, "HTTP 400");
    expect(humanizeApiError(err, fallback)).toBe(fallback);
  });
});
