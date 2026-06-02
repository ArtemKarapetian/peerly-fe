import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Error500Page from "./Page";

const navigate = vi.fn();
let authState = { isAuthenticated: false };

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigate };
});
vi.mock("@/entities/user", () => ({
  useAuth: () => authState,
}));

beforeEach(() => {
  navigate.mockReset();
});

afterEach(() => {
  authState = { isAuthenticated: false };
});

const renderPage = () =>
  render(
    <MemoryRouter>
      <Error500Page />
    </MemoryRouter>,
  );

describe("Error500Page", () => {
  it("shows sign-in + home actions for anonymous users", () => {
    authState = { isAuthenticated: false };
    renderPage();
    expect(screen.getByRole("button", { name: "auth.signIn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "errors.toHome" })).toBeInTheDocument();
  });

  it("shows dashboard + courses actions for authenticated users", () => {
    authState = { isAuthenticated: true };
    renderPage();
    expect(screen.getByRole("button", { name: "errors.toDashboard" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "errors.toCourses" })).toBeInTheDocument();
  });

  it("navigates to /login when anonymous user clicks the sign-in action", async () => {
    authState = { isAuthenticated: false };
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "auth.signIn" }));
    expect(navigate).toHaveBeenCalledWith("/login");
  });

  it("navigates to dashboard when authenticated user clicks the dashboard action", async () => {
    authState = { isAuthenticated: true };
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: "errors.toDashboard" }));
    expect(navigate).toHaveBeenCalledTimes(1);
  });
});
