import { Navigate, Outlet } from "react-router-dom";

import { defaultRouteForRole, useAuth } from "@/entities/user";

export function PublicOnlyRoute() {
  const { isAuthenticated, session } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={defaultRouteForRole(session?.role)} replace />;
  }

  return <Outlet />;
}
