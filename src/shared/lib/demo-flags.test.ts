import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { LEGACY_STORAGE_KEYS, STORAGE_KEYS } from "@/shared/config/constants";

import {
  DEMO_FLAG_METADATA,
  getDemoFlags,
  setDemoFlag,
  isDemoFlagEnabled,
  resetDemoFlags,
  setAllDemoFlags,
} from "./demo-flags";

describe("demo-flags", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ships metadata for every declared flag", () => {
    const flagKeys = Object.keys(getDemoFlags());
    const metaKeys = Object.keys(DEMO_FLAG_METADATA);
    expect(metaKeys.sort()).toEqual(flagKeys.sort());
    for (const meta of Object.values(DEMO_FLAG_METADATA)) {
      expect(meta.description).toMatch(/\S/);
    }
  });

  it("defaults every flag to false when nothing is stored", () => {
    const flags = getDemoFlags();
    for (const value of Object.values(flags)) {
      expect(value).toBe(false);
    }
  });

  it("persists a single flag flip across reads", () => {
    setDemoFlag("enableEmailConfirmation", true);
    expect(isDemoFlagEnabled("enableEmailConfirmation")).toBe(true);
    expect(isDemoFlagEnabled("supportChat")).toBe(false);
  });

  it("resetDemoFlags brings every flag back to false", () => {
    setDemoFlag("supportChat", true);
    setDemoFlag("enableEmailConfirmation", true);
    resetDemoFlags();
    const flags = getDemoFlags();
    for (const value of Object.values(flags)) {
      expect(value).toBe(false);
    }
  });

  it("setAllDemoFlags merges overrides without dropping previously-flipped flags", () => {
    setDemoFlag("supportChat", true);
    setAllDemoFlags({ enableEmailConfirmation: true });
    expect(isDemoFlagEnabled("supportChat")).toBe(true);
    expect(isDemoFlagEnabled("enableEmailConfirmation")).toBe(true);
    expect(isDemoFlagEnabled("enablePasswordReset")).toBe(false);
  });

  it("backfills missing keys from a partial stored payload", () => {
    localStorage.setItem(STORAGE_KEYS.demoFlags, JSON.stringify({ enablePasswordReset: true }));
    const flags = getDemoFlags();
    expect(flags.enablePasswordReset).toBe(true);
    expect(flags.supportChat).toBe(false);
    expect(flags.enableEmailConfirmation).toBe(false);
  });

  it("falls back to defaults instead of throwing on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEYS.demoFlags, "{broken");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => getDemoFlags()).not.toThrow();
    expect(isDemoFlagEnabled("supportChat")).toBe(false);
  });

  it("migrates the legacy peerly_feature_flags key on first read and removes it", () => {
    localStorage.setItem(
      LEGACY_STORAGE_KEYS.featureFlags,
      JSON.stringify({ supportChat: true, enableEmailConfirmation: true }),
    );
    const flags = getDemoFlags();
    expect(flags.supportChat).toBe(true);
    expect(flags.enableEmailConfirmation).toBe(true);
    expect(localStorage.getItem(LEGACY_STORAGE_KEYS.featureFlags)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.demoFlags)).not.toBeNull();
  });

  it("does not overwrite an existing demoFlags value with the legacy migration", () => {
    localStorage.setItem(STORAGE_KEYS.demoFlags, JSON.stringify({ supportChat: true }));
    localStorage.setItem(
      LEGACY_STORAGE_KEYS.featureFlags,
      JSON.stringify({ enablePasswordReset: true }),
    );
    const flags = getDemoFlags();
    expect(flags.supportChat).toBe(true);
    expect(flags.enablePasswordReset).toBe(false);
    expect(localStorage.getItem(LEGACY_STORAGE_KEYS.featureFlags)).not.toBeNull();
  });
});
