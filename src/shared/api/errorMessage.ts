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

/**
 * Recognises raw .NET runtime exception messages like
 *   "Exception of type 'Peerly.Core.Exceptions.NotFoundException' was thrown."
 * BE shouldn't leak these — until it's fixed, we drop them and use the fallback.
 */
function isRawDotnetException(text: string): boolean {
  return /Exception of type '[\w.]+'\s+was thrown\.?/i.test(text);
}

function pickProblemDetailsMessage(body: ProblemDetailsBody): string | null {
  if (body.errors) {
    const lines = flattenErrors(body.errors)
      .flatMap((line) => line.split(/\r?\n/))
      .map(stripValidationPrefix)
      .filter(Boolean)
      .filter((line) => !isRawDotnetException(line));
    if (lines.length > 0) return lines.join("\n");
  }
  if (typeof body.detail === "string") {
    const trimmed = body.detail.trim();
    if (trimmed && !isRawDotnetException(trimmed)) return trimmed;
  }
  if (typeof body.title === "string") {
    const trimmed = body.title.trim();
    if (trimmed && !isRawDotnetException(trimmed)) return trimmed;
  }
  return null;
}

export function humanizeApiError(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) {
    if (error instanceof Error) {
      const msg = error.message;
      if (msg && !isRawDotnetException(msg)) return msg;
    }
    return fallback;
  }

  if (looksLikeProblemDetails(error.body)) {
    const picked = pickProblemDetailsMessage(error.body);
    if (picked) return picked;
  }

  if (typeof error.body === "string") {
    const trimmed = error.body.trim();
    if (trimmed && !isRawDotnetException(trimmed)) return trimmed;
  }

  return fallback;
}
