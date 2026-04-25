import { ROUTES } from "@/shared/config/routes";

// Простой подход к защите: prefixes + явные страницы; меняем на whitelist/route-meta когда станет тесно

const PROTECTED_PREFIXES = [
  "/teacher",
  "/admin",
  "/student",
  // Legacy редиректы — нужны, чтобы ProtectedRoute сработал до Navigate
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

// null = редирект не нужен
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
