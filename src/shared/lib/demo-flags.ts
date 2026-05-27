import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/shared/config/constants";

export interface DemoFlags {
  supportChat: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;
}

export interface DemoFlagMeta {
  description: string;
}

export const DEMO_FLAG_METADATA: Record<keyof DemoFlags, DemoFlagMeta> = {
  supportChat: { description: "Support-chat launcher in the footer" },
  enableEmailConfirmation: {
    description: "Require email confirmation after registration",
  },
  enablePasswordReset: { description: "Password-reset entry point on login" },
};

const DEFAULT_FLAGS: DemoFlags = {
  supportChat: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,
};

const STORAGE_KEY = STORAGE_KEYS.demoFlags;
const LEGACY_KEY = LEGACY_STORAGE_KEYS.featureFlags;

function migrateLegacyIfNeeded(): void {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== null) return;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === null) return;
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore (private browsing, quota)
  }
}

export function getDemoFlags(): DemoFlags {
  migrateLegacyIfNeeded();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<DemoFlags>;
      return { ...DEFAULT_FLAGS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load demo flags:", e);
  }
  return { ...DEFAULT_FLAGS };
}

export function setDemoFlag(key: keyof DemoFlags, value: boolean): void {
  const flags = getDemoFlags();
  flags[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

export function isDemoFlagEnabled(key: keyof DemoFlags): boolean {
  return getDemoFlags()[key];
}

export function resetDemoFlags(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
}

export function setAllDemoFlags(overrides: Partial<DemoFlags>): void {
  const flags = getDemoFlags();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...flags, ...overrides }));
}
