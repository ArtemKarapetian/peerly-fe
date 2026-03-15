import { useEffect, useMemo, useState } from "react";

import { ROUTES } from "@/shared/config/routes.ts";
import { isFlagEnabled } from "@/shared/lib/feature-flags";

import { useAuth } from "@/entities/user";

import AdminCoursesPage from "@/pages/admin/courses/ui/Page.tsx";
import AdminFlagsPage from "@/pages/admin/flags/ui/Page.tsx";
import AdminIntegrationsPage from "@/pages/admin/integrations/ui/Page.tsx";
import AdminLimitsPage from "@/pages/admin/limits/ui/Page.tsx";
import AdminLogsPage from "@/pages/admin/logs/ui/Page.tsx";
import AdminOrgsPage from "@/pages/admin/orgs/ui/Page.tsx";
import AdminOverviewPage from "@/pages/admin/overview/ui/Page.tsx";
import AdminPluginsPage from "@/pages/admin/plugins/ui/Page.tsx";
import AdminRetentionPage from "@/pages/admin/retention/ui/Page.tsx";
import AdminSettingsPage from "@/pages/admin/settings/ui/Page.tsx";
import AdminUsersPage from "@/pages/admin/users/ui/Page.tsx";
import { LoginPage } from "@/pages/auth/login";
import { RegisterPage } from "@/pages/auth/register";
import Error401Page from "@/pages/errors/401/ui/Page.tsx";
import Error403Page from "@/pages/errors/403/ui/Page.tsx";
import Error404Page from "@/pages/errors/404/ui/Page.tsx";
import Error500Page from "@/pages/errors/500/ui/Page.tsx";
import HelpPage from "@/pages/public/help/ui/Page.tsx";
import LandingPage from "@/pages/public/landing/ui/Page.tsx";
import ResetPasswordPage from "@/pages/public/reset-password/ui/Page.tsx";
import StatusPage from "@/pages/public/status/ui/Page.tsx";
import TermsPage from "@/pages/public/terms/ui/Page.tsx";
import VerifyEmailPage from "@/pages/public/verify-email/ui/Page.tsx";
import DeleteAccountPage from "@/pages/shared/delete-account/ui/Page.tsx";
import ProfilePage from "@/pages/shared/profile/ui/Page.tsx";
import SecurityPage from "@/pages/shared/security/ui/Page.tsx";
import SettingsPage from "@/pages/shared/settings/ui/Page.tsx";
import CreateAppealPage from "@/pages/student/appeals/create/ui/Page.tsx";
import AppealsListPage from "@/pages/student/appeals/list/ui/Page.tsx";
import CoursePage from "@/pages/student/courses/detail/ui/Page.tsx";
import CoursesListPage from "@/pages/student/courses/list/ui/Page.tsx";
import DashboardPage from "@/pages/student/dashboard/ui/Page.tsx";
import GradebookPage from "@/pages/student/gradebook/ui/Page.tsx";
import InboxPage from "@/pages/student/inbox/ui/Page.tsx";
import ReviewsInboxPage from "@/pages/student/reviews/inbox/ui/Page.tsx";
import ReceivedReviewsPage from "@/pages/student/reviews/received/ui/Page.tsx";
import ReviewPage from "@/pages/student/reviews/review/ui/Page.tsx";
import { SubmitWorkPage } from "@/pages/student/submissions/submit-work";
import SubmissionsPage from "@/pages/student/submissions/ui/Page.tsx";
import TaskPage from "@/pages/student/task/detail/ui/Page.tsx";
import TeacherAnalyticsPage from "@/pages/teacher/analytics/ui/Page.tsx";
import TeacherAnnouncementsPage from "@/pages/teacher/announcements/ui/Page.tsx";
import TeacherAppealsPage from "@/pages/teacher/appeals/ui/Page.tsx";
import TeacherAssignmentDetailsPage from "@/pages/teacher/assignment-detail/ui/Page.tsx";
import { TeacherAssignmentExtensionsPage } from "@/pages/teacher/assignment-extensinsions";
import TeacherAssignmentsPage from "@/pages/teacher/assignments/ui/Page.tsx";
import TeacherAutomationPage from "@/pages/teacher/automation/ui/Page.tsx";
import TeacherCourseDetailsPage from "@/pages/teacher/course-detail/ui/Page.tsx";
import TeacherCoursesPage from "@/pages/teacher/courses/ui/Page.tsx";
import TeacherCreateAssignmentPage from "@/pages/teacher/create-assignment/ui/Page.tsx";
import TeacherDistributionPage from "@/pages/teacher/distribution/ui/Page.tsx";
import TeacherExtensionsPage from "@/pages/teacher/extensions/ui/Page.tsx";
import TeacherModerationPage from "@/pages/teacher/moderation/ui/Page.tsx";
import TeacherPeerSessionSettingsPage from "@/pages/teacher/peer-session-settings/ui/Page.tsx";
import TeacherRubricsPage from "@/pages/teacher/rubrics/ui/Page.tsx";
import TeacherSubmissionsPage from "@/pages/teacher/submissions/ui/Page.tsx";

import { getAuthRedirect, isAuthPage, isProtectedRoute } from "@/app/routing/guards.ts";
import { getCurrentHashPath, navigateHash, parseHash } from "@/app/routing/parseHash.ts";

export function Router() {
  const { isAuthenticated } = useAuth();

  const [hashPath, setHashPath] = useState<string>(() => getCurrentHashPath());

  useEffect(() => {
    const onHashChange = () => setHashPath(getCurrentHashPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const parsed = useMemo(() => parseHash(hashPath), [hashPath]);
  const pathname = parsed.pathname;
  const params = parsed.params;
  const routeKey = parsed.routeKey;

  // (опционально) мягко нормализуем legacy URL -> canonical
  const legacyRedirect = useMemo(() => {
    if (routeKey === "legacyCourse" && params.courseId) return ROUTES.course(params.courseId);
    if (routeKey === "legacyTeacherCourse" && params.courseId)
      return ROUTES.teacherCourse(params.courseId);
    // Teacher dashboard removed — redirect to courses
    if (pathname === ROUTES.teacherDashboard) return ROUTES.teacherCourses;
    return null;
  }, [routeKey, params.courseId, pathname]);

  const authRedirect = useMemo(
    () => getAuthRedirect(pathname, isAuthenticated),
    [pathname, isAuthenticated],
  );

  const featureRedirect = useMemo(() => {
    if (pathname === ROUTES.resetPassword && !isFlagEnabled("enablePasswordReset"))
      return ROUTES.login;
    if (pathname === ROUTES.verifyEmail && !isFlagEnabled("enableEmailConfirmation"))
      return ROUTES.login;
    return null;
  }, [pathname]);

  const redirectTo = legacyRedirect ?? authRedirect ?? featureRedirect;

  useEffect(() => {
    if (redirectTo && redirectTo !== pathname) {
      navigateHash(redirectTo);
    }
  }, [redirectTo, pathname]);

  // Чтобы не мигал "404" до редиректа — сразу отрисуем ожидаемую страницу
  if (!isAuthenticated && isProtectedRoute(pathname)) return <LoginPage />;
  if (isAuthenticated && isAuthPage(pathname)) return <DashboardPage />;

  // Teacher (static)
  if (pathname === ROUTES.teacherCourses) return <TeacherCoursesPage />;
  if (pathname === ROUTES.teacherRubrics) return <TeacherRubricsPage />;
  if (pathname === ROUTES.teacherAssignments) return <TeacherAssignmentsPage />;
  if (pathname === ROUTES.teacherCreateAssignment) return <TeacherCreateAssignmentPage />;
  if (pathname === ROUTES.teacherDistribution) return <TeacherDistributionPage />;
  if (pathname === ROUTES.teacherModeration) return <TeacherModerationPage />;
  if (pathname === ROUTES.teacherSubmissions) return <TeacherSubmissionsPage />;
  if (pathname === ROUTES.teacherAppeals) return <TeacherAppealsPage />;

  // Teacher (feature-flagged)
  if (pathname === ROUTES.teacherAnalytics)
    return isFlagEnabled("enableAnalytics") ? <TeacherAnalyticsPage /> : <Error404Page />;
  if (pathname === ROUTES.teacherAnnouncements)
    return isFlagEnabled("enableAnnouncements") ? <TeacherAnnouncementsPage /> : <Error404Page />;
  if (pathname === ROUTES.teacherExtensions)
    return isFlagEnabled("enableExtensions") ? <TeacherExtensionsPage /> : <Error404Page />;
  if (pathname === ROUTES.teacherAutomation)
    return isFlagEnabled("enableAutomation") ? <TeacherAutomationPage /> : <Error404Page />;

  // Teacher (dynamic)
  if (routeKey === "teacherCourse" && params.courseId) {
    return <TeacherCourseDetailsPage courseId={params.courseId} />;
  }
  if (routeKey === "teacherAssignmentExtensions" && params.assignmentId) {
    return <TeacherAssignmentExtensionsPage assignmentId={params.assignmentId} />;
  }
  if (routeKey === "teacherAssignment" && params.assignmentId) {
    return <TeacherAssignmentDetailsPage assignmentId={params.assignmentId} />;
  }
  if (routeKey === "teacherPeerSessionSettings" && params.assignmentId) {
    return <TeacherPeerSessionSettingsPage assignmentId={params.assignmentId} />;
  }

  // Admin
  if (pathname === ROUTES.adminOverview) return <AdminOverviewPage />;
  if (pathname === ROUTES.adminCourses) return <AdminCoursesPage />;
  if (pathname === ROUTES.adminUsers) return <AdminUsersPage />;
  if (pathname === ROUTES.adminOrgs) return <AdminOrgsPage />;
  if (pathname === ROUTES.adminSettings) return <AdminSettingsPage />;
  if (pathname === ROUTES.adminFlags) return <AdminFlagsPage />;
  if (pathname === ROUTES.adminLogs) return <AdminLogsPage />;

  // Admin (feature-flagged)
  if (pathname === ROUTES.adminPlugins)
    return isFlagEnabled("enablePlugins") ? <AdminPluginsPage /> : <Error404Page />;
  if (pathname === ROUTES.adminIntegrations)
    return isFlagEnabled("enableIntegrations") ? <AdminIntegrationsPage /> : <Error404Page />;
  if (pathname === ROUTES.adminRetention)
    return isFlagEnabled("enableRetention") ? <AdminRetentionPage /> : <Error404Page />;
  if (pathname === ROUTES.adminLimits)
    return isFlagEnabled("enableLimits") ? <AdminLimitsPage /> : <Error404Page />;

  // Student (static)
  if (pathname === ROUTES.dashboard) return <DashboardPage />;
  if (pathname === ROUTES.courses) return <CoursesListPage />;
  if (pathname === ROUTES.reviews) return <ReviewsInboxPage />;
  if (pathname === ROUTES.receivedReviews) return <ReceivedReviewsPage />;
  if (pathname === ROUTES.gradebook) return <GradebookPage />;
  if (pathname === ROUTES.inbox) return <InboxPage />;
  if (pathname === ROUTES.appeals) return <AppealsListPage />;

  // Student (dynamic)
  if (routeKey === "courseDetails" && params.courseId) {
    return <CoursePage courseId={params.courseId} />;
  }
  if (routeKey === "taskDetails" && params.taskId) {
    return <TaskPage taskId={params.taskId} />;
  }
  if (routeKey === "submitWork" && params.courseId && params.taskId) {
    return <SubmitWorkPage courseId={params.courseId} taskId={params.taskId} />;
  }
  if (routeKey === "submissions" && params.courseId && params.taskId) {
    return <SubmissionsPage courseId={params.courseId} taskId={params.taskId} />;
  }
  if (routeKey === "taskAppeal" && params.courseId && params.taskId) {
    return <CreateAppealPage courseId={params.courseId} taskId={params.taskId} />;
  }
  if (routeKey === "review" && params.reviewId && pathname !== ROUTES.receivedReviews) {
    return <ReviewPage reviewId={params.reviewId} />;
  }

  // Legacy: /task/:id, /submit/:taskId
  if (routeKey === "legacyTask" && params.taskId) return <TaskPage taskId={params.taskId} />;
  if (routeKey === "legacySubmit" && params.taskId)
    return <SubmitWorkPage courseId={"1"} taskId={params.taskId} />;

  // Profile / settings
  if (pathname === ROUTES.profile) return <ProfilePage />;
  if (pathname === ROUTES.settings) return <SettingsPage />;
  if (pathname === ROUTES.security) return <SecurityPage />;
  if (pathname === ROUTES.deleteAccount) return <DeleteAccountPage />;

  // Public (auth)
  if (pathname === ROUTES.login) return <LoginPage />;
  if (pathname === ROUTES.register) return <RegisterPage />;

  // Public (static)
  if (pathname === ROUTES.help) return <HelpPage />;
  if (pathname === ROUTES.status) return <StatusPage />;
  if (pathname === ROUTES.terms) return <TermsPage />;

  // Feature-flagged public
  if (pathname === ROUTES.resetPassword) return <ResetPasswordPage />;
  if (pathname === ROUTES.verifyEmail) return <VerifyEmailPage />;

  // Landing
  if (pathname === ROUTES.landing) return <LandingPage />;

  // Errors
  if (pathname === ROUTES.error401) return <Error401Page />;
  if (pathname === ROUTES.error403) return <Error403Page />;
  if (pathname === ROUTES.error404) return <Error404Page />;
  if (pathname === ROUTES.error500) return <Error500Page />;

  return <Error404Page />;
}
