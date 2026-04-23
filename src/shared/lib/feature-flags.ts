/**
 * Feature Flags System
 *
 * Flags fall into two groups:
 *
 *  1. Flags tagged `backend: true` — the gateway already implements the
 *     endpoints and the flag controls UI polish / optional behaviour.
 *
 *  2. Flags tagged `backend: false` — the feature has no real gateway
 *     endpoint yet. When enabled the UI is shown but runs against the
 *     local demo / in-memory store. Default OFF so the app only shows
 *     wired-up features until an admin opts in explicitly.
 */

import { STORAGE_KEYS } from "@/shared/config/constants";

export interface FeatureFlags {
  // ── Backed by the gateway ─────────────────────────────────────
  supportChat: boolean;
  twoFactor: boolean;
  enableEmailConfirmation: boolean;
  enablePasswordReset: boolean;

  // ── Demo-only (no gateway implementation) ─────────────────────
  enablePlugins: boolean;
  enableIntegrations: boolean;
  enableRetention: boolean;
  enableLimits: boolean;
  enableAutomation: boolean;
  enableAnalytics: boolean;
  enableExtensions: boolean;
  enableAnnouncements: boolean;
  enableAppeals: boolean;
  enableAuditLogs: boolean;
  enableOrganizations: boolean;
  enableAdminPanel: boolean;
  enableProfileEdit: boolean;
  enablePasswordChange: boolean;
}

export interface FlagMeta {
  backend: boolean;
  /** Short human description — shown in the admin UI. */
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
  enableAuditLogs: { backend: false, description: "Admin audit log view (demo)" },
  enableOrganizations: { backend: false, description: "Organization management (demo)" },
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
  enableAuditLogs: false,
  enableOrganizations: false,
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
