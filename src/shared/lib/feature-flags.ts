import { STORAGE_KEYS } from "@/shared/config/constants";

export interface FeatureFlags {
  supportChat: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;
}

export interface FlagMeta {
  description: string;
}

export const FLAG_METADATA: Record<keyof FeatureFlags, FlagMeta> = {
  supportChat: { description: "Support-chat launcher in the footer" },
  enableEmailConfirmation: {
    description: "Require email confirmation after registration",
  },
  enablePasswordReset: { description: "Password-reset entry point on login" },
};

const DEFAULT_FLAGS: FeatureFlags = {
  supportChat: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,
};

const STORAGE_KEY = STORAGE_KEYS.featureFlags;

export function getFeatureFlags(): FeatureFlags {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<FeatureFlags>;
      return { ...DEFAULT_FLAGS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load feature flags:", e);
  }
  return { ...DEFAULT_FLAGS };
}

export function setFeatureFlag(key: keyof FeatureFlags, value: boolean): void {
  const flags = getFeatureFlags();
  flags[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

export function isFlagEnabled(key: keyof FeatureFlags): boolean {
  return getFeatureFlags()[key];
}

export function resetFeatureFlags(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
}

export function setAllFlags(overrides: Partial<FeatureFlags>): void {
  const flags = getFeatureFlags();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...flags, ...overrides }));
}
