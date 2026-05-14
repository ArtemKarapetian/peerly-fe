import { beforeEach, describe, expect, it, vi } from "vitest";

import { storageApi } from "./storageApi";

const httpMock = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock("@/shared/api", async () => {
  const actual = await vi.importActual<typeof import("@/shared/api")>("@/shared/api");
  return {
    ...actual,
    http: {
      get: (...args: unknown[]): unknown => httpMock.get(...args),
      post: (...args: unknown[]): unknown => httpMock.post(...args),
      put: (...args: unknown[]): unknown => httpMock.put(...args),
      delete: (...args: unknown[]): unknown => httpMock.delete(...args),
    },
  };
});

beforeEach(() => {
  httpMock.get.mockReset();
  httpMock.post.mockReset();
  httpMock.put.mockReset();
  httpMock.delete.mockReset();
});

describe("storageApi.upload", () => {
  it("uploads a file in two phases and registers it under a homework", async () => {
    httpMock.get.mockResolvedValueOnce({ url: "https://s3/put", storageId: "stg-1" });
    httpMock.post.mockResolvedValueOnce({ fileId: 99 });

    const fetchSpy = vi.fn(() => Promise.resolve({ ok: true, status: 200 } as Response));
    globalThis.fetch = fetchSpy as unknown as typeof fetch;

    const file = new File(["data"], "a.pdf", { type: "application/pdf" });
    const out = await storageApi.upload(file, { kind: "homework", homeworkId: "hw-1" });

    expect(httpMock.get.mock.calls[0][0]).toBe("/storage/uploadUrl");
    expect((fetchSpy.mock.calls[0] as unknown[])[0]).toBe("https://s3/put");
    expect(httpMock.post.mock.calls[0][0]).toBe("/homeworks/hw-1/file");
    expect(httpMock.post.mock.calls[0][1]).toMatchObject({
      storageId: "stg-1",
      fileName: "a.pdf",
    });
    expect(out.fileId).toBe("99");
  });

  it("targets the submission attach path when kind is submission", async () => {
    httpMock.get.mockResolvedValueOnce({ url: "https://s3/p", storageId: "stg-2" });
    httpMock.post.mockResolvedValueOnce({ fileId: "100" });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, status: 200 } as Response),
    ) as unknown as typeof fetch;

    await storageApi.upload(new File(["x"], "b.txt"), {
      kind: "submission",
      submissionId: "sub-7",
    });

    expect(httpMock.post.mock.calls[0][0]).toBe("/submissions/sub-7/file");
  });

  it("throws when the storage PUT fails", async () => {
    httpMock.get.mockResolvedValueOnce({ url: "https://s3/p", storageId: "stg-x" });
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 } as Response),
    ) as unknown as typeof fetch;

    await expect(
      storageApi.upload(new File(["x"], "b.txt"), { kind: "homework", homeworkId: "hw-2" }),
    ).rejects.toThrow(/Upload failed/);
  });
});

describe("storageApi.getDownloadUrl", () => {
  it("hits /storage/downloadUrl/:fileId and returns the url", async () => {
    httpMock.get.mockResolvedValueOnce({ url: "https://dl/x" });
    const out = await storageApi.getDownloadUrl("f-9");
    expect(httpMock.get.mock.calls[0][0]).toBe("/storage/downloadUrl/f-9");
    expect(out).toBe("https://dl/x");
  });
});

describe("storageApi.triggerDownload", () => {
  it("creates an anchor with download attribute when fileName is provided", () => {
    const appendSpy = vi.spyOn(document.body, "appendChild");
    storageApi.triggerDownload("https://x/y", "report.pdf");
    const a = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(a.tagName).toBe("A");
    expect(a.href).toContain("https://x/y");
    expect(a.download).toBe("report.pdf");
    expect(a.target).toBe("");
    appendSpy.mockRestore();
  });

  it("opens in a new tab when no fileName is provided", () => {
    const appendSpy = vi.spyOn(document.body, "appendChild");
    storageApi.triggerDownload("https://x/z");
    const a = appendSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(a.target).toBe("_blank");
    appendSpy.mockRestore();
  });
});

describe("storageApi delete helpers", () => {
  it("deleteHomeworkFile DELETEs /homeworks/:id/file/:fileId", async () => {
    httpMock.delete.mockResolvedValueOnce(undefined);
    await storageApi.deleteHomeworkFile("hw-1", "f-1");
    expect(httpMock.delete.mock.calls[0][0]).toBe("/homeworks/hw-1/file/f-1");
  });

  it("deleteSubmissionFile DELETEs /submissions/:id/files/:fileId", async () => {
    httpMock.delete.mockResolvedValueOnce(undefined);
    await storageApi.deleteSubmissionFile("sub-1", "f-1");
    expect(httpMock.delete.mock.calls[0][0]).toBe("/submissions/sub-1/files/f-1");
  });
});
