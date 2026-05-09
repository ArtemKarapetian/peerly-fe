import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { FeatureRoute } from "@/app/routing/FeatureRoute";
import { NavigateRegistrar } from "@/app/routing/NavigateRegistrar";
import { ProtectedRoute } from "@/app/routing/ProtectedRoute";
import { PublicOnlyRoute } from "@/app/routing/PublicOnlyRoute";
import { RoleRoute } from "@/app/routing/RoleRoute";

// Admin
const AdminCoursesPage = lazy(() => import("@/pages/admin/courses/ui/Page"));
const AdminOverviewPage = lazy(() => import("@/pages/admin/overview/ui/Page"));
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

// Teacher
const TeacherAssignmentDetailsPage = lazy(
  () => import("@/pages/teacher/assignment-detail/ui/Page"),
);
const TeacherAssignmentsPage = lazy(() => import("@/pages/teacher/assignments/ui/Page"));
const TeacherCourseDetailsPage = lazy(() => import("@/pages/teacher/course-detail/ui/Page"));
const TeacherCoursesPage = lazy(() => import("@/pages/teacher/courses/ui/Page"));
const TeacherCreateAssignmentPage = lazy(() => import("@/pages/teacher/create-assignment/ui/Page"));
const TeacherCreateCoursePage = lazy(() => import("@/pages/teacher/create-course/ui/Page"));
const TeacherDistributionPage = lazy(() => import("@/pages/teacher/distribution/ui/Page"));
const TeacherModerationPage = lazy(() => import("@/pages/teacher/moderation/ui/Page"));
const TeacherPeerSessionSettingsPage = lazy(
  () => import("@/pages/teacher/peer-session-settings/ui/Page"),
);
const TeacherRubricsPage = lazy(() => import("@/pages/teacher/rubrics/ui/Page"));
const TeacherRubricDetailPage = lazy(() => import("@/pages/teacher/rubric-detail/ui/Page"));
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
          <Route path="/student/dashboard" element={<DashboardPage />} />
          <Route path="/student/courses" element={<CoursesListPage />} />
          <Route path="/student/courses/:courseId" element={<CoursePage />} />
          <Route path="/student/courses/:courseId/tasks/:taskId" element={<TaskPage />} />
          <Route
            path="/student/courses/:courseId/tasks/:taskId/submit"
            element={<SubmitWorkPage />}
          />
          <Route
            path="/student/courses/:courseId/tasks/:taskId/submissions"
            element={<SubmissionsPage />}
          />
          <Route path="/student/reviews" element={<ReviewsInboxPage />} />
          <Route path="/student/reviews/received" element={<ReceivedReviewsPage />} />
          <Route path="/student/reviews/:reviewId" element={<ReviewPage />} />
          <Route path="/student/gradebook" element={<GradebookPage />} />

          {/* Legacy student paths → /student/* (transitional redirects) */}
          <Route path="/dashboard" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="/courses" element={<Navigate to="/student/courses" replace />} />
          <Route path="/courses/:courseId/*" element={<Navigate to="/student/courses" replace />} />
          <Route path="/reviews" element={<Navigate to="/student/reviews" replace />} />
          <Route path="/reviews/*" element={<Navigate to="/student/reviews" replace />} />
          <Route path="/gradebook" element={<Navigate to="/student/gradebook" replace />} />

          {/* Profile / Settings */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/offboarding/delete-account" element={<DeleteAccountPage />} />

          {/* Teacher */}
          <Route element={<RoleRoute allow={["Teacher"]} />}>
            <Route path="/teacher/courses" element={<TeacherCoursesPage />} />
            <Route path="/teacher/courses/new" element={<TeacherCreateCoursePage />} />
            <Route path="/teacher/courses/:courseId" element={<TeacherCourseDetailsPage />} />
            <Route path="/teacher/rubrics" element={<TeacherRubricsPage />} />
            <Route path="/teacher/rubrics/:rubricId" element={<TeacherRubricDetailPage />} />
            <Route path="/teacher/assignments" element={<TeacherAssignmentsPage />} />
            <Route path="/teacher/assignments/new" element={<TeacherCreateAssignmentPage />} />
            <Route
              path="/teacher/assignment/:assignmentId"
              element={<TeacherAssignmentDetailsPage />}
            />
            <Route
              path="/teacher/peer-session-settings/:assignmentId"
              element={<TeacherPeerSessionSettingsPage />}
            />
            <Route path="/teacher/distribution" element={<TeacherDistributionPage />} />
            <Route path="/teacher/moderation" element={<TeacherModerationPage />} />
            <Route path="/teacher/submissions" element={<TeacherSubmissionsPage />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allow={["Admin"]} />}>
            <Route path="/admin/overview" element={<AdminOverviewPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
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
