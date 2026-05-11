import { useSyncExternalStore } from "react";

import type { RubricData } from "./types";

const STORAGE_KEY = "peerly_rubrics_library";

function readStored(): RubricData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
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
    return [];
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
