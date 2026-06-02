import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { UserRole } from "@/entities/user";

import { SideNav } from "./SideNavRoleAware";

const { useRoleMock } = vi.hoisted(() => ({
  useRoleMock: vi.fn<() => { currentRole: UserRole }>(),
}));

vi.mock("@/entities/user", () => ({
  useRole: useRoleMock,
}));

function renderNav(role: UserRole) {
  useRoleMock.mockReturnValue({ currentRole: role });
  return render(
    <MemoryRouter>
      <SideNav variant="desktop-expanded" />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  useRoleMock.mockReset();
});

describe("SideNav role-aware links", () => {
  it("renders student links for Student role", () => {
    renderNav("Student");
    expect(screen.queryByText(/nav\.home/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.courses/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.reviews/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.gradebook/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.distribution/)).not.toBeInTheDocument();
    expect(screen.queryByText(/nav\.rubrics/)).not.toBeInTheDocument();
  });

  it("renders teacher links for Teacher role", () => {
    renderNav("Teacher");
    expect(screen.queryByText(/nav\.courses/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.createAssignment/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.rubrics/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.distribution/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.analytics/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.gradebook/)).not.toBeInTheDocument();
  });

  it("renders admin links for Admin role", () => {
    renderNav("Admin");
    expect(screen.queryByText(/nav\.overview/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.users/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.rubrics/)).not.toBeInTheDocument();
    expect(screen.queryByText(/nav\.gradebook/)).not.toBeInTheDocument();
  });

  it("always renders profile and settings footer links", () => {
    renderNav("Student");
    expect(screen.queryByText(/nav\.profile/)).toBeInTheDocument();
    expect(screen.queryByText(/nav\.settings/)).toBeInTheDocument();
  });
});
