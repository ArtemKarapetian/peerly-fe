import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ParticipantImportModal } from "./ParticipantImportModal";

describe("ParticipantImportModal", () => {
  it("renders title and tabs when open", () => {
    render(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);

    expect(screen.getByText(/feature\.participantImport\.title/)).toBeInTheDocument();
    expect(screen.getByText(/feature\.participantImport\.csvImport/)).toBeInTheDocument();
    expect(screen.getByText(/feature\.participantImport\.addManually/)).toBeInTheDocument();
    expect(screen.getByText(/feature\.participantImport\.inviteCodes/)).toBeInTheDocument();
  });

  it("calls onClose when the X button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const { container } = render(<ParticipantImportModal courseId="c-1" onClose={onClose} />);

    const buttons = container.querySelectorAll("button");
    await user.click(buttons[0]);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the bottom Close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ParticipantImportModal courseId="c-1" onClose={onClose} />);

    const closeBtn = screen.getByRole("button", {
      name: /feature\.participantImport\.close/,
    });
    await user.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("switches between modes when tabs are clicked", async () => {
    const user = userEvent.setup();
    render(<ParticipantImportModal courseId="c-1" onClose={vi.fn()} />);

    expect(screen.getByText(/feature\.participantImport\.csvHint/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /feature\.participantImport\.addManually/ }),
    );
    expect(screen.getByText(/feature\.participantImport\.addOneManually/)).toBeInTheDocument();
    expect(screen.queryByText(/feature\.participantImport\.csvHint/)).not.toBeInTheDocument();
  });
});
