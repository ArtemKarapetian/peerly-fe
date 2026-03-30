import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/entities/user";

/** Redirects authenticated users away from login/register pages. */
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
