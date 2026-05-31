import { storageApi } from "@/entities/storage";

export async function downloadFile(fileId: string, fileName: string, errorMsg: string) {
  try {
    const url = await storageApi.getDownloadUrl(fileId);
    storageApi.triggerDownload(url, fileName);
  } catch {
    alert(errorMsg);
  }
}
