import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { ROUTES } from "./routes.ts";

export const CRUMBS = {
  courses: { label: "Курсы", href: ROUTES.courses } satisfies BreadcrumbItem,
  settings: { label: "Настройки", href: ROUTES.settings } satisfies BreadcrumbItem,
  studentDashboard: { label: "Студент", href: ROUTES.dashboard } satisfies BreadcrumbItem,
  teacherDashboard: {
    label: "Дашборд преподавателя",
    href: ROUTES.teacherDashboard,
  } satisfies BreadcrumbItem,
  adminRoot: { label: "Администратор", href: ROUTES.adminOverview } satisfies BreadcrumbItem,
  gradebook: { label: "Журнал оценок", href: ROUTES.gradebook } satisfies BreadcrumbItem,
} as const;
