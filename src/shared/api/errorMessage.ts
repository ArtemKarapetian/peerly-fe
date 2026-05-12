import { ApiError } from "./httpClient";

interface ProblemDetailsBody {
  title?: string;
  detail?: string;
  errors?: Record<string, string[] | string>;
}

function looksLikeProblemDetails(value: unknown): value is ProblemDetailsBody {
  return typeof value === "object" && value !== null;
}

function flattenErrors(errors: Record<string, string[] | string>): string[] {
  const out: string[] = [];
  for (const value of Object.values(errors)) {
    if (Array.isArray(value)) {
      out.push(...value);
    } else if (typeof value === "string") {
      out.push(value);
    }
  }
  return out;
}

function stripValidationPrefix(raw: string): string {
  return raw
    .replace(/^Validation failed:\s*/i, "")
    .replace(/^[-\s]+/, "")
    .replace(/\s*Severity:\s*Error\s*$/i, "")
    .trim();
}

export function humanizeApiError(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (looksLikeProblemDetails(error.body)) {
    if (error.body.errors) {
      const lines = flattenErrors(error.body.errors)
        .flatMap((line) => line.split(/\r?\n/))
        .map(stripValidationPrefix)
        .filter(Boolean);
      if (lines.length > 0) return lines.join("\n");
    }
    if (typeof error.body.detail === "string" && error.body.detail.trim()) {
      return error.body.detail.trim();
    }
    if (typeof error.body.title === "string" && error.body.title.trim()) {
      return error.body.title.trim();
    }
  }

  if (typeof error.body === "string" && error.body.trim()) {
    return error.body.trim();
  }

  return fallback;
}
