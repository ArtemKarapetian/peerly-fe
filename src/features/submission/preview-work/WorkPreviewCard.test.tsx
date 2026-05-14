import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WorkPreviewCard } from "./WorkPreviewCard";

describe("WorkPreviewCard", () => {
  it("renders the title and file list", () => {
    render(
      <WorkPreviewCard
        files={[
          { id: "f-1", name: "report.pdf", size: 1024 },
          { id: "f-2", name: "draft.md", size: 5 },
        ]}
        onDownloadFile={vi.fn()}
      />,
    );
    expect(screen.getByText(/feature\.workPreview\.title/)).toBeInTheDocument();
    expect(screen.getByText("report.pdf")).toBeInTheDocument();
    expect(screen.getByText("draft.md")).toBeInTheDocument();
  });

  it("calls onDownloadFile with the file id", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(
      <WorkPreviewCard
        files={[{ id: "f-1", name: "report.pdf", size: 1024 }]}
        onDownloadFile={onDownload}
      />,
    );
    const downloadButtons = screen.getAllByLabelText(/feature\.workPreview\.downloadFile/);
    await user.click(downloadButtons[0]);
    expect(onDownload).toHaveBeenCalledWith("f-1");
  });

  it("renders the validation checks summary when provided", () => {
    render(
      <WorkPreviewCard
        files={[]}
        validationChecks={[
          { id: "v-1", name: "syntax", status: "passed" },
          { id: "v-2", name: "lint", status: "warning", message: "small issue" },
        ]}
        onDownloadFile={vi.fn()}
      />,
    );
    expect(screen.getByText(/feature\.workPreview\.checks/)).toBeInTheDocument();
    expect(screen.getByText("syntax")).toBeInTheDocument();
    expect(screen.getByText("lint")).toBeInTheDocument();
  });
});
