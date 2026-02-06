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

// ========== TYPES ==========

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Teacher' | 'Admin';
  orgId: string;
  avatar?: string;
  createdAt: Date;
}

export interface DemoOrganization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  userCount: number;
  createdAt: Date;
}

export interface DemoCourse {
  id: string;
  name: string;
  title: string; // Display title
  code: string;
  teacherId: string;
  orgId: string;
  enrollmentCount: number;
  status: 'active' | 'archived';
  archived?: boolean; // Legacy field for compatibility
  assignmentIds?: string[]; // List of assignment IDs
  createdAt: Date;
}

export interface DemoAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  reviewCount: number;
  status: 'draft' | 'published' | 'closed';
  rubricId?: string;
}

export interface DemoRubric {
  id: string;
  teacherId: string;
  name: string;
  description: string;
  criteria: DemoRubricCriterion[];
  isPublic: boolean;
}

export interface DemoRubricCriterion {
  id: string;
  name: string;
  description: string;
  maxPoints: number;
}

export interface DemoSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  files: string[];
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'reviewed';
}

export interface DemoReview {
  id: string;
  submissionId: string;
  reviewerId: string;
  scores: Record<string, number>;
  comment: string;
  submittedAt?: Date;
  status: 'pending' | 'draft' | 'submitted';
}

export interface DemoAnnouncement {
  id: string;
  courseId: string;
  teacherId: string;
  title: string;
  content: string;
  publishedAt: Date;
}

export interface DemoAppeal {
  id: string;
  reviewId: string;
  studentId: string;
  reason: string;
  status: 'open' | 'resolved' | 'rejected';
  createdAt: Date;
}

export interface DemoPlugin {
  id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  category: 'plagiarism' | 'analytics' | 'integration' | 'other';
}

export interface DemoFeatureFlag {
  id: string;
  name: string;
  key: string;
  enabled: boolean;
  rolloutPercentage: number;
}

export interface DemoAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// ========== MOCK DATA ==========

// Organizations
const demoOrgs: DemoOrganization[] = [
  { id: 'org1', name: 'Университет Иннополис', slug: 'innopolis', plan: 'enterprise', userCount: 523, createdAt: new Date('2023-01-15') },
  { id: 'org2', name: 'МГУ им. Ломоносова', slug: 'msu', plan: 'pro', userCount: 1247, createdAt: new Date('2023-03-20') },
  { id: 'org3', name: 'ИТМО', slug: 'itmo', plan: 'pro', userCount: 892, createdAt: new Date('2023-05-10') },
];

// Users
const demoUsers: DemoUser[] = [
  { id: 'u1', email: 'student@peerly.ru', name: 'Иван Петров', role: 'Student', orgId: 'org1', createdAt: new Date('2023-09-01') },
  { id: 'u2', email: 'teacher@peerly.ru', name: 'Мария Сидорова', role: 'Teacher', orgId: 'org1', createdAt: new Date('2023-01-20') },
  { id: 'u3', email: 'admin@peerly.ru', name: 'Алексей Смирнов', role: 'Admin', orgId: 'org1', createdAt: new Date('2023-01-15') },
];

// Courses
const demoCourses: DemoCourse[] = [
  { id: 'c1', name: 'Веб-разработка', title: 'Веб-разработка', code: 'CS301', teacherId: 'u2', orgId: 'org1', enrollmentCount: 45, status: 'active', createdAt: new Date('2024-01-10') },
  { id: 'c2', name: 'Базы данных', title: 'Базы данных', code: 'CS302', teacherId: 'u2', orgId: 'org1', enrollmentCount: 38, status: 'active', createdAt: new Date('2024-01-12') },
  { id: 'c3', name: 'Алгоритмы', title: 'Алгоритмы', code: 'CS201', teacherId: 'u2', orgId: 'org1', enrollmentCount: 52, status: 'active', createdAt: new Date('2023-09-01') },
];

// Rubrics
const demoRubrics: DemoRubric[] = [
  {
    id: 'r1',
    teacherId: 'u2',
    name: 'Оценка веб-проекта',
    description: 'Критерии оценки финального веб-проекта',
    isPublic: true,
    criteria: [
      { id: 'c1', name: 'Функциональность', description: 'Работоспособность всех требуемых функций', maxPoints: 30 },
      { id: 'c2', name: 'Дизайн', description: 'Визуальное оформление и UX', maxPoints: 20 },
      { id: 'c3', name: 'Код', description: 'Качество и читаемость кода', maxPoints: 30 },
      { id: 'c4', name: 'Документация', description: 'Полнота документации', maxPoints: 20 },
    ],
  },
];

// Assignments
const demoAssignments: DemoAssignment[] = [
  {
    id: 'a1',
    courseId: 'c1',
    title: 'Лендинг-страница',
    description: 'Создать адаптивную лендинг-страницу',
    dueDate: new Date('2025-02-15'),
    reviewCount: 3,
    status: 'published',
    rubricId: 'r1',
  },
  {
    id: 'a2',
    courseId: 'c1',
    title: 'REST API',
    description: 'Разработать REST API для блога',
    dueDate: new Date('2025-03-01'),
    reviewCount: 2,
    status: 'published',
  },
];

// Submissions
const demoSubmissions: DemoSubmission[] = [
  {
    id: 's1',
    assignmentId: 'a1',
    studentId: 'u1',
    content: 'Сдал лендинг с использованием React',
    files: ['landing.zip', 'screenshots.pdf'],
    submittedAt: new Date('2025-02-10'),
    status: 'reviewed',
  },
];

// Reviews
const demoReviews: DemoReview[] = [
  {
    id: 'rv1',
    submissionId: 's1',
    reviewerId: 'u1',
    scores: { c1: 28, c2: 18, c3: 25, c4: 15 },
    comment: 'Хорошая работа, но можно улучшить документацию',
    submittedAt: new Date('2025-02-12'),
    status: 'submitted',
  },
];

// Announcements
const demoAnnouncements: DemoAnnouncement[] = [
  {
    id: 'an1',
    courseId: 'c1',
    teacherId: 'u2',
    title: 'Изменение дедлайна',
    content: 'Дедлайн первого задания перенесён на неделю',
    publishedAt: new Date('2025-01-20'),
  },
];

// Appeals
const demoAppeals: DemoAppeal[] = [
  {
    id: 'ap1',
    reviewId: 'rv1',
    studentId: 'u1',
    reason: 'Считаю оценку за функциональность заниженной',
    status: 'open',
    createdAt: new Date('2025-02-13'),
  },
];

// Plugins
const demoPlugins: DemoPlugin[] = [
  { id: 'p1', name: 'Plagiarism Checker', description: 'Проверка на плагиат', version: '2.1.0', enabled: true, category: 'plagiarism' },
  { id: 'p2', name: 'GitHub Integration', description: 'Интеграция с GitHub', version: '1.5.3', enabled: true, category: 'integration' },
  { id: 'p3', name: 'Analytics Dashboard', description: 'Расширенная аналитика', version: '3.0.1', enabled: false, category: 'analytics' },
];

// Feature Flags
const demoFeatureFlags: DemoFeatureFlag[] = [
  { id: 'ff1', name: 'New UI', key: 'new_ui', enabled: false, rolloutPercentage: 10 },
  { id: 'ff2', name: 'AI Assistant', key: 'ai_assistant', enabled: true, rolloutPercentage: 100 },
  { id: 'ff3', name: 'Video Reviews', key: 'video_reviews', enabled: false, rolloutPercentage: 5 },
];

// Audit Logs
const demoAuditLogs: DemoAuditLog[] = [
  { id: 'al1', userId: 'u3', action: 'UPDATE', resource: 'Organization', timestamp: new Date('2025-01-24 14:32'), metadata: { orgId: 'org1' } },
  { id: 'al2', userId: 'u2', action: 'CREATE', resource: 'Course', timestamp: new Date('2025-01-24 10:15'), metadata: { courseId: 'c1' } },
  { id: 'al3', userId: 'u1', action: 'SUBMIT', resource: 'Review', timestamp: new Date('2025-01-24 09:42'), metadata: { reviewId: 'rv1' } },
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

  getRubrics(): DemoRubric[] {
    return demoRubrics;
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
    return demoUsers.find(u => u.id === id);
  }

  getCourseById(id: string): DemoCourse | undefined {
    return demoCourses.find(c => c.id === id);
  }

  getAssignmentsByCourse(courseId: string): DemoAssignment[] {
    return demoAssignments.filter(a => a.courseId === courseId);
  }

  // Archive/Unarchive methods
  archiveCourse(courseId: string, archived: boolean): void {
    const course = demoCourses.find(c => c.id === courseId);
    if (course) {
      course.status = archived ? 'archived' : 'active';
      // Persist to localStorage if needed
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('demo_courses_archived') || '{}';
        const archivedMap = JSON.parse(stored);
        archivedMap[courseId] = archived;
        localStorage.setItem('demo_courses_archived', JSON.stringify(archivedMap));
      }
    }
  }

  archiveAssignment(assignmentId: string, archived: boolean): void {
    const assignment = demoAssignments.find(a => a.id === assignmentId);
    if (assignment) {
      // Add archived property to assignment if it doesn't exist
      (assignment as any).archived = archived;
      // Persist to localStorage if needed
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('demo_assignments_archived') || '{}';
        const archivedMap = JSON.parse(stored);
        archivedMap[assignmentId] = archived;
        localStorage.setItem('demo_assignments_archived', JSON.stringify(archivedMap));
      }
    }
  }
}

export const demoDataStore = new DemoDataStore();