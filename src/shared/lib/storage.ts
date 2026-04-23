/**
 * Typed localStorage wrapper.
 *
 * Provides type-safe get / set / remove with JSON (de)serialization
 * and a central registry of known keys so nothing is scattered.
 */

import { STORAGE_KEYS } from "@/shared/config/constants";

// ── Key → Value type map ──────────────────────────────────────────
interface StorageMap {
  [STORAGE_KEYS.session]: string; // JSON-serialized session
  [STORAGE_KEYS.language]: string;
  [STORAGE_KEYS.theme]: string;
  [STORAGE_KEYS.featureFlags]: string; // JSON-serialized FeatureFlags
}

type StorageKey = keyof StorageMap;

function get(key: StorageKey): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getJSON<T>(key: StorageKey): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set(key: StorageKey, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // quota exceeded or private browsing — silently ignore
  }
}

function setJSON(key: StorageKey, value: unknown): void {
  set(key, JSON.stringify(value));
}

function remove(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const storage = { get, getJSON, set, setJSON, remove } as const;
