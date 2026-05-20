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

  reviews: "/student/reviews",
  receivedReviews: "/student/reviews/received",
  review: (reviewId: string) => `/student/reviews/${reviewId}`,

  gradebook: "/student/gradebook",

  profile: "/profile",
  settings: "/settings",
  security: "/security",

  teacherDashboard: "/teacher/dashboard",
  teacherCourses: "/teacher/courses",
  teacherCourse: (courseId: string) => `/teacher/courses/${courseId}`,
  teacherRubrics: "/teacher/rubrics",
  teacherCreateAssignment: "/teacher/assignments/new",
  teacherAssignment: (assignmentId: string) => `/teacher/assignment/${assignmentId}`,
  teacherDistribution: "/teacher/distribution",
  teacherSubmissions: "/teacher/submissions",

  adminOverview: "/admin/overview",
  adminUsers: "/admin/users",
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
    key: "teacherAssignment",
    regex: /^\/teacher\/assignment\/([^/]+)$/,
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
