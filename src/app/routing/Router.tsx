import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/app/providers/auth.tsx";
import { isFlagEnabled } from "@/app/utils/featureFlags.ts";

import { ROUTES } from "@/shared/config/routes.ts";
import { getAuthRedirect, isAuthPage, isProtectedRoute } from "@/app/routing/guards.ts";
import { getCurrentHashPath, navigateHash, parseHash } from "@/app/routing/parseHash.ts";

// Student pages
import DashboardPage from "@/app/DashboardPage.tsx";
import TaskPage from "@/app/TaskPage.tsx";
import CoursePage from "@/app/CoursePage.tsx";
import CoursesListPage from "@/app/CoursesListPage.tsx";
import { SubmitWorkPage } from "@/features/submission";
import SubmissionsPage from "@/app/SubmissionsPage.tsx";
import ReviewsInboxPage from "@/pages/reviews/inbox/ui/Page.tsx";
import ReviewPage from "@/pages/reviews/review/ui/Page.tsx";
import ReceivedReviewsPage from "@/pages/reviews/received/ui/Page.tsx";
import GradebookPage from "@/app/GradebookPage.tsx";
import InboxPage from "@/app/InboxPage.tsx";
import LandingPage from "@/app/LandingPage.tsx";
import { LoginPage, RegisterPage } from "@/features/auth";
import CreateAppealPage from "@/pages/appeals/create/ui/Page.tsx";
import AppealsListPage from "@/app/student/AppealsListPage.tsx";
import { ExtensionRequestPage } from "@/pages/extensions/request";

// Profile/Settings pages
import ProfilePage from "@/app/ProfilePage.tsx";
import SettingsPage from "@/app/SettingsPage.tsx";
import SecurityPage from "@/app/SecurityPage.tsx";
import DeleteAccountPage from "@/app/profile/DeleteAccountPage.tsx";

// Public pages
import HelpPage from "@/app/public/HelpPage.tsx";
import StatusPage from "@/app/public/StatusPage.tsx";
import TermsPage from "@/app/public/TermsPage.tsx";
import ResetPasswordPage from "@/app/public/ResetPasswordPage.tsx";
import VerifyEmailPage from "@/app/public/VerifyEmailPage.tsx";

// Teacher pages
import TeacherDashboardPage from "@/app/teacher/TeacherDashboardPage.tsx";
import TeacherCoursesPage from "@/app/teacher/TeacherCoursesPage.tsx";
import TeacherCourseDetailsPage from "@/app/teacher/TeacherCourseDetailsPage.tsx";
import TeacherRubricsPage from "@/app/teacher/TeacherRubricsPage.tsx";
import TeacherAssignmentsPage from "@/app/teacher/TeacherAssignmentsPage.tsx";
import TeacherCreateAssignmentPage from "@/app/teacher/TeacherCreateAssignmentPage.tsx";
import TeacherAssignmentDetailsPage from "@/app/teacher/TeacherAssignmentDetailsPage.tsx";
import TeacherPeerSessionSettingsPage from "@/app/teacher/TeacherPeerSessionSettingsPage.tsx";
import TeacherDistributionPage from "@/app/teacher/TeacherDistributionPage.tsx";
import TeacherModerationPage from "@/app/teacher/TeacherModerationPage.tsx";
import TeacherSubmissionsPage from "@/app/teacher/TeacherSubmissionsPage.tsx";
import TeacherAnalyticsPage from "@/app/teacher/TeacherAnalyticsPage.tsx";
import TeacherAppealsPage from "@/app/teacher/TeacherAppealsPage.tsx";
import TeacherAnnouncementsPage from "@/app/teacher/TeacherAnnouncementsPage.tsx";
import TeacherExtensionsPage from "@/app/teacher/TeacherExtensionsPage.tsx";
import { TeacherAssignmentExtensionsPage } from "@/pages/teacher/assignment-extensinsions";
import TeacherAutomationPage from "@/app/teacher/TeacherAutomationPage.tsx";

// Admin pages
import AdminOverviewPage from "@/app/admin/AdminOverviewPage.tsx";
import AdminCoursesPage from "@/app/admin/AdminCoursesPage.tsx";
import AdminUsersPage from "@/app/admin/AdminUsersPage.tsx";
import AdminOrgsPage from "@/app/admin/AdminOrgsPage.tsx";
import AdminPluginsPage from "@/app/admin/AdminPluginsPage.tsx";
import AdminIntegrationsPage from "@/app/admin/AdminIntegrationsPage.tsx";
import AdminSettingsPage from "@/app/admin/AdminSettingsPage.tsx";
import AdminPoliciesPage from "@/app/admin/AdminPoliciesPage.tsx";
import AdminRetentionPage from "@/app/admin/AdminRetentionPage.tsx";
import AdminLimitsPage from "@/app/admin/AdminLimitsPage.tsx";
import AdminFlagsPage from "@/app/admin/AdminFlagsPage.tsx";
import AdminQueuesPage from "@/app/admin/AdminQueuesPage.tsx";
import AdminLogsPage from "@/app/admin/AdminLogsPage.tsx";
import AdminHealthPage from "@/app/admin/AdminHealthPage.tsx";

// Support
import SupportChatPage from "@/app/support/SupportChatPage.tsx";

// Error pages
import Error401Page from "@/app/errors/Error401Page.tsx";
import Error403Page from "@/app/errors/Error403Page.tsx";
import Error404Page from "@/app/errors/Error404Page.tsx";
import Error500Page from "@/app/errors/Error500Page.tsx";

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
    return null;
  }, [routeKey, params.courseId]);

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
  if (pathname === ROUTES.teacherDashboard) return <TeacherDashboardPage />;
  if (pathname === ROUTES.teacherCourses) return <TeacherCoursesPage />;
  if (pathname === ROUTES.teacherRubrics) return <TeacherRubricsPage />;
  if (pathname === ROUTES.teacherAssignments) return <TeacherAssignmentsPage />;
  if (pathname === ROUTES.teacherCreateAssignment) return <TeacherCreateAssignmentPage />;
  if (pathname === ROUTES.teacherDistribution) return <TeacherDistributionPage />;
  if (pathname === ROUTES.teacherModeration) return <TeacherModerationPage />;
  if (pathname === ROUTES.teacherSubmissions) return <TeacherSubmissionsPage />;
  if (pathname === ROUTES.teacherAnalytics) return <TeacherAnalyticsPage />;
  if (pathname === ROUTES.teacherAppeals) return <TeacherAppealsPage />;
  if (pathname === ROUTES.teacherAnnouncements) return <TeacherAnnouncementsPage />;
  if (pathname === ROUTES.teacherExtensions) return <TeacherExtensionsPage />;
  if (pathname === ROUTES.teacherAutomation) return <TeacherAutomationPage />;

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
  if (pathname === ROUTES.adminPlugins) return <AdminPluginsPage />;
  if (pathname === ROUTES.adminIntegrations) return <AdminIntegrationsPage />;
  if (pathname === ROUTES.adminSettings) return <AdminSettingsPage />;
  if (pathname === ROUTES.adminPolicies) return <AdminPoliciesPage />;
  if (pathname === ROUTES.adminRetention) return <AdminRetentionPage />;
  if (pathname === ROUTES.adminLimits) return <AdminLimitsPage />;
  if (pathname === ROUTES.adminFlags) return <AdminFlagsPage />;
  if (pathname === ROUTES.adminQueues) return <AdminQueuesPage />;
  if (pathname === ROUTES.adminLogs) return <AdminLogsPage />;
  if (pathname === ROUTES.adminHealth) return <AdminHealthPage />;

  // Student (static)
  if (pathname === ROUTES.dashboard) return <DashboardPage />;
  if (pathname === ROUTES.courses) return <CoursesListPage />;
  if (pathname === ROUTES.reviews) return <ReviewsInboxPage />;
  if (pathname === ROUTES.receivedReviews) return <ReceivedReviewsPage />;
  if (pathname === ROUTES.gradebook) return <GradebookPage />;
  if (pathname === ROUTES.inbox) return <InboxPage />;
  if (pathname === ROUTES.appeals) return <AppealsListPage />;
  if (pathname === ROUTES.extensions) return <ExtensionRequestPage />;

  // Student (dynamic)
  if (routeKey === "courseDetails" && params.courseId) {
    return <CoursePage courseId={params.courseId} />;
  }
  if (routeKey === "taskDetails" && params.taskId) {
    // TaskPage у тебя принимает только taskId — курс не обязателен
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
  if (routeKey === "extensionRequest" && params.courseId && params.taskId) {
    return <ExtensionRequestPage courseId={params.courseId} taskId={params.taskId} />;
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

  // Support
  if (pathname === ROUTES.supportChat) return <SupportChatPage />;

  // Errors
  if (pathname === ROUTES.error401) return <Error401Page />;
  if (pathname === ROUTES.error403) return <Error403Page />;
  if (pathname === ROUTES.error404) return <Error404Page />;
  if (pathname === ROUTES.error500) return <Error500Page />;

  return <Error404Page />;
}
