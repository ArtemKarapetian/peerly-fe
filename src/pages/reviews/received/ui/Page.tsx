import { useState } from "react";
import { AppShell } from "@/widgets/app-shell/AppShell.tsx";
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";

/**
 * ReceivedReviewsPage - Страница полученных отзывов студента
 * Route: /reviews/received
 *
 * Показывает все полученные рецензии, сгруппированные по заданиям
 */

// Types
interface ReceivedReview {
  reviewId: string;
  reviewerName: string | null; // null if anonymous
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

interface TaskSubmissionReviews {
  taskId: string;
  taskTitle: string;
  courseName: string;
  courseId: string;
  submittedAt: string;
  status: "PENDING" | "IN_REVIEW" | "REVIEWED" | "PUBLISHED";
  reviewsReceived: number;
  reviewsRequired: number;
  currentScore?: number; // Only if published
  maxScore?: number;
  allowAppeal: boolean;
  reviews: ReceivedReview[];
}

// Mock data
const mockReceivedReviews: TaskSubmissionReviews[] = [
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

export default function ReceivedReviewsPage() {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const toggleReview = (reviewId: string) => {
    setExpandedReviews((prev) => {
      const next = new Set(prev);
      if (next.has(reviewId)) {
        next.delete(reviewId);
      } else {
        next.add(reviewId);
      }
      return next;
    });
  };

  const getStatusBadge = (status: TaskSubmissionReviews["status"]) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#e8f5e9] text-[#4caf50] rounded-[8px] text-[13px] font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            Опубликовано
          </span>
        );
      case "IN_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff4e5] text-[#ff9800] rounded-[8px] text-[13px] font-medium">
            <Clock className="w-3.5 h-3.5" />
            На проверке
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#f5f5f5] text-[#767692] rounded-[8px] text-[13px] font-medium">
            <Clock className="w-3.5 h-3.5" />
            Ожидание
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AppShell title="Полученные отзывы">
      <div className="max-w-[1000px]">
        <h1 className="text-[32px] font-medium text-[#21214f] tracking-[-0.5px] mb-2">
          Полученные отзывы
        </h1>
        <p className="text-[16px] text-[#767692] mb-6">
          Просматривайте рецензии на свои работы от других студентов
        </p>

        {/* Tasks List */}
        <div className="space-y-4">
          {mockReceivedReviews.map((task) => (
            <div
              key={task.taskId}
              className="bg-white border-2 border-[#e6e8ee] rounded-[16px] overflow-hidden"
            >
              {/* Task Header */}
              <div
                className="p-4 desktop:p-5 cursor-pointer hover:bg-[#f9f9f9] transition-colors"
                onClick={() => toggleTask(task.taskId)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Course + Task */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[13px] text-[#767692]">{task.courseName}</span>
                      <span className="text-[#d2e1f8]">•</span>
                      <h3 className="text-[16px] desktop:text-[18px] font-medium text-[#21214f] tracking-[-0.3px]">
                        {task.taskTitle}
                      </h3>
                    </div>

                    {/* Status + Score/Progress */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      {getStatusBadge(task.status)}

                      {task.status === "PUBLISHED" && task.currentScore !== undefined && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#d2e1f8] text-[#21214f] rounded-[8px] text-[13px] font-medium">
                          Оценка: {task.currentScore}/{task.maxScore}
                        </span>
                      )}

                      {task.status === "IN_REVIEW" && (
                        <span className="text-[13px] text-[#767692]">
                          Проверяют: {task.reviewsReceived}/{task.reviewsRequired}
                        </span>
                      )}

                      {task.status === "PENDING" && (
                        <span className="text-[13px] text-[#767692]">Ожидание проверки</span>
                      )}
                    </div>

                    {/* Reviews Count */}
                    <div className="flex items-center gap-2 text-[14px] text-[#4b4963]">
                      <FileText className="w-4 h-4" />
                      <span>
                        {task.reviewsReceived > 0
                          ? `${task.reviewsReceived} ${task.reviewsReceived === 1 ? "рецензия" : "рецензии"}`
                          : "Нет рецензий"}
                      </span>
                    </div>

                    {/* Not published message */}
                    {task.status === "IN_REVIEW" && (
                      <div className="mt-3 flex items-start gap-2 text-[13px] text-[#767692] bg-[#f9f9f9] rounded-[8px] p-3">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>Итог будет доступен после завершения этапа проверки</span>
                      </div>
                    )}
                  </div>

                  {/* Expand Icon */}
                  <button className="p-2 hover:bg-[#f0f0f0] rounded-[8px] transition-colors shrink-0">
                    {expandedTasks.has(task.taskId) ? (
                      <ChevronUp className="w-5 h-5 text-[#767692]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#767692]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Content - Reviews */}
              {expandedTasks.has(task.taskId) && task.reviews.length > 0 && (
                <div className="border-t-2 border-[#e6e8ee] bg-[#fafafa] p-4 desktop:p-5">
                  <div className="space-y-4">
                    {task.reviews.map((review, _index) => (
                      <div
                        key={review.reviewId}
                        className="bg-white border-2 border-[#e6e8ee] rounded-[12px] overflow-hidden"
                      >
                        {/* Review Header */}
                        <div
                          className="p-4 cursor-pointer hover:bg-[#f9f9f9] transition-colors"
                          onClick={() => toggleReview(review.reviewId)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="text-[14px] font-medium text-[#21214f]">
                                  {review.isAnonymous ? "Анонимный рецензент" : review.reviewerName}
                                </span>
                                <span className="text-[12px] text-[#767692]">
                                  {review.submittedAt}
                                </span>
                              </div>
                              <p className="text-[14px] text-[#4b4963] line-clamp-2">
                                {review.overallComment}
                              </p>
                            </div>

                            <button className="p-1 hover:bg-[#f0f0f0] rounded-[8px] transition-colors shrink-0">
                              {expandedReviews.has(review.reviewId) ? (
                                <ChevronUp className="w-4 h-4 text-[#767692]" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-[#767692]" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded Review Details */}
                        {expandedReviews.has(review.reviewId) && (
                          <div className="border-t-2 border-[#e6e8ee] p-4 space-y-4">
                            {/* Criteria Breakdown */}
                            <div>
                              <h4 className="text-[14px] font-medium text-[#21214f] mb-3">
                                Оценки по критериям
                              </h4>
                              <div className="space-y-3">
                                {review.criteria.map((criterion, idx) => (
                                  <div key={idx} className="bg-[#f9f9f9] rounded-[8px] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[14px] text-[#21214f] font-medium">
                                        {criterion.name}
                                      </span>
                                      <span className="text-[14px] font-medium text-[#3d6bc6]">
                                        {criterion.score}/{criterion.maxScore}
                                      </span>
                                    </div>
                                    {criterion.comment && (
                                      <p className="text-[13px] text-[#4b4963] leading-[1.5]">
                                        {criterion.comment}
                                      </p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Overall Comment */}
                            <div>
                              <h4 className="text-[14px] font-medium text-[#21214f] mb-2">
                                Общий комментарий
                              </h4>
                              <p className="text-[14px] text-[#4b4963] leading-[1.6] bg-[#f9f9f9] rounded-[8px] p-3">
                                {review.overallComment}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Appeal Button */}
                  {task.allowAppeal && task.status === "PUBLISHED" && (
                    <div className="mt-4 pt-4 border-t-2 border-[#e6e8ee]">
                      <button
                        onClick={() => {
                          // TODO: Navigate to appeal form
                          alert("Форма запроса пересмотра будет добавлена позже");
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#d2def8] hover:bg-[#f9f9f9] hover:border-[#a0b8f1] text-[#21214f] rounded-[12px] text-[14px] font-medium transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        Запросить пересмотр
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* No reviews yet */}
              {expandedTasks.has(task.taskId) && task.reviews.length === 0 && (
                <div className="border-t-2 border-[#e6e8ee] bg-[#fafafa] p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#f0f0f0] rounded-full mb-3">
                    <Clock className="w-6 h-6 text-[#767692]" />
                  </div>
                  <p className="text-[14px] text-[#767692]">
                    Рецензии ещё не получены. Ожидайте завершения проверки.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {mockReceivedReviews.length === 0 && (
          <div className="bg-[#f9f9f9] rounded-[20px] p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#d2e1f8] rounded-full mb-4">
              <FileText className="w-8 h-8 text-[#3d6bc6]" />
            </div>
            <h3 className="text-[20px] font-medium text-[#21214f] mb-2 tracking-[-0.5px]">
              Вы ещё не получали отзывы
            </h3>
            <p className="text-[15px] text-[#767692] leading-[1.5] mb-6">
              Отзывы появятся здесь после того, как другие студенты проверят ваши работы.
            </p>
            <button
              onClick={() => (window.location.hash = "/courses")}
              className="inline-flex items-center justify-center px-5 py-3 bg-[#3d6bc6] hover:bg-[#2f5aa8] text-white rounded-[12px] text-[15px] font-medium transition-colors"
            >
              Перейти к курсам
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
