// Фича-флаги. backend:true — фича реальная, флаг рулит только UI-поведением
// backend:false — UI работает с локальным демо-стором; default OFF, чтобы видны были только дошитые до бекенда фичи

import { STORAGE_KEYS } from "@/shared/config/constants";

export interface FeatureFlags {
  // ── Реальные (есть на гейтвее) ────────────────────────────────
  supportChat: boolean;
  twoFactor: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;

  // ── Демо (нет на гейтвее) ─────────────────────────────────────
  enablePlugins: boolean;
  enableIntegrations: boolean;
  enableRetention: boolean;
  enableLimits: boolean;
  enableAutomation: boolean;
  enableAnalytics: boolean;
  enableExtensions: boolean;
  enableAnnouncements: boolean;
  enableAppeals: boolean;
  enableNotifications: boolean;
  enableAuditLogs: boolean;
  enableAdminPanel: boolean;
  enableProfileEdit: boolean;
  enablePasswordChange: boolean;
}

export interface FlagMeta {
  backend: boolean;
  description: string;
}

export const FLAG_METADATA: Record<keyof FeatureFlags, FlagMeta> = {
  supportChat: { backend: true, description: "Support-chat launcher in the footer" },
  twoFactor: { backend: true, description: "Two-factor authentication flow" },
  enableEmailConfirmation: {
    backend: true,
    description: "Require email confirmation after registration",
  },
  enablePasswordReset: { backend: true, description: "Password-reset entry point on login" },

  enablePlugins: { backend: false, description: "Plugins catalog (demo)" },
  enableIntegrations: { backend: false, description: "Integrations settings (demo)" },
  enableRetention: { backend: false, description: "Retention policies admin page (demo)" },
  enableLimits: { backend: false, description: "Rate-limit admin page (demo)" },
  enableAutomation: { backend: false, description: "Automation rules UI (demo)" },
  enableAnalytics: { backend: false, description: "Teacher analytics dashboards (demo)" },
  enableExtensions: { backend: false, description: "Deadline-extension manager (demo)" },
  enableAnnouncements: { backend: false, description: "Course announcements (demo)" },
  enableAppeals: { backend: false, description: "Student appeals inbox (demo)" },
  enableNotifications: {
    backend: false,
    description: "Notifications inbox + dashboard widget (demo)",
  },
  enableAuditLogs: { backend: false, description: "Admin audit log view (demo)" },
  enableAdminPanel: { backend: false, description: "Admin panel entry point (demo)" },
  enableProfileEdit: { backend: false, description: "Self-service profile edit (demo)" },
  enablePasswordChange: { backend: false, description: "Password change form (demo)" },
};

const DEFAULT_FLAGS: FeatureFlags = {
  supportChat: false,
  twoFactor: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,

  enablePlugins: false,
  enableIntegrations: false,
  enableRetention: false,
  enableLimits: false,
  enableAutomation: false,
  enableAnalytics: false,
  enableExtensions: false,
  enableAnnouncements: false,
  enableAppeals: false,
  enableNotifications: false,
  enableAuditLogs: false,
  enableAdminPanel: true,
  enableProfileEdit: false,
  enablePasswordChange: false,
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
