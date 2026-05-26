import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { type DemoFlags, isDemoFlagEnabled } from "@/shared/lib/demo-flags";

interface DemoFlagRouteProps {
  flag: keyof DemoFlags;
  redirectTo?: string;
}

export function DemoFlagRoute({ flag, redirectTo = ROUTES.error404 }: DemoFlagRouteProps) {
  if (!isDemoFlagEnabled(flag)) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
}
