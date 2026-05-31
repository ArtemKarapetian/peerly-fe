import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PublicLayout, PublicTopBar } from "./PublicLayout";

const { useAuthMock, defaultRouteForRoleMock, navigateMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  defaultRouteForRoleMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

vi.mock("@/entities/user", () => ({
  useAuth: useAuthMock,
  defaultRouteForRole: defaultRouteForRoleMock,
}));

vi.mock("@/widgets/navigation/ProfileDropdown.tsx", () => ({
  ProfileDropdown: () => <div data-testid="profile-dropdown">Profile</div>,
}));

beforeEach(() => {
  navigateMock.mockReset();
  defaultRouteForRoleMock.mockReset();
});

function renderTopBar(showAuthControls = true) {
  return render(
    <MemoryRouter>
      <PublicTopBar showAuthControls={showAuthControls} />
    </MemoryRouter>,
  );
}

describe("PublicTopBar", () => {
  it("renders Get Started CTA for anonymous users", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, session: null });
    renderTopBar();
    expect(screen.getByRole("button", { name: /page\.landing\.getStarted/ })).toBeInTheDocument();
  });

  it("navigates to register on anonymous CTA click", async () => {
    const user = userEvent.setup();
    useAuthMock.mockReturnValue({ isAuthenticated: false, session: null });
    renderTopBar();
    await user.click(screen.getByRole("button", { name: /page\.landing\.getStarted/ }));
    expect(navigateMock).toHaveBeenCalledWith("/register");
  });

  it("renders profile dropdown for authenticated users", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: true, session: { role: "Student" } });
    defaultRouteForRoleMock.mockReturnValue("/student/dashboard");
    renderTopBar();
    expect(screen.getByTestId("profile-dropdown")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /getStarted/ })).not.toBeInTheDocument();
  });

  it("hides auth controls when showAuthControls=false", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, session: null });
    renderTopBar(false);
    expect(screen.queryByRole("button", { name: /getStarted/ })).not.toBeInTheDocument();
  });
});

describe("PublicLayout footer", () => {
  it("renders Help and Terms links in the footer", () => {
    useAuthMock.mockReturnValue({ isAuthenticated: false, session: null });
    render(
      <MemoryRouter>
        <PublicLayout>
          <div>child</div>
        </PublicLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /widget\.publicLayout\.help/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /widget\.publicLayout\.terms/ })).toBeInTheDocument();
  });
});
