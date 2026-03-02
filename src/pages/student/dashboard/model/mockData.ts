import type {
  DeadlineItem,
  ActionCardData,
  RecentItem,
  TodaySummaryData,
  Notification,
} from "@/widgets/student-dashboard";

export const mockDeadlines: DeadlineItem[] = [
  {
    id: "1",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "1",
    taskTitle: "Задание 1: Создание лендинга",
    dueDate: "31 января, 23:59",
    status: "NOT_STARTED",
    isUrgent: true,
  },
  {
    id: "2",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "2",
    taskTitle: "Задание 2: Прототипирование",
    dueDate: "1 февраля, 18:00",
    status: "DRAFT",
    isUrgent: true,
  },
  {
    id: "3",
    courseId: "1",
    courseName: "Веб-разработка",
    taskId: "3",
    taskTitle: "Задание 3: React компоненты",
    dueDate: "3 февраля, 23:59",
    status: "NEED_YOUR_REVIEW",
  },
  {
    id: "4",
    courseId: "3",
    courseName: "Алгоритмы и структуры данных",
    taskId: "4",
    taskTitle: "Задание 1: Сортировки",
    dueDate: "5 февраля, 20:00",
    status: "SUBMITTED",
  },
  {
    id: "5",
    courseId: "2",
    courseName: "Дизайн интерфейсов",
    taskId: "5",
    taskTitle: "Задание 3: UI Kit",
    dueDate: "7 февраля, 23:59",
    status: "IN_REVIEW",
  },
];

export const mockActionData: ActionCardData = {
  reviewsPending: 2,
  newFeedback: 1,
};

export const mockRecentItems: RecentItem[] = [
  {
    id: "1",
    type: "task",
    title: "Задание 1: Создание лендинга",
    subtitle: "Веб-разработка",
    timestamp: "2 часа назад",
  },
  {
    id: "2",
    type: "course",
    title: "Дизайн интерфейсов",
    subtitle: "Иванова А.П.",
    timestamp: "5 часов назад",
    coverColor: "#b7bdff",
  },
  {
    id: "3",
    type: "task",
    title: "Задание 3: React компоненты",
    subtitle: "Веб-разработка",
    timestamp: "вчера",
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
    time: "10 минут назад",
    isRead: false,
  },
  {
    id: "2",
    type: "reminder",
    title: 'Дедлайн "Прототипирование" через 24 часа',
    time: "2 часа назад",
    isRead: false,
  },
  {
    id: "3",
    type: "grade",
    title: 'Оценка выставлена за "Сортировки"',
    time: "5 часов назад",
    isRead: true,
  },
  {
    id: "4",
    type: "info",
    title: "Добавлены новые материалы к курсу",
    time: "вчера",
    isRead: true,
  },
];
