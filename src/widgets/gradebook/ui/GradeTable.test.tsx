import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { GradeTable, type GradeEntry } from "./GradeTable";

const grades: GradeEntry[] = [
  {
    id: "g-1",
    courseId: "c-1",
    courseName: "Algebra",
    taskId: "t-1",
    taskTitle: "Linear Equations",
    status: "published",
    score: 9,
    maxScore: 10,
    isScoreLocked: false,
    updatedAt: "2026-01-01",
  },
  {
    id: "g-2",
    courseId: "c-1",
    courseName: "Algebra",
    taskId: "t-2",
    taskTitle: "Quadratics",
    status: "draft",
    score: null,
    maxScore: 10,
    isScoreLocked: true,
    updatedAt: "2026-01-02",
  },
];

const statusLabels = { published: "Published", draft: "Draft" };
const statusColors = { published: "bg-success-light", draft: "bg-muted" };

describe("GradeTable", () => {
  it("renders the empty state when grades are empty", () => {
    render(
      <GradeTable
        grades={[]}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onRowClick={vi.fn()}
      />,
    );
    expect(screen.getByText("widget.gradeTable.noGrades")).toBeInTheDocument();
  });

  it("renders grade rows with course, title and score", () => {
    render(
      <GradeTable
        grades={grades}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onRowClick={vi.fn()}
      />,
    );
    expect(screen.getAllByText("Algebra").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Linear Equations").length).toBeGreaterThan(0);
    expect(screen.getAllByText("9").length).toBeGreaterThan(0);
  });

  it("calls onRowClick with the row's grade when clicked", async () => {
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    render(
      <GradeTable
        grades={grades}
        statusLabels={statusLabels}
        statusColors={statusColors}
        onRowClick={onRowClick}
      />,
    );
    const firstRow = screen.getAllByText("Linear Equations")[0]!;
    await user.click(firstRow);
    expect(onRowClick).toHaveBeenCalled();
    const arg = onRowClick.mock.calls[0]![0]! as GradeEntry;
    expect(arg.id).toBe("g-1");
  });
});
