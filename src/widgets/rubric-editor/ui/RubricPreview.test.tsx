import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RubricEditorData } from "../model/types";

import { RubricPreview } from "./RubricPreview";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function makeRubric(overrides: Partial<RubricEditorData> = {}): RubricEditorData {
  return {
    id: "r1",
    teacherId: "t1",
    name: "Demo Rubric",
    criteria: [
      {
        id: "c1",
        name: "Clarity",
        description: "Writing clarity",
        maxScore: 5,
        commentRequired: false,
        position: 0,
      },
      {
        id: "c2",
        name: "Depth",
        description: "",
        maxScore: 3,
        commentRequired: true,
        position: 1,
      },
    ],
    ...overrides,
  };
}

describe("RubricPreview", () => {
  it("renders rubric name + each criterion", () => {
    render(<RubricPreview rubric={makeRubric()} />);
    expect(screen.getByText("Demo Rubric")).toBeInTheDocument();
    expect(screen.getByText("Clarity")).toBeInTheDocument();
    expect(screen.getByText("Depth")).toBeInTheDocument();
  });

  it("shows description only when present", () => {
    render(<RubricPreview rubric={makeRubric()} />);
    expect(screen.getByText("Writing clarity")).toBeInTheDocument();
  });

  it("flags commentRequired criteria with the warning badge", () => {
    render(<RubricPreview rubric={makeRubric()} />);
    expect(screen.getByText(/commentRequired/)).toBeInTheDocument();
  });

  it("numbers criteria starting from 1", () => {
    render(<RubricPreview rubric={makeRubric()} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
