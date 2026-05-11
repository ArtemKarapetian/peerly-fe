import type { Role } from "@/shared/api";

export function defaultRouteForRole(role: Role | undefined | null): string {
  switch (role) {
    case "Teacher":
      return "/teacher/courses";
    case "Admin":
      return "/admin/overview";
    case "Student":
    default:
      return "/student/dashboard";
  }
}
