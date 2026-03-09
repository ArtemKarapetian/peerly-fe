import { Appeal, CreateAppealInput } from "@/entities/appeal/model/types.ts";

const STORAGE_KEY = "peerly_appeals";

/**
 * Get all appeals from storage
 */
function read(): Appeal[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Appeal[]) : [];
  } catch (e) {
    console.error("Failed to load appeals:", e);
    return [];
  }
}

function write(items: Appeal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const appealRepo = {
  getByStudent(studentId: string): Promise<Appeal[]> {
    return Promise.resolve(read().filter((a) => a.studentId === studentId));
  },
  create(input: CreateAppealInput): Promise<Appeal> {
    const newAppeal: Appeal = {
      ...input,
      id: `appeal-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      status: "new",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const items = read();
    items.push(newAppeal);
    write(items);
    return Promise.resolve(newAppeal);
  },
};
