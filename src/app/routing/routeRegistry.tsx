import { ComponentType, LazyExoticComponent, lazy } from "react";

import { ROUTES, ROUTE_PATTERNS } from "@/shared/config/routes";

type LazyComponent = LazyExoticComponent<ComponentType>;

export type Access =
  | "public"
  | "publicOnly"
  | "auth"
  | "student"
  | "teacher"
  | "admin"
  | "redirect";

export interface RouteConfig {
  path: string;
  component?: LazyComponent;
  access: Access;
  redirectTo?: string;
}

const AdminOverviewPage = lazy(() => import("@/pages/admin/overview/ui/Page"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users/ui/Page"));

const LoginPage = lazy(() => import("@/pages/auth/login/ui/Page"));
const RegisterPage = lazy(() => import("@/pages/auth/register/ui/Page"));

const Error401Page = lazy(() => import("@/pages/errors/401/ui/Page"));
const Error403Page = lazy(() => import("@/pages/errors/403/ui/Page"));
const Error404Page = lazy(() => import("@/pages/errors/404/ui/Page"));
const Error500Page = lazy(() => import("@/pages/errors/500/ui/Page"));

const HelpPage = lazy(() => import("@/pages/public/help/ui/Page"));
const LandingPage = lazy(() => import("@/pages/public/landing/ui/Page"));
const TermsPage = lazy(() => import("@/pages/public/terms/ui/Page"));
const VerifyEmailPage = lazy(() => import("@/pages/public/verify-email/ui/Page"));

const ProfilePage = lazy(() => import("@/pages/shared/profile/ui/Page"));
const SecurityPage = lazy(() => import("@/pages/shared/security/ui/Page"));
const SettingsPage = lazy(() => import("@/pages/shared/settings/ui/Page"));

const CoursePage = lazy(() => import("@/pages/student/courses/detail/ui/Page"));
const CoursesListPage = lazy(() => import("@/pages/student/courses/list/ui/Page"));
const DashboardPage = lazy(() => import("@/pages/student/dashboard/ui/Page"));
const GradebookPage = lazy(() => import("@/pages/student/gradebook/ui/Page"));
const ReviewsInboxPage = lazy(() => import("@/pages/student/reviews/inbox/ui/Page"));
const ReceivedReviewsPage = lazy(() => import("@/pages/student/reviews/received/ui/Page"));
const ReviewPage = lazy(() => import("@/pages/student/reviews/review/ui/Page"));
const SubmitWorkPage = lazy(() => import("@/pages/student/submissions/submit-work/ui/Page"));
const SubmissionsPage = lazy(() => import("@/pages/student/submissions/ui/Page"));
const TaskPage = lazy(() => import("@/pages/student/task/detail/ui/Page"));

const TeacherAssignmentDetailsPage = lazy(
  () => import("@/pages/teacher/assignment-detail/ui/Page"),
);
const TeacherAnalyticsPage = lazy(() => import("@/pages/teacher/analytics/ui/Page"));
const TeacherCourseDetailsPage = lazy(() => import("@/pages/teacher/course-detail/ui/Page"));
const TeacherCoursesPage = lazy(() => import("@/pages/teacher/courses/ui/Page"));
const TeacherCreateAssignmentPage = lazy(() => import("@/pages/teacher/create-assignment/ui/Page"));
const TeacherCreateCoursePage = lazy(() => import("@/pages/teacher/create-course/ui/Page"));
const TeacherDistributionPage = lazy(() => import("@/pages/teacher/distribution/ui/Page"));
const TeacherRubricsPage = lazy(() => import("@/pages/teacher/rubrics/ui/Page"));
const TeacherRubricDetailPage = lazy(() => import("@/pages/teacher/rubric-detail/ui/Page"));
const TeacherSubmissionsPage = lazy(() => import("@/pages/teacher/submissions/ui/Page"));

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
