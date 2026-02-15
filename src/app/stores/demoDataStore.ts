/**
 * Demo Data Store - In-memory data for demonstration
 *
 * Provides mock data for:
 * - Users (students, teachers, admins)
 * - Organizations/Tenants
 * - Courses
 * - Assignments
 * - Rubrics
 * - Submissions
 * - Reviews
 * - Announcements
 * - Appeals
 * - Audit Logs
 * - Plugins
 * - Feature Flags
 */
import { DemoUser } from "@/entities/user/model/types.ts";
import { CreateCourseInput, DemoCourse } from "@/entities/course/model/types.ts";
import { DemoOrganization } from "@/entities/organization/model/types.ts";
import { DemoSubmission } from "@/entities/work/model/types.ts";
import { DemoReview } from "@/entities/review/model/types.ts";
import { DemoAssignment } from "@/entities/assignment/model/types.ts";
import { DemoAnnouncement } from "@/entities/announcement/model/types.ts";
import { DemoAppeal } from "@/entities/appeal/model/types.ts";
import { DemoPlugin } from "@/entities/plugin/model/types.ts";
import { DemoFeatureFlag } from "@/entities/feature-flag/model/types.ts";
import { DemoAuditLog } from "@/entities/audit-log/model/types.ts";

// ========== MOCK DATA ==========

// Organizations
const demoOrgs: DemoOrganization[] = [
  {
    id: "org1",
    name: "Университет Иннополис",
    slug: "innopolis",
    plan: "enterprise",
    userCount: 523,
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "org2",
    name: "МГУ им. Ломоносова",
    slug: "msu",
    plan: "pro",
    userCount: 1247,
    createdAt: new Date("2023-03-20"),
  },
  {
    id: "org3",
    name: "ИТМО",
    slug: "itmo",
    plan: "pro",
    userCount: 892,
    createdAt: new Date("2023-05-10"),
  },
];

// Users
const demoUsers: DemoUser[] = [
  {
    id: "u1",
    email: "student@peerly.ru",
    name: "Иван Петров",
    role: "Student",
    orgId: "org1",
    createdAt: new Date("2023-09-01"),
  },
  {
    id: "u2",
    email: "teacher@peerly.ru",
    name: "Мария Сидорова",
    role: "Teacher",
    orgId: "org1",
    createdAt: new Date("2023-01-20"),
  },
  {
    id: "u3",
    email: "admin@peerly.ru",
    name: "Алексей Смирнов",
    role: "Admin",
    orgId: "org1",
    createdAt: new Date("2023-01-15"),
  },
];

// Courses
const demoCourses: DemoCourse[] = [
  {
    id: "c1",
    name: "Веб-разработка",
    title: "Веб-разработка",
    code: "CS301",
    teacherId: "u2",
    orgId: "org1",
    enrollmentCount: 45,
    status: "active",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "c2",
    name: "Базы данных",
    title: "Базы данных",
    code: "CS302",
    teacherId: "u2",
    orgId: "org1",
    enrollmentCount: 38,
    status: "active",
    createdAt: new Date("2024-01-12"),
  },
  {
    id: "c3",
    name: "Алгоритмы",
    title: "Алгоритмы",
    code: "CS201",
    teacherId: "u2",
    orgId: "org1",
    enrollmentCount: 52,
    status: "active",
    createdAt: new Date("2023-09-01"),
  },
];

// Assignments
const demoAssignments: DemoAssignment[] = [
  {
    id: "a1",
    courseId: "c1",
    title: "Лендинг-страница",
    description: "Создать адаптивную лендинг-страницу",
    dueDate: new Date("2025-02-15"),
    reviewCount: 3,
    status: "published",
    rubricId: "r1",
  },
  {
    id: "a2",
    courseId: "c1",
    title: "REST API",
    description: "Разработать REST API для блога",
    dueDate: new Date("2025-03-01"),
    reviewCount: 2,
    status: "published",
  },
];

// Submissions
const demoSubmissions: DemoSubmission[] = [
  {
    id: "s1",
    assignmentId: "a1",
    studentId: "u1",
    content: "Сдал лендинг с использованием React",
    files: ["landing.zip", "screenshots.pdf"],
    submittedAt: new Date("2025-02-10"),
    status: "reviewed",
  },
];

// Reviews
const demoReviews: DemoReview[] = [
  {
    id: "rv1",
    submissionId: "s1",
    reviewerId: "u1",
    scores: { c1: 28, c2: 18, c3: 25, c4: 15 },
    comment: "Хорошая работа, но можно улучшить документацию",
    submittedAt: new Date("2025-02-12"),
    status: "submitted",
  },
];

// Announcements
const demoAnnouncements: DemoAnnouncement[] = [
  {
    id: "an1",
    courseId: "c1",
    teacherId: "u2",
    title: "Изменение дедлайна",
    content: "Дедлайн первого задания перенесён на неделю",
    publishedAt: new Date("2025-01-20"),
  },
];

// Appeals
const demoAppeals: DemoAppeal[] = [
  {
    id: "ap1",
    reviewId: "rv1",
    studentId: "u1",
    reason: "Считаю оценку за функциональность заниженной",
    status: "open",
    createdAt: new Date("2025-02-13"),
  },
];

// Plugins
const demoPlugins: DemoPlugin[] = [
  {
    id: "p1",
    name: "Plagiarism Checker",
    description: "Проверка на плагиат",
    version: "2.1.0",
    enabled: true,
    category: "plagiarism",
  },
  {
    id: "p2",
    name: "GitHub Integration",
    description: "Интеграция с GitHub",
    version: "1.5.3",
    enabled: true,
    category: "integration",
  },
  {
    id: "p3",
    name: "Analytics Dashboard",
    description: "Расширенная аналитика",
    version: "3.0.1",
    enabled: false,
    category: "analytics",
  },
];

// Feature Flags
const demoFeatureFlags: DemoFeatureFlag[] = [
  { id: "ff1", name: "New UI", key: "new_ui", enabled: false, rolloutPercentage: 10 },
  { id: "ff2", name: "AI Assistant", key: "ai_assistant", enabled: true, rolloutPercentage: 100 },
  { id: "ff3", name: "Video Reviews", key: "video_reviews", enabled: false, rolloutPercentage: 5 },
];

// Audit Logs
const demoAuditLogs: DemoAuditLog[] = [
  {
    id: "al1",
    userId: "u3",
    action: "UPDATE",
    resource: "Organization",
    timestamp: new Date("2025-01-24 14:32"),
    metadata: { orgId: "org1" },
  },
  {
    id: "al2",
    userId: "u2",
    action: "CREATE",
    resource: "Course",
    timestamp: new Date("2025-01-24 10:15"),
    metadata: { courseId: "c1" },
  },
  {
    id: "al3",
    userId: "u1",
    action: "SUBMIT",
    resource: "Review",
    timestamp: new Date("2025-01-24 09:42"),
    metadata: { reviewId: "rv1" },
  },
];

// ========== STORE ==========

class DemoDataStore {
  getOrganizations(): DemoOrganization[] {
    return demoOrgs;
  }

  getUsers(): DemoUser[] {
    return demoUsers;
  }

  getCourses(): DemoCourse[] {
    return demoCourses;
  }

  getAssignments(): DemoAssignment[] {
    return demoAssignments;
  }

  getSubmissions(): DemoSubmission[] {
    return demoSubmissions;
  }

  getReviews(): DemoReview[] {
    return demoReviews;
  }

  getAnnouncements(): DemoAnnouncement[] {
    return demoAnnouncements;
  }

  getAppeals(): DemoAppeal[] {
    return demoAppeals;
  }

  getPlugins(): DemoPlugin[] {
    return demoPlugins;
  }

  getFeatureFlags(): DemoFeatureFlag[] {
    return demoFeatureFlags;
  }

  getAuditLogs(): DemoAuditLog[] {
    return demoAuditLogs;
  }

  // Helpers
  getUserById(id: string): DemoUser | undefined {
    return demoUsers.find((u) => u.id === id);
  }

  getCourseById(id: string): DemoCourse | undefined {
    return demoCourses.find((c) => c.id === id);
  }

  getAssignmentsByCourse(courseId: string): DemoAssignment[] {
    return demoAssignments.filter((a) => a.courseId === courseId);
  }

  // Archive/Unarchive methods
  archiveCourse(courseId: string, archived: boolean): void {
    const course = demoCourses.find((c) => c.id === courseId);
    if (course) {
      course.status = archived ? "archived" : "active";
      // Persist to localStorage if needed
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_courses_archived") || "{}";
        const archivedMap = JSON.parse(stored);
        archivedMap[courseId] = archived;
        localStorage.setItem("demo_courses_archived", JSON.stringify(archivedMap));
      }
    }
  }

  archiveAssignment(assignmentId: string, archived: boolean): void {
    const assignment = demoAssignments.find((a) => a.id === assignmentId);
    if (assignment) {
      // Add archived property to assignment if it doesn't exist
      (assignment as DemoAssignment & { archived?: boolean }).archived = archived;
      // Persist to localStorage if needed
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("demo_assignments_archived") || "{}";
        const archivedMap = JSON.parse(stored);
        archivedMap[assignmentId] = archived;
        localStorage.setItem("demo_assignments_archived", JSON.stringify(archivedMap));
      }
    }
  }

  // Добавьте метод в класс DemoDataStore перед закрывающей скобкой
  createCourse(input: CreateCourseInput): DemoCourse {
    const newCourse: DemoCourse = {
      id: `c${Date.now()}`,
      name: input.title,
      title: input.title,
      code: input.code,
      teacherId: input.instructorId,
      orgId: "org1",
      enrollmentCount: 0,
      status: input.archived ? "archived" : "active",
      archived: input.archived ?? false,
      createdAt: new Date(),
    };

    demoCourses.push(newCourse);
    return newCourse;
  }
}

export const demoDataStore = new DemoDataStore();
