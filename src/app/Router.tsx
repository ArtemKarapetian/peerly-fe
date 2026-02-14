import { useState, useEffect } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import DashboardPage from './DashboardPage';
import TaskPage from './TaskPage';
import CoursePage from './CoursePage';
import CoursesListPage from './CoursesListPage';
import SubmitWorkPage from './SubmitWorkPage';
import SubmissionsPage from './SubmissionsPage';
import ReviewsInboxPage from './ReviewsInboxPage';
import ReviewPage from './ReviewPageNew';
import ReceivedReviewsPage from './ReceivedReviewsPage';
import GradebookPage from './GradebookPage';
import InboxPage from './InboxPage';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import AppealPage from './AppealPage';

// Teacher pages
import TeacherDashboardPage from './teacher/TeacherDashboardPage';
import TeacherCoursesPage from './teacher/TeacherCoursesPage';
import TeacherRubricsPage from './teacher/TeacherRubricsPage';
import TeacherAssignmentsPage from './teacher/TeacherAssignmentsPage';
import TeacherDistributionPage from './teacher/TeacherDistributionPage';
import TeacherModerationPage from './teacher/TeacherModerationPage';
import TeacherSubmissionsPage from './teacher/TeacherSubmissionsPage';
import TeacherAnalyticsPage from './teacher/TeacherAnalyticsPage';
import TeacherAppealsPage from './teacher/TeacherAppealsPage';
import TeacherAnnouncementsPage from './teacher/TeacherAnnouncementsPage';

// Admin pages
import AdminOverviewPage from './admin/AdminOverviewPage';
import AdminCoursesPage from './admin/AdminCoursesPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminOrgsPage from './admin/AdminOrgsPage';
import AdminPluginsPage from './admin/AdminPluginsPage';
import AdminIntegrationsPage from './admin/AdminIntegrationsPage';
import AdminPoliciesPage from './admin/AdminPoliciesPage';
import AdminFlagsPage from './admin/AdminFlagsPage';
import AdminQueuesPage from './admin/AdminQueuesPage';
import AdminLogsPage from './admin/AdminLogsPage';
import AdminHealthPage from './admin/AdminHealthPage';

/**
 * Router с защитой роутов
 * 
 * Public routes (isAuthenticated=false):
 * - #/ - landing page
 * - #/login - страница входа
 * - #/register - страница регистрации
 * 
 * Protected routes (isAuthenticated=true):
 * - #/dashboard - студенческий дашборд
 * - #/courses - список всех курсов
 * - #/course/:id - детали курса
 * - #/task/:id - детали задания
 * - #/courses/:courseId/tasks/:taskId/submit - отправка работы
 * - #/courses/:courseId/tasks/:taskId/submissions - история версий
 * - #/reviews - reviews inbox
 * - #/reviews/received - полученные рецензии (EXACT match - checked before pattern)
 * - #/reviews/:reviewId - экран рецензии (PATTERN match)
 * 
 * Правила редиректа:
 * - Если не авторизован и пытается попасть на protected route → /login
 * - Если авторизован и пытается попасть на /login или /register → /dashboard
 */

export type Route = 'landing' | 'login' | 'register' | 'dashboard' | 'courses' | 'course' | 'task' | 'submit' | 'submissions' | 'reviews' | 'review' | 'received-reviews' | 'gradebook' | 'appeal' | 'inbox';

export function Router() {
  const { isAuthenticated } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<Route>('landing');
  const [courseId, setCourseId] = useState<string | undefined>(undefined);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);
  const [reviewId, setReviewId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove #
      
      // Парсинг роута
      let parsedRoute: Route = 'landing';
      let parsedCourseId: string | undefined = undefined;
      let parsedTaskId: string | undefined = undefined;
      let parsedReviewId: string | undefined = undefined;

      // Route matching - order matters! Check most specific routes first.
      // IMPORTANT: Exact string matches MUST come before regex/pattern matches to avoid conflicts.
      
      // Check for /courses/:courseId/tasks/:taskId/submit
      const submitRegex = /^\/courses\/([^/]+)\/tasks\/([^/]+)\/submit$/;
      const submitMatch = hash.match(submitRegex);
      if (submitMatch) {
        parsedRoute = 'submit';
        parsedCourseId = submitMatch[1];
        parsedTaskId = submitMatch[2];
      } 
      // Check for /courses/:courseId/tasks/:taskId/submissions
      else {
        const submissionsRegex = /^\/courses\/([^/]+)\/tasks\/([^/]+)\/submissions$/;
        const submissionsMatch = hash.match(submissionsRegex);
        if (submissionsMatch) {
          parsedRoute = 'submissions';
          parsedCourseId = submissionsMatch[1];
          parsedTaskId = submissionsMatch[2];
        }
        // Check for exact match /reviews/received BEFORE pattern /reviews/:reviewId
        else if (hash === '/reviews/received') {
          parsedRoute = 'received-reviews';
        }
        // Check for /reviews inbox
        else if (hash === '/reviews') {
          parsedRoute = 'reviews';
        }
        // Check for /reviews/:reviewId (MUST come AFTER exact /reviews/received check)
        else {
          const reviewRegex = /^\/reviews\/([^/]+)$/;
          const reviewMatch = hash.match(reviewRegex);
          if (reviewMatch) {
            parsedRoute = 'review';
            parsedReviewId = reviewMatch[1];
          }
          // Legacy routes
          else if (hash.startsWith('/task/')) {
            parsedRoute = 'task';
            parsedTaskId = hash.replace('/task/', '');
          }
          else if (hash.startsWith('/course/')) {
            parsedRoute = 'course';
            parsedCourseId = hash.replace('/course/', '');
          }
          // Simple exact match routes
          else if (hash === '/dashboard') {
            parsedRoute = 'dashboard';
          }
          else if (hash === '/gradebook') {
            parsedRoute = 'gradebook';
          }
          else if (hash === '/appeal') {
            parsedRoute = 'appeal';
          }
          else if (hash === '/inbox') {
            parsedRoute = 'inbox';
          }
          else if (hash === '/courses') {
            parsedRoute = 'courses';
          }
          else if (hash === '/login') {
            parsedRoute = 'login';
          }
          else if (hash === '/register') {
            parsedRoute = 'register';
          }
          else if (hash === '/' || hash === '') {
            parsedRoute = 'landing';
          }
        }
      }

      // Проверка доступа и редиректы
      const protectedRoutes: Route[] = ['dashboard', 'courses', 'course', 'task', 'submit', 'submissions', 'reviews', 'review', 'received-reviews', 'gradebook', 'appeal', 'inbox'];
      const authRoutes: Route[] = ['login', 'register'];

      if (!isAuthenticated && protectedRoutes.includes(parsedRoute)) {
        // Не авторизован и пытается попасть на protected route → /login
        window.location.hash = '/login';
        return;
      }

      if (isAuthenticated && authRoutes.includes(parsedRoute)) {
        // Авторизован и пытается попасть на /login или /register → /dashboard
        window.location.hash = '/dashboard';
        return;
      }

      // Если проверки пройдены, устанавливаем роут
      setCurrentRoute(parsedRoute);
      setCourseId(parsedCourseId);
      setTaskId(parsedTaskId);
      setReviewId(parsedReviewId);
    };

    // Initial load
    handleHashChange();

    // Listen to hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  switch (currentRoute) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'dashboard':
      return <DashboardPage />;
    case 'courses':
      return <CoursesListPage />;
    case 'course':
      return <CoursePage courseId={courseId} />;
    case 'task':
      return <TaskPage taskId={taskId} />;
    case 'submit':
      return <SubmitWorkPage courseId={courseId || '1'} taskId={taskId || '1'} />;
    case 'submissions':
      return <SubmissionsPage courseId={courseId || '1'} taskId={taskId || '1'} />;
    case 'reviews':
      return <ReviewsInboxPage />;
    case 'review':
      return <ReviewPage reviewId={reviewId || '1'} />;
    case 'received-reviews':
      return <ReceivedReviewsPage />;
    case 'gradebook':
      return <GradebookPage />;
    case 'appeal':
      return <AppealPage taskId={taskId} reviewId={reviewId} />;
    case 'inbox':
      return <InboxPage />;
    default:
      return <LandingPage />;
  }
}