import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AssignmentFormData } from "../model/types";

import { StepBasics } from "./StepBasics";

const { courseRepoMock, groupRepoMock } = vi.hoisted(() => ({
  courseRepoMock: { getAll: vi.fn() },
  groupRepoMock: { listForCourse: vi.fn() },
}));

vi.mock("@/entities/course", () => ({
  courseRepo: courseRepoMock,
}));

vi.mock("@/entities/group", () => ({
  groupRepo: groupRepoMock,
}));

function makeData(overrides: Partial<AssignmentFormData> = {}): AssignmentFormData {
  return {
    courseId: "",
    groupId: null,
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
    ...overrides,
  };
}

beforeEach(() => {
  courseRepoMock.getAll.mockReset();
  groupRepoMock.listForCourse.mockReset();
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
  groupRepoMock.listForCourse.mockResolvedValue([]);
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
    render(<StepBasics data={makeData({ courseId: "c-1" })} onUpdate={onUpdate} lockCourse />);

    const courseSelect = screen.getByRole("combobox", { name: /courseLabel/i });
    expect(courseSelect).toBeDisabled();
    expect(screen.getByText(/basics\.courseLockedHint/)).toBeInTheDocument();
  });

  it("does not show the locked hint when lockCourse=false", () => {
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);
    expect(screen.queryByText(/basics\.courseLockedHint/)).not.toBeInTheDocument();
  });

  it("fires onUpdate with selected courseId and resets groupId when changing the select", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData()} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Algebra" })).toBeInTheDocument();
    });
    const courseSelect = screen.getByRole("combobox", { name: /courseLabel/i });
    await user.selectOptions(courseSelect, "c-2");

    expect(onUpdate).toHaveBeenCalledWith({ courseId: "c-2", groupId: null });
  });

  it("loads groups for the selected course and fires onUpdate with groupId on selection", async () => {
    groupRepoMock.listForCourse.mockResolvedValueOnce([
      { id: "g-1", name: "Группа A", studentCount: 0 },
      { id: "g-2", name: "Группа B", studentCount: 0 },
    ]);
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    render(<StepBasics data={makeData({ courseId: "c-1" })} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(screen.getByRole("option", { name: "Группа A" })).toBeInTheDocument();
    });
    const groupSelect = screen.getByRole("combobox", { name: /audienceLabel/i });
    await user.selectOptions(groupSelect, "g-2");

    expect(onUpdate).toHaveBeenCalledWith({ groupId: "g-2" });
  });
});
