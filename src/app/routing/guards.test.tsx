import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { AuthProvider } from "@/entities/user/model/auth";

import { FeatureRoute } from "./FeatureRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { PublicOnlyRoute } from "./PublicOnlyRoute";

// Mock feature flags
vi.mock("@/shared/lib/feature-flags", () => ({
  isFlagEnabled: (key: string) => {
    const flags: Record<string, boolean> = {
      enableAnalytics: true,
      enablePlugins: false,
    };
    return flags[key] ?? false;
  },
}));

function renderWithRouter(initialPath: string, routes: React.ReactNode) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <AuthProvider>{routes}</AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /login when not authenticated", () => {
    renderWithRouter(
      "/dashboard",
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("renders child route when authenticated", () => {
    localStorage.setItem("peerly_auth", "true");
    localStorage.setItem(
      "peerly_user",
      JSON.stringify({ id: "1", name: "Test", email: "t@t.com" }),
    );

    renderWithRouter(
      "/dashboard",
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});

describe("PublicOnlyRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders child route when not authenticated", () => {
    renderWithRouter(
      "/login",
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("redirects to /dashboard when authenticated", () => {
    localStorage.setItem("peerly_auth", "true");
    localStorage.setItem(
      "peerly_user",
      JSON.stringify({ id: "1", name: "Test", email: "t@t.com" }),
    );

    renderWithRouter(
      "/login",
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<div>Login Page</div>} />
        </Route>
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
  });
});

describe("FeatureRoute", () => {
  it("renders child route when flag is enabled", () => {
    renderWithRouter(
      "/analytics",
      <Routes>
        <Route element={<FeatureRoute flag="enableAnalytics" />}>
          <Route path="/analytics" element={<div>Analytics</div>} />
        </Route>
        <Route path="/404" element={<div>Not Found</div>} />
      </Routes>,
    );

    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("redirects when flag is disabled", () => {
    renderWithRouter(
      "/plugins",
      <Routes>
        <Route element={<FeatureRoute flag="enablePlugins" />}>
          <Route path="/plugins" element={<div>Plugins</div>} />
        </Route>
        <Route path="/404" element={<div>Not Found</div>} />
      </Routes>,
    );

    expect(screen.getByText("Not Found")).toBeInTheDocument();
    expect(screen.queryByText("Plugins")).not.toBeInTheDocument();
  });

  it("uses custom redirectTo path", () => {
    renderWithRouter(
      "/plugins",
      <Routes>
        <Route element={<FeatureRoute flag="enablePlugins" redirectTo="/home" />}>
          <Route path="/plugins" element={<div>Plugins</div>} />
        </Route>
        <Route path="/home" element={<div>Home</div>} />
      </Routes>,
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
