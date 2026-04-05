import { describe, it, expect, beforeEach } from "vitest";

import {
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

  describe("getFeatureFlags", () => {
    it("returns defaults when nothing stored", () => {
      const flags = getFeatureFlags();
      expect(flags.supportChat).toBe(false);
      expect(flags.enableAnalytics).toBe(true);
    });

    it("merges stored values with defaults", () => {
      localStorage.setItem("peerly_feature_flags", JSON.stringify({ supportChat: true }));
      const flags = getFeatureFlags();
      expect(flags.supportChat).toBe(true);
      expect(flags.enableAnalytics).toBe(true); // default preserved
    });

    it("returns defaults on corrupted JSON", () => {
      localStorage.setItem("peerly_feature_flags", "not-valid-json");
      const flags = getFeatureFlags();
      expect(flags.supportChat).toBe(false);
    });
  });

  describe("setFeatureFlag", () => {
    it("sets a single flag", () => {
      setFeatureFlag("supportChat", true);
      expect(isFlagEnabled("supportChat")).toBe(true);
    });

    it("preserves other flags", () => {
      setFeatureFlag("supportChat", true);
      setFeatureFlag("twoFactor", true);
      expect(isFlagEnabled("supportChat")).toBe(true);
      expect(isFlagEnabled("twoFactor")).toBe(true);
    });
  });

  describe("isFlagEnabled", () => {
    it("returns default value for unset flag", () => {
      expect(isFlagEnabled("enableRetention")).toBe(true);
      expect(isFlagEnabled("enablePlugins")).toBe(false);
    });
  });

  describe("resetFeatureFlags", () => {
    it("resets all flags to defaults", () => {
      setFeatureFlag("supportChat", true);
      expect(isFlagEnabled("supportChat")).toBe(true);
      resetFeatureFlags();
      // supportChat default is false
      expect(isFlagEnabled("enableRetention")).toBe(true); // default true preserved
      expect(isFlagEnabled("supportChat")).toBe(false);
    });
  });

  describe("setAllFlags", () => {
    it("sets multiple flags at once", () => {
      setAllFlags({ supportChat: true, twoFactor: true });
      expect(isFlagEnabled("supportChat")).toBe(true);
      expect(isFlagEnabled("twoFactor")).toBe(true);
      expect(isFlagEnabled("enablePlugins")).toBe(false); // unchanged
    });
  });
});
