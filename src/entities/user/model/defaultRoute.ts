import type { Role } from "@/shared/api";
import { ROUTES } from "@/shared/config/routes";

export function defaultRouteForRole(role: Role | undefined | null): string {
  switch (role) {
    case "Teacher":
      return ROUTES.teacherCourses;
    case "Admin":
      return ROUTES.adminOverview;
    case "Student":
    default:
      return ROUTES.dashboard;
  }
}
