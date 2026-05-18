import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { STORAGE_KEYS } from "@/shared/config/constants";

import {
  FLAG_METADATA,
  getFeatureFlags,
  setFeatureFlag,
  isFlagEnabled,
  resetFeatureFlags,
  setAllFlags,
} from "./feature-flags";

describe("feature-flags", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("ships metadata for every declared flag", () => {
    const flagKeys = Object.keys(getFeatureFlags());
    const metaKeys = Object.keys(FLAG_METADATA);
    expect(metaKeys.sort()).toEqual(flagKeys.sort());
    for (const meta of Object.values(FLAG_METADATA)) {
      expect(meta.description).toMatch(/\S/);
    }
  });

  it("defaults every flag to false when nothing is stored", () => {
    const flags = getFeatureFlags();
    for (const value of Object.values(flags)) {
      expect(value).toBe(false);
    }
  });

  it("persists a single flag flip across reads", () => {
    setFeatureFlag("enableEmailConfirmation", true);
    expect(isFlagEnabled("enableEmailConfirmation")).toBe(true);
    expect(isFlagEnabled("supportChat")).toBe(false);
  });

  it("resetFeatureFlags brings every flag back to false", () => {
    setFeatureFlag("supportChat", true);
    setFeatureFlag("enableEmailConfirmation", true);
    resetFeatureFlags();
    const flags = getFeatureFlags();
    for (const value of Object.values(flags)) {
      expect(value).toBe(false);
    }
  });

  it("setAllFlags merges overrides without dropping previously-flipped flags", () => {
    setFeatureFlag("supportChat", true);
    setAllFlags({ enableEmailConfirmation: true });
    expect(isFlagEnabled("supportChat")).toBe(true);
    expect(isFlagEnabled("enableEmailConfirmation")).toBe(true);
    expect(isFlagEnabled("enablePasswordReset")).toBe(false);
  });

  it("backfills missing keys from a partial stored payload", () => {
    localStorage.setItem(STORAGE_KEYS.featureFlags, JSON.stringify({ enablePasswordReset: true }));
    const flags = getFeatureFlags();
    expect(flags.enablePasswordReset).toBe(true);
    expect(flags.supportChat).toBe(false);
    expect(flags.enableEmailConfirmation).toBe(false);
  });

  it("falls back to defaults instead of throwing on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEYS.featureFlags, "{broken");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => getFeatureFlags()).not.toThrow();
    expect(isFlagEnabled("supportChat")).toBe(false);
  });
});
