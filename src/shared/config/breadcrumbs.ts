import i18n from "@/shared/lib/i18n/config";
import type { BreadcrumbItem } from "@/shared/ui/Breadcrumbs.tsx";

import { ROUTES } from "./routes.ts";

export const getCrumbs = () =>
  ({
    // Student
    courses: { label: i18n.t("nav.courses"), href: ROUTES.courses } satisfies BreadcrumbItem,
    studentDashboard: {
      label: i18n.t("nav.home"),
      href: ROUTES.dashboard,
    } satisfies BreadcrumbItem,
    gradebook: { label: i18n.t("nav.gradebook"), href: ROUTES.gradebook } satisfies BreadcrumbItem,
    settings: { label: i18n.t("nav.settings"), href: ROUTES.settings } satisfies BreadcrumbItem,

    // Teacher
    teacherCourses: {
      label: i18n.t("nav.courses"),
      href: ROUTES.teacherCourses,
    } satisfies BreadcrumbItem,
    teacherAssignments: {
      label: i18n.t("nav.assignments"),
      href: ROUTES.teacherAssignments,
    } satisfies BreadcrumbItem,

    // Admin
    adminSettings: {
      label: i18n.t("nav.settings"),
      href: ROUTES.adminSettings,
    } satisfies BreadcrumbItem,
    adminOverview: {
      label: i18n.t("nav.overview"),
      href: ROUTES.adminOverview,
    } satisfies BreadcrumbItem,
  }) as const;
