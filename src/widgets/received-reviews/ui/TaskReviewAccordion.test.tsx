import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { TaskReviewAccordion } from "./TaskReviewAccordion";

const tasks = [
  {
    taskId: "t-1",
    courseName: "Algebra",
    taskTitle: "Linear Equations",
    status: "PUBLISHED" as const,
    currentScore: 9,
    maxScore: 10,
    reviewsReceived: 3,
    reviewsRequired: 3,
    allowAppeal: true,
    reviews: [
      {
        reviewId: "r-1",
        reviewerName: "Alice",
        isAnonymous: false,
        submittedAt: "2026-01-05",
        overallComment: "Good work overall.",
        criteria: [
          { name: "Clarity", score: 4, maxScore: 5, comment: "clear" },
          { name: "Depth", score: 5, maxScore: 5 },
        ],
      },
    ],
  },
  {
    taskId: "t-2",
    courseName: "Geometry",
    taskTitle: "Triangles",
    status: "IN_REVIEW" as const,
    reviewsReceived: 1,
    reviewsRequired: 3,
    reviews: [],
  },
];

describe("TaskReviewAccordion", () => {
  it("renders task titles and status badges", () => {
    render(<TaskReviewAccordion tasks={tasks} />);
    expect(screen.getByText("Linear Equations")).toBeInTheDocument();
    expect(screen.getByText("Triangles")).toBeInTheDocument();
    expect(screen.getByText(/widget\.taskReviewAccordion\.published/)).toBeInTheDocument();
    expect(screen.getByText(/widget\.taskReviewAccordion\.inReview/)).toBeInTheDocument();
  });

  it("expands a task to reveal reviews when clicked", async () => {
    const user = userEvent.setup();
    render(<TaskReviewAccordion tasks={tasks} />);
    await user.click(screen.getByText("Linear Equations"));
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText(/Good work overall/)).toBeInTheDocument();
  });

  it("shows the empty-reviews state for an expanded task with no reviews", async () => {
    const user = userEvent.setup();
    render(<TaskReviewAccordion tasks={tasks} />);
    await user.click(screen.getByText("Triangles"));
    expect(screen.getByText(/widget\.taskReviewAccordion\.noReviewsYet/)).toBeInTheDocument();
  });
});
