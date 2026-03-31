import { renderHook, act } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { RoleProvider, useRole, getRoleBadgeColor } from "./role";

// Mock i18n to avoid circular dependency issues with getRoleDisplayName
vi.mock("@/shared/lib/i18n/config", () => ({
  default: { t: (key: string) => key },
}));

function wrapper({ children }: { children: ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>;
}

describe("getRoleBadgeColor", () => {
  it("returns correct class for Student", () => {
    expect(getRoleBadgeColor("Student")).toBe("bg-info-light text-brand-primary");
  });

  it("returns correct class for Teacher", () => {
    expect(getRoleBadgeColor("Teacher")).toBe("bg-warning-light text-warning");
  });

  it("returns correct class for Admin", () => {
    expect(getRoleBadgeColor("Admin")).toBe("bg-secondary text-foreground");
  });
});

describe("RoleProvider / useRole", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides Student as default role", () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.currentRole).toBe("Student");
  });

  it("reads saved role from localStorage", () => {
    localStorage.setItem("peerly_role", "Admin");

    const { result } = renderHook(() => useRole(), { wrapper });

    expect(result.current.currentRole).toBe("Admin");
  });

  it("setRole updates role and saves to localStorage", () => {
    const { result } = renderHook(() => useRole(), { wrapper });

    act(() => {
      result.current.setRole("Teacher");
    });

    expect(result.current.currentRole).toBe("Teacher");
    expect(localStorage.getItem("peerly_role")).toBe("Teacher");
  });

  it("throws when useRole is used outside provider", () => {
    expect(() => {
      renderHook(() => useRole());
    }).toThrow("useRole must be used within a RoleProvider");
  });
});
