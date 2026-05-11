import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";

import type { Session } from "@/shared/api";
import { STORAGE_KEYS } from "@/shared/config/constants";

import { AuthProvider } from "@/entities/user/model/auth";

import { RoleRoute } from "./RoleRoute";

vi.mock("@/shared/lib/i18n/config", () => ({
  default: { t: (key: string) => key },
}));

function setSessionRole(role: Session["role"]) {
  const session: Session = {
    userId: "1",
    userName: "Test",
    email: "test@example.com",
    role,
  };
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
}

function renderAt(initialPath: string, children: React.ReactNode) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          {children}
          <Route path="/403" element={<div>forbidden</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("RoleRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders children when current role is in allow list", () => {
    setSessionRole("Teacher");

    renderAt(
      "/teacher/rubrics",
      <Route element={<RoleRoute allow={["Teacher"]} />}>
        <Route path="/teacher/rubrics" element={<div>rubrics page</div>} />
      </Route>,
    );

    expect(screen.getByText("rubrics page")).toBeInTheDocument();
  });

  it("redirects to current role's home when role is not in allow list", () => {
    setSessionRole("Student");

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/teacher/rubrics"]}>
          <Routes>
            <Route element={<RoleRoute allow={["Teacher"]} />}>
              <Route path="/teacher/rubrics" element={<div>rubrics page</div>} />
            </Route>
            <Route path="/student/dashboard" element={<div>student home</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("student home")).toBeInTheDocument();
    expect(screen.queryByText("rubrics page")).not.toBeInTheDocument();
  });

  it("redirects to custom redirectTo when specified", () => {
    setSessionRole("Student");

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin/users"]}>
          <Routes>
            <Route element={<RoleRoute allow={["Admin"]} redirectTo="/404" />}>
              <Route path="/admin/users" element={<div>admin users</div>} />
            </Route>
            <Route path="/404" element={<div>not found</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    );

    expect(screen.getByText("not found")).toBeInTheDocument();
  });

  it("supports multiple roles in allow list", () => {
    setSessionRole("Admin");

    renderAt(
      "/moderator/panel",
      <Route element={<RoleRoute allow={["Teacher", "Admin"]} />}>
        <Route path="/moderator/panel" element={<div>moderator panel</div>} />
      </Route>,
    );

    expect(screen.getByText("moderator panel")).toBeInTheDocument();
  });
});
