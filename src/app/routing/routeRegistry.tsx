import { ComponentType, LazyExoticComponent, lazy } from "react";

import { ROUTES, ROUTE_PATTERNS } from "@/shared/config/routes";

type LazyComponent = LazyExoticComponent<ComponentType>;

export type Access = "public" | "publicOnly" | "auth" | "student" | "teacher" | "admin";

export interface RouteConfig {
  path: string;
  component?: LazyComponent;
  access: Access;
}

const AdminOverviewPage = lazy(() => import("@/pages/admin/overview"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users"));

const LoginPage = lazy(() => import("@/pages/auth/login"));
const RegisterPage = lazy(() => import("@/pages/auth/register"));

const Error401Page = lazy(() => import("@/pages/errors/401"));
const Error403Page = lazy(() => import("@/pages/errors/403"));
export const Error404Page = lazy(() => import("@/pages/errors/404"));
const Error500Page = lazy(() => import("@/pages/errors/500"));

const HelpPage = lazy(() => import("@/pages/public/help"));
const LandingPage = lazy(() => import("@/pages/public/landing"));
const TermsPage = lazy(() => import("@/pages/public/terms"));
const VerifyEmailPage = lazy(() => import("@/pages/public/verify-email"));

const ProfilePage = lazy(() => import("@/pages/shared/profile"));
const SecurityPage = lazy(() => import("@/pages/shared/security"));
const SettingsPage = lazy(() => import("@/pages/shared/settings"));

const CoursePage = lazy(() => import("@/pages/student/courses/detail"));
const CoursesListPage = lazy(() => import("@/pages/student/courses/list"));
const DashboardPage = lazy(() => import("@/pages/student/dashboard"));
const GradebookPage = lazy(() => import("@/pages/student/gradebook"));
const ReviewsInboxPage = lazy(() => import("@/pages/student/reviews/inbox"));
const ReceivedReviewsPage = lazy(() => import("@/pages/student/reviews/received"));
const ReviewPage = lazy(() => import("@/pages/student/reviews/review"));
const SubmitWorkPage = lazy(() => import("@/pages/student/submissions/submit-work"));
const SubmissionsPage = lazy(() => import("@/pages/student/submissions"));
const TaskPage = lazy(() => import("@/pages/student/task/detail"));

const TeacherAssignmentDetailsPage = lazy(() => import("@/pages/teacher/assignment-detail"));
const TeacherAnalyticsPage = lazy(() => import("@/pages/teacher/analytics"));
const TeacherCourseDetailsPage = lazy(() => import("@/pages/teacher/course-detail"));
const TeacherCoursesPage = lazy(() => import("@/pages/teacher/courses"));
const TeacherCreateAssignmentPage = lazy(() => import("@/pages/teacher/create-assignment"));
const TeacherCreateCoursePage = lazy(() => import("@/pages/teacher/create-course"));
const TeacherDistributionPage = lazy(() => import("@/pages/teacher/distribution"));
const TeacherRubricsPage = lazy(() => import("@/pages/teacher/rubrics"));
const TeacherRubricDetailPage = lazy(() => import("@/pages/teacher/rubric-detail"));
const TeacherSubmissionsPage = lazy(() => import("@/pages/teacher/submissions"));

export const routeRegistry: RouteConfig[] = [
  { path: ROUTES.landing, component: LandingPage, access: "public" },
  { path: ROUTES.help, component: HelpPage, access: "public" },
  { path: ROUTES.terms, component: TermsPage, access: "public" },

  {
    path: ROUTES.verifyEmail,
    component: VerifyEmailPage,
    access: "public",
  },

  { path: ROUTES.login, component: LoginPage, access: "publicOnly" },
  { path: ROUTES.register, component: RegisterPage, access: "publicOnly" },

  { path: ROUTES.dashboard, component: DashboardPage, access: "student" },
  { path: ROUTES.courses, component: CoursesListPage, access: "student" },
  { path: ROUTE_PATTERNS.studentCourse, component: CoursePage, access: "student" },
  { path: ROUTE_PATTERNS.studentTask, component: TaskPage, access: "student" },
  { path: ROUTE_PATTERNS.studentSubmitWork, component: SubmitWorkPage, access: "student" },
  { path: ROUTE_PATTERNS.studentSubmissions, component: SubmissionsPage, access: "student" },
  { path: ROUTES.reviews, component: ReviewsInboxPage, access: "student" },
  { path: ROUTES.receivedReviews, component: ReceivedReviewsPage, access: "student" },
  { path: ROUTE_PATTERNS.studentReview, component: ReviewPage, access: "student" },
  { path: ROUTES.gradebook, component: GradebookPage, access: "student" },

  { path: ROUTES.profile, component: ProfilePage, access: "auth" },
  { path: ROUTES.settings, component: SettingsPage, access: "auth" },
  { path: ROUTES.security, component: SecurityPage, access: "auth" },

  { path: ROUTES.teacherCourses, component: TeacherCoursesPage, access: "teacher" },
  { path: ROUTES.teacherCreateCourse, component: TeacherCreateCoursePage, access: "teacher" },
  { path: ROUTE_PATTERNS.teacherCourse, component: TeacherCourseDetailsPage, access: "teacher" },
  { path: ROUTES.teacherRubrics, component: TeacherRubricsPage, access: "teacher" },
  { path: ROUTE_PATTERNS.teacherRubric, component: TeacherRubricDetailPage, access: "teacher" },
  {
    path: ROUTES.teacherCreateAssignment,
    component: TeacherCreateAssignmentPage,
    access: "teacher",
  },
  {
    path: ROUTE_PATTERNS.teacherAssignment,
    component: TeacherAssignmentDetailsPage,
    access: "teacher",
  },
  { path: ROUTES.teacherAnalytics, component: TeacherAnalyticsPage, access: "teacher" },
  { path: ROUTES.teacherDistribution, component: TeacherDistributionPage, access: "teacher" },
  { path: ROUTES.teacherSubmissions, component: TeacherSubmissionsPage, access: "teacher" },

  { path: ROUTES.adminOverview, component: AdminOverviewPage, access: "admin" },
  { path: ROUTES.adminUsers, component: AdminUsersPage, access: "admin" },

  { path: ROUTES.error401, component: Error401Page, access: "public" },
  { path: ROUTES.error403, component: Error403Page, access: "public" },
  { path: ROUTES.error404, component: Error404Page, access: "public" },
  { path: ROUTES.error500, component: Error500Page, access: "public" },
];
