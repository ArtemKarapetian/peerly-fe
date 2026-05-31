import type { Id } from "./common";

export interface FileDto {
  id: Id;
  name: string;
  size: number;
}

export function fileFromDto(f: FileDto): { id: string; name: string; size: number } {
  return { id: String(f.id), name: f.name, size: f.size };
}

export interface CreateFileRequestBody {
  storageId: string;
  fileName: string;
  fileSize: number;
}

export interface CreateFileResponse {
  fileId: Id;
}

export interface GenerateUploadUrlResponse {
  url: string;
  storageId: string;
}

export interface GenerateDownloadUrlResponse {
  url: string;
}
