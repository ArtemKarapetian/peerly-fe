import { ROUTES } from "@/shared/config/routes";

/**
 * Определяем, какие маршруты требуют авторизации.
 * Тут намеренно простой подход: prefixes + набор явных страниц.
 * (Если захочешь — можно перейти к whitelist/route-meta, но это позже.)
 */

const PROTECTED_PREFIXES = [
  "/teacher",
  "/admin",
  "/student", // все студент-специфичные пути
  // Legacy redirects (студент-роуты до префикса /student) — оставлены, чтобы
  // авторизация триггерилась и ProtectedRoute успевал перебросить редиректом.
  "/courses",
  "/reviews",
  "/dashboard",
  "/gradebook",
  "/inbox",
  "/appeals",
] as const;

const PROTECTED_EXACT = [
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
