import { useState, useEffect } from "react";
import { useAuth } from "@/app/providers/auth.tsx";
import { isFlagEnabled } from "@/app/utils/featureFlags";

// Student pages
import DashboardPage from "./DashboardPage";
import TaskPage from "./TaskPage";
import CoursePage from "./CoursePage";
import CoursesListPage from "./CoursesListPage";
import SubmitWorkPage from "./SubmitWorkPage";
import SubmissionsPage from "./SubmissionsPage";
import ReviewsInboxPage from "./ReviewsInboxPage";
import ReviewPage from "./ReviewPageNew";
import ReceivedReviewsPage from "./ReceivedReviewsPage";
import GradebookPage from "./GradebookPage";
import InboxPage from "./InboxPage";
import LandingPage from "./LandingPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import CreateAppealPage from "./student/CreateAppealPage";
import AppealsListPage from "./student/AppealsListPage";
import ExtensionRequestPage from "./student/ExtensionRequestPage";

// Profile/Settings pages
import ProfilePage from "./ProfilePage";
import SettingsPage from "./SettingsPage";
import SecurityPage from "./SecurityPage";
import DeleteAccountPage from "./profile/DeleteAccountPage";

// Public pages
import HelpPage from "./public/HelpPage";
import StatusPage from "./public/StatusPage";
import TermsPage from "./public/TermsPage";
import ResetPasswordPage from "./public/ResetPasswordPage";
import VerifyEmailPage from "./public/VerifyEmailPage";

// Teacher pages
import TeacherDashboardPage from "./teacher/TeacherDashboardPage";
import TeacherCoursesPage from "./teacher/TeacherCoursesPage";
import TeacherCourseDetailsPage from "./teacher/TeacherCourseDetailsPage";
import TeacherRubricsPage from "./teacher/TeacherRubricsPage";
import TeacherAssignmentsPage from "./teacher/TeacherAssignmentsPage";
import TeacherCreateAssignmentPage from "./teacher/TeacherCreateAssignmentPage";
import TeacherAssignmentDetailsPage from "./teacher/TeacherAssignmentDetailsPage";
import TeacherPeerSessionSettingsPage from "./teacher/TeacherPeerSessionSettingsPage";
import TeacherDistributionPage from "./teacher/TeacherDistributionPage";
import TeacherModerationPage from "./teacher/TeacherModerationPage";
import TeacherSubmissionsPage from "./teacher/TeacherSubmissionsPage";
import TeacherAnalyticsPage from "./teacher/TeacherAnalyticsPage";
import TeacherAppealsPage from "./teacher/TeacherAppealsPage";
import TeacherAnnouncementsPage from "./teacher/TeacherAnnouncementsPage";
import TeacherExtensionsPage from "./teacher/TeacherExtensionsPage";
import TeacherAssignmentExtensionsPage from "./teacher/TeacherAssignmentExtensionsPage";
import TeacherAutomationPage from "./teacher/TeacherAutomationPage";

// Admin pages
import AdminOverviewPage from "./admin/AdminOverviewPage";
import AdminCoursesPage from "./admin/AdminCoursesPage";
import AdminUsersPage from "./admin/AdminUsersPage";
import AdminOrgsPage from "./admin/AdminOrgsPage";
import AdminPluginsPage from "./admin/AdminPluginsPage";
import AdminIntegrationsPage from "./admin/AdminIntegrationsPage";
import AdminSettingsPage from "./admin/AdminSettingsPage";
import AdminPoliciesPage from "./admin/AdminPoliciesPage";
import AdminRetentionPage from "./admin/AdminRetentionPage";
import AdminLimitsPage from "./admin/AdminLimitsPage";
import AdminFlagsPage from "./admin/AdminFlagsPage";
import AdminQueuesPage from "./admin/AdminQueuesPage";
import AdminLogsPage from "./admin/AdminLogsPage";
import AdminHealthPage from "./admin/AdminHealthPage";

// Support
import SupportChatPage from "./support/SupportChatPage";

// Error pages
import Error401Page from "./errors/Error401Page";
import Error403Page from "./errors/Error403Page";
import Error404Page from "./errors/Error404Page";
import Error500Page from "./errors/Error500Page";

/**
 * Extended Router with Teacher and Admin routes
 */

export function Router() {
  const { isAuthenticated } = useAuth();
  const [currentHash, setCurrentHash] = useState(window.location.hash.slice(1));
  const [params, setParams] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "/";
      setCurrentHash(hash);

      // Parse params from hash
      const extractedParams: Record<string, string> = {};

      // Extract courseId and taskId from complex routes
      const submitMatch = hash.match(/^\/courses\/([^/]+)\/tasks\/([^/]+)\/submit$/);
      const submissionsMatch = hash.match(/^\/courses\/([^/]+)\/tasks\/([^/]+)\/submissions$/);
      const extensionRequestMatch = hash.match(
        /^\/courses\/([^/]+)\/tasks\/([^/]+)\/extension-request$/,
      );
      const appealMatch = hash.match(/^\/courses\/([^/]+)\/tasks\/([^/]+)\/appeal$/);
      const reviewMatch = hash.match(/^\/reviews\/([^/]+)$/);
      const courseMatch = hash.match(/^\/course\/([^/]+)$/);
      const taskMatch = hash.match(/^\/task\/([^/]+)$/);
      const teacherCourseMatch = hash.match(/^\/teacher\/course\/([^/]+)$/);
      const teacherAssignmentMatch = hash.match(/^\/teacher\/assignment\/([^/]+)$/);
      const peerSessionMatch = hash.match(/^\/teacher\/peer-session-settings\/([^/]+)$/);

      if (submitMatch) {
        extractedParams.courseId = submitMatch[1];
        extractedParams.taskId = submitMatch[2];
      } else if (submissionsMatch) {
        extractedParams.courseId = submissionsMatch[1];
        extractedParams.taskId = submissionsMatch[2];
      } else if (extensionRequestMatch) {
        extractedParams.courseId = extensionRequestMatch[1];
        extractedParams.taskId = extensionRequestMatch[2];
      } else if (appealMatch) {
        extractedParams.courseId = appealMatch[1];
        extractedParams.taskId = appealMatch[2];
      } else if (reviewMatch && hash !== "/reviews/received") {
        extractedParams.reviewId = reviewMatch[1];
      } else if (teacherCourseMatch) {
        extractedParams.courseId = teacherCourseMatch[1];
      } else if (teacherAssignmentMatch) {
        extractedParams.assignmentId = teacherAssignmentMatch[1];
      } else if (peerSessionMatch) {
        extractedParams.assignmentId = peerSessionMatch[1];
      } else if (courseMatch) {
        extractedParams.courseId = courseMatch[1];
      } else if (taskMatch) {
        extractedParams.taskId = taskMatch[1];
      }

      setParams(extractedParams);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Route protection
  const protectedPaths = [
    "/dashboard",
    "/courses",
    "/course/",
    "/task/",
    "/reviews",
    "/gradebook",
    "/inbox",
    "/teacher/",
    "/admin/",
  ];

  const isProtectedRoute = protectedPaths.some((path) => currentHash.startsWith(path));

  // Compute redirect target
  const redirectTo = (() => {
    if (!isAuthenticated && isProtectedRoute) {
      return "/login";
    } else if (isAuthenticated && (currentHash === "/login" || currentHash === "/register")) {
      return "/dashboard";
    }
    return null;
  })();

  // Handle redirects via useEffect
  useEffect(() => {
    if (redirectTo) {
      window.location.hash = redirectTo;
    }
  }, [redirectTo]);

  if (!isAuthenticated && isProtectedRoute) {
    return <LoginPage />;
  }

  if (isAuthenticated && (currentHash === "/login" || currentHash === "/register")) {
    return <DashboardPage />;
  }

  // Teacher routes
  if (currentHash === "/teacher/dashboard") return <TeacherDashboardPage />;
  if (currentHash === "/teacher/courses") return <TeacherCoursesPage />;
  if (currentHash.startsWith("/teacher/course/"))
    return <TeacherCourseDetailsPage courseId={params.courseId} />;
  if (currentHash === "/teacher/rubrics") return <TeacherRubricsPage />;
  if (currentHash === "/teacher/assignments") return <TeacherAssignmentsPage />;
  if (currentHash === "/teacher/assignments/new") return <TeacherCreateAssignmentPage />;
  if (currentHash.startsWith("/teacher/assignment/")) {
    if (currentHash.includes("/extensions")) {
      const assignmentExtMatch = currentHash.match(/^\/teacher\/assignment\/([^/]+)\/extensions$/);
      if (assignmentExtMatch) {
        return <TeacherAssignmentExtensionsPage assignmentId={assignmentExtMatch[1]} />;
      }
    }
    return <TeacherAssignmentDetailsPage assignmentId={params.assignmentId} />;
  }
  if (currentHash.startsWith("/teacher/peer-session-settings/"))
    return <TeacherPeerSessionSettingsPage assignmentId={params.assignmentId} />;
  if (currentHash === "/teacher/distribution") return <TeacherDistributionPage />;
  if (currentHash === "/teacher/moderation") return <TeacherModerationPage />;
  if (currentHash === "/teacher/submissions") return <TeacherSubmissionsPage />;
  if (currentHash === "/teacher/analytics") return <TeacherAnalyticsPage />;
  if (currentHash === "/teacher/appeals") return <TeacherAppealsPage />;
  if (currentHash === "/teacher/announcements") return <TeacherAnnouncementsPage />;
  if (currentHash === "/teacher/extensions") return <TeacherExtensionsPage />;
  if (currentHash === "/teacher/automation") return <TeacherAutomationPage />;

  // Admin routes
  if (currentHash === "/admin/overview") return <AdminOverviewPage />;
  if (currentHash === "/admin/courses") return <AdminCoursesPage />;
  if (currentHash === "/admin/users") return <AdminUsersPage />;
  if (currentHash === "/admin/orgs") return <AdminOrgsPage />;
  if (currentHash === "/admin/plugins") return <AdminPluginsPage />;
  if (currentHash === "/admin/integrations") return <AdminIntegrationsPage />;
  if (currentHash === "/admin/settings") return <AdminSettingsPage />;
  if (currentHash === "/admin/policies") return <AdminPoliciesPage />;
  if (currentHash === "/admin/retention") return <AdminRetentionPage />;
  if (currentHash === "/admin/limits") return <AdminLimitsPage />;
  if (currentHash === "/admin/flags") return <AdminFlagsPage />;
  if (currentHash === "/admin/queues") return <AdminQueuesPage />;
  if (currentHash === "/admin/logs") return <AdminLogsPage />;
  if (currentHash === "/admin/health") return <AdminHealthPage />;

  // Student routes
  if (currentHash === "/dashboard") return <DashboardPage />;
  if (currentHash === "/courses") return <CoursesListPage />;
  if (currentHash.startsWith("/course/")) return <CoursePage courseId={params.courseId} />;
  if (currentHash.startsWith("/task/")) return <TaskPage taskId={params.taskId} />;
  if (currentHash.match(/^\/courses\/[^/]+\/tasks\/[^/]+\/submit$/)) {
    return <SubmitWorkPage courseId={params.courseId || "1"} taskId={params.taskId || "1"} />;
  }
  if (currentHash.match(/^\/courses\/[^/]+\/tasks\/[^/]+\/appeal$/)) {
    return <CreateAppealPage courseId={params.courseId} taskId={params.taskId} />;
  }
  if (currentHash.match(/^\/courses\/[^/]+\/tasks\/[^/]+\/extension-request$/)) {
    return <ExtensionRequestPage />;
  }
  if (currentHash.match(/^\/courses\/[^/]+\/tasks\/[^/]+\/submissions$/)) {
    return <SubmissionsPage courseId={params.courseId || "1"} taskId={params.taskId || "1"} />;
  }
  if (currentHash === "/reviews") return <ReviewsInboxPage />;
  if (currentHash === "/reviews/received") return <ReceivedReviewsPage />;
  if (currentHash.match(/^\/reviews\/[^/]+$/) && currentHash !== "/reviews/received") {
    return <ReviewPage reviewId={params.reviewId || "1"} />;
  }
  if (currentHash === "/gradebook") return <GradebookPage />;
  if (currentHash === "/inbox") return <InboxPage />;
  if (currentHash === "/appeals") return <AppealsListPage />;
  if (currentHash === "/extensions") return <ExtensionRequestPage />;

  // Profile/Settings routes
  if (currentHash === "/profile") return <ProfilePage />;
  if (currentHash === "/settings") return <SettingsPage />;
  if (currentHash === "/security") return <SecurityPage />;
  if (currentHash === "/offboarding/delete-account") return <DeleteAccountPage />;

  // Public routes
  if (currentHash === "/login") return <LoginPage />;
  if (currentHash === "/register") return <RegisterPage />;
  if (currentHash === "/help") return <HelpPage />;
  if (currentHash === "/status") return <StatusPage />;
  if (currentHash === "/terms") return <TermsPage />;

  // Feature-flagged routes
  if (currentHash === "/reset-password") {
    if (isFlagEnabled("enablePasswordReset")) {
      return <ResetPasswordPage />;
    } else {
      // Feature is disabled, show login
      return <LoginPage />;
    }
  }

  if (currentHash.startsWith("/verify-email")) {
    if (isFlagEnabled("enableEmailConfirmation")) {
      return <VerifyEmailPage />;
    } else {
      // Feature is disabled, show login
      return <LoginPage />;
    }
  }

  if (currentHash === "/" || currentHash === "") return <LandingPage />;

  // Support routes
  if (currentHash === "/support/chat") return <SupportChatPage />;

  // Error routes
  if (currentHash === "/401") return <Error401Page />;
  if (currentHash === "/403") return <Error403Page />;
  if (currentHash === "/404") return <Error404Page />;
  if (currentHash === "/500") return <Error500Page />;

  // 404 fallback
  return <Error404Page />;
}
