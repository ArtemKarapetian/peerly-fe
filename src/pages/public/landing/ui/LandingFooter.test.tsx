import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { LandingFooter } from "./LandingFooter";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

describe("LandingFooter", () => {
  it("renders Help and Terms links + the current year", () => {
    render(
      <MemoryRouter>
        <LandingFooter />
      </MemoryRouter>,
    );
    expect(screen.getByRole("link", { name: /footerHelp/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /footerTerms/ })).toBeInTheDocument();
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`${year}.*Peerly`))).toBeInTheDocument();
  });
});
