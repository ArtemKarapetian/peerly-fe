import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import { RoleProvider } from "@/entities/user/model/role";

import { RoleRoute } from "./RoleRoute";

vi.mock("@/shared/lib/i18n/config", () => ({
  default: { t: (key: string) => key },
}));

function renderAt(initialPath: string, children: React.ReactNode) {
  return render(
    <RoleProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          {children}
          <Route path="/403" element={<div>forbidden</div>} />
        </Routes>
      </MemoryRouter>
    </RoleProvider>,
  );
}

describe("RoleRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when current role is in allow list", () => {
    localStorage.setItem("peerly_role", "Teacher");

    renderAt(
      "/teacher/rubrics",
      <Route element={<RoleRoute allow={["Teacher"]} />}>
        <Route path="/teacher/rubrics" element={<div>rubrics page</div>} />
      </Route>,
    );

    expect(screen.getByText("rubrics page")).toBeInTheDocument();
  });

  it("redirects to /403 when role is not in allow list", () => {
    localStorage.setItem("peerly_role", "Student");

    renderAt(
      "/teacher/rubrics",
      <Route element={<RoleRoute allow={["Teacher"]} />}>
        <Route path="/teacher/rubrics" element={<div>rubrics page</div>} />
      </Route>,
    );

    expect(screen.getByText("forbidden")).toBeInTheDocument();
    expect(screen.queryByText("rubrics page")).not.toBeInTheDocument();
  });

  it("redirects to custom redirectTo when specified", () => {
    localStorage.setItem("peerly_role", "Student");

    render(
      <RoleProvider>
        <MemoryRouter initialEntries={["/admin/users"]}>
          <Routes>
            <Route element={<RoleRoute allow={["Admin"]} redirectTo="/404" />}>
              <Route path="/admin/users" element={<div>admin users</div>} />
            </Route>
            <Route path="/404" element={<div>not found</div>} />
          </Routes>
        </MemoryRouter>
      </RoleProvider>,
    );

    expect(screen.getByText("not found")).toBeInTheDocument();
  });

  it("supports multiple roles in allow list", () => {
    localStorage.setItem("peerly_role", "Admin");

    renderAt(
      "/moderator/panel",
      <Route element={<RoleRoute allow={["Teacher", "Admin"]} />}>
        <Route path="/moderator/panel" element={<div>moderator panel</div>} />
      </Route>,
    );

    expect(screen.getByText("moderator panel")).toBeInTheDocument();
  });
});
