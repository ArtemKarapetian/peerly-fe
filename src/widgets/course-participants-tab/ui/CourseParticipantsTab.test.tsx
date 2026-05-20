import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CourseParticipantsTab } from "./CourseParticipantsTab";

const useCourseParticipantsMock = vi.fn();

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
  initReactI18next: { type: "3rdParty", init: vi.fn() },
}));

vi.mock("@/entities/course", () => ({
  useCourseParticipants: () => useCourseParticipantsMock(),
}));

vi.mock("@/features/participant/search", () => ({
  ParticipantSearch: () => <div data-testid="participant-search" />,
}));

beforeEach(() => {
  useCourseParticipantsMock.mockReset();
});

describe("CourseParticipantsTab", () => {
  it("does not crash when a participant has no name", () => {
    useCourseParticipantsMock.mockReturnValue({
      data: {
        teachers: [{ teacherId: "t-1", email: "t@x", name: undefined }],
        students: [
          { studentId: "s-1", email: "a@x", name: null },
          { studentId: "s-2", email: "b@x", name: "  " },
          { studentId: "s-3", email: "c@x", name: "Иванов Иван" },
        ],
      },
      isLoading: false,
    });
    render(<CourseParticipantsTab courseId="c-1" />);
    expect(screen.getByText(/Иванов/)).toBeInTheDocument();
    expect(screen.getAllByText(/entity\.user\.roleStudent/).length).toBeGreaterThan(0);
  });

  it("splits a full name into first and last", () => {
    useCourseParticipantsMock.mockReturnValue({
      data: {
        teachers: [],
        students: [{ studentId: "s-1", email: "a@x", name: "Анна Смирнова" }],
      },
      isLoading: false,
    });
    render(<CourseParticipantsTab courseId="c-1" />);
    expect(screen.getByText("Анна Смирнова")).toBeInTheDocument();
  });
});
