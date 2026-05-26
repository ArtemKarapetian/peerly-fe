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
  supportChat: "/support/chat",

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
  teacherCreateCourse: "/teacher/courses/new",
  teacherCourse: (courseId: string) => `/teacher/courses/${courseId}`,
  teacherRubrics: "/teacher/rubrics",
  teacherCreateAssignment: "/teacher/assignments/new",
  teacherAssignment: (assignmentId: string) => `/teacher/assignment/${assignmentId}`,
  teacherDistribution: "/teacher/distribution",
  teacherSubmissions: "/teacher/submissions",
  teacherAnalytics: "/teacher/analytics",

  adminOverview: "/admin/overview",
  adminUsers: "/admin/users",
} as const;

// React Router patterns (with :param) — single source for parameterized routes.
// Используется в routeRegistry; рантайм-ссылки строятся через ROUTES.<builder>.
export const ROUTE_PATTERNS = {
  studentCourse: "/student/courses/:courseId",
  studentTask: "/student/courses/:courseId/tasks/:taskId",
  studentSubmitWork: "/student/courses/:courseId/tasks/:taskId/submit",
  studentSubmissions: "/student/courses/:courseId/tasks/:taskId/submissions",
  studentReview: "/student/reviews/:reviewId",
  teacherCourse: "/teacher/courses/:courseId",
  teacherRubric: "/teacher/rubrics/:rubricId",
  teacherAssignment: "/teacher/assignment/:assignmentId",
} as const;
