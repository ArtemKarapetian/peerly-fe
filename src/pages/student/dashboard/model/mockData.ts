import type {
  DeadlineItem,
  ActionCardData,
  TodaySummaryData,
  Notification,
} from "@/widgets/student-dashboard";

// Deadlines stored as ISO datetimes — formatted/localized by the consumer.
export const mockDeadlines: DeadlineItem[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "1",
    taskTitle: "Задание 1: Создание лендинга",
    dueDate: "2026-01-31T23:59",
    status: "NOT_STARTED",
    isUrgent: true,
  },
  {
    id: "2",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "2",
    taskTitle: "Задание 2: Прототипирование",
    dueDate: "2026-02-01T18:00",
    status: "DRAFT",
    isUrgent: true,
  },
  {
    id: "3",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "3",
    taskTitle: "Задание 3: React компоненты",
    dueDate: "2026-02-03T23:59",
    status: "NEED_YOUR_REVIEW",
  },
  {
    id: "4",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "4",
    taskTitle: "Задание 1: Сортировки",
    dueDate: "2026-02-05T20:00",
    status: "SUBMITTED",
  },
  {
    id: "5",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "5",
    taskTitle: "Задание 3: UI Kit",
    dueDate: "2026-02-07T23:59",
    status: "IN_REVIEW",
  },
];

export const mockActionData: ActionCardData = {
  reviewsPending: 2,
  newFeedback: 1,
};

// Stable demo "now" for relative-time formatting: 2026-04-24T12:00.
// Items below are positioned relative to it so the dashboard renders identically every time.
export const mockRecentItems = [
  {
    id: "1",
    type: "task",
    title: "Задание 1: Создание лендинга",
    subtitle: "Веб-разработка",
    timestamp: "2026-04-24T10:00",
  },
  {
    id: "2",
    type: "course",
    title: "Дизайн интерфейсов",
    subtitle: "Иванова А.П.",
    timestamp: "2026-04-24T07:00",
    coverColor: "#b7bdff",
  },
  {
    id: "3",
    type: "task",
    title: "Задание 3: React компоненты",
    subtitle: "Веб-разработка",
    timestamp: "2026-04-23T12:00",
  },
];

export const mockTodayData: TodaySummaryData = {
  reviewsPending: 2,
  tasksToday: 3,
};

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "feedback",
    title: 'Новый отзыв на задание "Создание лендинга"',
    time: "2026-04-24T11:50",
    isRead: false,
  },
  {
    id: "2",
    type: "reminder",
    title: 'Дедлайн "Прототипирование" через 24 часа',
    time: "2026-04-24T10:00",
    isRead: false,
  },
  {
    id: "3",
    type: "grade",
    title: 'Оценка выставлена за "Сортировки"',
    time: "2026-04-24T07:00",
    isRead: true,
  },
  {
    id: "4",
    type: "info",
    title: "Добавлены новые материалы к курсу",
    time: "2026-04-23T12:00",
    isRead: true,
  },
];
