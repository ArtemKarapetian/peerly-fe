export type NotificationType =
  | "DEADLINE"
  | "REVIEW_ASSIGNED"
  | "REVIEW_RECEIVED"
  | "GRADE_PUBLISHED"
  | "COMMENT"
  | "TASK_UPDATED";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  link: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "REVIEW_ASSIGNED",
    title: "Новая рецензия для проверки",
    message: 'Вам назначена рецензия работы по заданию "React компоненты"',
    time: "2025-01-24T10:30:00",
    isRead: false,
    link: "#/reviews",
  },
  {
    id: "2",
    type: "DEADLINE",
    title: "Приближается дедлайн",
    message: 'До сдачи задания "TypeScript проект" осталось 2 дня',
    time: "2025-01-24T09:15:00",
    isRead: false,
    link: "#/task/4",
  },
  {
    id: "3",
    type: "GRADE_PUBLISHED",
    title: "Оценка опубликована",
    message: 'Преподаватель выставил оценку 92/100 за "TypeScript проект"',
    time: "2025-01-23T16:45:00",
    isRead: false,
    link: "#/task/4",
  },
  {
    id: "4",
    type: "REVIEW_RECEIVED",
    title: "Получена рецензия",
    message: 'Ваша работа "Landing Page" прошла peer review',
    time: "2025-01-23T14:20:00",
    isRead: true,
    link: "#/reviews/received",
  },
  {
    id: "5",
    type: "COMMENT",
    title: "Новый комментарий",
    message: 'Преподаватель оставил комментарий к заданию "Backend API"',
    time: "2025-01-23T11:30:00",
    isRead: true,
    link: "#/task/6",
  },
  {
    id: "6",
    type: "DEADLINE",
    title: "Дедлайн истекает сегодня",
    message: 'Последний день сдачи задания "Прототипирование"',
    time: "2025-01-23T08:00:00",
    isRead: false,
    link: "#/task/3",
  },
  {
    id: "7",
    type: "REVIEW_ASSIGNED",
    title: "Новая рецензия для проверки",
    message: 'Вам назначена рецензия работы по заданию "Вайрфреймы"',
    time: "2025-01-22T15:45:00",
    isRead: true,
    link: "#/reviews",
  },
  {
    id: "8",
    type: "TASK_UPDATED",
    title: "Задание обновлено",
    message: 'Преподаватель обновил требования к заданию "Графы"',
    time: "2025-01-22T13:10:00",
    isRead: true,
    link: "#/task/8",
  },
  {
    id: "9",
    type: "GRADE_PUBLISHED",
    title: "Оценка опубликована",
    message: 'Преподаватель выставил оценку 85/100 за "Landing Page"',
    time: "2025-01-20T14:30:00",
    isRead: true,
    link: "#/task/1",
  },
  {
    id: "10",
    type: "REVIEW_RECEIVED",
    title: "Получена рецензия",
    message: 'Ваша работа "Сортировка" прошла peer review',
    time: "2025-01-19T17:00:00",
    isRead: true,
    link: "#/reviews/received",
  },
];

export type FilterType = "ALL" | "UNREAD" | "DEADLINES" | "REVIEWS";

export const filterLabels: Record<FilterType, string> = {
  ALL: "Все",
  UNREAD: "Непрочитанные",
  DEADLINES: "Дедлайны",
  REVIEWS: "Рецензии",
};
