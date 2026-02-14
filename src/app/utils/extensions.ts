/**
 * Extensions (Deadline Exceptions) Utilities
 *
 * Manages deadline extensions for assignments
 */

export type ExtensionType = "submission" | "review" | "both";
export type ExtensionStatus = "manual" | "requested" | "approved" | "denied";

export interface Extension {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  type: ExtensionType;
  submissionDeadlineOverride?: string; // ISO date string
  reviewDeadlineOverride?: string; // ISO date string
  reason: string;
  status: ExtensionStatus;
  requestedAt?: string; // ISO date string
  processedAt?: string; // ISO date string
  processedBy?: string; // teacher id
  notifyStudent: boolean;
}

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

function getExtensions(): Extension[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_EXTENSIONS));
      return DEMO_EXTENSIONS;
    }
    return JSON.parse(stored);
  } catch {
    return DEMO_EXTENSIONS;
  }
}

function saveExtensions(extensions: Extension[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(extensions));
}

export function getExtensionsByAssignment(assignmentId: string): Extension[] {
  return getExtensions().filter((ext) => ext.assignmentId === assignmentId);
}

export function getExtensionForStudent(
  assignmentId: string,
  studentId: string,
): Extension | undefined {
  return getExtensions().find(
    (ext) => ext.assignmentId === assignmentId && ext.studentId === studentId,
  );
}

export function createExtension(extension: Omit<Extension, "id">): Extension {
  const extensions = getExtensions();
  const newExtension: Extension = {
    ...extension,
    id: `ext${Date.now()}`,
  };

  // Remove any existing extension for the same student/assignment
  const filtered = extensions.filter(
    (ext) =>
      !(ext.assignmentId === extension.assignmentId && ext.studentId === extension.studentId),
  );

  filtered.push(newExtension);
  saveExtensions(filtered);
  return newExtension;
}

export function updateExtension(id: string, updates: Partial<Extension>): Extension | null {
  const extensions = getExtensions();
  const index = extensions.findIndex((ext) => ext.id === id);

  if (index === -1) return null;

  extensions[index] = { ...extensions[index], ...updates };
  saveExtensions(extensions);
  return extensions[index];
}

export function deleteExtension(id: string): boolean {
  const extensions = getExtensions();
  const filtered = extensions.filter((ext) => ext.id !== id);

  if (filtered.length === extensions.length) return false;

  saveExtensions(filtered);
  return true;
}

export function requestExtension(
  assignmentId: string,
  studentId: string,
  studentName: string,
  type: ExtensionType,
  submissionDeadlineOverride?: string,
  reviewDeadlineOverride?: string,
  reason?: string,
): Extension {
  return createExtension({
    assignmentId,
    studentId,
    studentName,
    type,
    submissionDeadlineOverride,
    reviewDeadlineOverride,
    reason: reason || "Запрос студента",
    status: "requested",
    requestedAt: new Date().toISOString(),
    notifyStudent: false,
  });
}

export function approveExtension(id: string, teacherId: string): Extension | null {
  return updateExtension(id, {
    status: "approved",
    processedAt: new Date().toISOString(),
    processedBy: teacherId,
  });
}

export function denyExtension(id: string, teacherId: string): Extension | null {
  return updateExtension(id, {
    status: "denied",
    processedAt: new Date().toISOString(),
    processedBy: teacherId,
  });
}

// Helper to format extension status
export function getExtensionStatusLabel(status: ExtensionStatus): string {
  const labels: Record<ExtensionStatus, string> = {
    manual: "Вручную",
    requested: "Запрошено",
    approved: "Одобрено",
    denied: "Отклонено",
  };
  return labels[status];
}

// Helper to get extension type label
export function getExtensionTypeLabel(type: ExtensionType): string {
  const labels: Record<ExtensionType, string> = {
    submission: "Сдача работы",
    review: "Проверка работ",
    both: "Сдача и проверка",
  };
  return labels[type];
}
