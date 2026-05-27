/**
 * Typed localStorage wrapper.
 *
 * The StorageMap binds each known key to the actual JSON-deserialized value
 * type — so `storage.getJSON(STORAGE_KEYS.demoFlags)` is `DemoFlags | null`
 * automatically, no generic argument needed.
 */

import type { Session } from "@/shared/api/session";
import { STORAGE_KEYS } from "@/shared/config/constants";

import type { DemoFlags } from "./demo-flags";

interface StorageMap {
  [STORAGE_KEYS.session]: Session;
  [STORAGE_KEYS.demoFlags]: DemoFlags;
  [STORAGE_KEYS.language]: string;
  [STORAGE_KEYS.theme]: string;
  [STORAGE_KEYS.demoToolsVisible]: boolean;
  [STORAGE_KEYS.pendingVerificationEmail]: string;
}

type StorageKey = keyof StorageMap;

function get(key: StorageKey): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function getJSON<K extends StorageKey>(key: K): StorageMap[K] | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as StorageMap[K];
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

function setJSON<K extends StorageKey>(key: K, value: StorageMap[K]): void {
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
