import type { AttachTarget } from "./storageApi";

export const storageApiDemo = {
  upload: (_file: File, _target: AttachTarget): Promise<{ fileId: string }> =>
    Promise.resolve({ fileId: `f${Date.now()}` }),
  getDownloadUrl: (_fileId: string): Promise<string> =>
    Promise.resolve("data:text/plain;charset=utf-8,demo"),
  deleteHomeworkFile: (_homeworkId: string, _fileId: string) => Promise.resolve(),
  deleteSubmissionFile: (_submissionId: string, _fileId: string) => Promise.resolve(),
};
