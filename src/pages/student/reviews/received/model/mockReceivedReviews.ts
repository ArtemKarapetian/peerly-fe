export interface ReceivedReview {
  reviewId: string;
  reviewerName: string | null;
  submittedAt: string;
  criteria: {
    name: string;
    score: number;
    maxScore: number;
    comment?: string;
  }[];
  overallComment: string;
  isAnonymous: boolean;
}

export interface TaskSubmissionReviews {
  taskId: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  submittedAt: string;
  status: "PENDING" | "IN_REVIEW" | "REVIEWED" | "PUBLISHED";
  reviewsReceived: number;
  reviewsRequired: number;
  currentScore?: number;
  maxScore?: number;
  allowAppeal: boolean;
  reviews: ReceivedReview[];
}

export const mockReceivedReviews: TaskSubmissionReviews[] = [
  {
    taskId: "1",
    taskTitle: "Задание 1: Создание лендинга",
    courseName: "Веб-разработка",
    courseId: "1",
    submittedAt: "20 января, 15:30",
    status: "PUBLISHED",
    reviewsReceived: 2,
    reviewsRequired: 2,
    currentScore: 85,
    maxScore: 100,
    allowAppeal: true,
    reviews: [
      {
        reviewId: "r1",
        reviewerName: null,
        submittedAt: "21 января, 10:15",
        isAnonymous: true,
        criteria: [
          {
            name: "Структура HTML",
            score: 9,
            maxScore: 10,
            comment: "Отличная семантическая разметка, всё понятно и логично.",
          },
          {
            name: "CSS стилизация",
            score: 8,
            maxScore: 10,
            comment: "Хорошая работа, но можно улучшить адаптивность на мобильных устройствах.",
          },
          {
            name: "Интерактивность",
            score: 7,
            maxScore: 10,
            comment: "Базовые скрипты работают, но не хватает плавных анимаций.",
          },
        ],
        overallComment:
          "Очень хорошая работа! Структура кода чистая и понятная. Основные требования выполнены. Рекомендую уделить больше внимания адаптивному дизайну и добавить анимации для улучшения пользовательского опыта.",
      },
      {
        reviewId: "r2",
        reviewerName: "Петров А.С.",
        submittedAt: "22 января, 14:20",
        isAnonymous: false,
        criteria: [
          {
            name: "Структура HTML",
            score: 10,
            maxScore: 10,
            comment: "Идеальная структура, использованы все необходимые теги.",
          },
          {
            name: "CSS стилизация",
            score: 9,
            maxScore: 10,
            comment: "Отличные стили, современный подход.",
          },
          {
            name: "Интерактивность",
            score: 8,
            maxScore: 10,
            comment: "Хорошо реализовано, но можно добавить больше интерактивных элементов.",
          },
        ],
        overallComment:
          "Отличная работа! Код чистый, структура логичная. Дизайн современный и привлекательный. Продолжайте в том же духе!",
      },
    ],
  },
  {
    taskId: "2",
    taskTitle: "Задание 2: React компоненты",
    courseName: "Веб-разработка",
    courseId: "1",
    submittedAt: "23 января, 18:00",
    status: "IN_REVIEW",
    reviewsReceived: 1,
    reviewsRequired: 2,
    allowAppeal: false,
    reviews: [
      {
        reviewId: "r3",
        reviewerName: null,
        submittedAt: "24 января, 09:30",
        isAnonymous: true,
        criteria: [
          {
            name: "Архитектура компонентов",
            score: 8,
            maxScore: 10,
            comment: "Хорошая декомпозиция, компоненты переиспользуемые.",
          },
          {
            name: "Использование хуков",
            score: 7,
            maxScore: 10,
            comment: "Базовые хуки использованы корректно, но можно улучшить.",
          },
        ],
        overallComment:
          "Хорошая работа, но есть куда расти. Обратите внимание на оптимизацию рендеринга.",
      },
    ],
  },
  {
    taskId: "3",
    taskTitle: "Задание 1: Прототипирование",
    courseName: "Дизайн интерфейсов",
    courseId: "2",
    submittedAt: "24 января, 12:00",
    status: "PENDING",
    reviewsReceived: 0,
    reviewsRequired: 2,
    allowAppeal: false,
    reviews: [],
  },
  {
    taskId: "4",
    taskTitle: "Задание 3: TypeScript проект",
    courseName: "Веб-разработка",
    courseId: "1",
    submittedAt: "18 января, 20:45",
    status: "PUBLISHED",
    reviewsReceived: 3,
    reviewsRequired: 3,
    currentScore: 92,
    maxScore: 100,
    allowAppeal: false,
    reviews: [
      {
        reviewId: "r4",
        reviewerName: "Смирнова М.В.",
        submittedAt: "19 января, 11:20",
        isAnonymous: false,
        criteria: [
          {
            name: "Типизация",
            score: 10,
            maxScore: 10,
            comment: "Все типы правильно определены, нет использования any.",
          },
          {
            name: "Структура проекта",
            score: 9,
            maxScore: 10,
            comment: "Отличная организация файлов и папок.",
          },
          {
            name: "Качество кода",
            score: 9,
            maxScore: 10,
            comment: "Чистый код, следует best practices.",
          },
        ],
        overallComment:
          "Превосходная работа! Видно, что вы хорошо разобрались в TypeScript. Код читаемый, типизация строгая. Единственная рекомендация — добавить больше JSDoc комментариев для сложных функций.",
      },
      {
        reviewId: "r5",
        reviewerName: null,
        submittedAt: "19 января, 15:40",
        isAnonymous: true,
        criteria: [
          {
            name: "Типизация",
            score: 9,
            maxScore: 10,
            comment: "Отлично, но пару мест можно было типизировать строже.",
          },
          {
            name: "Структура проекта",
            score: 10,
            maxScore: 10,
            comment: "Идеальная структура, легко ориентироваться.",
          },
          {
            name: "Качество кода",
            score: 9,
            maxScore: 10,
            comment: "Очень качественный код, почти без замечаний.",
          },
        ],
        overallComment:
          "Отличная работа! Проект выглядит профессионально. TypeScript используется правильно, код чистый и понятный.",
      },
      {
        reviewId: "r6",
        reviewerName: null,
        submittedAt: "20 января, 09:10",
        isAnonymous: true,
        criteria: [
          {
            name: "Типизация",
            score: 10,
            maxScore: 10,
            comment: "Безупречная типизация на всех уровнях.",
          },
          {
            name: "Структура проекта",
            score: 9,
            maxScore: 10,
            comment: "Очень хорошая структура.",
          },
          {
            name: "Качество кода",
            score: 10,
            maxScore: 10,
            comment: "Код как из учебника — чисто, понятно, эффективно.",
          },
        ],
        overallComment:
          "Выдающаяся работа! Это пример того, как должен выглядеть TypeScript проект. Так держать!",
      },
    ],
  },
  {
    taskId: "5",
    taskTitle: "Задание 2: Wireframes",
    courseName: "Дизайн интерфейсов",
    courseId: "2",
    submittedAt: "15 января, 14:30",
    status: "PUBLISHED",
    reviewsReceived: 2,
    reviewsRequired: 2,
    currentScore: 78,
    maxScore: 100,
    allowAppeal: true,
    reviews: [
      {
        reviewId: "r7",
        reviewerName: null,
        submittedAt: "16 января, 10:00",
        isAnonymous: true,
        criteria: [
          {
            name: "Композиция",
            score: 7,
            maxScore: 10,
            comment: "Базовая композиция есть, но можно улучшить баланс элементов.",
          },
          {
            name: "Удобство использования",
            score: 8,
            maxScore: 10,
            comment: "В целом удобно, но навигация местами неочевидна.",
          },
          {
            name: "Полнота решения",
            score: 7,
            maxScore: 10,
            comment: "Основные экраны есть, но не хватает edge cases.",
          },
        ],
        overallComment:
          "Работа выполнена на хорошем уровне, но есть что улучшить. Рекомендую проработать user flow более детально и добавить состояния для ошибок и загрузки.",
      },
      {
        reviewId: "r8",
        reviewerName: "Козлов Д.А.",
        submittedAt: "17 января, 16:25",
        isAnonymous: false,
        criteria: [
          {
            name: "Композиция",
            score: 8,
            maxScore: 10,
            comment: "Хорошая визуальная иерархия в большинстве экранов.",
          },
          {
            name: "Удобство использования",
            score: 8,
            maxScore: 10,
            comment: "Интерфейс интуитивный, но есть пару спорных решений.",
          },
          {
            name: "Полнота решения",
            score: 8,
            maxScore: 10,
            comment: "Покрыты основные сценарии, детализация хорошая.",
          },
        ],
        overallComment:
          "Хорошая работа! Wireframes проработаны качественно. Главная рекомендация — добавьте аннотации с пояснениями логики работы сложных элементов.",
      },
    ],
  },
];
