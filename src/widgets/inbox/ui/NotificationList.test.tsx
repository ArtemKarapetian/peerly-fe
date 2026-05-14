import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NotificationList, type Notification } from "./NotificationList";

const notifications: Notification[] = [
  {
    id: "n-1",
    type: "DEADLINE",
    title: "Deadline soon",
    message: "Your task is due tomorrow",
    time: new Date().toISOString(),
    isRead: false,
    link: "/student/dashboard",
  },
  {
    id: "n-2",
    type: "GRADE_PUBLISHED",
    title: "Grade published",
    message: "You got 9/10",
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    link: "/student/gradebook",
  },
];

describe("NotificationList", () => {
  it("renders notification titles and messages", () => {
    render(
      <NotificationList
        notifications={notifications}
        selectedFilter="ALL"
        onNotificationClick={vi.fn()}
        onResetFilter={vi.fn()}
      />,
    );
    expect(screen.getByText("Deadline soon")).toBeInTheDocument();
    expect(screen.getByText("You got 9/10")).toBeInTheDocument();
  });

  it("calls onNotificationClick when a row is clicked", async () => {
    const user = userEvent.setup();
    const onNotificationClick = vi.fn();
    render(
      <NotificationList
        notifications={notifications}
        selectedFilter="ALL"
        onNotificationClick={onNotificationClick}
        onResetFilter={vi.fn()}
      />,
    );
    await user.click(screen.getByText("Deadline soon"));
    expect(onNotificationClick).toHaveBeenCalled();
    const arg = onNotificationClick.mock.calls[0][0] as Notification;
    expect(arg.id).toBe("n-1");
  });

  it("shows the empty state with reset button when filter is non-ALL", async () => {
    const user = userEvent.setup();
    const onResetFilter = vi.fn();
    render(
      <NotificationList
        notifications={[]}
        selectedFilter="DEADLINES"
        onNotificationClick={vi.fn()}
        onResetFilter={onResetFilter}
      />,
    );
    const resetBtn = screen.getByText(/widget\.notificationList\.showAll/);
    await user.click(resetBtn);
    expect(onResetFilter).toHaveBeenCalledTimes(1);
  });
});
