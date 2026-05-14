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

  it("FLAG_METADATA declares the expected flag keys with backend + description", () => {
    const keys = Object.keys(FLAG_METADATA);
    expect(keys).toContain("supportChat");
    expect(keys).toContain("twoFactor");
    expect(keys).toContain("enableEmailConfirmation");
    expect(keys).toContain("enablePasswordReset");
    for (const meta of Object.values(FLAG_METADATA)) {
      expect(typeof meta.backend).toBe("boolean");
      expect(typeof meta.description).toBe("string");
      expect(meta.description.length).toBeGreaterThan(0);
    }
  });

  it("getFeatureFlags returns all defaults (false) when nothing stored", () => {
    const flags = getFeatureFlags();
    expect(flags.supportChat).toBe(false);
    expect(flags.twoFactor).toBe(false);
    expect(flags.enableEmailConfirmation).toBe(false);
    expect(flags.enablePasswordReset).toBe(false);
  });

  it("setFeatureFlag toggles a single flag and persists it", () => {
    setFeatureFlag("twoFactor", true);
    expect(isFlagEnabled("twoFactor")).toBe(true);
    expect(isFlagEnabled("supportChat")).toBe(false);
  });

  it("isFlagEnabled reads back persisted value", () => {
    setFeatureFlag("supportChat", true);
    expect(isFlagEnabled("supportChat")).toBe(true);
  });

  it("resetFeatureFlags restores all defaults", () => {
    setFeatureFlag("supportChat", true);
    setFeatureFlag("twoFactor", true);
    resetFeatureFlags();
    expect(isFlagEnabled("supportChat")).toBe(false);
    expect(isFlagEnabled("twoFactor")).toBe(false);
  });

  it("setAllFlags merges overrides into existing flags", () => {
    setFeatureFlag("supportChat", true);
    setAllFlags({ twoFactor: true });
    expect(isFlagEnabled("supportChat")).toBe(true);
    expect(isFlagEnabled("twoFactor")).toBe(true);
  });

  it("getFeatureFlags merges partial stored payloads with defaults", () => {
    localStorage.setItem(STORAGE_KEYS.featureFlags, JSON.stringify({ twoFactor: true }));
    const flags = getFeatureFlags();
    expect(flags.twoFactor).toBe(true);
    expect(flags.supportChat).toBe(false);
  });

  it("getFeatureFlags returns defaults when stored JSON is corrupt", () => {
    localStorage.setItem(STORAGE_KEYS.featureFlags, "{broken");
    vi.spyOn(console, "error").mockImplementation(() => {});
    const flags = getFeatureFlags();
    expect(flags.supportChat).toBe(false);
  });
});
