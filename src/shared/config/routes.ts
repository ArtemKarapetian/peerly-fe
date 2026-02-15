/**
 * Единственный источник правды по URL-ам приложения.
 * - Все статические пути и "билдеры" (path builders) живут здесь.
 * - Все regex-паттерны для вытаскивания params — тоже здесь.
 */

export const ROUTES = {
  // Base
  landing: "/",

  // Auth / Public
  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  help: "/help",
  status: "/status",
  terms: "/terms",
  supportChat: "/support/chat",

  // Errors
  error401: "/401",
  error403: "/403",
  error404: "/404",
  error500: "/500",

  // Student
  dashboard: "/dashboard",
  courses: "/courses",
  course: (courseId: string) => `/courses/${courseId}`,
  task: (courseId: string, taskId: string) => `/courses/${courseId}/tasks/${taskId}`,
  submitWork: (courseId: string, taskId: string) => `/courses/${courseId}/tasks/${taskId}/submit`,
  submissions: (courseId: string, taskId: string) =>
    `/courses/${courseId}/tasks/${taskId}/submissions`,
  extensionRequest: (courseId: string, taskId: string) =>
    `/courses/${courseId}/tasks/${taskId}/extension-request`,
  taskAppeal: (courseId: string, taskId: string) => `/courses/${courseId}/tasks/${taskId}/appeal`,

  reviews: "/reviews",
  receivedReviews: "/reviews/received",
  review: (reviewId: string) => `/reviews/${reviewId}`,

  gradebook: "/gradebook",
  inbox: "/inbox",
  appeals: "/appeals",
  extensions: "/extensions",

  profile: "/profile",
  settings: "/settings",
  security: "/security",
  deleteAccount: "/offboarding/delete-account",

  // Teacher
  teacherDashboard: "/teacher/dashboard",
  teacherCourses: "/teacher/courses",
  teacherCourse: (courseId: string) => `/teacher/courses/${courseId}`,
  teacherRubrics: "/teacher/rubrics",
  teacherAssignments: "/teacher/assignments",
  teacherCreateAssignment: "/teacher/assignments/new",
  teacherAssignment: (assignmentId: string) => `/teacher/assignment/${assignmentId}`,
  teacherAssignmentExtensions: (assignmentId: string) =>
    `/teacher/assignment/${assignmentId}/extensions`,
  teacherPeerSessionSettings: (assignmentId: string) =>
    `/teacher/peer-session-settings/${assignmentId}`,
  teacherDistribution: "/teacher/distribution",
  teacherModeration: "/teacher/moderation",
  teacherSubmissions: "/teacher/submissions",
  teacherAnalytics: "/teacher/analytics",
  teacherAppeals: "/teacher/appeals",
  teacherAnnouncements: "/teacher/announcements",
  teacherExtensions: "/teacher/extensions",
  teacherAutomation: "/teacher/automation",

  // Admin
  adminOverview: "/admin/overview",
  adminCourses: "/admin/courses",
  adminUsers: "/admin/users",
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

  /**
   * Legacy (поддержка старых URL из текущего RouterExtended)
   * Можно позже убрать и сделать авто-редирект на canonical.
   */
  legacyCourse: (courseId: string) => `/course/${courseId}`,
  legacyTask: (taskId: string) => `/task/${taskId}`,
  legacyTeacherCourse: (courseId: string) => `/teacher/course/${courseId}`,
  legacySubmit: (taskId: string) => `/submit/${taskId}`,
} as const;

export type RoutePatternDef = {
  key: string;
  regex: RegExp;
  params: readonly string[];
};

/**
 * ВАЖНО: порядок важен (сначала более специфичные, потом более общие).
 * Эти паттерны используются parseHash.ts для извлечения params.
 */
export const ROUTE_PATTERN_LIST = [
  // Student complex
  {
    key: "submitWork",
    regex: /^\/courses\/([^/]+)\/tasks\/([^/]+)\/submit$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "submissions",
    regex: /^\/courses\/([^/]+)\/tasks\/([^/]+)\/submissions$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "extensionRequest",
    regex: /^\/courses\/([^/]+)\/tasks\/([^/]+)\/extension-request$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "taskAppeal",
    regex: /^\/courses\/([^/]+)\/tasks\/([^/]+)\/appeal$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "taskDetails",
    regex: /^\/courses\/([^/]+)\/tasks\/([^/]+)$/,
    params: ["courseId", "taskId"] as const,
  },

  // Reviews
  {
    key: "review",
    regex: /^\/reviews\/([^/]+)$/,
    params: ["reviewId"] as const,
  },

  // Teacher
  {
    key: "teacherAssignmentExtensions",
    regex: /^\/teacher\/assignment\/([^/]+)\/extensions$/,
    params: ["assignmentId"] as const,
  },
  {
    key: "teacherAssignment",
    regex: /^\/teacher\/assignment\/([^/]+)$/,
    params: ["assignmentId"] as const,
  },
  {
    key: "teacherPeerSessionSettings",
    regex: /^\/teacher\/peer-session-settings\/([^/]+)$/,
    params: ["assignmentId"] as const,
  },
  {
    key: "teacherCourse",
    regex: /^\/teacher\/courses\/([^/]+)$/,
    params: ["courseId"] as const,
  },

  // Student course details
  {
    key: "courseDetails",
    regex: /^\/courses\/([^/]+)$/,
    params: ["courseId"] as const,
  },

  // Legacy
  {
    key: "legacyTeacherCourse",
    regex: /^\/teacher\/course\/([^/]+)$/,
    params: ["courseId"] as const,
  },
  {
    key: "legacyCourse",
    regex: /^\/course\/([^/]+)$/,
    params: ["courseId"] as const,
  },
  {
    key: "legacyTask",
    regex: /^\/task\/([^/]+)$/,
    params: ["taskId"] as const,
  },
  {
    key: "legacySubmit",
    regex: /^\/submit\/([^/]+)$/,
    params: ["taskId"] as const,
  },
] as const;

export type RoutePatternKey = (typeof ROUTE_PATTERN_LIST)[number]["key"];
