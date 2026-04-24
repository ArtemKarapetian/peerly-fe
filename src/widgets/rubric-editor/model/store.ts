import { useSyncExternalStore } from "react";

import type { RubricData } from "./types";

const STORAGE_KEY = "peerly_rubrics_library";

const DEFAULT_RUBRICS: RubricData[] = [
  {
    id: "r1",
    name: "Оценка веб-проекта",
    description:
      "Критерии оценки финального веб-проекта с фокусом на функциональность, дизайн и качество кода",
    teacherId: "u2",
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-15"),
    criteria: [
      {
        id: "c1",
        name: "Функциональность",
        description:
          "Работоспособность всех требуемых функций и корректная обработка пользовательских сценариев",
        maxScore: 5,
        weight: 30,
        required: true,
        commentRequired: true,
        minCommentLength: 20,
      },
      {
        id: "c2",
        name: "Дизайн и UX",
        description: "Визуальное оформление, адаптивность, удобство использования",
        maxScore: 5,
        weight: 20,
        required: true,
      },
      {
        id: "c3",
        name: "Качество кода",
        description: "Читаемость, структура, соблюдение best practices",
        maxScore: 5,
        weight: 30,
        required: true,
      },
      {
        id: "c4",
        name: "Документация",
        description: "Полнота README, комментариев и инструкций по запуску",
        maxScore: 5,
        weight: 20,
        required: false,
      },
    ],
  },
  {
    id: "r2",
    name: "Проверка кода (Code Review)",
    description: "Рубрика для оценки качества программного кода",
    teacherId: "u2",
    createdAt: new Date("2025-01-12"),
    updatedAt: new Date("2025-01-12"),
    criteria: [
      {
        id: "c1",
        name: "Корректность",
        description: "Код работает и решает поставленную задачу",
        maxScore: 5,
        required: true,
      },
      {
        id: "c2",
        name: "Читаемость",
        description: "Код легко читается и понимается",
        maxScore: 5,
        required: true,
      },
      {
        id: "c3",
        name: "Эффективность",
        description: "Оптимальность алгоритма и использования ресурсов",
        maxScore: 5,
        required: false,
      },
    ],
  },
  {
    id: "r3",
    name: "Эссе и письменные работы",
    description: "Критерии оценки текстовых работ и аналитических эссе",
    teacherId: "u2",
    createdAt: new Date("2025-01-08"),
    updatedAt: new Date("2025-01-20"),
    criteria: [
      {
        id: "c1",
        name: "Структура и организация",
        description: "Логичность построения текста, наличие введения и заключения",
        maxScore: 5,
        required: true,
      },
      {
        id: "c2",
        name: "Аргументация",
        description: "Убедительность доводов и качество примеров",
        maxScore: 5,
        required: true,
        commentRequired: true,
      },
      {
        id: "c3",
        name: "Язык и стиль",
        description: "Грамотность, академический стиль, отсутствие ошибок",
        maxScore: 5,
        required: true,
      },
      {
        id: "c4",
        name: "Источники",
        description: "Использование и оформление источников",
        maxScore: 5,
        required: false,
      },
    ],
  },
];

function readStored(): RubricData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_RUBRICS;
    const parsed = JSON.parse(stored) as (Omit<RubricData, "createdAt" | "updatedAt"> & {
      createdAt: string;
      updatedAt: string;
    })[];
    return parsed.map((r) => ({
      ...r,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.updatedAt),
    }));
  } catch (e) {
    console.error("Failed to parse stored rubrics", e);
    return DEFAULT_RUBRICS;
  }
}

let rubrics: RubricData[] = readStored();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rubrics));
  } catch {
    // ignore storage errors
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): RubricData[] {
  return rubrics;
}

export function setRubrics(next: RubricData[]): void {
  rubrics = next;
  persist();
  emit();
}

export function useRubrics(): RubricData[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useRubric(id: string | undefined): RubricData | null {
  const all = useRubrics();
  if (!id) return null;
  return all.find((r) => r.id === id) ?? null;
}
