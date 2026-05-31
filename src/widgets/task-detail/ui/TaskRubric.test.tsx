import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { TaskRubric } from "./TaskRubric";

const { useRubricMock } = vi.hoisted(() => ({ useRubricMock: vi.fn() }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/entities/rubric", () => ({
  useRubric: useRubricMock,
}));

describe("TaskRubric", () => {
  it("renders nothing when rubricId is null", () => {
    useRubricMock.mockReturnValue({ data: null });
    const { container } = render(<TaskRubric rubricId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing when detail has no criteria", () => {
    useRubricMock.mockReturnValue({
      data: { rubric: { id: "r1", teacherId: "t", name: "R" }, criteria: [] },
    });
    const { container } = render(<TaskRubric rubricId="r1" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the rubric name and each criterion's name and maxScore label", () => {
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Essay" },
        criteria: [
          {
            id: "c1",
            name: "Clarity",
            description: "Is it clear",
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
          {
            id: "c2",
            name: "Depth",
            description: null,
            maxScore: 3,
            commentRequired: false,
            position: 1,
          },
        ],
      },
    });
    render(<TaskRubric rubricId="r1" />);
    expect(screen.getByText("Essay")).toBeInTheDocument();
    expect(screen.getByText("Clarity")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
    expect(screen.getByText("Is it clear")).toBeInTheDocument();
  });
});
