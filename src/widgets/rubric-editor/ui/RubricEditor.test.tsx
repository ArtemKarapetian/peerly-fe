import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RubricData } from "../model/types";

import { RubricEditor } from "./RubricEditor";

function makeRubric(): RubricData {
  return {
    id: "r-1",
    name: "Test Rubric",
    description: "Test description",
    criteria: [
      {
        id: "c-1",
        name: "Clarity",
        description: "Is the writing clear",
        maxScore: 5,
        required: true,
      },
      {
        id: "c-2",
        name: "Depth",
        description: "Depth of analysis",
        maxScore: 5,
        required: true,
      },
    ],
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-02"),
    teacherId: "t-1",
  };
}

let confirmSpy: { mockRestore: () => void };
let alertSpy: { mockRestore: () => void };

beforeEach(() => {
  confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
  alertSpy = vi.spyOn(window, "alert").mockImplementation(() => undefined);
});

afterEach(() => {
  confirmSpy.mockRestore();
  alertSpy.mockRestore();
});

describe("RubricEditor", () => {
  it("renders rubric name and existing criteria", () => {
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    expect(screen.getByDisplayValue("Test Rubric")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Clarity")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Depth")).toBeInTheDocument();
  });

  it("adds a new criterion when Add Criterion clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    const addBtn = screen.getByRole("button", { name: /addCriterion/i });
    await user.click(addBtn);

    const criterionNameInputs = screen.getAllByPlaceholderText(/criterionNamePlaceholder/i);
    expect(criterionNameInputs).toHaveLength(3);
  });

  it("marks editor dirty when user edits the rubric name", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    const nameInput = screen.getByDisplayValue("Test Rubric");
    await user.type(nameInput, " v2");

    expect(screen.getByText(/unsavedChanges/i)).toBeInTheDocument();
  });

  it("removes a criterion after confirm", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    const deleteButtons = screen.getAllByTitle(/deleteCriterion/i);
    expect(deleteButtons).toHaveLength(2);
    await user.click(deleteButtons[0]);

    expect(confirmSpy).toHaveBeenCalled();
    const remaining = screen.getAllByPlaceholderText(/criterionNamePlaceholder/i);
    expect(remaining).toHaveLength(1);
  });

  it("calls onSave with the edited rubric when Save Changes is clicked", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    const nameInput = screen.getByDisplayValue("Test Rubric");
    await user.type(nameInput, " v2");

    const saveBtn = screen.getByRole("button", { name: /saveChanges/i });
    await user.click(saveBtn);

    expect(onSave).toHaveBeenCalledTimes(1);
    const saved = onSave.mock.calls[0][0] as RubricData;
    expect(saved.name).toBe("Test Rubric v2");
  });

  it("save button is disabled when there are no unsaved changes", () => {
    const onSave = vi.fn();
    render(<RubricEditor rubric={makeRubric()} onSave={onSave} />);

    const saveBtn = screen.getByRole("button", { name: /saveChanges/i });
    expect(saveBtn).toBeDisabled();
  });

  it("alerts when trying to delete the last criterion", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const rubric: RubricData = {
      ...makeRubric(),
      criteria: [makeRubric().criteria[0]],
    };
    render(<RubricEditor rubric={rubric} onSave={onSave} />);

    const deleteButtons = screen.getAllByTitle(/deleteCriterion/i);
    await user.click(deleteButtons[0]);

    expect(alertSpy).toHaveBeenCalled();
    expect(confirmSpy).not.toHaveBeenCalled();
  });
});
