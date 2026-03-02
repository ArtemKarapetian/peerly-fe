import type { WorkFile, ValidationCheck, RubricSectionData } from "@/features/review";

export const workFiles: WorkFile[] = [
  { id: "f1", name: "landing-v3.zip", size: 2457600, url: "#" },
  { id: "f2", name: "screenshots.pdf", size: 512000, url: "#" },
];

export const validationChecks: ValidationCheck[] = [
  {
    id: "c1",
    name: "Проверка на плагиат",
    status: "passed",
    message: "Совпадений не обнаружено",
  },
  { id: "c2", name: "Линтинг кода", status: "passed" },
  { id: "c3", name: "Формат файлов", status: "passed" },
];

export const rubricSections: RubricSectionData[] = [
  {
    id: "s1",
    name: "Дизайн и UI",
    description: "Оценка визуального оформления и пользовательского интерфейса",
    criteria: [
      {
        id: "c1",
        name: "Визуальная привлекательность",
        description: "Насколько привлекателен и профессионален дизайн",
        maxScore: 5,
        required: true,
        commentRequired: false,
      },
      {
        id: "c2",
        name: "Адаптивность",
        description: "Корректное отображение на разных устройствах",
        maxScore: 5,
        required: true,
        commentRequired: true,
        minCommentLength: 20,
      },
      {
        id: "c3",
        name: "Типографика",
        description: "Читаемость текста и использование шрифтов",
        maxScore: 5,
        required: true,
      },
    ],
  },
  {
    id: "s2",
    name: "Функциональность",
    description: "Оценка работоспособности и функций",
    criteria: [
      {
        id: "c4",
        name: "Корректность работы форм",
        maxScore: 5,
        required: true,
        commentRequired: true,
        minCommentLength: 15,
      },
      {
        id: "c5",
        name: "Навигация",
        description: "Удобство и логичность навигации",
        maxScore: 5,
        required: true,
      },
    ],
  },
  {
    id: "s3",
    name: "Код",
    description: "Оценка качества кода",
    criteria: [
      {
        id: "c6",
        name: "Чистота кода",
        description: "Читаемость, структура, комментарии",
        maxScore: 5,
        required: true,
      },
      {
        id: "c7",
        name: "Использование технологий",
        maxScore: 5,
        required: false,
      },
    ],
  },
];

export const allCriteria = rubricSections.flatMap((section) => section.criteria);
export const requiredCriteria = allCriteria.filter((c) => c.required);
export const minOverallCommentLength = 50;
