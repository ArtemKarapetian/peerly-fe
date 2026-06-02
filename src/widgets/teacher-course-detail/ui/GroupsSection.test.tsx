import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import type { Group } from "@/entities/group";

import { GroupsSection } from "./GroupsSection";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts && "count" in opts ? `${key}:${String(opts.count)}` : key,
  }),
}));

vi.mock("@/features/group/manage-course-groups", () => ({
  CreateGroupForm: ({ onCancel }: { onCancel: () => void }) => (
    <div data-testid="create-form">
      <button onClick={onCancel}>cancel</button>
    </div>
  ),
  GroupRow: ({ group }: { group: Group }) => <li data-testid="group-row">{group.name}</li>,
}));

const baseHandlers = {
  locked: false,
  onStartCreate: vi.fn(),
  onCancelCreate: vi.fn(),
  onCreateGroup: vi.fn(),
  onRenameGroup: vi.fn(),
  onRequestDelete: vi.fn(),
  onAddStudents: vi.fn(),
  onCreateHomework: vi.fn(),
};

function renderInRouter(node: React.ReactElement) {
  return render(<MemoryRouter>{node}</MemoryRouter>);
}

describe("GroupsSection", () => {
  it("renders the empty state when there are no groups", () => {
    renderInRouter(
      <GroupsSection {...baseHandlers} groups={[]} totalStudents={0} creating={false} />,
    );
    expect(screen.getByText("widget.groups.empty")).toBeInTheDocument();
  });

  it("renders one GroupRow per group", () => {
    const groups: Group[] = [
      { id: "g1", name: "Alpha", studentCount: 2 },
      { id: "g2", name: "Beta", studentCount: 0 },
    ];

    renderInRouter(
      <GroupsSection {...baseHandlers} groups={groups} totalStudents={2} creating={false} />,
    );

    expect(screen.getAllByTestId("group-row")).toHaveLength(2);
  });

  it("hides the create form and shows only the lock banner when locked=true", () => {
    renderInRouter(
      <GroupsSection {...baseHandlers} locked groups={[]} totalStudents={0} creating={false} />,
    );
    expect(screen.getByText(/widget.groups.lockedHint/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /widget.groups.createGroup/ })).toBeNull();
  });

  it("hides the create button while a group is being created", () => {
    renderInRouter(
      <GroupsSection {...baseHandlers} groups={[]} totalStudents={0} creating={true} />,
    );
    expect(screen.queryByRole("button", { name: /widget.groups.createGroup/ })).toBeNull();
    expect(screen.getByTestId("create-form")).toBeInTheDocument();
  });

  it("shows the create button when not creating and not locked", () => {
    renderInRouter(
      <GroupsSection {...baseHandlers} groups={[]} totalStudents={0} creating={false} />,
    );
    expect(
      screen.getAllByRole("button", { name: /widget.groups.createGroup/ }).length,
    ).toBeGreaterThan(0);
  });
});
