import type { Version } from "@/entities/work";

export const mockVersions: Version[] = [
  {
    id: "v3",
    versionNumber: 3,
    status: "submitted",
    timestamp: "27 января 2026, 16:45",
    files: [
      { id: "f1", name: "landing-final-v3.zip", size: 2457600 },
      { id: "f2", name: "screenshots.pdf", size: 512000 },
    ],
    note: "Финальная версия с исправлениями по всем замечаниям",
    validationChecks: [
      {
        id: "c1",
        name: "Проверка на плагиат",
        description: "Сравнение с базой работ",
        status: "passed",
        message: "Совпадений не обнаружено",
      },
      {
        id: "c2",
        name: "Линтинг кода",
        description: "Проверка стиля и качества кода",
        status: "passed",
        message: "Ошибок не найдено",
      },
      {
        id: "c3",
        name: "Формат файлов",
        description: "Соответствие требованиям задания",
        status: "passed",
        message: "Все файлы в порядке",
      },
      {
        id: "c4",
        name: "Анонимизация",
        description: "Проверка на личные данные",
        status: "passed",
        message: "Личных данных не найдено",
      },
    ],
  },
  {
    id: "v2",
    versionNumber: 2,
    status: "accepted",
    timestamp: "26 января 2026, 10:30",
    files: [{ id: "f3", name: "landing-v2.zip", size: 2048000 }],
    note: "Исправлена адаптивная версия",
    validationChecks: [
      {
        id: "c5",
        name: "Проверка на плагиат",
        description: "Сравнение с базой работ",
        status: "passed",
      },
      {
        id: "c6",
        name: "Линтинг кода",
        description: "Проверка стиля и качества кода",
        status: "warning",
        message: "3 предупреждения о стиле кода",
      },
      {
        id: "c7",
        name: "Формат файлов",
        description: "Соответствие требованиям задания",
        status: "passed",
      },
      {
        id: "c8",
        name: "Анонимизация",
        description: "Проверка на личные данные",
        status: "passed",
      },
    ],
  },
  {
    id: "v1",
    versionNumber: 1,
    status: "submitted",
    timestamp: "25 января 2026, 14:30",
    files: [{ id: "f4", name: "landing-draft.zip", size: 1536000 }],
    validationChecks: [
      {
        id: "c9",
        name: "Проверка на плагиат",
        description: "Сравнение с базой работ",
        status: "passed",
      },
      {
        id: "c10",
        name: "Линтинг кода",
        description: "Проверка стиля и качества кода",
        status: "warning",
        message: "5 предупреждений о стиле кода",
      },
      {
        id: "c11",
        name: "Формат файлов",
        description: "Соответствие требованиям задания",
        status: "failed",
        message: "Отсутствует README.md",
      },
      {
        id: "c12",
        name: "Анонимизация",
        description: "Проверка на личные данные",
        status: "passed",
      },
    ],
  },
];
