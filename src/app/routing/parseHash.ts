import { ROUTE_PATTERN_LIST, type RoutePatternKey } from "@/shared/config/routes";

export type ParsedHash = {
  /** Полный нормализованный hash-путь без "#" (например "/courses/1") */
  fullPath: string;
  /** Только pathname (без query), например "/verify-email" */
  pathname: string;
  /** query-параметры из hash (если есть) */
  query: Record<string, string>;
  /** Ключ паттерна, если совпал один из ROUTE_PATTERN_LIST */
  routeKey?: RoutePatternKey;
  /** Параметры из паттерна (courseId/taskId/assignmentId/...) */
  params: Record<string, string>;
};

export function normalizeHashPath(input: string): string {
  const raw = (input || "").trim();

  // если прилетел "#/path" или "/path" или "path"
  const withoutHash = raw.startsWith("#") ? raw.slice(1) : raw;
  const withLeadingSlash = withoutHash.startsWith("/") ? withoutHash : `/${withoutHash}`;

  // пустой => "/"
  return withLeadingSlash === "/" || withLeadingSlash === "/#" ? "/" : withLeadingSlash;
}

export function getCurrentHashPath(): string {
  const current = window.location.hash || "#/";
  return normalizeHashPath(current);
}

export function parseHash(hashPath: string): ParsedHash {
  const full = normalizeHashPath(hashPath);

  // отделяем query внутри hash, если есть: "#/verify-email?token=123"
  const [pathnameRaw, queryRaw = ""] = full.split("?");
  const pathname = pathnameRaw || "/";

  const query: Record<string, string> = {};
  if (queryRaw) {
    const usp = new URLSearchParams(queryRaw);
    usp.forEach((value, key) => {
      query[key] = value;
    });
  }

  // матчим паттерны для params (в заданном порядке)
  for (const p of ROUTE_PATTERN_LIST) {
    const m = pathname.match(p.regex);
    if (!m) continue;

    const params: Record<string, string> = {};
    p.params.forEach((name, idx) => {
      params[name] = m[idx + 1];
    });

    return {
      fullPath: full,
      pathname,
      query,
      routeKey: p.key,
      params,
    };
  }

  return {
    fullPath: full,
    pathname,
    query,
    params: {},
  };
}

/** Удобная навигация для hash-router */
export function navigateHash(pathname: string): void {
  const normalized = normalizeHashPath(pathname);
  window.location.hash = normalized; // даст "#/..."
}
