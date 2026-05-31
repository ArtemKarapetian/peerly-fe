import { type ChangeEvent, type DragEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface UseFileUploadDropzoneArgs {
  acceptedFormats: string[];
  maxSizeMB: number;
  disabled: boolean;
  isUploading: boolean;
  onFileSelected: (file: File) => void;
  onUploadError?: (error: string) => void;
}

export function useFileUploadDropzone({
  acceptedFormats,
  maxSizeMB,
  disabled,
  isUploading,
  onFileSelected,
  onUploadError,
}: UseFileUploadDropzoneArgs) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const fileName = file.name.toLowerCase();
    const hasValidExtension = acceptedFormats.some((ext) => fileName.endsWith(ext.toLowerCase()));
    if (!hasValidExtension) {
      return t("feature.submission.upload.invalidFormat", { formats: acceptedFormats.join(", ") });
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return t("feature.submission.upload.fileTooLarge", { max: maxSizeMB });
    }
    return null;
  };

  const handleFileSelect = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      onUploadError?.(validationError);
      return;
    }
    onUploadError?.("");
    onFileSelected(file);
  };

  const blocked = disabled || isUploading;

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!blocked) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (blocked) return;
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  const handleClick = () => {
    if (!blocked) fileInputRef.current?.click();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleFileSelect(files[0]);
  };

  return {
    isDragging,
    fileInputRef,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    handleClick,
    handleInputChange,
  };
}
