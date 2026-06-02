import { appNavigate } from "@/shared/lib/navigate";

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
