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

    if (!raw) {
      const seeded = cloneDemo(demo);
      storage.setItem(key, JSON.stringify(seeded));
      return seeded;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) throw new Error("Invalid stored value");

    return (parsed as Extension[]).map((e) => ({ ...e }));
  } catch {
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

    list[idx] = { ...next, id: prev.id };

    setAll(list);
    return list[idx];
  };

  return {
    getAll(): Promise<Extension[]> {
      return Promise.resolve(getAll());
    },

    getByAssignment(assignmentId: string): Promise<Extension[]> {
      return Promise.resolve(getAll().filter((e) => e.assignmentId === assignmentId));
    },

    getForStudent(assignmentId: string, studentId: string): Promise<Extension | undefined> {
      return Promise.resolve(
        getAll().find((e) => e.assignmentId === assignmentId && e.studentId === studentId),
      );
    },

    create(extension: Omit<Extension, "id">): Promise<Extension> {
      return Promise.resolve(upsertForStudentAssignment(extension));
    },

    update(id: string, updates: Partial<Extension>): Promise<Extension | null> {
      return Promise.resolve(updateById(id, (prev) => ({ ...prev, ...updates })));
    },

    delete(id: string): Promise<boolean> {
      const list = getAll();
      const next = list.filter((e) => e.id !== id);
      if (next.length === list.length) return Promise.resolve(false);
      setAll(next);
      return Promise.resolve(true);
    },

    request(
      assignmentId: string,
      studentId: string,
      studentName: string,
      type: ExtensionType,
      submissionDeadlineOverride?: string,
      reviewDeadlineOverride?: string,
      reason?: string,
    ): Promise<Extension> {
      return Promise.resolve(
        upsertForStudentAssignment({
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
        }),
      );
    },

    approve(id: string, teacherId: string): Promise<Extension | null> {
      return Promise.resolve(
        updateById(id, (prev) => ({
          ...prev,
          status: "approved",
          processedAt: nowIso(),
          processedBy: teacherId,
        })),
      );
    },

    deny(id: string, teacherId: string): Promise<Extension | null> {
      return Promise.resolve(
        updateById(id, (prev) => ({
          ...prev,
          status: "denied",
          processedAt: nowIso(),
          processedBy: teacherId,
        })),
      );
    },
  };
})();
