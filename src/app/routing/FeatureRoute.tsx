import { Navigate, Outlet } from "react-router-dom";

import { type FeatureFlags, isFlagEnabled } from "@/shared/lib/feature-flags";

interface FeatureRouteProps {
  flag: keyof FeatureFlags;
  redirectTo?: string;
}

/** Renders child routes only when the given feature flag is enabled. */
export function FeatureRoute({ flag, redirectTo = "/404" }: FeatureRouteProps) {
  if (!isFlagEnabled(flag)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
