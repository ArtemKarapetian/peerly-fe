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
    finalMark: 4,
    reviewsReceived: 3,
    reviewsRequired: 3,
    reviews: [
      {
        reviewId: "r-1",
        mark: 4,
        comment: "Good work overall.",
      },
    ],
  },
  {
    taskId: "t-2",
    courseName: "Geometry",
    taskTitle: "Triangles",
    status: "IN_REVIEW" as const,
    finalMark: null,
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

  it("expands a published task to reveal anonymous reviews with marks and comments", async () => {
    const user = userEvent.setup();
    render(<TaskReviewAccordion tasks={tasks} />);
    await user.click(screen.getByText("Linear Equations"));
    expect(screen.getByText(/widget\.taskReviewAccordion\.anonymousReviewer/)).toBeInTheDocument();
    expect(screen.getByText(/Good work overall/)).toBeInTheDocument();
  });

  it("shows the empty-reviews state for an expanded task with no reviews", async () => {
    const user = userEvent.setup();
    render(<TaskReviewAccordion tasks={tasks} />);
    await user.click(screen.getByText("Triangles"));
    expect(screen.getByText(/widget\.taskReviewAccordion\.noReviewsYet/)).toBeInTheDocument();
  });
});
