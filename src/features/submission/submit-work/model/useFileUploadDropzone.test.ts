import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useFileUploadDropzone } from "./useFileUploadDropzone";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, opts?: Record<string, unknown>) =>
      opts ? `${key}:${JSON.stringify(opts)}` : key,
  }),
}));

function makeFile(name: string, sizeBytes: number): File {
  const file = new File(["x".repeat(sizeBytes)], name, { type: "application/octet-stream" });
  Object.defineProperty(file, "size", { value: sizeBytes });
  return file;
}

function makeChangeEvent(file: File) {
  return {
    target: { files: [file] },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
}

const defaultArgs = {
  acceptedFormats: [".pdf", ".doc"],
  maxSizeMB: 5,
  disabled: false,
  isUploading: false,
};

describe("useFileUploadDropzone", () => {
  it("rejects file with invalid extension", () => {
    const onFileSelected = vi.fn();
    const onUploadError = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadDropzone({ ...defaultArgs, onFileSelected, onUploadError }),
    );

    act(() => {
      result.current.handleInputChange(makeChangeEvent(makeFile("evil.exe", 100)));
    });

    expect(onFileSelected).not.toHaveBeenCalled();
    expect(onUploadError).toHaveBeenCalledTimes(1);
    expect(onUploadError.mock.calls[0]![0]).toContain("invalidFormat");
  });

  it("rejects file exceeding maxSizeMB", () => {
    const onFileSelected = vi.fn();
    const onUploadError = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadDropzone({ ...defaultArgs, onFileSelected, onUploadError }),
    );

    const tooBig = makeFile("big.pdf", 6 * 1024 * 1024);
    act(() => {
      result.current.handleInputChange(makeChangeEvent(tooBig));
    });

    expect(onFileSelected).not.toHaveBeenCalled();
    expect(onUploadError).toHaveBeenCalledTimes(1);
    expect(onUploadError.mock.calls[0]![0]).toContain("fileTooLarge");
  });

  it("accepts a valid file and clears the error", () => {
    const onFileSelected = vi.fn();
    const onUploadError = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadDropzone({ ...defaultArgs, onFileSelected, onUploadError }),
    );

    const good = makeFile("essay.pdf", 1024);
    act(() => {
      result.current.handleInputChange(makeChangeEvent(good));
    });

    expect(onFileSelected).toHaveBeenCalledWith(good);
    expect(onUploadError).toHaveBeenLastCalledWith("");
  });

  it("does not enter dragging state when disabled", () => {
    const { result } = renderHook(() =>
      useFileUploadDropzone({
        ...defaultArgs,
        disabled: true,
        onFileSelected: vi.fn(),
      }),
    );

    act(() => {
      result.current.handleDragEnter({
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as React.DragEvent<HTMLDivElement>);
    });

    expect(result.current.isDragging).toBe(false);
  });

  it("ignores drop while uploading", () => {
    const onFileSelected = vi.fn();
    const { result } = renderHook(() =>
      useFileUploadDropzone({
        ...defaultArgs,
        isUploading: true,
        onFileSelected,
      }),
    );

    const good = makeFile("essay.pdf", 1024);
    act(() => {
      result.current.handleDrop({
        preventDefault: () => {},
        stopPropagation: () => {},
        dataTransfer: { files: [good] },
      } as unknown as React.DragEvent<HTMLDivElement>);
    });

    expect(onFileSelected).not.toHaveBeenCalled();
  });
});
