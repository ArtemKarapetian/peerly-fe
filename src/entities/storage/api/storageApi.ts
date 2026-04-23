/**
 * Two-phase file upload via the gateway's storage endpoints.
 *
 * 1. GET  /storage/uploadUrl           → { url, storageId }
 * 2. PUT  <url>                        → raw file body
 * 3. POST /homeworks/{id}/file         or
 *         /submissions/{id}/file       → registers the uploaded file
 *                                        with { storageId, fileName, fileSize }
 *
 * Download is a single call that resolves to a signed URL.
 */

import {
  http,
  type CreateFileRequestBody,
  type CreateFileResponse,
  type GenerateDownloadUrlResponse,
  type GenerateUploadUrlResponse,
} from "@/shared/api";

type AttachTarget =
  | { kind: "homework"; homeworkId: string }
  | { kind: "submission"; submissionId: string };

function attachPath(target: AttachTarget): string {
  if (target.kind === "homework") return `/homeworks/${target.homeworkId}/file`;
  return `/submissions/${target.submissionId}/file`;
}

async function requestUploadUrl(): Promise<GenerateUploadUrlResponse> {
  return http.get<GenerateUploadUrlResponse>("/storage/uploadUrl");
}

async function putBinary(url: string, file: File): Promise<void> {
  const res = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }
}

async function registerUploadedFile(
  target: AttachTarget,
  body: CreateFileRequestBody,
): Promise<string> {
  const res = await http.post<CreateFileResponse>(attachPath(target), body);
  return String(res.fileId);
}

export const storageApi = {
  /**
   * End-to-end upload: obtains a signed URL, PUTs the binary, and then
   * registers the file under the target homework or submission.
   */
  upload: async (file: File, target: AttachTarget): Promise<{ fileId: string }> => {
    const { url, storageId } = await requestUploadUrl();
    await putBinary(url, file);
    const fileId = await registerUploadedFile(target, {
      storageId,
      fileName: file.name,
      fileSize: file.size,
    });
    return { fileId };
  },

  getDownloadUrl: async (fileId: string): Promise<string> => {
    const res = await http.get<GenerateDownloadUrlResponse>(`/storage/downloadUrl/${fileId}`);
    return res.url;
  },

  deleteHomeworkFile: async (homeworkId: string, fileId: string): Promise<void> => {
    await http.delete<void>(`/homeworks/${homeworkId}/file/${fileId}`);
  },

  deleteSubmissionFile: async (submissionId: string, fileId: string): Promise<void> => {
    await http.delete<void>(`/submissions/${submissionId}/files/${fileId}`);
  },
};

export type { AttachTarget };
