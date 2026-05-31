import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { CoursesEmptyState } from "./CoursesEmptyState";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

function renderInRouter(node: React.ReactElement) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe("CoursesEmptyState", () => {
  it("hides the create button when isSearching=true", () => {
    renderInRouter(<CoursesEmptyState isSearching />);
    expect(screen.queryByRole("button", { name: /createCourse/ })).toBeNull();
    expect(screen.getByText(/noCoursesSearch/)).toBeInTheDocument();
  });

  it("shows the create button when isSearching=false", () => {
    renderInRouter(<CoursesEmptyState isSearching={false} />);
    expect(screen.getByRole("button", { name: /createCourse/ })).toBeInTheDocument();
    expect(screen.getByText(/noCourses/)).toBeInTheDocument();
  });
});
