import { renderHook, act, render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { SimplePagination, usePagination } from "./simple-pagination";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("usePagination", () => {
  it("computes totalPages from items.length / itemsPerPage", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentPage).toBe(1);
  });

  it("slices currentItems for the current page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.currentItems).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

    act(() => {
      result.current.handlePageChange(2);
    });
    expect(result.current.currentPage).toBe(2);
    expect(result.current.currentItems).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);

    act(() => {
      result.current.handlePageChange(3);
    });
    expect(result.current.currentItems).toEqual([20, 21, 22, 23, 24]);
  });

  it("clamps currentPage back to 1 when totalPages shrinks below it", async () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 5), {
      initialProps: { items: Array.from({ length: 25 }, (_, i) => i) },
    });
    act(() => {
      result.current.handlePageChange(5);
    });
    expect(result.current.currentPage).toBe(5);

    rerender({ items: Array.from({ length: 5 }, (_, i) => i) });
    await Promise.resolve();
    expect(result.current.currentPage).toBe(1);
  });

  it("uses default itemsPerPage = 10", () => {
    const { result } = renderHook(() => usePagination(Array.from({ length: 30 }, (_, i) => i)));
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentItems).toHaveLength(10);
  });
});

describe("SimplePagination", () => {
  it("returns null when totalPages <= 1", () => {
    const { container } = render(
      <SimplePagination currentPage={1} totalPages={1} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("disables previous button on first page", () => {
    render(<SimplePagination currentPage={1} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /pagination\.previous/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /pagination\.next/ })).not.toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(<SimplePagination currentPage={5} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByRole("button", { name: /pagination\.next/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: /pagination\.previous/ })).not.toBeDisabled();
  });

  it("calls onPageChange with next page when next clicked", () => {
    const onChange = vi.fn();
    render(<SimplePagination currentPage={2} totalPages={5} onPageChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /pagination\.next/ }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("calls onPageChange with previous page when prev clicked", () => {
    const onChange = vi.fn();
    render(<SimplePagination currentPage={2} totalPages={5} onPageChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /pagination\.previous/ }));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
