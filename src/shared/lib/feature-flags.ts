/**
 * Feature Flags System
 *
 * Manages feature flags with localStorage persistence
 */

export interface FeatureFlags {
  supportChat: boolean;
  twoFactor: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  supportChat: false,
  twoFactor: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,
};

const STORAGE_KEY = "peerly_feature_flags";

export function getFeatureFlags(): FeatureFlags {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_FLAGS, ...parsed };
    }
  } catch (e) {
    console.error("Failed to load feature flags:", e);
  }
  return DEFAULT_FLAGS;
}

export function setFeatureFlag(key: keyof FeatureFlags, value: boolean): void {
  const flags = getFeatureFlags();
  flags[key] = value;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(flags));
}

export function isFlagEnabled(key: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[key];
}

export function resetFeatureFlags(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FLAGS));
}
