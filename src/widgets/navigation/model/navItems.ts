import {
  Archive,
  BarChart3,
  Book,
  BookOpen,
  FileCheck,
  Layers,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Shuffle,
  Users,
} from "lucide-react";

import type { UserRole } from "@/entities/user";

export interface NavItem {
  icon: LucideIcon;
  labelKey: string;
  hash: string;
}

export function getNavItemsForRole(role: UserRole | null): NavItem[] {
  switch (role) {
    case "Student":
      return [
        { icon: LayoutDashboard, labelKey: "nav.home", hash: "/student/dashboard" },
        { icon: Book, labelKey: "nav.courses", hash: "/student/courses" },
        { icon: FileCheck, labelKey: "nav.reviews", hash: "/student/reviews" },
        { icon: MessageSquare, labelKey: "nav.receivedReviews", hash: "/student/reviews/received" },
        { icon: BookOpen, labelKey: "nav.gradebook", hash: "/student/gradebook" },
      ];
    case "Teacher":
      return [
        { icon: Book, labelKey: "nav.courses", hash: "/teacher/courses" },
        { icon: FileCheck, labelKey: "nav.createAssignment", hash: "/teacher/assignments/new" },
        { icon: Layers, labelKey: "nav.rubrics", hash: "/teacher/rubrics" },
        { icon: Shuffle, labelKey: "nav.distribution", hash: "/teacher/distribution" },
        { icon: Archive, labelKey: "nav.studentSubmissions", hash: "/teacher/submissions" },
        { icon: BarChart3, labelKey: "nav.analytics", hash: "/teacher/analytics" },
      ];
    case "Admin":
      return [
        { icon: LayoutDashboard, labelKey: "nav.overview", hash: "/admin/overview" },
        { icon: Users, labelKey: "nav.users", hash: "/admin/users" },
      ];
    default:
      return [];
  }
}

export function isItemActive(currentPath: string, hash: string, items: NavItem[]): boolean {
  if (currentPath === hash) return true;
  const hasMoreSpecificMatch = items.some(
    (item) =>
      item.hash !== hash && item.hash.startsWith(hash + "/") && currentPath.startsWith(item.hash),
  );
  if (hasMoreSpecificMatch) return false;
  return currentPath.startsWith(hash + "/");
}
