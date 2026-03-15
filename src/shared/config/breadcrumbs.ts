import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { ROUTES } from "./routes.ts";

export const CRUMBS = {
  // Student
  courses: { label: "Курсы", href: ROUTES.courses } satisfies BreadcrumbItem,
  studentDashboard: { label: "Главная", href: ROUTES.dashboard } satisfies BreadcrumbItem,
  gradebook: { label: "Журнал оценок", href: ROUTES.gradebook } satisfies BreadcrumbItem,
  settings: { label: "Настройки", href: ROUTES.settings } satisfies BreadcrumbItem,

  // Teacher
  teacherCourses: { label: "Курсы", href: ROUTES.teacherCourses } satisfies BreadcrumbItem,
  teacherAssignments: {
    label: "Задания",
    href: ROUTES.teacherAssignments,
  } satisfies BreadcrumbItem,

  // Admin
  adminSettings: { label: "Настройки", href: ROUTES.adminSettings } satisfies BreadcrumbItem,
  adminOverview: { label: "Обзор", href: ROUTES.adminOverview } satisfies BreadcrumbItem,
} as const;
