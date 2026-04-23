import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { FeatureRoute } from "@/app/routing/FeatureRoute";
import { NavigateRegistrar } from "@/app/routing/NavigateRegistrar";
import { ProtectedRoute } from "@/app/routing/ProtectedRoute";
import { PublicOnlyRoute } from "@/app/routing/PublicOnlyRoute";
import { RoleRoute } from "@/app/routing/RoleRoute";

// Admin
const AdminCoursesPage = lazy(() => import("@/pages/admin/courses/ui/Page"));
const AdminFlagsPage = lazy(() => import("@/pages/admin/flags/ui/Page"));
const AdminIntegrationsPage = lazy(() => import("@/pages/admin/integrations/ui/Page"));
const AdminLimitsPage = lazy(() => import("@/pages/admin/limits/ui/Page"));
const AdminOrgsPage = lazy(() => import("@/pages/admin/orgs/ui/Page"));
const AdminOverviewPage = lazy(() => import("@/pages/admin/overview/ui/Page"));
const AdminPluginsPage = lazy(() => import("@/pages/admin/plugins/ui/Page"));
const AdminRetentionPage = lazy(() => import("@/pages/admin/retention/ui/Page"));
const AdminSettingsPage = lazy(() => import("@/pages/admin/settings/ui/Page"));
const AdminUsersPage = lazy(() => import("@/pages/admin/users/ui/Page"));

// Auth
const LoginPage = lazy(() => import("@/pages/auth/login/ui/Page"));
const RegisterPage = lazy(() => import("@/pages/auth/register/ui/Page"));

// Errors
const Error401Page = lazy(() => import("@/pages/errors/401/ui/Page"));
const Error403Page = lazy(() => import("@/pages/errors/403/ui/Page"));
const Error404Page = lazy(() => import("@/pages/errors/404/ui/Page"));
const Error500Page = lazy(() => import("@/pages/errors/500/ui/Page"));

// Public
const HelpPage = lazy(() => import("@/pages/public/help/ui/Page"));
const LandingPage = lazy(() => import("@/pages/public/landing/ui/Page"));
const ResetPasswordPage = lazy(() => import("@/pages/public/reset-password/ui/Page"));
const StatusPage = lazy(() => import("@/pages/public/status/ui/Page"));
const TermsPage = lazy(() => import("@/pages/public/terms/ui/Page"));
const VerifyEmailPage = lazy(() => import("@/pages/public/verify-email/ui/Page"));

// Shared (authenticated)
const DeleteAccountPage = lazy(() => import("@/pages/shared/delete-account/ui/Page"));
const ProfilePage = lazy(() => import("@/pages/shared/profile/ui/Page"));
const SecurityPage = lazy(() => import("@/pages/shared/security/ui/Page"));
const SettingsPage = lazy(() => import("@/pages/shared/settings/ui/Page"));

// Student
const CreateAppealPage = lazy(() => import("@/pages/student/appeals/create/ui/Page"));
const AppealsListPage = lazy(() => import("@/pages/student/appeals/list/ui/Page"));
const CoursePage = lazy(() => import("@/pages/student/courses/detail/ui/Page"));
const CoursesListPage = lazy(() => import("@/pages/student/courses/list/ui/Page"));
const DashboardPage = lazy(() => import("@/pages/student/dashboard/ui/Page"));
const GradebookPage = lazy(() => import("@/pages/student/gradebook/ui/Page"));
const InboxPage = lazy(() => import("@/pages/student/inbox/ui/Page"));
const ReviewsInboxPage = lazy(() => import("@/pages/student/reviews/inbox/ui/Page"));
const ReceivedReviewsPage = lazy(() => import("@/pages/student/reviews/received/ui/Page"));
const ReviewPage = lazy(() => import("@/pages/student/reviews/review/ui/Page"));
const SubmitWorkPage = lazy(() => import("@/pages/student/submissions/submit-work/ui/Page"));
const SubmissionsPage = lazy(() => import("@/pages/student/submissions/ui/Page"));
const TaskPage = lazy(() => import("@/pages/student/task/detail/ui/Page"));

// Teacher
const TeacherAnalyticsPage = lazy(() => import("@/pages/teacher/analytics/ui/Page"));
const TeacherAnnouncementsPage = lazy(() => import("@/pages/teacher/announcements/ui/Page"));
const TeacherAppealsPage = lazy(() => import("@/pages/teacher/appeals/ui/Page"));
const TeacherAssignmentDetailsPage = lazy(
  () => import("@/pages/teacher/assignment-detail/ui/Page"),
);
const TeacherAssignmentExtensionsPage = lazy(
  () => import("@/pages/teacher/assignment-extensinsions/ui/Page"),
);
const TeacherAssignmentsPage = lazy(() => import("@/pages/teacher/assignments/ui/Page"));
const TeacherAutomationPage = lazy(() => import("@/pages/teacher/automation/ui/Page"));
const TeacherCourseDetailsPage = lazy(() => import("@/pages/teacher/course-detail/ui/Page"));
const TeacherCoursesPage = lazy(() => import("@/pages/teacher/courses/ui/Page"));
const TeacherCreateAssignmentPage = lazy(() => import("@/pages/teacher/create-assignment/ui/Page"));
const TeacherCreateCoursePage = lazy(() => import("@/pages/teacher/create-course/ui/Page"));
const TeacherDistributionPage = lazy(() => import("@/pages/teacher/distribution/ui/Page"));
const TeacherExtensionsPage = lazy(() => import("@/pages/teacher/extensions/ui/Page"));
const TeacherModerationPage = lazy(() => import("@/pages/teacher/moderation/ui/Page"));
const TeacherPeerSessionSettingsPage = lazy(
  () => import("@/pages/teacher/peer-session-settings/ui/Page"),
);
const TeacherRubricsPage = lazy(() => import("@/pages/teacher/rubrics/ui/Page"));
const TeacherSubmissionsPage = lazy(() => import("@/pages/teacher/submissions/ui/Page"));

function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function Router() {
  return (
    <Suspense fallback={<PageFallback />}>
      <NavigateRegistrar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Feature-flagged public */}
        <Route element={<FeatureRoute flag="enablePasswordReset" redirectTo="/login" />}>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route element={<FeatureRoute flag="enableEmailConfirmation" redirectTo="/login" />}>
          <Route path="/verify-email" element={<VerifyEmailPage />} />
        </Route>

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* Student */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CoursesListPage />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/courses/:courseId/tasks/:taskId" element={<TaskPage />} />
          <Route path="/courses/:courseId/tasks/:taskId/submit" element={<SubmitWorkPage />} />
          <Route
            path="/courses/:courseId/tasks/:taskId/submissions"
            element={<SubmissionsPage />}
          />
          <Route element={<FeatureRoute flag="enableAppeals" />}>
            <Route path="/courses/:courseId/tasks/:taskId/appeal" element={<CreateAppealPage />} />
          </Route>
          <Route path="/reviews" element={<ReviewsInboxPage />} />
          <Route path="/reviews/received" element={<ReceivedReviewsPage />} />
          <Route path="/reviews/:reviewId" element={<ReviewPage />} />
          <Route path="/gradebook" element={<GradebookPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route element={<FeatureRoute flag="enableAppeals" />}>
            <Route path="/appeals" element={<AppealsListPage />} />
          </Route>

          {/* Profile / Settings */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/offboarding/delete-account" element={<DeleteAccountPage />} />

          {/* Teacher */}
          <Route element={<RoleRoute allow={["Teacher"]} />}>
            {/* Teacher (static) */}
            <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
            <Route path="/teacher/courses/new" element={<TeacherCreateCoursePage />} />
            <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetailsPage />} />
            <Route path="/teacher/rubrics" element={<TeacherRubricsPage />} />
            <Route path="/teacher/assignments" element={<TeacherAssignmentsPage />} />
            <Route path="/teacher/assignments/new" element={<TeacherCreateAssignmentPage />} />
            <Route
              path="/teacher/assignment/:assignmentId"
              element={<TeacherAssignmentDetailsPage />}
            />
            <Route
              path="/teacher/assignment/:assignmentId/extensions"
              element={<TeacherAssignmentExtensionsPage />}
            />
            <Route
              path="/teacher/peer-session-settings/:assignmentId"
              element={<TeacherPeerSessionSettingsPage />}
            />
            <Route path="/teacher/distribution" element={<TeacherDistributionPage />} />
            <Route path="/teacher/moderation" element={<TeacherModerationPage />} />
            <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
            <Route element={<FeatureRoute flag="enableAppeals" />}>
              <Route path="/teacher/appeals" element={<TeacherAppealsPage />} />
            </Route>

            {/* Teacher (feature-flagged) */}
            <Route element={<FeatureRoute flag="enableAnalytics" />}>
              <Route path="/teacher/analytics" element={<TeacherAnalyticsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableAnnouncements" />}>
              <Route path="/teacher/announcements" element={<TeacherAnnouncementsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableExtensions" />}>
              <Route path="/teacher/extensions" element={<TeacherExtensionsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableAutomation" />}>
              <Route path="/teacher/automation" element={<TeacherAutomationPage />} />
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allow={["Admin"]} />}>
            <Route element={<FeatureRoute flag="enableAdminPanel" />}>
              <Route path="/admin/overview" element={<AdminOverviewPage />} />
              <Route path="/admin/courses" element={<AdminCoursesPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/flags" element={<AdminFlagsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableOrganizations" />}>
              <Route path="/admin/orgs" element={<AdminOrgsPage />} />
            </Route>

            {/* Admin (feature-flagged) */}
            <Route element={<FeatureRoute flag="enablePlugins" />}>
              <Route path="/admin/plugins" element={<AdminPluginsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableIntegrations" />}>
              <Route path="/admin/integrations" element={<AdminIntegrationsPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableRetention" />}>
              <Route path="/admin/retention" element={<AdminRetentionPage />} />
            </Route>
            <Route element={<FeatureRoute flag="enableLimits" />}>
              <Route path="/admin/limits" element={<AdminLimitsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/teacher/dashboard" element={<Navigate to="/teacher/courses" replace />} />

        {/* ── Error pages ───────────────────────────────── */}
        <Route path="/401" element={<Error401Page />} />
        <Route path="/403" element={<Error403Page />} />
        <Route path="/404" element={<Error404Page />} />
        <Route path="/500" element={<Error500Page />} />

        {/* ── Catch-all ─────────────────────────────────── */}
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </Suspense>
  );
}
