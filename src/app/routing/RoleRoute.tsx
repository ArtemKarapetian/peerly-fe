import { Navigate, Outlet } from "react-router-dom";

import { useRole, type UserRole } from "@/entities/user/model/role";

interface RoleRouteProps {
  allow: UserRole[];
  redirectTo?: string;
}

/**
 * Renders child routes only when the current user's role is in `allow`.
 * Must be used inside a <ProtectedRoute /> — assumes the user is authenticated.
 */
export function RoleRoute({ allow, redirectTo = "/403" }: RoleRouteProps) {
  const { currentRole } = useRole();

  if (!allow.includes(currentRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
