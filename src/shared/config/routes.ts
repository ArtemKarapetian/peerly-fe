// Единственный источник URL-ов: статические пути, билдеры и регексы для extract params

export const ROUTES = {
  landing: "/",

  login: "/login",
  register: "/register",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  help: "/help",
  status: "/status",
  terms: "/terms",

  error401: "/401",
  error403: "/403",
  error404: "/404",
  error500: "/500",

  dashboard: "/student/dashboard",
  courses: "/student/courses",
  course: (courseId: string) => `/student/courses/${courseId}`,
  task: (courseId: string, taskId: string) => `/student/courses/${courseId}/tasks/${taskId}`,
  submitWork: (courseId: string, taskId: string) =>
    `/student/courses/${courseId}/tasks/${taskId}/submit`,
  submissions: (courseId: string, taskId: string) =>
    `/student/courses/${courseId}/tasks/${taskId}/submissions`,
  taskAppeal: (courseId: string, taskId: string) =>
    `/student/courses/${courseId}/tasks/${taskId}/appeal`,

  reviews: "/student/reviews",
  receivedReviews: "/student/reviews/received",
  review: (reviewId: string) => `/student/reviews/${reviewId}`,

  gradebook: "/student/gradebook",
  inbox: "/student/inbox",
  appeals: "/student/appeals",

  profile: "/profile",
  settings: "/settings",
  security: "/security",
  deleteAccount: "/offboarding/delete-account",

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

  adminOverview: "/admin/overview",
  adminCourses: "/admin/courses",
  adminUsers: "/admin/users",
  adminFlags: "/admin/flags",
  adminLogs: "/admin/logs",
  adminSettings: "/admin/settings",
  adminIntegrations: "/admin/integrations",
  adminPlugins: "/admin/plugins",
  adminRetention: "/admin/retention",
  adminLimits: "/admin/limits",
} as const;

export type RoutePatternDef = {
  key: string;
  regex: RegExp;
  params: readonly string[];
};

// Порядок важен: сначала более специфичные, потом общие — иначе общий съест частный
export const ROUTE_PATTERN_LIST = [
  {
    key: "submitWork",
    regex: /^\/student\/courses\/([^/]+)\/tasks\/([^/]+)\/submit$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "submissions",
    regex: /^\/student\/courses\/([^/]+)\/tasks\/([^/]+)\/submissions$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "taskAppeal",
    regex: /^\/student\/courses\/([^/]+)\/tasks\/([^/]+)\/appeal$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "taskDetails",
    regex: /^\/student\/courses\/([^/]+)\/tasks\/([^/]+)$/,
    params: ["courseId", "taskId"] as const,
  },
  {
    key: "review",
    regex: /^\/student\/reviews\/([^/]+)$/,
    params: ["reviewId"] as const,
  },
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
  {
    key: "courseDetails",
    regex: /^\/student\/courses\/([^/]+)$/,
    params: ["courseId"] as const,
  },
] as const;

export type RoutePatternKey = (typeof ROUTE_PATTERN_LIST)[number]["key"];
