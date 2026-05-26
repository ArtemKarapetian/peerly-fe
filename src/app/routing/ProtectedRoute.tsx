import { Navigate, Outlet } from "react-router-dom";

import { ROUTES } from "@/shared/config/routes";
import { PageSkeleton } from "@/shared/ui/PageSkeleton";

import { useAuth } from "@/entities/user";

export function ProtectedRoute() {
  const { status } = useAuth();

  if (status === "unknown") {
    return <PageSkeleton />;
  }

  if (status !== "authenticated") {
    return <Navigate to={ROUTES.login} replace />;
  }

  return <Outlet />;
}
