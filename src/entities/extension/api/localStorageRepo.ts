/**
 * Extensions (Deadline Exceptions) Utilities
 *
 * Manages deadline extensions for assignments
 */
import { Extension, ExtensionType } from "@/entities/extension";

const STORAGE_KEY = "peerly_extensions";

// Initialize with demo data
const DEMO_EXTENSIONS: Extension[] = [
  {
    id: "ext1",
    assignmentId: "1",
    studentId: "1",
    studentName: "Анна Смирнова",
    type: "submission",
    submissionDeadlineOverride: "2025-02-05T23:59:00",
    reason: "Медицинская справка",
    status: "approved",
    requestedAt: "2025-01-20T10:30:00",
    processedAt: "2025-01-20T14:00:00",
    processedBy: "teacher1",
    notifyStudent: true,
  },
  {
    id: "ext2",
    assignmentId: "1",
    studentId: "3",
    studentName: "Дмитрий Козлов",
    type: "both",
    submissionDeadlineOverride: "2025-02-10T23:59:00",
    reviewDeadlineOverride: "2025-02-15T23:59:00",
    reason: "Участие в конференции",
    status: "manual",
    processedAt: "2025-01-18T09:00:00",
    processedBy: "teacher1",
    notifyStudent: true,
  },
  {
    id: "ext3",
    assignmentId: "1",
    studentId: "5",
    studentName: "Ольга Петрова",
    type: "submission",
    reason: "Семейные обстоятельства",
    status: "requested",
    requestedAt: "2025-01-24T15:20:00",
    notifyStudent: false,
  },
];

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function makeId(): string {
  // В современных браузерах это надёжнее, чем Date.now()
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `ext_${crypto.randomUUID()}`;
  }
  return `ext_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function cloneDemo(demo: Extension[]): Extension[] {
  return demo.map((e) => ({ ...e }));
}

function readExtensions(storage: StorageLike, key: string, demo: Extension[]): Extension[] {
  try {
    const raw = storage.getItem(key);

    // Первый запуск — засеиваем DEMO
    if (!raw) {
      const seeded = cloneDemo(demo);
      storage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid stored value");

    // Отдаём копии объектов, чтобы случайно не мутировать “живую” ссылку
    return (parsed as Extension[]).map((e) => ({ ...e }));
  } catch {
    // Если localStorage битый/недоступен/JSON кривой — возвращаем DEMO
    const fallback = cloneDemo(demo);
    try {
      storage.setItem(key, JSON.stringify(fallback));
    } catch {
      // ignore
    }
    return fallback;
  }
}

function writeExtensions(storage: StorageLike, key: string, extensions: Extension[]): void {
  storage.setItem(key, JSON.stringify(extensions));
}

export const extensionRepo = (() => {
  const storage: StorageLike = localStorage;
  const key = STORAGE_KEY;
  const demo = DEMO_EXTENSIONS;

  const nowIso = () => new Date().toISOString();

  const getAll = (): Extension[] => readExtensions(storage, key, demo);
  const setAll = (next: Extension[]) => writeExtensions(storage, key, next);

  /**
   * Создать extension, при этом гарантируем уникальность пары:
   * (assignmentId + studentId). Старый (если был) удаляем.
   */
  const upsertForStudentAssignment = (data: Omit<Extension, "id">): Extension => {
    const list = getAll();

    const filtered = list.filter(
      (e) => !(e.assignmentId === data.assignmentId && e.studentId === data.studentId),
    );

    const created: Extension = { ...data, id: makeId() };
    filtered.push(created);

    setAll(filtered);
    return created;
  };

  const updateById = (id: string, patch: (prev: Extension) => Extension): Extension | null => {
    const list = getAll();
    const idx = list.findIndex((e) => e.id === id);
    if (idx === -1) return null;

    const prev = list[idx];
    const next = patch(prev);

    // Запрещаем менять id через updates
    list[idx] = { ...next, id: prev.id };

    setAll(list);
    return list[idx];
  };

  return {
    // базовые
    getAll,

    getByAssignment(assignmentId: string): Extension[] {
      return getAll().filter((e) => e.assignmentId === assignmentId);
    },

    getForStudent(assignmentId: string, studentId: string): Extension | undefined {
      return getAll().find((e) => e.assignmentId === assignmentId && e.studentId === studentId);
    },

    create(extension: Omit<Extension, "id">): Extension {
      return upsertForStudentAssignment(extension);
    },

    update(id: string, updates: Partial<Extension>): Extension | null {
      return updateById(id, (prev) => ({ ...prev, ...updates }));
    },

    delete(id: string): boolean {
      const list = getAll();
      const next = list.filter((e) => e.id !== id);
      if (next.length === list.length) return false;
      setAll(next);
      return true;
    },

    // доменные методы
    request(
      assignmentId: string,
      studentId: string,
      studentName: string,
      type: ExtensionType,
      submissionDeadlineOverride?: string,
      reviewDeadlineOverride?: string,
      reason?: string,
    ): Extension {
      return upsertForStudentAssignment({
        assignmentId,
        studentId,
        studentName,
        type,
        submissionDeadlineOverride,
        reviewDeadlineOverride,
        reason: reason?.trim() || "Запрос студента",
        status: "requested",
        requestedAt: nowIso(),
        notifyStudent: false,
      });
    },

    approve(id: string, teacherId: string): Extension | null {
      return updateById(id, (prev) => ({
        ...prev,
        status: "approved",
        processedAt: nowIso(),
        processedBy: teacherId,
      }));
    },

    deny(id: string, teacherId: string): Extension | null {
      return updateById(id, (prev) => ({
        ...prev,
        status: "denied",
        processedAt: nowIso(),
        processedBy: teacherId,
      }));
    },
  };
})();
