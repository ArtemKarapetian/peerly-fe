import { act, renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, it, expect, beforeEach } from "vitest";

import { FeatureFlagsProvider, useFeatureFlags } from "./feature-flags-provider";

const defaultFlags = {
  commentsEnabled: false,
  supportChat: false,
  twoFactor: false,
  enableEmailConfirmation: false,
  enablePasswordReset: false,
  deleteAccount: false,
  enablePlugins: false,
  enableIntegrations: false,
  enableRetention: true,
  enableLimits: true,
  enableAutomation: true,
  enableAnalytics: true,
  enableExtensions: true,
  enableAnnouncements: true,
};

function wrapper({ children }: { children: ReactNode }) {
  return <FeatureFlagsProvider>{children}</FeatureFlagsProvider>;
}

describe("FeatureFlagsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides default flags when localStorage is empty", () => {
    const { result } = renderHook(() => useFeatureFlags(), { wrapper });

    expect(result.current.flags).toEqual(defaultFlags);
  });

  it("merges stored flags with defaults", () => {
    localStorage.setItem(
      "peerly_feature_flags",
      JSON.stringify({ supportChat: true, enablePlugins: true }),
    );

    const { result } = renderHook(() => useFeatureFlags(), { wrapper });

    expect(result.current.flags.supportChat).toBe(true);
    expect(result.current.flags.enablePlugins).toBe(true);
    // defaults still present
    expect(result.current.flags.enableAnalytics).toBe(true);
    expect(result.current.flags.commentsEnabled).toBe(false);
  });

  it("falls back to defaults when localStorage contains invalid JSON", () => {
    localStorage.setItem("peerly_feature_flags", "not-valid-json");

    const { result } = renderHook(() => useFeatureFlags(), { wrapper });

    expect(result.current.flags).toEqual(defaultFlags);
  });

  it("updateFlag updates a flag value", () => {
    const { result } = renderHook(() => useFeatureFlags(), { wrapper });

    expect(result.current.flags.supportChat).toBe(false);

    act(() => {
      result.current.updateFlag("supportChat", true);
    });

    expect(result.current.flags.supportChat).toBe(true);
  });

  it("persists updated flags to localStorage", () => {
    const { result } = renderHook(() => useFeatureFlags(), { wrapper });

    act(() => {
      result.current.updateFlag("supportChat", true);
    });

    const stored = JSON.parse(localStorage.getItem("peerly_feature_flags")!) as Record<
      string,
      boolean
    >;
    expect(stored.supportChat).toBe(true);
  });
});

describe("useFeatureFlags", () => {
  it("throws when used outside provider", () => {
    expect(() => {
      renderHook(() => useFeatureFlags());
    }).toThrow("useFeatureFlags must be used within a FeatureFlagsProvider");
  });
});
