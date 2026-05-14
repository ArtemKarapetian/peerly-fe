import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TeacherCourseParticipants } from "./Participants";

const { courseRepoMock } = vi.hoisted(() => ({
  courseRepoMock: {
    getParticipants: vi.fn(),
  },
}));

vi.mock("@/entities/course", () => ({
  courseRepo: courseRepoMock,
}));

vi.mock("@/features/participant/import", () => ({
  ParticipantImportModal: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="import-modal">
      <button onClick={onClose}>close</button>
    </div>
  ),
}));

beforeEach(() => {
  courseRepoMock.getParticipants.mockReset();
});

describe("TeacherCourseParticipants", () => {
  it("does not show the participants list while loading", () => {
    let resolveFn: (v: { students: never[]; teachers: never[] }) => void = () => undefined;
    courseRepoMock.getParticipants.mockReturnValue(
      new Promise((res) => {
        resolveFn = res;
      }),
    );
    render(<TeacherCourseParticipants courseId="c-1" />);
    expect(screen.queryByText(/widget\.participants\.empty/)).not.toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    resolveFn({ students: [], teachers: [] });
  });

  it("shows the empty state when there are no participants", async () => {
    courseRepoMock.getParticipants.mockResolvedValueOnce({ students: [], teachers: [] });
    render(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => {
      expect(screen.getByText(/widget\.participants\.empty/)).toBeInTheDocument();
    });
  });

  it("renders teacher then student rows and shows correct counts", async () => {
    courseRepoMock.getParticipants.mockResolvedValueOnce({
      students: [
        { id: 1, userName: "Alice" },
        { id: 2, userName: "Bob" },
      ],
      teachers: [{ id: 9, userName: "Prof X" }],
    });
    render(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => {
      expect(screen.getByText("Alice")).toBeInTheDocument();
    });
    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("Prof X")).toBeInTheDocument();

    const totalSection = screen.getByText(/widget\.participants\.total/).closest("span");
    expect(totalSection?.textContent).toContain("3");
    const studentSection = screen.getByText(/widget\.participants\.studentsCount/).closest("span");
    expect(studentSection?.textContent).toContain("2");
    const teacherSection = screen.getByText(/widget\.participants\.teachersCount/).closest("span");
    expect(teacherSection?.textContent).toContain("1");
  });

  it("filters by role via the select", async () => {
    const user = userEvent.setup();
    courseRepoMock.getParticipants.mockResolvedValueOnce({
      students: [{ id: 1, userName: "Alice" }],
      teachers: [{ id: 9, userName: "Prof X" }],
    });
    render(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "teacher");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Prof X")).toBeInTheDocument();
  });

  it("filters by name with the search input", async () => {
    const user = userEvent.setup();
    courseRepoMock.getParticipants.mockResolvedValueOnce({
      students: [
        { id: 1, userName: "Alice" },
        { id: 2, userName: "Bob" },
      ],
      teachers: [],
    });
    render(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const search = screen.getByPlaceholderText(/widget\.participants\.searchPlaceholder/);
    await user.type(search, "bob");

    expect(screen.queryByText("Alice")).not.toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows notFound state when search excludes everyone", async () => {
    const user = userEvent.setup();
    courseRepoMock.getParticipants.mockResolvedValueOnce({
      students: [{ id: 1, userName: "Alice" }],
      teachers: [],
    });
    render(<TeacherCourseParticipants courseId="c-1" />);

    await waitFor(() => expect(screen.getByText("Alice")).toBeInTheDocument());

    const search = screen.getByPlaceholderText(/widget\.participants\.searchPlaceholder/);
    await user.type(search, "zzzzz");

    expect(screen.getByText(/widget\.participants\.notFound/)).toBeInTheDocument();
  });
});
