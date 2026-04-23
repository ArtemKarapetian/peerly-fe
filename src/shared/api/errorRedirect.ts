import { appNavigate } from "@/shared/lib/navigate";

/**
 * Map of HTTP statuses that should take the user to a dedicated error page.
 * Kept in one place so httpClient and useAsync stay in sync.
 */
const REDIRECT_TARGETS: Record<number, string> = {
  403: "/403",
  404: "/404",
  500: "/500",
};

/** Navigates to the matching error page. Returns true if a redirect was issued. */
export function redirectForStatus(status: number): boolean {
  const target = REDIRECT_TARGETS[status];
  if (!target) return false;
  appNavigate(target);
  return true;
}
