import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DropdownFilter } from "./DropdownFilter";

const OPTIONS = [
  { value: "all", label: "All" },
  { value: "a", label: "Apples" },
  { value: "b", label: "Bananas" },
];

describe("DropdownFilter", () => {
  it("shows only the trigger initially", () => {
    render(
      <DropdownFilter
        options={OPTIONS}
        selectedValue="all"
        selectedLabel="All"
        onSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: /All/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Apples" })).toBeNull();
  });

  it("opens the menu on trigger click and lists options", async () => {
    const user = userEvent.setup();
    render(
      <DropdownFilter
        options={OPTIONS}
        selectedValue="all"
        selectedLabel="All"
        onSelect={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: /All/ }));
    expect(screen.getByRole("button", { name: "Apples" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bananas" })).toBeInTheDocument();
  });

  it("calls onSelect with the value and closes the menu when a choice is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <DropdownFilter
        options={OPTIONS}
        selectedValue="all"
        selectedLabel="All"
        onSelect={onSelect}
      />,
    );

    await user.click(screen.getByRole("button", { name: /All/ }));
    await user.click(screen.getByRole("button", { name: "Apples" }));

    expect(onSelect).toHaveBeenCalledWith("a");
    expect(screen.queryByRole("button", { name: "Bananas" })).toBeNull();
  });

  it("clicking trigger twice closes it", async () => {
    const user = userEvent.setup();
    render(
      <DropdownFilter
        options={OPTIONS}
        selectedValue="all"
        selectedLabel="All"
        onSelect={vi.fn()}
      />,
    );

    const trigger = screen.getByRole("button", { name: /All/ });
    await user.click(trigger);
    expect(screen.getByRole("button", { name: "Apples" })).toBeInTheDocument();
    await user.click(trigger);
    expect(screen.queryByRole("button", { name: "Apples" })).toBeNull();
  });
});
