/**
 * Централизованные роуты приложения
 * При изменении URL — меняем только здесь
 */

export const ROUTES = {
  // Публичные
  landing: "/",
  login: "/login",
  register: "/register",

  // Студент
  dashboard: "/dashboard",
  courses: "/courses",
  course: (id: string) => `/courses/${id}`,
  task: (courseId: string, taskId: string) => `/courses/${courseId}/tasks/${taskId}`,
  submitWork: (taskId: string) => `/submit/${taskId}`,
  submissions: "/submissions",
  reviewsInbox: "/reviews",
  receivedReviews: "/received-reviews",
  appeal: (appealId: string) => `/appeals/${appealId}`,
  appeals: "/appeals",
  gradebook: "/gradebook",
  inbox: "/inbox",
  profile: "/profile",
  settings: "/settings",
  security: "/security",

  // Преподаватель
  teacherDashboard: "/teacher/dashboard",
  teacherCourse: (id: string) => `/teacher/courses/${id}`,
  teacherTask: (courseId: string, taskId: string) => `/teacher/courses/${courseId}/tasks/${taskId}`,
  teacherSubmissions: "/teacher/submissions",
  teacherReviews: "/teacher/reviews",

  // Админ
  adminOverview: "/admin/overview",
  adminUsers: "/admin/users",
  adminCourses: "/admin/courses",
  adminOrgs: "/admin/orgs",
  adminFlags: "/admin/flags",
  adminLogs: "/admin/logs",
  adminSettings: "/admin/settings",
  adminHealth: "/admin/health",
  adminQueues: "/admin/queues",
  adminIntegrations: "/admin/integrations",
  adminPlugins: "/admin/plugins",
  adminPolicies: "/admin/policies",
  adminRetention: "/admin/retention",
  adminLimits: "/admin/limits",
} as const;
