import { Navigate, Outlet } from "react-router-dom";

import { defaultRouteForRole, useRole, type UserRole } from "@/entities/user";

interface RoleRouteProps {
  allow: UserRole[];
  redirectTo?: string;
}

export function RoleRoute({ allow, redirectTo }: RoleRouteProps) {
  const { currentRole } = useRole();

  if (!allow.includes(currentRole)) {
    return <Navigate to={redirectTo ?? defaultRouteForRole(currentRole)} replace />;
  }

  return <Outlet />;
}
