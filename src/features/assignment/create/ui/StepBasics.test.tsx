import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AssignmentFormData } from "../model/types";

import { StepBasics } from "./StepBasics";

const { courseRepoMock } = vi.hoisted(() => ({
  courseRepoMock: { getAll: vi.fn() },
}));

vi.mock("@/entities/course", () => ({
  courseRepo: courseRepoMock,
}));

function makeData(): AssignmentFormData {
  return {
    courseId: "",
    title: "",
    description: "",
    submissionDeadline: null,
    reviewDeadline: null,
    rubricId: null,
    reviewsPerSubmission: 3,
    discrepancyThreshold: 30,
    status: "draft",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
}

beforeEach(() => {
  courseRepoMock.getAll.mockReset();
  courseRepoMock.getAll.mockResolvedValue([
    {
      id: "c-1",
      title: "Algebra",
      description: "",
      code: "",
      teachers: [],
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      archived: false,
      createdAt: new Date(),
      name: "Algebra",
      backendStatus: "inProgress",
    },
    {
      id: "c-2",
      title: "Geometry",
      description: "",
      code: "",
      teachers: [],
      enrollmentCount: 0,
      homeworkCount: 0,
      status: "active",
      archived: false,
      createdAt: new Date(),
      name: "Geometry",
      backendStatus: "inProgress",
    },
  ]);
});

describe("StepBasics", () => {
  it("renders the title heading and course options", async () => {
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);

    expect(screen.getByText("feature.assignmentCreate.basics.title")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Algebra" })).toBeInTheDocument();
    });
  });

  it("fires onUpdate with new title when typing", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);

    const titleInput = screen.getByPlaceholderText(/basics\.titlePlaceholder/);
    await user.type(titleInput, "A");

    expect(onUpdate).toHaveBeenCalledWith({ title: "A" });
  });

  it("disables course select and shows hint when lockCourse=true", () => {
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} lockCourse />);

    const select = screen.getByRole("combobox");
    expect(select).toBeDisabled();
    expect(screen.getByText(/basics\.courseLockedHint/)).toBeInTheDocument();
  });

  it("does not show the locked hint when lockCourse=false", () => {
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);
    expect(screen.queryByText(/basics\.courseLockedHint/)).not.toBeInTheDocument();
  });

  it("fires onUpdate with selected courseId when changing the select", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Algebra" })).toBeInTheDocument();
    });
    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "c-2");

    expect(onUpdate).toHaveBeenCalledWith({ courseId: "c-2" });
  });
});
