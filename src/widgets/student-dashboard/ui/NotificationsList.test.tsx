import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { NotificationsList, type Notification } from "./NotificationsList";

vi.mock("@/shared/lib/formatDate", () => ({
  formatRelativeTime: (iso: string) => iso,
  formatDateTime: (iso: string) => iso,
  formatDateShort: (iso: string) => iso,
}));

const baseItems: Notification[] = [
  {
    id: "n-1",
    type: "feedback",
    title: "Feedback received",
    time: new Date().toISOString(),
    isRead: false,
  },
  {
    id: "n-2",
    type: "grade",
    title: "New grade posted",
    time: new Date().toISOString(),
    isRead: true,
  },
];

describe("NotificationsList", () => {
  it("renders the empty state when there are no items", () => {
    render(<NotificationsList items={[]} onNotificationClick={vi.fn()} onViewAllClick={vi.fn()} />);
    expect(screen.getByText(/widget\.notificationsList\.noNewNotifications/)).toBeInTheDocument();
  });

  it("renders each notification title", () => {
    render(
      <NotificationsList
        items={baseItems}
        onNotificationClick={vi.fn()}
        onViewAllClick={vi.fn()}
      />,
    );
    expect(screen.getByText("Feedback received")).toBeInTheDocument();
    expect(screen.getByText("New grade posted")).toBeInTheDocument();
  });

  it("invokes onNotificationClick with the id", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <NotificationsList
        items={baseItems}
        onNotificationClick={onClick}
        onViewAllClick={vi.fn()}
      />,
    );
    await user.click(screen.getByText("Feedback received"));
    expect(onClick).toHaveBeenCalledWith("n-1");
  });
});
