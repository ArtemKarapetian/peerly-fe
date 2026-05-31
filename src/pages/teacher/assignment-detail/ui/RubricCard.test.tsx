import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RubricCard } from "./RubricCard";

const { useRubricMock } = vi.hoisted(() => ({ useRubricMock: vi.fn() }));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/entities/rubric", () => ({
  useRubric: useRubricMock,
}));

describe("RubricCard (teacher assignment)", () => {
  it("renders nothing when rubricId is null", () => {
    useRubricMock.mockReturnValue({ data: null });
    const { container } = render(<RubricCard rubricId={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders rubric name + numbered criteria with descriptions", () => {
    useRubricMock.mockReturnValue({
      data: {
        rubric: { id: "r1", teacherId: "t", name: "Standard Essay" },
        criteria: [
          {
            id: "c1",
            name: "Argument",
            description: "Logical chain",
            maxScore: 5,
            commentRequired: false,
            position: 0,
          },
          {
            id: "c2",
            name: "Style",
            description: null,
            maxScore: 3,
            commentRequired: false,
            position: 1,
          },
        ],
      },
    });
    render(<RubricCard rubricId="r1" />);

    expect(screen.getByText("Standard Essay")).toBeInTheDocument();
    expect(screen.getByText("Argument")).toBeInTheDocument();
    expect(screen.getByText("Logical chain")).toBeInTheDocument();
    expect(screen.getByText("Style")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
