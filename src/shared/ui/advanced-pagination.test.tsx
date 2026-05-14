import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AdvancedPagination } from "./advanced-pagination";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && "page" in opts ? `${key}:${String(opts.page)}` : key,
  }),
}));

describe("AdvancedPagination", () => {
  it("returns null when totalPages is 1 or less", () => {
    const { container } = render(
      <AdvancedPagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders all page buttons when totalPages <= maxPageButtons", () => {
    render(<AdvancedPagination currentPage={1} totalPages={3} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /pagination\.page:1$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pagination\.page:2$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /pagination\.page:3$/ })).toBeInTheDocument();
  });

  it("calls onPageChange when clicking a page number", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<AdvancedPagination currentPage={1} totalPages={3} onPageChange={onChange} />);
    await user.click(screen.getByRole("button", { name: /pagination\.page:2$/ }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("disables previous on page 1 and next on the last page", () => {
    const { rerender } = render(
      <AdvancedPagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );
    expect(screen.getByRole("button", { name: /pagination\.back/ })).toBeDisabled();

    rerender(<AdvancedPagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /pagination\.forward/ })).toBeDisabled();
  });

  it("marks the current page button with aria-current='page'", () => {
    render(<AdvancedPagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />);
    const current = screen.getByRole("button", { current: "page" });
    expect(within(current).getByText("2")).toBeInTheDocument();
  });
});
