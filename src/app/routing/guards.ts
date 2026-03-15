import { ROUTES } from "@/shared/config/routes";

/**
 * Определяем, какие маршруты требуют авторизации.
 * Тут намеренно простой подход: prefixes + набор явных страниц.
 * (Если захочешь — можно перейти к whitelist/route-meta, но это позже.)
 */

const PROTECTED_PREFIXES = [
  "/teacher",
  "/admin",
  "/courses", // включает /courses, /courses/:id, /courses/:id/tasks/...
  "/course", // legacy /course/:id
  "/task", // legacy /task/:id
  "/reviews",
] as const;

const PROTECTED_EXACT = [
  ROUTES.dashboard,
  ROUTES.gradebook,
  ROUTES.inbox,
  ROUTES.appeals,
  ROUTES.profile,
  ROUTES.settings,
  ROUTES.security,
  ROUTES.deleteAccount,
] as const;

export function isAuthPage(pathname: string): boolean {
  return pathname === ROUTES.login || pathname === ROUTES.register;
}

export function isProtectedRoute(pathname: string): boolean {
  if (PROTECTED_EXACT.includes(pathname as (typeof PROTECTED_EXACT)[number])) return true;
  return PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Возвращает путь, на который нужно редиректнуть, или null если редирект не нужен.
 */
export function getAuthRedirect(pathname: string, isAuthenticated: boolean): string | null {
  const protectedRoute = isProtectedRoute(pathname);

  if (!isAuthenticated && protectedRoute) {
    return ROUTES.login;
  }

  if (isAuthenticated && isAuthPage(pathname)) {
    return ROUTES.dashboard;
  }

  return null;
}
